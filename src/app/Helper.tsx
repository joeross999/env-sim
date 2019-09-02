export class Comparable {

  private id: String;

  constructor(id: String) {
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
  id: String;
  constructor() {
    this.id = String(Unique.nextIdNum++);
  }
}