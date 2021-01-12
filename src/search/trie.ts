class TrieNode {
  private children: Map<number, TrieNode>;
  private char: number;

  constructor(char: number, residule: string) {
    this.char = char;
    this.children = new Map<number, TrieNode>();
    if (residule.length > 0) {
      this.add(residule);
    }
  }

  add(word: string) {
    if (word.length === 0) {
      return;
    }
    let char = word.charCodeAt(0);
    let residule = word.slice(1);
    if (this.children.has(char)) {
      this.children.get(char)?.add(residule);
    } else {
      this.children.set(char, new TrieNode(char, residule));
    }
  }

  private child(word: string) {
    return this.children.get(word.charCodeAt(0));
  }

  depth(word: string): number {
    if (word.length === 0) {
      return 0;
    }

    let d = 0;
    let child = this.child(word);
    if (child === undefined) {
      return 0;
    }
    d++;
    word = word.slice(1);

    while (word.length > 0) {
      child = child?.child(word);
      if (child === undefined) {
        break;
      }
      d++;
      word = word.slice(1);
    }
    return d;
  }

  find(word: string): [number, string] {
    let charstr = String.fromCharCode(this.char);
    if (word.length === 0) {
      return [0, charstr];
    }
    let child = this.child(word);
    if (child === undefined) {
      return [0, charstr];
    }

    let [d, str] = child.find(word.slice(1));
    // root node is 0
    if (this.char > 0) {
      return [1 + d, charstr + str];
    }
    return [1 + d, str];
  }
}

export default class Trie extends TrieNode {
  constructor(words: string[]) {
    super(0, "");
    for (let w of words) {
      this.add(w);
    }
  }
}
