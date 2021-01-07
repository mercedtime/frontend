import React, { useState, useRef, useEffect } from "react";
import InputGroup from "react-bootstrap/InputGroup";
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
  const [term, setTerm] = useState<Term>("spring");
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
        <div className="input-group mb-3">
          <button className="btn btn-primary" onClick={update}>
            update
          </button>
        </div>
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
          type="number"
          min="2018"
          max={new Date().getFullYear()}
          value={year}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setYear(Number.parseInt(e.target.value))
          }
        />
        <Select
          options={select}
          className="select"
          style={{ width: "400px" }}
          onChange={selectChange}
        />
        <input className="search" type="search" placeholder="search" />

        <input
          type="checkbox"
          value="testing"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPaged(e.target.checked);
          }}
        />
        {paged ? (
          <CourseTable
            dark={dark || false}
            variant={dark ? "dark" : ""}
            courses={courses}
            maxPageLength={pagelen}
          />
        ) : (
          <SortableTable
            variant={dark ? "dark" : ""}
            names={columns}
            sorter={sorter}
            data={courses}
            renderRow={(c: Course) => (
              <CourseTableRow
                key={`${c.crn}-${c.id}`}
                course={c}
                dark={false}
              />
            )}
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
