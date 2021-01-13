/**
 * tokenize will clean and split a body of text into
 * smaller tokens.
 * @param body the body of text being tokenized.
 */
export const tokenize = (body: string): string[] => {
  return body
    .replace(/[\.\r;,\u2019\u2014]/g, "")
    .replace(/[\t\n-_]/g, " ")
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

type Doc<T extends Rankable> = {
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

export class DocumentIndex<T extends Rankable> {
  private freqs: TokenMap<IndexValue>;
  private op: Op = operations.or;

  protected documents: Doc<T>[];

  constructor(docs: T[]) {
    this.freqs = new Map<string, IndexValue>();
    this.documents = docs.map((d: T) => {
      let tokens = tokenize(d.document());
      return { doc: d, tokens: tokens, frequencies: buildFreqMap(tokens) };
    });

    let tokens: string[];
    let val: IndexValue | undefined;
    for (let d = 0; d < this.documents.length; d++) {
      tokens = this.documents[d].tokens;
      for (let i = 0; i < tokens.length; i++) {
        val = this.freqs.get(tokens[i]);
        if (val === undefined) {
          val = { freq: 0, dist: 0, docs: [] };
        }
        val.freq++;
        val.docs.push(d);
        this.freqs.set(tokens[i], val);
      }
    }
  }
}

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
  private op: Op = operations.or;

  protected freqs: TokenMap<number>;
  documents: Doc<T>[];

  constructor(docs?: T[], options?: { op?: "or" | "and" }) {
    if (options !== undefined) {
      this.op = operations[options.op || "or"];
    }

    this.freqs = new Map<string, number>();
    if (docs === undefined) {
      this.ndocs = 0;
      this.documents = [];
      return;
    }
    this.ndocs = docs.length;
    this.documents = docs.map((d: T) => {
      let tokens = tokenize(d.document());
      return { doc: d, tokens: tokens, frequencies: buildFreqMap(tokens) };
    });

    let count: number | undefined;
    for (let i = 0; i < docs.length; i++) {
      for (let tok of this.documents[i].tokens) {
        count = this.freqs.get(tok);
        if (count === undefined) {
          count = 0;
        }
        this.freqs.set(tok, count + 1);
      }
    }
  }

  search(query: string | string[]): T[] {
    let querytok: string[];
    if (typeof query === "string") {
      querytok = tokenize(query);
    } else {
      querytok = query;
    }

    let maxfreq: number;
    let doc: Doc<T>;
    let rank: number;

    for (let i = 0; i < this.ndocs; i++) {
      maxfreq = 0;
      doc = this.documents[i];

      rank = this.op.defaultRank;
      for (let q of querytok) {
        let tf = doc.frequencies.get(q);
        if (tf == undefined) {
          continue;
        }
        let idf = this.freqs.get(q);
        if (idf === undefined) {
          continue;
        }
        rank = this.op.process(
          rank,
          (tf / maxfreq) * Math.log(this.ndocs / idf)
        );
      }
      doc.doc.setRank(rank);
    }
    return this.documents.map((d: Doc<T>) => d.doc);
  }

  add(doc: T) {
    let tokens = tokenize(doc.document());
    let count: number | undefined;
    this.documents.push({
      doc: doc,
      tokens: tokens,
      frequencies: buildFreqMap(tokens),
    });
    for (let tok of tokens) {
      count = this.freqs.get(tok);
      if (count === undefined) {
        count = 0;
      }
      this.freqs.set(tok, count + 1);
    }
  }
}

/**
 * tfidf will calculate the TF-IDF value for an array of documents
 * and a query.
 * https://en.wikipedia.org/wiki/Tf%E2%80%93idf
 *
 * @param docs An array of token vectors
 * @param query A raw query string by which the TF-IDF will
 *  be calculated.
 */
export const tfidf = (docs: string[][], query: string) => {
  let count: number | undefined;
  let querytok = tokenize(query);
  let rankings: number[] = new Array<number>(docs.length);

  let idfs = new Map<string, number>();
  let tfs = new Map<string, number>();

  // Count the frequencies of every word
  // accross the set of documents.
  for (let doc of docs) {
    for (let tok of doc) {
      count = idfs.get(tok);
      if (count === undefined) {
        count = 0;
      }
      idfs.set(tok, count + 1);
    }
  }

  for (let i = 0; i < docs.length; i++) {
    let maxcount = 0;
    for (let tok of docs[i]) {
      count = tfs.get(tok);
      if (count === undefined) {
        count = 0;
      }
      count += 1;

      // count the max freq of any word in d
      if (count > maxcount) {
        maxcount = count;
      }
      tfs.set(tok, count);
    }

    rankings[i] = 0;
    for (let q of querytok) {
      let tf = tfs.get(q);
      let idf = idfs.get(q);
      if (idf === undefined || tf === undefined) {
        continue;
      }
      rankings[i] += (tf / maxcount) * Math.log(docs.length / idf);
    }
    tfs.clear();
  }
  return rankings;
};

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
    if (count == undefined) {
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
