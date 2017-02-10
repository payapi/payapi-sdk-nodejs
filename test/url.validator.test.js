(function () {
  "use strict";

  const should = require("should");
  const chai = require("chai");
  const chaiAsPromised = require("chai-as-promised");
  const expect = chai.expect;

  chai.use(chaiAsPromised);
  var UrlValidator = require("../lib/url.validator");
  var url;

  beforeEach(function() {
    url = "https://payapi.io/terms"
  });

  describe("URL", function() {
    it("should be valid with https protocol and valid url", function() {
      return expect(
          new UrlValidator({ url: url }).validate()
          ).to.be.true;
    });
    it("should be invalid with http protocol and valid url", function() {
      url = "http://payapi.io/terms";
      return expect(
          new UrlValidator({ url: url }).validate()
          ).to.be.false;
    });
    it("should be invalid with https protocol and invalid url", function() {
      url = "https://payapi.io/terms diiba daaba";
      return expect(
          new UrlValidator({ url: url }).validate()
          ).to.be.false;
    });
    it("should be invalid with no protocol and valid url", function() {
      url = "payapi.io/terms";
      return expect(
          new UrlValidator({ url: url }).validate()
          ).to.be.false;
    });
    it("should be invalid with no protocol and invalid url", function() {
      url = "payapi.io/terms diiba daaba";
      return expect(
          new UrlValidator({ url: url }).validate()
          ).to.be.false;
    });
    it("should be invalid undefined", function() {
      url = null;
      return expect(
          new UrlValidator({ url: url }).validate()
          ).to.be.false;
    });
  });
}());
