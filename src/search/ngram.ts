export const ngram = (n: number, body: string): string[][] => {
  let grams: string[][] = [];
  let tokens = body
    .replace(/\.\n\r;,/g, "")
    .replace(/\t-_/g, " ")
    .toLowerCase()
    .split(" ");
  let ix = tokens.length - n + 1;
  while (ix--) {
    grams[ix] = tokens.slice(ix, ix + n);
  }
  return grams;
};
