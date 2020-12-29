import React from "react";
import Table, {
  TableProps as BootstrapTableProps,
} from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";

import CourseTableRow from "./CourseTableRow";
import { Course } from "../api";
import { PageManager, usePaginated } from "../hooks";
import "./CourseTable.scss";

type TableBodyTag = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
>;

export type TableProps = BootstrapTableProps & {
  maxPageLength?: number;
  columns?: string[];
  children?: TableBodyTag;
};

// TODO dynamic table body generation from the <thead> tag passed
// as a child prop
// function getTableColumns(thead: TableBodyTag): string[] {
//   return [];
// }

// TODO figure out how to bind the column names with object-keys so you
// can just pass an object with "column_name": "interface_key"
type TableHeadNames = { names: string[] } | { [column: string]: string };

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

export function CourseTableBody({ courses }: { courses: Course[] }) {
  return (
    <tbody>
      {courses.map((c) => (
        <CourseTableRow {...c} key={c.id} />
      ))}
    </tbody>
  );
}

function TablePagination({
  pager,
  pages,
}: {
  pager: PageManager;
  pages: number;
}) {
  const start = pager.page.current === 0;
  const end = pager.page.current === pages;
  return (
    <Pagination>
      <Pagination.First onClick={() => pager.goto(1)} disabled={start} />
      <Pagination.Prev onClick={() => pager.move(-1)} disabled={start} />
      <Pagination.Ellipsis disabled />
      <Pagination.Item onClick={() => pager.move(-2)} disabled={start}>
        {pager.page.current - 1 > 0 ? pager.page.current - 1 : "-"}
      </Pagination.Item>
      <Pagination.Item onClick={() => pager.move(-1)} disabled={start}>
        {pager.page.current || "-"}
      </Pagination.Item>
      <Pagination.Item active>{pager.page.current + 1}</Pagination.Item>
      <Pagination.Item onClick={() => pager.move(1)} disabled={end}>
        {pager.page.current + 2}
      </Pagination.Item>
      <Pagination.Item onClick={() => pager.move(2)} disabled={end}>
        {pager.page.current + 3}
      </Pagination.Item>
      <Pagination.Ellipsis disabled />
      <Pagination.Next onClick={() => pager.move(1)} disabled={end} />
      <Pagination.Last onClick={() => pager.goto(pages)} disabled={end} />
    </Pagination>
  );
}

export default function CourseTable(props: TableProps & { courses: Course[] }) {
  let maxpagelen: number;
  if (props.maxPageLength === undefined) {
    maxpagelen = 10;
  } else {
    maxpagelen = props.maxPageLength;
  }

  const pages = Math.floor(props.courses.length / maxpagelen);
  const [rows, pager] = usePaginated<Course>(props.courses, maxpagelen);
  const tprops: BootstrapTableProps = {
    striped: props.striped,
    bordered: props.bordered,
    borderless: props.borderless,
    hover: props.hover,
    size: props.size,
    variant: props.variant,
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

  return (
    <>
      <TablePagination pager={pager} pages={pages} />
      <Table {...tprops}>
        <CourseTableHead names={names} />
        <CourseTableBody courses={rows} />
      </Table>
      <TablePagination pager={pager} pages={pages} />
    </>
  );
}
