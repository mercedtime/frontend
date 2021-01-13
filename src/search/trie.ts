export interface Node {
  char: number;
  add: (word: string) => void;
}

class TrieNode implements Node {
  char: number;

  protected children: Map<number, TrieNode>;
  private terminates: boolean = false;

  constructor(char: number, residule: string) {
    this.char = char;
    this.children = new Map<number, TrieNode>();
    if (residule.length > 0) {
      this.add(residule);
    }
    this.terminates = this.children.size == 0;
  }

  // TODO make this iterative to save memory
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

  collapse(): string[] {
    let res: string[] = [];
    let current: string;
    for (const [char, child] of this.children) {
      current = String.fromCharCode(char);
      if (child.children.size === 0) {
        res.push(current);
      } else {
        if (child.terminates) {
          res.push(current);
        }
        for (let s of child.collapse()) {
          res.push(current + s);
        }
      }
    }
    return res;
  }

  getNode(word: string): TrieNode | undefined {
    if (word.length === 0) {
      return this;
    }
    let child = this.child(word);
    if (child === undefined) {
      return undefined;
    }
    word = word.slice(1);
    while (word.length > 0) {
      child = child.child(word);
      if (child === undefined) {
        return undefined;
      }
      word = word.slice(1);
    }
    return child;
  }
}

export default class Trie extends TrieNode {
  constructor(words: string[]) {
    super(0, "");
    for (let w of words) {
      this.add(w);
    }
  }

  search(prefix: string): string[] {
    let node = this.getNode(prefix);
    if (node === undefined) {
      return [];
    }
    return node.collapse().map((s: string) => prefix + s);
  }

  get size(): number {
    return this.children.size;
  }
}
