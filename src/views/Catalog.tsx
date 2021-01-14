import React, { RefObject, useState, useRef, useEffect } from "react";
import Select, { ActionMeta } from "react-select";
import InputGroup from "react-bootstrap/InputGroup";

import { FrequencyIndex, Rankable, Doc, tokenize } from "../search/search";
import { Course, Term, Subject, getCatalog } from "../api";
import CatalogEntry from "../course/Course";
import CourseTableRow from "../course/CourseTableRow";
import SortableTable from "../components/table/SortableTable";
import "./Catalog.scss";
import Trie from "../search/trie";

/**
 * TODO
 * - Add a date range input
 * - Improve the search box <https://github.com/algolia/react-instantsearch>
 */

type SelectOpt = {
  value: string;
  label: string;
};

class Search<T extends Rankable> extends FrequencyIndex<T> {
  trie: Trie;

  constructor(courses: T[]) {
    super(courses);
    let tokens = new Set(this.documents.flatMap((val: Doc<T>) => val.tokens));
    this.trie = new Trie(Array.from(tokens.keys()));
  }

  async find(query: string) {
    let terms = tokenize(query);
    terms = terms.concat(this.trie.search(query));
    return this.search(terms);
  }
}

type CourseState = {
  courses: CatalogEntry[];
  index?: Search<CatalogEntry>;
};

export default function Catalog({
  dark,
  subjects,
}: {
  dark?: boolean;
  subjects: Subject[];
}) {
  let t0 = performance.now();
  const [year, setYear] = useState(2021);
  const [term] = useState<Term>("spring");
  const [courseState, setCourseState] = useState<CourseState>({
    courses: [],
  });
  const [pagelen, setPageLen] = useState(20);
  const [paged] = useState(false);
  const searchRef = useRef<HTMLInputElement>();

  const fetchCourses = (subj: string | undefined) => {
    getCatalog(year, term, subj).then((res: Course[]) => {
      let courses = res.map((c: Course) => new CatalogEntry(c));
      setCourseState({
        courses: courses,
        index: new Search(courses),
      });
    });
  };

  const update = () => {
    fetchCourses(undefined);
  };
  // eslint-disable-next-line
  useEffect(update, []);

  let select = [{ value: "all", label: "All" }];
  select.push(
    ...subjects.map((s) => {
      return { value: s.code, label: s.name };
    })
  );

  console.log("Catalog startup:", `${performance.now() - t0} ms`);
  return (
    <>
      <h1>Catalog</h1>
      <div className="container">
        <div className="input-group mb-3"></div>
        {paged && (
          <InputGroup className="mb-3">
            <input
              className="text-input"
              type="number"
              min="1"
              max={courseState.courses.length}
              step="1"
              value={pagelen}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPageLen(Number.parseInt(e.target.value));
              }}
            />
          </InputGroup>
        )}

        <input
          hidden // TODO find a place for this
          type="number"
          min="2018"
          max={new Date().getFullYear()}
          value={year}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setYear(Number.parseInt(e.target.value))
          }
        />

        <CatalogResults
          dark={dark}
          paged={false}
          courses={courseState.courses}
          search={searchRef}
          selections={select}
          // selectChange={selectChange}
          update={update}
          index={courseState.index}
        />
      </div>
    </>
  );
}

type CatalogSearchProps = {
  dark?: boolean;
  paged?: boolean;
  courses: Course[];
  selections: SelectOpt[];
  search: any;
  update: () => void;
  index?: Search<CatalogEntry>;

  // depricated
  selectChange?: (
    val: SelectOpt | null | undefined,
    action: ActionMeta<SelectOpt>
  ) => void;
};

const CatalogResults = (props: CatalogSearchProps) => {
  const columns = [
    { value: "crn", label: "CRN" },
    { value: "course_num", label: "Course" },
    { value: "type", label: "Type" },
    { value: "title", label: "Title" },
    { value: "enrolled", label: "Enrolled" },
    { value: "capacity", label: "Capacity" },
    { value: "percent", label: "Percent" },
    { value: "updated_at", label: "Updated" },
  ];
  const [filterResult, setFiltered] = useState(props.courses);
  const subjRef = useRef<string>();
  const searchRef = useRef<HTMLInputElement>();

  const reset = () => {
    const subj = subjRef.current;
    if (subj !== undefined && subj !== "" && subj !== "all") {
      setFiltered(
        props.courses.filter((c: Course) => c.subject === subjRef.current)
      );
    } else {
      setFiltered(props.courses);
    }
  };
  useEffect(reset, [props.courses]);

  const searchInput = async (e: React.FormEvent<HTMLInputElement>) => {
    if (props.index === undefined) {
      return;
    }
    let query: string;
    if (
      searchRef.current === undefined ||
      searchRef.current.value.length < 3 // optimization, min subject length is 3
    ) {
      reset();
      return;
    } else {
      query = searchRef.current.value;
    }

    const sort = (a: CatalogEntry, b: CatalogEntry) =>
      b.getRank() - a.getRank();

    let crs = await props.index
      .find(query)
      .then((result) =>
        result.filter((d: CatalogEntry) => d.getRank() > 0).sort(sort)
      );
    setFiltered(crs);
  };

  const selectChange = (
    val: { value: string; label: string } | null | undefined,
    action: ActionMeta<{ value: string; label: string }>
  ) => {
    if (val === null || val === undefined) {
      return;
    }
    switch (val.value) {
      case "":
      case "all":
        // reset
        setFiltered(props.courses);
        break;
      default:
        subjRef.current = val.value;
        setFiltered(
          props.courses.filter((c: Course) => c.subject === subjRef.current)
        );
        break;
    }
  };

  return (
    <>
      <section className="catalog-input">
        <div className="search">
          <input
            ref={searchRef as RefObject<HTMLInputElement>}
            onInput={searchInput}
            className="form-control"
            type="search"
            placeholder="Search"
          />
        </div>
        <Select
          options={props.selections}
          className="select subj-select"
          style={{ width: "400px" }}
          onChange={selectChange}
        />
        <hr />
        <button className="updated-btn btn btn-primary" onClick={props.update}>
          update
        </button>
      </section>

      <SortableTable
        names={columns}
        data={filterResult}
        renderRow={(c: Course) => (
          <CourseTableRow key={`${c.crn}-${c.id}`} course={c} dark={false} />
        )}
        sorter={sorter}
        variant={props.dark ? "dark" : ""}
      />
    </>
  );
};

const sorter = (a: Course, b: Course, key: string, rev: boolean): number => {
  if (rev) {
    let tmp = a;
    a = b;
    b = tmp;
  }
  switch (key) {
    case "crn":
      return b.crn - a.crn;
    case "course_num":
      return b.course_num - a.course_num;
    case "type":
      return b.type.localeCompare(a.type);
    case "title":
      return b.title.localeCompare(a.title);
    case "enrolled":
      return b.enrolled - a.enrolled;
    case "capacity":
      return b.capacity - a.capacity;
    case "percent":
      let ap = (a.enrolled / a.capacity) * 100;
      let bp = (b.enrolled / b.capacity) * 100;
      return bp - ap;
    case "updated_at":
      return b.updated_at.getTime() - a.updated_at.getTime();
  }
  return 0;
};
