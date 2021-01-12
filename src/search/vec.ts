import levenshtein from "js-levenshtein";

export type token = {
  key: string;
  ranking: number;
};

export type vec = token[];
type withvec = { vector: vec };
/**
 * tokenize will clean and split a body of text into
 * smaller tokens.
 * @param body the body of text being tokenized.
 */
export const tokenize = (body: string): string[] => {
  return body
    .replace(/\.\n\r;,/g, "")
    .replace(/\t-_/g, " ")
    .toLowerCase()
    .split(" ")
    .filter((tok: string) => tok !== "" && !stopwords.has(tok));
};

export const vectorize = (body: string): vec => {
  let tokens = tokenize(body);
  return countVectorize(tokens).sort(
    (a: token, b: token) => b.ranking - a.ranking
  );
};

const sum = (vals: number[]): number => {
  let ret = 0;
  for (let v of vals) {
    ret += v;
  }
  return ret;
};

export function vecsort<T>(
  vectors: (T & withvec)[],
  query: string
): (T & withvec)[] {
  return vectors.sort((a: T & withvec, b: T & withvec): number => {
    const calc = (data: T & withvec) =>
      sum(data.vector.map((t: token) => levenshtein(t.key, query) * t.ranking));
    return calc(b) / b.vector.length - calc(a) / a.vector.length;
  });
}

export type Rankable = {
  setRank: (rank: number) => void;
  document: () => string;
};

type Doc<T extends Rankable> = { doc: T; tokens: string[] };

// type FreqMap = Map<string, { freq: number; dist: number }>;
type FreqMap = Map<string, number>;

/**
 * FrequencyIndex is a document index that operates by
 * counting token frequencies in a document and a set.
 *
 * This is based on the TF-IDF algorithm.
 * https://en.wikipedia.org/wiki/Tf%E2%80%93idf
 * of documents.
 */
export class FrequencyIndex<T extends Rankable> {
  freqs: FreqMap;
  documents: Doc<T>[];
  ndocs: number;

  constructor(docs: T[] | undefined) {
    this.freqs = new Map<string, number>();
    if (docs === undefined) {
      this.ndocs = 0;
      this.documents = [];
      return;
    }
    this.ndocs = docs.length;
    this.documents = docs.map((d: T) => {
      return { doc: d, tokens: tokenize(d.document()) };
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

  search(query: string): number[] {
    let querytok = tokenize(query);
    let tfs = new Map<string, number>();
    let rankings = new Array<number>(this.ndocs);

    let maxfreq: number;
    let count: number | undefined;
    let doc: Doc<T>;
    for (let i = 0; i < this.ndocs; i++) {
      maxfreq = 0;
      doc = this.documents[i];

      for (let tok of doc.tokens) {
        count = tfs.get(tok);
        if (count === undefined) {
          count = 0;
        }
        count += 1;
        if (count > maxfreq) {
          maxfreq = count;
        }
        tfs.set(tok, count);
      }

      rankings[i] = 0;
      for (let q of querytok) {
        let tf = tfs.get(q);
        let idf = this.freqs.get(q);
        if (idf === undefined || tf === undefined) {
          continue;
        }
        rankings[i] += (tf / maxfreq) * Math.log(this.ndocs / idf);
      }
      doc.doc.setRank(rankings[i]);
      tfs.clear();
    }
    return rankings;
  }

  add(doc: T) {
    let tokens = tokenize(doc.document());
    let count: number | undefined;
    this.documents.push({ doc: doc, tokens: tokens });
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
 * countVectorize will vectorize a list of tokens base on
 * token frequency in the corpus.
 * @param tokens an array of cleaned token strings
 */
const countVectorize = (tokens: string[]): vec => {
  let res: vec = [];
  let map = new Map<string, number>();
  let count: number | undefined;
  for (let i = 0; i < tokens.length; i++) {
    let tok = tokens[i];
    count = map.get(tok);
    if (count === undefined) {
      count = 0;
    }
    map.set(tok, count + 1);
  }
  map.forEach((val: number, key: string) => {
    res.push({ key: key, ranking: val });
  });
  return res;
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
