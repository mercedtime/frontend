import { useState, useEffect } from "react";

import { Course, getCourses } from "../api";
import CourseTable from "../course/CourseTable";

export default function Catalog({ dark }: { dark: boolean }) {
  const [courses, setCourses] = useState<Course[]>([]);

  const update = () => {
    getCourses(2021, "spring").then((res: Course[]) => {
      setCourses(res);
    });
  };
  useEffect(update, []);

  return (
    <>
      <h1>Catalog</h1>
      <div className="container">
        <button className="btn btn-primary" onClick={update}>
          update
        </button>
        <CourseTable
          variant={dark ? "dark" : ""}
          courses={courses}
          maxPageLength={20}
        />
      </div>
    </>
  );
}
