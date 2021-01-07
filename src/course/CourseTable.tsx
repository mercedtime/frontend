import React from "react";
import Table, {
  TableProps as BootstrapTableProps,
} from "react-bootstrap/Table";

import PaginationButtons from "../components/table/PaginationButtons";
import CourseTableRow from "./CourseTableRow";
import { Course } from "../api";
import { usePaginated } from "../hooks";
import "./CourseTable.scss";

type TableBodyTag = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
>;

export type TableProps = BootstrapTableProps & {
  dark: boolean;
  maxPageLength?: number;
  columns?: string[];
  children?: TableBodyTag;
};

export function CourseTableHead({ names }: { names: string[] }) {
  return (
    <thead>
      <tr>
        {names.map((n) => (
          <th key={n}>{n}</th>
        ))}
      </tr>
    </thead>
  );
}

export function CourseTableBody({
  dark,
  courses,
}: {
  dark: boolean;
  courses: Course[];
}) {
  return (
    <tbody>
      {courses.map((c) => (
        <CourseTableRow course={c} dark={dark} key={c.id} />
      ))}
    </tbody>
  );
}

export default function CourseTable(props: TableProps & { courses: Course[] }) {
  const maxpagelen = props.maxPageLength || 10;
  const [rows, pager] = usePaginated<Course>(props.courses, maxpagelen);
  const tprops: BootstrapTableProps = {
    striped: props.striped,
    bordered: props.bordered,
    borderless: props.borderless,
    hover: props.hover,
    size: props.size,
    variant: props.variant || props.dark ? "dark" : "",
    responsive: props.responsive,
  };
  const names = [
    "crn",
    "course",
    "type",
    "title",
    "enrolled",
    "capacity",
    "percent",
    "updated",
  ];
  let pages = Math.floor(props.courses.length / maxpagelen);

  return (
    <>
      <PaginationButtons pager={pager} pages={pages} dark={props.dark} />
      <Table {...tprops}>
        <CourseTableHead names={names} />
        <CourseTableBody courses={rows} dark={true} />
      </Table>
      <PaginationButtons pager={pager} pages={pages} dark={props.dark} />
    </>
  );
}
