const chai = require("chai");
const validators = require("./validators");

describe("validateEmail", () => {
	it("Empty string", () => {
		chai.expect(validators.validateEmail("")).to.equal(false);
  });
  it("No @", () => {
		chai.expect(validators.validateEmail("test.mysublife.com")).to.equal(false);
  });
  it("No . in 2nd part", () => {
		chai.expect(validators.validateEmail("test@mysublife")).to.equal(false);
  });
  it("Nothing before @", () => {
		chai.expect(validators.validateEmail("@mysublife.com")).to.equal(false);
  });
  it("Proper email with domain.dns", () => {
		chai.expect(validators.validateEmail("test@mysublife.com")).to.equal(true);
  });
  it("Proper email with sub.domain.dns", () => {
		chai.expect(validators.validateEmail("test@test.mysublife.com")).to.equal(true);
  });
  it("Proper email with domain.name", () => {
		chai.expect(validators.validateEmail("test@mysublife.name")).to.equal(true);
	});
});

describe("validateMessage", () => {
	it("Invalid string", () => {
    chai.expect(validators.validateMessage(null)).to.equal(false);
    chai.expect(validators.validateMessage("")).to.equal(false);
    chai.expect(validators.validateMessage(123)).to.equal(false);
  });
  it("Ok string", () => {
    chai.expect(validators.validateMessage("my message")).to.equal(true);
    chai.expect(validators.validateMessage("my message\nwith new line")).to.equal(true);

    let str = "a".repeat(validators.MESSAGE_LENGTH_MAX);
    chai.expect(validators.validateMessage(str)).to.equal(true);
  });
  it("String too long", () => {
    let str = "a".repeat(validators.MESSAGE_LENGTH_MAX + 1);
    chai.expect(validators.validateMessage(str)).to.equal(false);
  });
});

describe("validateSessionKey", () => {
  it("Empty string", () => {
		chai.expect(validators.validateSessionKey("")).to.equal(false);
  });
  it("1 char", () => {
		chai.expect(validators.validateSessionKey("a")).to.equal(false);
  });
  it("129 char", () => {
		chai.expect(validators.validateSessionKey("398c0d61f6f64b6d37afd661bf76d96c46912f04c327d63048bc549b35c4e2b4eea8f524ec47ac4dcf98396bc864f1b70e583b20665cd1cbf2bb2bad446110a7e")).to.equal(false);
  });
  it("128 char", () => {
    chai.expect(validators.validateSessionKey("398c0d61f6f64b6d37afd661bf76d96c46912f04c327d63048bc549b35c4e2b4eea8f524ec47ac4dcf98396bc864f1b70e83b20665cd1cbf2bb2bad446110a7e")).to.equal(true);
    chai.expect(validators.validateSessionKey("398C0d61f6f64b6d37afd661bf76d96c46912f04c327d63048bc549b35c4e2b4eea8f524ec47ac4dcf98396bc864f1b70e83b20665cd1cbf2bb2bad446110a7e")).to.equal(true);
  });
  it("128 char with special", () => {
    chai.expect(validators.validateSessionKey("398c0d61f6f64b6d37afd66.bf76d96c46912f04c327d63048bc549b35c4e2b4eea8f524ec47ac4dcf98396bc864f1b70e83b20665cd1cbf2bb2bad446110a7e")).to.equal(false);
    chai.expect(validators.validateSessionKey("398c0d61f6f64b6d37afd66-bf76d96c46912f04c327d63048bc549b35c4e2b4eea8f524ec47ac4dcf98396bc864f1b70e83b20665cd1cbf2bb2bad446110a7e")).to.equal(false);
    chai.expect(validators.validateSessionKey("'98c0d61f6f64b6d37afd66-bf76d96c46912f04c327d63048bc549b35c4e2b4eea8f524ec47ac4dcf98396bc864f1b70e83b20665cd1cbf2bb2bad446110a7e")).to.equal(false);
    chai.expect(validators.validateSessionKey("\"98c0d61f6f64b6d37afd66-bf76d96c46912f04c327d63048bc549b35c4e2b4eea8f524ec47ac4dcf98396bc864f1b70e83b20665cd1cbf2bb2bad446110a7e")).to.equal(false);
  });
});
