import { useEffect, useRef, useState, MutableRefObject } from "react";

export interface PageManager {
  move: (n: number) => number;
  goto: (page: number) => void;
  page: MutableRefObject<number>;
}

/**
 * usePaginated takes care of table paging.
 * @param all The full array of data being paginated
 * @param pageLen Maximum length of each page.
 * @returns An array with the current row and a `PageManager`.
 */
export function usePaginated<T>(
  all: Array<T>,
  pageLen: number
): [T[], PageManager] {
  let pages = Math.floor(all.length / pageLen);
  if (all.length % pageLen !== 0) {
    pages++;
  }
  const index = useRef(0);
  const page = useRef(0);
  const [rows, setRows] = useState<Array<T>>(all.slice(index.current, pageLen));

  const move = (n: number): number => {
    let ix = index.current + n * pageLen;
    if (ix < 0 || ix >= all.length) {
      return page.current;
    }
    index.current = ix;
    page.current += n;
    setRows(
      all.slice(index.current, Math.min(index.current + pageLen, all.length))
    );
    return page.current;
  };

  const goto = (p: number) => {
    if (all.length % pageLen !== 0 && p > page.current) {
      p += 1;
    }
    move(Math.max(p - 1 - page.current, -pages));
  };

  // need to set the initial rows
  useEffect(() => {
    if (page.current !== 0) {
      return;
    }
    setRows(all.slice(page.current, pageLen));
  }, [all, pageLen]);
  return [rows, { move: move, goto: goto, page: page }];
}
