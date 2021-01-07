import React, { useState, useRef, useEffect } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Select, { ActionMeta } from "react-select";

import { Course, Term, Subject, getCourses } from "../api";
import CourseTable from "../course/CourseTable";
import CourseTableRow from "../course/CourseTableRow";
import SortableTable from "../components/table/SortableTable";

export default function Catalog({
  dark,
  subjects,
}: {
  dark?: boolean;
  subjects: Subject[];
}) {
  const [year, setYear] = useState(2021);
  const [term] = useState<Term>("spring");
  const [courses, setCourses] = useState<Course[]>([]);
  const [pagelen, setPageLen] = useState(20);
  const [paged, setPaged] = useState(false);
  const subjRef = useRef<string | undefined>(undefined);

  const fetchCourses = (subj: string | undefined) => {
    getCourses(year, term, subj).then((res: Course[]) => {
      setCourses(
        res.sort((a: Course, b: Course): number => {
          return b.updated_at.getTime() - a.updated_at.getTime();
        })
      );
      setCourses(res);
    });
  };

  const selectChange = (
    val: { value: string; label: string } | null | undefined,
    action: ActionMeta<{ value: string; label: string }>
  ) => {
    console.log(val, action);
    if (val === null || val === undefined) {
      return;
    }
    switch (val.value) {
      case "":
      case "all":
        subjRef.current = undefined;
        fetchCourses(undefined);
        break;
      default:
        subjRef.current = val.value;
        fetchCourses(val.value);
    }
  };

  const update = () => {
    fetchCourses(subjRef.current);
  };
  // eslint-disable-next-line
  useEffect(update, []);

  let select = [{ value: "all", label: "All" }];
  select.push(
    ...subjects.map((s) => {
      return { value: s.code, label: s.name };
    })
  );
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
              max={courses.length}
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

        <section className="catalog-input">
          <div className="search">
            <input
              className="form-control"
              type="search"
              placeholder="Search"
            />
          </div>
          <Select
            options={select}
            className="select subj-select"
            style={{ width: "400px" }}
            onChange={selectChange}
          />
          <hr />
          <input
            id="page-checkbox"
            type="checkbox"
            value="testing"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPaged(e.target.checked);
            }}
          />
          <label htmlFor="page-checkbox">Show pages</label>
          <button className="updated-btn btn btn-primary" onClick={update}>
            update
          </button>
        </section>

        {paged ? (
          <CourseTable
            dark={dark || false}
            variant={dark ? "dark" : ""}
            courses={courses}
            maxPageLength={pagelen}
          />
        ) : (
          <SortableTable
            names={columns}
            data={courses}
            renderRow={(c: Course) => (
              <CourseTableRow
                key={`${c.crn}-${c.id}`}
                course={c}
                dark={false}
              />
            )}
            sorter={sorter}
            variant={dark ? "dark" : ""}
          />
        )}
      </div>
    </>
  );
}

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
