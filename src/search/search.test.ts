import fs from "fs";
import "@testing-library/jest-dom/extend-expect";

import {
  tokenize,
  vec,
  vectorize,
  vecsort,
  FrequencyIndex,
  Rankable,
  soundex,
} from "./vec";
import Trie from "./trie";

// test("vectorization", () => {
//   let res = vectorize(
//     "this is    a simple vEctOrizaTIon test for my  vectorization function"
//   );
//   for (let v of res) {
//     expect(v.key).not.toBe(""); // none of them should return an empty string
//     expect(v.ranking).not.toBe(0);
//     if (v.key === "vectorization") {
//       expect(v.ranking).toBe(2);
//     }
//     if (v.key === "function") {
//       expect(v.ranking).toBe(1);
//     }
//   }
// });

test("vector sorting", () => {
  type v = { i: number; vector: vec };
  let vectors: v[] = [
    {
      i: 0,
      vector: vectorize(
        `Lorem ipsum dolor sit amet, consectetur adipiscing lorem elit, sed do
        lorem, eiusmod tempor incididunt ut`
      ),
    },
    {
      i: 1,
      vector: vectorize(
        `Assembly languages were soon developed that let the programmer
        specify instruction in a text format, (e.g., ADD X, TOTAL), with abbreviations for each operation code and meaningful names for specifying addresses`
      ),
    },
    {
      i: 2,
      vector: vectorize(
        `Machine code was the language of early programs, written in the
        instruction set of the particular machine, often in binary notation`
      ),
    },
    {
      i: 3,
      vector: vectorize(
        `However, because an assembly language is little more than a
        different notation for a machine language, any two machines with
        different instruction sets also have different assembly languages`
      ),
    },
    {
      i: 4,
      vector: vectorize(
        `However, because an assembly language is little more than a
        different notation for a machine language, any two machines with
        different instruction sets also have different assembly languages
        assembly assembly`
      ),
    },
  ];

  // TODO this should pass
  // for (let v of vectors[2].vector) {
  //   if (v.key === "machine") {
  //     expect(v.ranking).toBe(2);
  //   }
  // }

  // for (let a of vectors) {
  //   console.log(a.i, a.vector);
  // }

  let sorted: v[];
  sorted = vecsort(vectors, "assembly");
  // expect(sorted[0].i).toBe(4);
  // sorted = vecsort(vectors, "lorem");
  // expect(sorted[0].i).toBe(0);
  sorted = vecsort(sorted, "different");
  // expect(sorted[0].i).toBe(4);
});

const subjects = [
  { code: "ANTH", name: "Anthropology" },
  { code: "BIO", name: "Biological Sciences" },
  { code: "BIOE", name: "Bioengineering" },
  { code: "CCST", name: "Chicano Chicana Studies" },
  { code: "CHEM", name: "Chemistry" },
  { code: "CHN", name: "Chinese" },
  { code: "COGS", name: "Cognitive Science" },
  { code: "CRES", name: "Critical Race and Ethnic Studies" },
  { code: "CRS", name: "Community Research and Service" },
  { code: "CSE", name: "Computer Science and Engineering" },
  { code: "ECON", name: "Economics" },
  { code: "EECS", name: "Electrical Engineering and Computer Science" },
  { code: "ENG", name: "English" },
  { code: "ENGR", name: "Engineering" },
  { code: "ENVE", name: "Environmental Engineering" },
  { code: "ES", name: "Environmental Systems (GR)" },
  { code: "ESS", name: "Environmental Systems Science" },
  { code: "FRE", name: "French" },
  { code: "GASP", name: "Global Arts Studies Program" },
  { code: "HIST", name: "History" },
  { code: "HS", name: "Heritage Studies" },
  { code: "IH", name: "Interdisciplinary Humanities" },
  { code: "JPN", name: "Japanese" },
  { code: "MATH", name: "Mathematics" },
  { code: "MBSE", name: "Materials and BioMat Sci & Engr" },
  { code: "ME", name: "Mechanical Engineering" },
  { code: "MGMT", name: "Management" },
  {
    code: "MIST",
    name: "Management of Innovation, Sustainability and Technology",
  },
  { code: "MSE", name: "Materials Science and Engineering" },
  { code: "NSED", name: "Natural Sciences Education" },
  { code: "PH", name: "Public Health" },
  { code: "PHIL", name: "Philosophy" },
  { code: "PHYS", name: "Physics" },
  { code: "POLI", name: "Political Science" },
  { code: "PSY", name: "Psychology" },
  { code: "QSB", name: "Quantitative and Systems Biology" },
  { code: "SOC", name: "Sociology" },
  { code: "SPAN", name: "Spanish" },
  { code: "SPRK", name: "Spark" },
  { code: "WRI", name: "Writing" },
];

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
  // console.log(soundex("hello"), soundex("yerlo"));
  console.log(soundex("wash"), soundex("wush"));
});

test("misc", () => {
  // return;
  let data = fs.readFileSync("./src/search/testdata.txt");
  let rawdocs = data.toString().split("\n");

  let docs: Rankable[] = rawdocs.map((d: string) => {
    let rank = 0;
    return {
      document: () => d,
      setRank: (r: number) => (rank = r),
      getRank: () => rank,
    };
  });
  let copy = {
    document: () => docs[0].document(),
    setRank: (r: number) => docs[0].setRank(r),
    getRank: () => docs[0].getRank(),
  };
  console.log(docs[0] == copy);
  console.log(docs[0] === copy);
  let store = new FrequencyIndex(docs);

  let query: string;
  // query = "network";
  // query = "global network";
  // query = "money network";
  // query = "network money";
  // query = "analysis";
  query = "operating systems";
  docs = store.search(["operating", "systems", "system", "sys"]);
  for (let d of docs.reverse()) {
    console.log(d.getRank(), d.document());
  }

  // type index = { raw: string; rank: number };
  // let indexes: index[] = [];
  // for (let i = 0; i < rankings.length; i++) {
  //   indexes.push({ raw: rawdocs[i], rank: rankings[i] });
  // }
  // indexes = indexes.sort((a: index, b: index) => a.rank - b.rank);
  // for (let ix of indexes) {
  //   console.log(ix.rank, ix.raw);
  // }
});
