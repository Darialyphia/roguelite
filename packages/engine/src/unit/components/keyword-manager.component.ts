import type { Keyword } from '../keywords';

export class KeywordManagerComponent {
  private keywordsDict = new Map<Keyword, number>();

  add(keyword: Keyword) {
    if (!this.keywordsDict.has(keyword)) {
      this.keywordsDict.set(keyword, 0);
    }

    this.keywordsDict.set(keyword, this.keywordsDict.get(keyword)! + 1);
  }

  remove(keyword: Keyword, forceDelete = false) {
    if (!this.keywordsDict.has(keyword)) return;
    const newVal = this.keywordsDict.get(keyword)! - 1;
    if (newVal === 0 || forceDelete) {
      this.keywordsDict.delete(keyword);
    } else {
      this.keywordsDict.set(keyword, newVal);
    }
  }

  get keywords() {
    return [...this.keywordsDict.keys()];
  }
}
