import React, { useEffect, useState } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import Card, { CardProps } from "react-bootstrap/Card";

import CourseTable from "../course/CourseTable";
import { Subject, Course, getCatalog } from "../api";
import "./Schedule.scss";

interface ScheduleProps {
  subjects: Subject[];
  dark: boolean;
}

const Schedule = (props: ScheduleProps & RouteComponentProps) => {
  return (
    <>
      <h1>Schedule</h1>
      <section className="schedule subject-section">
        <div className="courses-list">
          {props.subjects.map((s) => (
            <SubjectCard
              subj={s}
              bg={props.dark ? "dark" : "light"}
              text={props.dark ? "light" : "dark"}
              key={s.code}
              border={props.dark ? "" : "light"}
            ></SubjectCard>
          ))}
        </div>
      </section>
    </>
  );
};

export default Schedule;

export const SubjectCard = (props: CardProps & { subj: Subject }) => {
  return (
    <Card {...props}>
      <Card.Body>
        <Card.Title>{props.subj.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {props.subj.code.toUpperCase()}
        </Card.Subtitle>
        <Card.Text>Subject description coming soon...</Card.Text>
        <Card.Link as={Link} to={`/subject/${props.subj.code.toLowerCase()}`}>
          More info
        </Card.Link>
      </Card.Body>
    </Card>
  );
};

export type SubjectViewProps = RouteComponentProps<{
  id: string;
}>;

export const SubjectView = (
  props: {
    dark: boolean;
    subject?: string;
    getName: (k: string) => string;
  } & SubjectViewProps
) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loaded, setLoaded] = useState(false);
  const subjcode = props.match.params.id;
  useEffect(() => {
    getCatalog(2021, "spring", subjcode).then((res) => {
      setCourses(res);
      setLoaded(true);
    });
  }, [subjcode]);

  let variant: string;
  let className: string;
  if (props.dark) {
    className = "container dark-table";
    variant = "dark";
  } else {
    className = "container";
    variant = "";
  }

  if (!loaded) {
    return (
      <div className={className}>
        <h2>Subject {props.match.params.id}</h2>
        <p>loading...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h2>
        {props.subject ||
          props.getName(props.match.params.id) ||
          props.match.params.id}
      </h2>
      <CourseTable dark={props.dark} variant={variant} courses={courses} />
    </div>
  );
};
