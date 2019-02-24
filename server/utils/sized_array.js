module.exports = class SizedArray extends Array {
  constructor(maxLength) {
    if (maxLength === 0)
      throw new Error("Should have a size > 0");

    super();

    this._maxLength = maxLength;
  }

  push(value) {
    if (this.length >= this._maxLength)
      this.shift();

    return super.push(value);
  }
}
