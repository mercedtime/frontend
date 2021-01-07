import Pagination from "react-bootstrap/Pagination";
import { PageManager } from "../../hooks";
import { Course } from "../../api";

export default function PaginationButtons({
  pager,
  pages,
  dark,
}: {
  pager: PageManager<Course>;
  pages: number;
  dark: boolean;
}) {
  const start = pager.page.current === 0;
  const end = pager.page.current >= pages;
  return (
    <Pagination
      className={dark ? "darkmode" : ""}
      style={{
        backgroundColor: dark ? "black" : "none",
        color: dark ? "white" : "black",
      }}
    >
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
      <Pagination.Item
        onClick={() => pager.move(2)}
        disabled={pager.page.current >= pages - 1}
      >
        {pager.page.current + 3}
      </Pagination.Item>
      <Pagination.Ellipsis disabled />
      <Pagination.Next onClick={() => pager.move(1)} disabled={end} />
      <Pagination.Last onClick={() => pager.goto(pages)} disabled={end} />
    </Pagination>
  );
}
