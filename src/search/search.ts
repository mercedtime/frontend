/**
 * tokenize will clean and split a body of text into
 * smaller tokens.
 * @param body the body of text being tokenized.
 */
export const tokenize = (body: string): string[] => {
  /*eslint no-useless-escape: "off"*/
  return body
    .replace(/[\.\r;,\u2019\u2014]/g, "")
    .replace(/[\t\n_]/g, " ")
    .replace(/\u201c/g, '"')
    .replace(/\u2013/g, "-")
    .replace(/\u2018/g, "'")
    .toLowerCase()
    .split(" ")
    .filter((tok: string) => tok !== "" && !stopwords.has(tok));
};

export type Rankable = {
  setRank: (rank: number) => void;
  getRank: () => number;
  document: () => string;
};

export type Doc<T extends Rankable> = {
  doc: T;
  tokens: string[];
  frequencies: Map<string, number>;
};

type Op = {
  defaultRank: number;
  process: (rank: number, other: number) => number;
};

const operations: { [name: string]: Op } = {
  or: {
    defaultRank: 0,
    process: (rank: number, other: number) => rank + other,
  },
  and: {
    defaultRank: 1,
    // TODO find a way to normalize around 1
    process: (rank: number, other: number) => Math.abs(rank - 1) * other,
  },
};

type IndexValue = { freq: number; dist: number; docs: number[] };

type TokenMap<T> = Map<string, T>;

/**
 * FrequencyIndex is a document index that operates by
 * counting token frequencies in a document and a set.
 *
 * This is based on the TF*IDF algorithm.
 * https://en.wikipedia.org/wiki/tf-idf
 * of documents.
 */
export class FrequencyIndex<T extends Rankable> {
  private ndocs: number;
  protected op: Op = operations.or;

  protected freqs: TokenMap<IndexValue>;
  protected documents: Doc<T>[];

  constructor(docs?: T[], options?: { op?: "or" | "and" }) {
    if (options !== undefined) {
      this.op = operations[options.op || "or"];
    }

    this.freqs = new Map<string, IndexValue>();
    if (docs === undefined) {
      this.ndocs = 0;
      this.documents = [];
      return;
    }
    this.ndocs = docs.length;
    this.documents = docs.map((d: T) => {
      let tokens = tokenize(d.document());
      let freq = buildFreqMap(tokens);
      return { doc: d, tokens: tokens, frequencies: freq };
    });

    let val: IndexValue | undefined;
    for (let i = 0; i < docs.length; i++) {
      for (let tok of this.documents[i].tokens) {
        val = this.freqs.get(tok);
        if (val === undefined) {
          val = { freq: 0, dist: 0, docs: [] };
        }
        val.freq++;
        val.docs.push(i);
        this.freqs.set(tok, val);
      }
    }
  }

  search(query: string | string[]) {
    let querytok: string[];
    let maxfreq: number = 1; // TODO get this while indexing
    let doc: Doc<T>;
    let tf: number | undefined;
    let idf: IndexValue | undefined;
    let result: T[] = [];

    if (typeof query === "string") {
      querytok = tokenize(query);
    } else {
      querytok = query;
    }
    for (let i = 0; i < this.documents.length; i++) {
      this.documents[i].doc.setRank(this.op.defaultRank);
    }

    for (let q of querytok) {
      idf = this.freqs.get(q);
      if (idf === undefined) {
        continue;
      }
      for (let ix of idf.docs) {
        doc = this.documents[ix];
        tf = doc.frequencies.get(q);
        if (tf === undefined) {
          continue;
        }
        doc.doc.setRank(
          (tf / maxfreq) * Math.log(this.documents.length / idf.freq)
        );
        result.push(doc.doc);
      }
    }
    return result;
  }

  add(doc: T) {
    let tokens = tokenize(doc.document());
    let val: IndexValue | undefined;
    this.documents.push({
      doc: doc,
      tokens: tokens,
      frequencies: buildFreqMap(tokens),
    });
    for (let tok of tokens) {
      val = this.freqs.get(tok);
      if (val === undefined) {
        val = { freq: 0, dist: 0, docs: [] };
      }
      val.freq++;
      val.docs.push(this.documents.length - 1);
      this.freqs.set(tok, val);
    }
  }
}

/**
 * 0 | A, E, H, I, O, U, W, Y
 * 1 | B, F, P, V
 * 2 | C, G, J, K, Q, S, X, Z
 * 3 | D, T
 * 4 | L
 * 5 | M, N
 * 6 | R
 * https://www.archives.gov/research/census/soundex
 *
 * @param text text being parsed
 */
export const soundex = (text: string) => {
  let s = [];
  let si = 1;
  let c;
  let mappings = "01230120022455012623010202";

  s[0] = text[0].toUpperCase();
  for (let i = 1, l = text.length; i < l; i++) {
    c = text[i].toUpperCase().charCodeAt(0) - 65;
    if (c >= 0 && c <= 25) {
      if (mappings[c] === "0") {
        continue;
      }
      if (mappings[c] !== s[si - 1]) {
        s[si] = mappings[c];
        si++;
      }
      if (si > 3) {
        break;
      }
    }
  }
  if (si <= 3) {
    while (si <= 3) {
      s[si] = "0";
      si++;
    }
  }
  return s.join("");
};

const buildFreqMap = <T>(values: T[]): Map<T, number> => {
  let m = new Map<T, number>();
  let count: number | undefined;
  for (let val of values) {
    count = m.get(val);
    if (count === undefined) {
      count = 0;
    }
    count++;
    m.set(val, count);
  }
  return m;
};

const stopwords = new Set([
  "i",
  "me",
  "my",
  "myself",
  "we",
  "our",
  "ours",
  "ourselves",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "he",
  "him",
  "his",
  "himself",
  "she",
  "her",
  "hers",
  "herself",
  "it",
  "its",
  "itself",
  "they",
  "them",
  "their",
  "theirs",
  "themselves",
  "what",
  "which",
  "who",
  "whom",
  "this",
  "that",
  "these",
  "those",
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "having",
  "do",
  "does",
  "did",
  "doing",
  "a",
  "an",
  "the",
  "and",
  "but",
  "if",
  "or",
  "because",
  "as",
  "until",
  "while",
  "of",
  "at",
  "by",
  "for",
  "with",
  "about",
  "against",
  "between",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "to",
  "from",
  "up",
  "down",
  "in",
  "out",
  "on",
  "off",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "s",
  "t",
  "can",
  "will",
  "just",
  "don",
  "should",
  "now",
]);
