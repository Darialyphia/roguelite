import { RUNES, type Rune } from '../../utils/rune';

export class RuneManager {
  private readonly _runes: Rune[] = [];

  get runes() {
    return [...this._runes];
  }

  add(rune: Rune) {
    this._runes.push(rune);
  }

  remove(rune: Rune) {
    const index = this._runes.findIndex(r => r.equals(rune));
    if (index === -1) return;
    this._runes.splice(index, 1);
  }

  getMissing(runes: Rune[]) {
    const groups = this.countRunesById(runes);
    const ownGroups = this.countRunesById(this._runes);

    return Object.fromEntries(
      Object.entries(groups).map(([key, count]) => {
        if (key === RUNES.COLORLESS.id) {
          return [key, 0];
        } else {
          return [key, Math.max(0, (ownGroups[key] || 0) - count)];
        }
      })
    );
  }

  hasUnlocked(runes: Rune[]) {
    const groups = this.countRunesById(runes);
    const ownGroups = this.countRunesById(this._runes);

    return (
      runes.length <= this._runes.length &&
      Object.entries(groups).every(([key, count]) => {
        if (key === RUNES.COLORLESS.id) return true;
        return count <= ownGroups[key] || 0;
      })
    );
  }

  countRunesById(runes: Rune[]): Record<string, number> {
    return runes.reduce(
      (acc, rune) => {
        acc[rune.id] = (acc[rune.id] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  getRuneCount(rune: Rune) {
    return this.runes.filter(r => r.equals(rune)).length;
  }
}
