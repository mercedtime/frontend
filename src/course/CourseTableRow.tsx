import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import Alert from "react-bootstrap/Alert";
import { Course, SubCourse } from "../api";
import { formatDate } from "../util";
import "./CourseTableRow.scss";

function CourseTableRow(course: Course) {
  const [expanded, setExpanded] = useState(false);
  let subcourses = <></>;
  if (expanded) {
    if (course.subcourses === null) {
      subcourses = (
        <tr>
          <td colSpan={5}>
            <Alert
              variant="danger"
              dismissible
              onClose={() => setExpanded(false)}
            >
              No sub courses for {course.title}
            </Alert>
          </td>
        </tr>
      );
    } else {
      subcourses = (
        <tr>
          <td colSpan={5}>
            {course.subcourses.map((c) => (
              <SubCourseRow course={c} expanded={setExpanded} key={c.crn} />
            ))}
          </td>
        </tr>
      );
    }
  }

  return (
    <>
      <tr onClick={() => setExpanded(!expanded)} className="course-row">
        <td className="course-crn">{course.crn}</td>
        <td>
          {course.subject}-{course.course_num}
        </td>
        <td>{course.type}</td>
        <td>{course.title}</td>
        <td>{course.enrolled}</td>
        <td>{course.capacity}</td>
        <td>{((course.enrolled / course.capacity) * 100).toFixed(2)}%</td>
        <td>{formatDate(new Date(course.updated_at.toString()))}</td>
      </tr>
      <CSSTransition
        in={expanded}
        timeout={200}
        classNames="subcourse-dropdown"
      >
        {subcourses}
      </CSSTransition>
    </>
  );
}

export default CourseTableRow;

interface SubCourseProps {
  course: SubCourse;
  expanded: React.Dispatch<React.SetStateAction<boolean>>;
}

function SubCourseRow({ course, expanded }: SubCourseProps) {
  return (
    <div onClick={() => expanded(false)} style={{ display: "flex" }}>
      <td></td>
      <td>{course.crn}</td>
      <td>{course.section}</td>
      <td>{course.type}</td>
      <td>{course.days.join(",")}</td>
    </div>
  );
}
