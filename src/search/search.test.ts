import fs from "fs";
import "@testing-library/jest-dom/extend-expect";
import levenshtein from "js-levenshtein";

import { tokenize, FrequencyIndex, Rankable, soundex } from "./search";
import Trie from "./trie";

test("Trie", () => {
  let t = new Trie(["to", "today", "tomorrow", "toddler", "frog", "tomato"]);
  expect(t.depth("to")).toBe(2);
  expect(t.depth("toddle")).toBe(6);
  expect(t.depth("tomorrow night")).toBe(8);

  let str =
    "Using management and organizational behavior theories, students will identify and evaluate examples of functional and dysfunctional leadership in workplace settings. Students will also learn and apply strategies for effectively managing employees and other human resources through the use of organizational case materials, leadership assessments, and team exercises involving both oral and written communications. Class and group discussions will focus on improving individual and team performance in work organizations with sensitivity to cross-cultural differences.";
  for (let s of str.split(" ")) {
    t.add(s);
  }
  expect(t.depth("organiz")).toBe(7);
  expect(t.depth("organize")).toBe(7);
  expect(t.depth("organized")).toBe(7);

  t = new Trie([
    "cat",
    "car",
    "cats",
    "cart",
    "carrot",
    "cold",
    "california",
    "crayon",
    "corrola",
  ]);

  let keys = t.search("ca");
  for (let k of ["cat", "cats", "car", "cart", "carrot", "california"]) {
    expect(keys).toContain(k);
  }
  keys = t.search("co");
  for (let k of ["cold", "corrola"]) {
    expect(keys).toContain(k);
  }
});

test("Trie-big", () => {
  let data = fs.readFileSync("./src/search/testdata.txt");
  let tokens = tokenize(data.toString().replace(/[\u2018]/g, ""));
  class T extends Trie {
    print() {
      for (const [key, node] of this.children) {
        console.log(key.toString(16), String.fromCharCode(key), "=>", node);
      }
    }
  }

  let trie = new T(tokens);
  for (let res of trie.search("scien")) {
    expect(res).toContain("scien");
  }
});

test("soundex", () => {
  let d: number;
  d = levenshtein(soundex("wash"), soundex("hush"));
  expect(d).toBe(1);
  // d = levenshtein(soundex("hello"), soundex("yerlo"));
  // console.log(d);
  // console.log(d);
});

const sorter = <T extends Rankable>(a: T, b: T): number => {
  return b.getRank() - a.getRank();
};

test("frequency search", () => {
  let docs = [
    "this is a test",
    "science is a term that you can search for",
    "science is called science for scientific reasons",
    "here are some other reasons to test my keyword search",
  ].map((s: string) => {
    let rank = 0;
    return {
      document: () => s,
      setRank: (r: number) => (rank = r),
      getRank: () => rank,
    };
  });
  let store = new FrequencyIndex(docs, { op: "or" });
  let query: string | string[];
  query = "scientific reasons";
  query = "test keyword";
  let res = store.search(query);
  for (let r of res) {
    console.log(r.getRank(), r.document());
  }
  expect(res.sort(sorter)[0].document()).toBe(
    "here are some other reasons to test my keyword search"
  );
});

test("misc", () => {
  // return;
  let data = fs.readFileSync("./src/search/testdata.txt");
  let rawdocs = data.toString().split("\n");

  type D = Rankable;

  let docs: Rankable[] = rawdocs.map(
    (d: string): D => {
      let rank = 0;
      return {
        document: () => d,
        setRank: (r: number) => (rank = r),
        getRank: () => rank,
      };
    }
  );

  class TestIndex extends FrequencyIndex<D> {
    test() {
      // console.log(this.documents);
      console.log(this.freqs.size);
    }
  }

  let store = new TestIndex(docs);
  store.test();

  let query: string;
  // query = "operating systems";
  query = "data science";
  let t0 = performance.now();
  docs = store.search(query);
  let t1 = performance.now() - t0;
  if (t1 > 15) {
    fail(`should run in under 15 milliseconds; got ${t1}`);
  }
});
