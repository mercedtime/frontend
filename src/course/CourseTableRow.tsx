import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import { Course, SubCourse } from "../api";
import { formatDate } from "../util";
import "./CourseTableRow.scss";

function CourseTableRow({ course, dark }: { course: Course; dark: boolean }) {
  const [expanded, setExpanded] = useState(false);
  let subcourses = <></>;
  if (expanded) {
    if (course.subcourses === null) {
      subcourses = (
        <>
          <tr>{course.description}</tr>
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
        </>
      );
    } else {
      subcourses = (
        <>
          <tr>{course.description}</tr>
          <tr>
            <td colSpan={8}>
              <div className="subcourses">
                {course.subcourses.map((c) => (
                  <SubCourseRow course={c} expanded={setExpanded} key={c.crn} />
                ))}
              </div>
            </td>
          </tr>
        </>
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
        <td>
          {formatDate(
            typeof course.updated_at === "string"
              ? new Date(course.updated_at as string)
              : course.updated_at
          )}
        </td>
      </tr>
      <CSSTransition
        in={expanded}
        timeout={200}
        classNames="subcourse-dropdown"
        appear
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
    <Card onClick={() => expanded(false)}>
      <Card.Header>
        {course.section} {course.type}
      </Card.Header>
      <Card.Body>
        {course.crn} {course.days.join(",")} {course.building_room}
      </Card.Body>
    </Card>
  );
}
