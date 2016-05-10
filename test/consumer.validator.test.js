(function () {
  "use strict";

  const should = require("should");
  const chai = require("chai");
  const chaiAsPromised = require("chai-as-promised");
  const expect = chai.expect;
  const jwt = require("jwt-simple");
  const moment = require("moment");
  chai.use(chaiAsPromised);
  var ConsumerValidator = require("../lib/consumer.validator");
  var consumer;
  var optionalFields;

  beforeEach(function() {
    consumer = {
      name: "consumer name",
      locale: "en-US",
      co: "Care of someone",
      streetAddress: "Mannerheimintie 12",
      streetAddress2: "A 123",
      postalCode: "00100",
      city: "Helsinki",
      stateOrProvince: "Uusimaa",
      countryCode: "FI",
      locale: "en-US"
    };
    optionalFields = [];
  });

  describe("Consumer", function() {
    describe("Name", function() {
      it("can be optional", function() {
        delete consumer.name;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        optionalFields = ['consumer.name'];
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with a western name", function() {
        consumer.name = "Matti Meikäläinen";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with a chinese name", function() {
        consumer.name = "王 秀英";
        consumer.locale = "zh_CN";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail with blacklisted characters", function() {
        consumer.name = "< diiba";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer name");
        expect(validationError.translationKey).to.equal("invalid.consumer.name");
        expect(validationError.elementName).to.equal("consumer[name]");
        expect(validationError.value).to.equal(consumer.name);
      });
      it("should fail with name shorter than 2 characters", function() {
        consumer.name = "x";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer name");
        expect(validationError.translationKey).to.equal("invalid.consumer.name");
        expect(validationError.elementName).to.equal("consumer[name]");
        expect(validationError.value).to.equal(consumer.name);
      });
      it("should fail with name longer than 53 characters", function() {
        consumer.name = "Bithurasdinhournimlousgon Kleslinfarjilpourginjdesher2";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer name");
        expect(validationError.translationKey).to.equal("invalid.consumer.name");
        expect(validationError.elementName).to.equal("consumer[name]");
        expect(validationError.value).to.equal(consumer.name);
      });
    });

    describe("c/o (care of)", function() {
      it("should succeed when left empty", function() {
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail with co longer than 53 characters", function() {
        consumer.co = "Bithurasdinhournimlousgon Kleslinfarjilpourginjdesher2";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer c/o");
        expect(validationError.translationKey).to.equal("invalid.consumer.co");
        expect(validationError.elementName).to.equal("consumer[co]");
        expect(validationError.value).to.equal(consumer.co);
      });
      it("should fail with blacklisted characters", function() {
        consumer.co = "< diiba";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer c/o");
        expect(validationError.elementName).to.equal("consumer[co]");
        expect(validationError.translationKey).to.equal("invalid.consumer.co");
        expect(validationError.value).to.equal(consumer.co);
      });
    });

    describe("Street address", function() {
      it("can be optional", function() {
        delete consumer.streetAddress;
        optionalFields = ['consumer.streetAddress'];
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail with streetAddress longer than 53 characters", function() {
        consumer.streetAddress = "123456789012345678901234567890123456789012345678901234";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer street address");
        expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress");
        expect(validationError.elementName).to.equal("consumer[streetAddress]");
        expect(validationError.value).to.equal(consumer.streetAddress);
      });
      it("should fail with blacklisted characters", function() {
        consumer.streetAddress = "< diiba";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer street address");
        expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress");
        expect(validationError.elementName).to.equal("consumer[streetAddress]");
        expect(validationError.value).to.equal(consumer.streetAddress);
      });
    });

    describe("Street address 2", function() {
      it("should succeed when left empty", function() {
        delete consumer.streetAddress2;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail with streetAddress longer than 53 characters", function() {
        consumer.streetAddress2 = "123456789012345678901234567890123456789012345678901234";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer street address 2");
        expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress2");
        expect(validationError.elementName).to.equal("consumer[streetAddress2]");
        expect(validationError.value).to.equal(consumer.streetAddress2);
      });
      it("should fail with blacklisted characters", function() {
        consumer.streetAddress2 = "< diiba";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer street address 2");
        expect(validationError.elementName).to.equal("consumer[streetAddress2]");
        expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress2");
        expect(validationError.value).to.equal(consumer.streetAddress2);
      });
    });

    describe("Postal code", function() {
      it("can be optional", function() {
        delete consumer.postalCode;
        optionalFields = ['consumer.postalCode'];
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail with postalCode longer than 10 characters", function() {
        consumer.postalCode = "12345678901";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer postal code");
        expect(validationError.elementName).to.equal("consumer[postalCode]");
        expect(validationError.translationKey).to.equal("invalid.consumer.postalCode");
        expect(validationError.value).to.equal(consumer.postalCode);
      });
      it("should fail with blacklisted characters", function() {
        consumer.postalCode = "< diiba";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer postal code");
        expect(validationError.elementName).to.equal("consumer[postalCode]");
        expect(validationError.translationKey).to.equal("invalid.consumer.postalCode");
        expect(validationError.value).to.equal(consumer.postalCode);
      });
    });

    describe("City", function() {
      it("can be optional", function() {
        delete consumer.city;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        optionalFields = ['consumer.city'];
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail with city longer than 53 characters", function() {
        consumer.city = "123456789012345678901234567890123456789012345678901234";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer city");
        expect(validationError.translationKey).to.equal("invalid.consumer.city");
        expect(validationError.elementName).to.equal("consumer[city]");
        expect(validationError.value).to.equal(consumer.city);
      });
      it("should fail with blacklisted characters", function() {
        consumer.city = "< diiba";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer city");
        expect(validationError.translationKey).to.equal("invalid.consumer.city");
        expect(validationError.elementName).to.equal("consumer[city]");
        expect(validationError.value).to.equal(consumer.city);
      });
    });

    describe("State or province", function() {
      it("should succeed when left empty", function() {
        delete consumer.stateOrProvince;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail with stateOrProvince longer than 53 characters", function() {
        consumer.stateOrProvince = "123456789012345678901234567890123456789012345678901234";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer state or province");
        expect(validationError.translationKey).to.equal("invalid.consumer.stateOrProvince");
        expect(validationError.elementName).to.equal("consumer[stateOrProvince]");
        expect(validationError.value).to.equal(consumer.stateOrProvince);
      });
      it("should fail with blacklisted characters", function() {
        consumer.stateOrProvince = "< diiba";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer state or province");
        expect(validationError.elementName).to.equal("consumer[stateOrProvince]");
        expect(validationError.translationKey).to.equal("invalid.consumer.stateOrProvince");
        expect(validationError.value).to.equal(consumer.stateOrProvince);
      });
    });

    describe("Country code", function() {
      it("can be optional", function() {
        delete consumer.countryCode;
        optionalFields = ["consumer.countryCode"];
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail if it doesn't exist in list of country codes", function() {
        consumer.countryCode = "foo";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer country code");
        expect(validationError.translationKey).to.equal("invalid.consumer.countryCode");
        expect(validationError.elementName).to.equal("consumer[countryCode]");
        expect(validationError.value).to.equal(consumer.countryCode);
      });
    });

    describe("Locale", function() {
      it("should fall back to en-US when left empty", function() {
        delete consumer.locale;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail with blacklisted characters", function() {
        consumer.locale = "<iiba";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer locale");
        expect(validationError.translationKey).to.equal("invalid.consumer.locale");
        expect(validationError.elementName).to.equal("consumer[locale]");
        expect(validationError.value).to.equal(consumer.locale);
      });
      it("should fail when being under 2 characters long", function() {
        consumer.locale = "F";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer locale");
        expect(validationError.elementName).to.equal("consumer[locale]");
        expect(validationError.translationKey).to.equal("invalid.consumer.locale");
        expect(validationError.value).to.equal(consumer.locale);
      });
      it("should fail when being over 7 characters long", function() {
        consumer.locale = "12345678";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer locale");
        expect(validationError.elementName).to.equal("consumer[locale]");
        expect(validationError.translationKey).to.equal("invalid.consumer.locale");
        expect(validationError.value).to.equal(consumer.locale);
      });
    });
  });
}());
