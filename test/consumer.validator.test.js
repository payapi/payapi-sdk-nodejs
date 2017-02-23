(function () {
  "use strict";

  const should = require("should");
  const chai = require("chai");
  const chaiAsPromised = require("chai-as-promised");
  const expect = chai.expect;
  const jwt = require("jwt-simple");
  const moment = require("moment");
  const BLACKLISTED_CHARACTERS = [";", "`", "´", "\"", "{", "}", "<", ">"];

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
      phoneNumber: "34615344819"
    };
    optionalFields = [];
  });

  describe("Consumer", function() {
    describe("Name", function() {
      it("can be optional", function() {
        delete consumer.name;
        optionalFields = ["name"];
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete consumer.name;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer name");
        expect(validationError.translationKey).to.equal("invalid.consumer.name");
        expect(validationError.value).to.equal("Consumer name is mandatory");
      });
      it("should fail if not optional but is empty", function() {
        consumer.name = "";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer name");
        expect(validationError.translationKey).to.equal("invalid.consumer.name");
        expect(validationError.elementName).to.equal("consumer[name]");
        expect(validationError.value).to.equal("Consumer name is mandatory");
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
      it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          consumer.name = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            consumer: consumer,
            optionalFields: optionalFields
          };
          var validationError = new ConsumerValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer name");
          expect(validationError.translationKey).to.equal("invalid.consumer.name");
          expect(validationError.value).to.equal("Consumer name is not URL encoded");
        }
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
        expect(validationError.value).to.equal("Consumer name is must be between 2 and 52 characters");
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
        expect(validationError.value).to.equal("Consumer name is must be between 2 and 52 characters");
      });
    }); // name

    describe("c/o (care of)", function() {
      it("can be optional", function() {
        delete consumer.co;
        optionalFields = ["co"];
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed when left empty", function() {
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete consumer.co;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer c/o");
        expect(validationError.translationKey).to.equal("invalid.consumer.co");
        expect(validationError.value).to.equal("Consumer co is mandatory");
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
        expect(validationError.value).to.equal("Consumer c/o must be between 2 and 52 characters");
      });
      it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          consumer.co = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            consumer: consumer,
            optionalFields: optionalFields
          };
          var validationError = new ConsumerValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer c/o");
          expect(validationError.translationKey).to.equal("invalid.consumer.co");
          expect(validationError.value).to.equal("Consumer c/o is not URL encoded");
        }
      });
    }); // co

    describe("Street address", function() {
      it("can be optional", function() {
        delete consumer.streetAddress;
        optionalFields = ["streetAddress"];
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail if not optional but is empty", function() {
        consumer.streetAddress = "";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer street address");
        expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress");
        expect(validationError.elementName).to.equal("consumer[streetAddress]");
        expect(validationError.value).to.equal("Consumer street address is mandatory");
      });
      it("can be mandatory", function() {
        delete consumer.streetAddress;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer street address");
        expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress");
        expect(validationError.elementName).to.equal("consumer[streetAddress]");
        expect(validationError.value).to.equal("Consumer street address is mandatory");
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
        expect(validationError.value).to.equal("Consumer street address must be between 2 and 52 characters");
      });
      it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          consumer.streetAddress = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            consumer: consumer,
            optionalFields: optionalFields
          };
          var validationError = new ConsumerValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer street address");
          expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress");
          expect(validationError.value).to.equal("Consumer street address is not URL encoded");
        }
      });
    });

    describe("Street address 2", function() {
      it("can be optional", function() {
        delete consumer.streetAddress2;
        optionalFields = ["streetAddress2"];
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete consumer.streetAddress2;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer street address 2");
        expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress2");
        expect(validationError.elementName).to.equal("consumer[streetAddress2]");
        expect(validationError.value).to.equal("Consumer street address 2 is mandatory");
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
        expect(validationError.value).to.equal("Consumer street address 2 must be between 2 and 52 characters");
      });
      it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          consumer.streetAddress2 = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            consumer: consumer,
            optionalFields: optionalFields
          };
          var validationError = new ConsumerValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer street address 2");
          expect(validationError.translationKey).to.equal("invalid.consumer.streetAddress2");
          expect(validationError.value).to.equal("Consumer street address 2 is not URL encoded");
        }
      });
    });

    describe("Postal code", function() {
      it("can be optional", function() {
        delete consumer.postalCode;
        optionalFields = ["postalCode"];
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete consumer.postalCode;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer postal code");
        expect(validationError.translationKey).to.equal("invalid.consumer.postalCode");
        expect(validationError.elementName).to.equal("consumer[postalCode]");
        expect(validationError.value).to.equal("Consumer postal code is mandatory");
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
        expect(validationError.value).to.equal("Consumer postal code must be between 2 and 10 characters");
      });
      it("should fail if not optional but is empty", function() {
        consumer.postalCode = "";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer postal code");
        expect(validationError.translationKey).to.equal("invalid.consumer.postalCode");
        expect(validationError.elementName).to.equal("consumer[postalCode]");
        expect(validationError.value).to.equal("Consumer postal code is mandatory");
      });
      it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          consumer.postalCode = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            consumer: consumer,
            optionalFields: optionalFields
          };
          var validationError = new ConsumerValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer postal code");
          expect(validationError.translationKey).to.equal("invalid.consumer.postalCode");
          expect(validationError.value).to.equal("Consumer postal code is not URL encoded");
        }
      });
    });

    describe("City", function() {
      it("can be optional", function() {
        delete consumer.city;
        optionalFields = ["city"];
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete consumer.city;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer city");
        expect(validationError.translationKey).to.equal("invalid.consumer.city");
        expect(validationError.elementName).to.equal("consumer[city]");
        expect(validationError.value).to.equal("Consumer city is mandatory");
      });
      it("should fail if not optional but is empty", function() {
        consumer.city = "";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer city");
        expect(validationError.translationKey).to.equal("invalid.consumer.city");
        expect(validationError.elementName).to.equal("consumer[city]");
        expect(validationError.value).to.equal("Consumer city is mandatory");
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
        expect(validationError.value).to.equal("Consumer city must be between 2 and 53 characters");
      });
      it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          consumer.city = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            consumer: consumer,
            optionalFields: optionalFields
          };
          var validationError = new ConsumerValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer city");
          expect(validationError.translationKey).to.equal("invalid.consumer.city");
          expect(validationError.value).to.equal("Consumer city is not URL encoded");
        }
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
        optionalFields = ["countryCode"];
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail if not optional but is empty", function() {
        consumer.countryCode = "";
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

    describe("Phone number", function() {

      it("should succeed with a valid phone number", function() {
        consumer.phoneNumber = "34615344819";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(new ConsumerValidator(params).validate()).to.be.empty;
      });

      it("should fail with an invalid phone number (wrong format)", function() {
        consumer.phoneNumber = "634341232";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid phone number");
        expect(validationError.elementName).to.equal("consumer[phoneNumber]");
        expect(validationError.translationKey).to.equal("invalid.consumer.phoneNumber");
        expect(validationError.value).to.equal(consumer.phoneNumber);
      });

      it("should success with a valid phone number if '+' included ", function () {
        consumer.phoneNumber= "+34615344810";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(new ConsumerValidator(params).validate()).to.be.empty;
      });
    });
  });
}());

