const chai = require("chai");
const SizedArray = require("./sized_array");

describe("SizedArray", () => {
  it("Should not accept size 0", () => {
    chai.expect(() => {new SizedArray(0);}).to.throw();
  });

  it("Should accept size > 0", () => {
    chai.expect(JSON.stringify(new SizedArray(2))).to.equal(JSON.stringify([]));
  });

  it("Should remove items from start when reaching limit", () => {
    let array = new SizedArray(2);
    chai.expect(JSON.stringify(array)).to.equal(JSON.stringify([]));
    array.push(4);
    chai.expect(JSON.stringify(array)).to.equal(JSON.stringify([4]));
    array.push(5);
    chai.expect(JSON.stringify(array)).to.equal(JSON.stringify([4, 5]));
    array.push(6);
    chai.expect(JSON.stringify(array)).to.equal(JSON.stringify([5, 6]));
  });
});
