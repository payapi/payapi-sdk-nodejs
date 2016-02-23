(function () {
  "use strict";

  const should = require("should");
  const chai = require("chai");
  const chaiAsPromised = require("chai-as-promised");
  const expect = chai.expect;
  const moment = require("moment");
  chai.use(chaiAsPromised);
  var InputDataValidator = require("../lib/validators").InputDataValidator;
  var params;

  beforeEach(function() {
    params = {
      payment: {
        ip: "8.8.8.8",
      },
      consumer: {
        name: "consumer name",
        email: "nosuchemailaddress@payapi.io",
        locale: "en-US",
        co: "Care of someone",
        streetAddress: "Mannerheimintie 12",
        streetAddress: "A 123",
        postalCode: "00100",
        city: "Helsinki",
        stateOrProvince: "Uusimaa",
        country: "",
        locale: ""
      },
    };
  });

  describe("InputDataValidator", function() {
    describe("Payment", function() {
      describe("IP address", function() {
        it("should succeed with ip 8.8.8.8", function() {
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });

        it("should fail with ip ::1:127.0.0.1.ö", function() {
          params.payment.ip = "::1:127.0.0.1.ö";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment IP address");
          expect(validationError.translationKey).to.equal("invalid.payment.ip.address");
          expect(validationError.value).to.equal(params.payment.ip);
        });

        it("should fail with ip :", function() {
          params.payment.ip = ":";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment IP address");
          expect(validationError.translationKey).to.equal("invalid.payment.ip.address");
          expect(validationError.value).to.equal(params.payment.ip);
        });

        it("should succeed with ip ::1:127.0.0.1", function() {
          params.payment.ip = "::1:127.0.0.1";
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });
      });
    });

    describe("Consumer", function() {

      describe("Name", function() {
        it("should fail with empty name", function() {
          delete params.consumer.name;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer name");
          expect(validationError.translationKey).to.equal("invalid.consumer.name");
          expect(validationError.value).to.equal(params.consumer.name);
        });
        it("should fail with non alphanumeric name", function() {
          params.consumer.name = "### diiba";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer name");
          expect(validationError.translationKey).to.equal("invalid.consumer.name");
          expect(validationError.value).to.equal(params.consumer.name);
        });
        it("should fail with name shorter than 2 characters", function() {
          params.consumer.name = "x";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer name");
          expect(validationError.translationKey).to.equal("invalid.consumer.name");
          expect(validationError.value).to.equal(params.consumer.name);
        });
        it("should fail with name longer than 53 characters", function() {
          params.consumer.name = "Bithurasdinhournimlousgon Kleslinfarjilpourginjdesher2";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer name");
          expect(validationError.translationKey).to.equal("invalid.consumer.name");
          expect(validationError.value).to.equal(params.consumer.name);
        });
      });

      describe("Email address", function() {
        it("should succeed with email nosuchemailaddress@payapi.io", function() {
          params.consumer.email = "nosuchemailaddress@payapi.io";
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });

        it("should fail with email diiba", function() {
          params.consumer.email = "diiba";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer email address");
          expect(validationError.translationKey).to.equal("invalid.consumer.email.address");
          expect(validationError.value).to.equal(params.consumer.email);
        });
      });

      describe("c/o (care of)", function() {
        it("should succeed when left empty", function() {
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });
        it("should fail with co longer than 53 characters", function() {
          params.consumer.co = "Bithurasdinhournimlousgon Kleslinfarjilpourginjdesher2";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer c/o");
          expect(validationError.translationKey).to.equal("invalid.consumer.co");
          expect(validationError.value).to.equal(params.consumer.co);
        });
      });

      describe("Street address", function() {
        it("should fail when left empty", function() {
          delete params.consumer.streetAddress;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer street address");
          expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress");
          expect(validationError.value).to.equal(params.consumer.streetAddress);
        });
        it("should fail with streetAddress longer than 53 characters", function() {
          params.consumer.streetAddress = "123456789012345678901234567890123456789012345678901234";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer street address");
          expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress");
          expect(validationError.value).to.equal(params.consumer.streetAddress);
        });
      });

      describe("Street address 2", function() {
        it("should succeed when left empty", function() {
          delete params.consumer.streetAddress2;
          return expect(
            new InputDataValidator(params).validate()
          ).to.be.empty;
        });
        it("should fail with streetAddress longer than 53 characters", function() {
          params.consumer.streetAddress2 = "123456789012345678901234567890123456789012345678901234";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer street address 2");
          expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress2");
          expect(validationError.value).to.equal(params.consumer.streetAddress2);
        });
      });

      describe("Postal code", function() {
        it("should fail when left empty", function() {
          delete params.consumer.postalCode;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer postal code");
          expect(validationError.translationKey).to.equal("invalid.consumer.postalCode");
          expect(validationError.value).to.equal(params.consumer.postalCode);
        });
        it("should fail with postalCode longer than 10 characters", function() {
          params.consumer.postalCode = "12345678901";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer postal code");
          expect(validationError.translationKey).to.equal("invalid.consumer.postalCode");
          expect(validationError.value).to.equal(params.consumer.postalCode);
        });
      });

      describe("City", function() {
        it("should fail when left empty", function() {
          delete params.consumer.city;
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer city");
          expect(validationError.translationKey).to.equal("invalid.consumer.city");
          expect(validationError.value).to.equal(params.consumer.city);
        });
        it("should fail with city longer than 53 characters", function() {
          params.consumer.city = "123456789012345678901234567890123456789012345678901234";
          var validationError = new InputDataValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer city");
          expect(validationError.translationKey).to.equal("invalid.consumer.city");
          expect(validationError.value).to.equal(params.consumer.city);
        });
      });
    });
  });
}());
