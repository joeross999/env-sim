export class Comparable {

  private id: string;

  constructor(id: string) {
    this.id = id;
  }
  equals(other: Comparable) {
    return this === other;
  }
  toString() {
    return this.id;
  }
}

export class Unique {
  static nextIdNum = 0;
  id: string;
  constructor() {
    this.id = String(Unique.nextIdNum++);
  }
}

export function range(_start: number, _end?: number, _step?: number): Array<number> {
  let start: number = (_end) ? _start : 0;
  let stop: number = (_end) ? _end : _start;
  let step: number = (_step) ? _step : 1;

  let t: Array<number> = [];
  for (let i = start; i < stop; i=i+step) {
    t.push(i);
  }

  return t;
}
