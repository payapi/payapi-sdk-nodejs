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
      consumerId: "happyConsumer623",
      name: "consumer name",
      locale: "en-US",
      co: "Care of someone",
      streetAddress: "Mannerheimintie 12",
      streetAddress2: "A 123",
      postalCode: "00100",
      city: "Helsinki",
      stateOrProvince: "Uusimaa",
      countryCode: "FI",
      mobilePhoneNumber: "34615344819",
      email: "happyconsumer@example.com",
      ssn: "071259-999M"
    };
    optionalFields = [];
  });

  describe("Consumer", function() {

    it("should succed for valid consumer object without optionalFields", function() {
      var params = {
        consumer: consumer
      };
      return expect(
        new ConsumerValidator(params).validate()
      ).to.be.empty;
    });

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
      it("should fail if not optional but is null", function() {
        consumer.name = "null";
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
        consumer.locale = "zh-CN";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      /*it("cannot contain blacklisted characters", function() {
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
      });*/
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
      it("should fail with all spaces", function() {
        consumer.name = "     ";
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
     /* it("cannot contain blacklisted characters", function() {
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
      });*/
      it("should fail with all spaces", function() {
        consumer.co = "     ";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer c/o");
        expect(validationError.translationKey).to.equal("invalid.consumer.co");
        expect(validationError.elementName).to.equal("consumer[co]");
        expect(validationError.value).to.equal("Consumer co is mandatory");
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
      /*it("cannot contain blacklisted characters", function() {
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
      });*/
      it("should fail with all spaces", function() {
        consumer.streetAddress = "     ";
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
      /*it("cannot contain blacklisted characters", function() {
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
      });*/
      it("should fail with all spaces", function() {
        consumer.streetAddress2 = "     ";
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
      /*it("cannot contain blacklisted characters", function() {
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
      });*/
      it("should fail with all spaces", function() {
        consumer.postalCode = "      ";
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
      /*it("cannot contain blacklisted characters", function() {
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
      });*/
      it("should fail with all spaces", function() {
        consumer.city = "     ";
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
    });

    describe("State or province", function() {
      it("can be optional", function() {
        delete consumer.stateOrProvince;
        optionalFields = ["stateOrProvince"];
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete consumer.stateOrProvince;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer state or province");
        expect(validationError.translationKey).to.equal("invalid.consumer.stateOrProvince");
        expect(validationError.elementName).to.equal("consumer[stateOrProvince]");
        expect(validationError.value).to.equal("Consumer state or province is mandatory");
      });
      it("should succeed when left empty", function() {
        consumer.stateOrProvince = "";
        optionalFields = ["stateOrProvince"];
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
        expect(validationError.value).to.equal("Consumer state or province must be between 2 and 52 characters");
      });
      /*it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          consumer.stateOrProvince = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            consumer: consumer,
            optionalFields: optionalFields
          };
          var validationError = new ConsumerValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer state or province");
          expect(validationError.translationKey).to.equal("invalid.consumer.stateOrProvince");
          expect(validationError.value).to.equal("Consumer state or province is not URL encoded");
        }
      });*/
      it("should fail with all spaces", function() {
        consumer.stateOrProvince = "     ";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer state or province");
        expect(validationError.translationKey).to.equal("invalid.consumer.stateOrProvince");
        expect(validationError.elementName).to.equal("consumer[stateOrProvince]");
        expect(validationError.value).to.equal("Consumer state or province is mandatory");
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
      it("can be mandatory", function() {
        delete consumer.countryCode;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer country code");
        expect(validationError.translationKey).to.equal("invalid.consumer.countryCode");
        expect(validationError.elementName).to.equal("consumer[countryCode]");
        expect(validationError.value).to.equal("Consumer country code is mandatory");
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
        expect(validationError.value).to.equal("Consumer country code is mandatory");
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
        expect(validationError.value).to.equal("Consumer country code is not valid");
      });
      it("should fail with all spaces", function() {
        consumer.countryCode = "  ";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer country code");
        expect(validationError.translationKey).to.equal("invalid.consumer.countryCode");
        expect(validationError.elementName).to.equal("consumer[countryCode]");
        expect(validationError.value).to.equal("Consumer country code is mandatory");
      });
    });

    describe("Locale", function() {
      it("can be optional", function() {
        delete consumer.locale;
        optionalFields = ["locale"];
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete consumer.locale;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer locale");
        expect(validationError.translationKey).to.equal("invalid.consumer.locale");
        expect(validationError.elementName).to.equal("consumer[locale]");
        expect(validationError.value).to.equal("Consumer locale is mandatory");
      });
      it("should fall back to en-US when left empty", function() {
        delete consumer.locale;
        optionalFields = ["locale"];
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail when being under 5 characters long", function() {
        consumer.locale = "FI";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer locale");
        expect(validationError.elementName).to.equal("consumer[locale]");
        expect(validationError.translationKey).to.equal("invalid.consumer.locale");
        expect(validationError.value).to.equal("Consumer locale must be 5 characters");
      });
      it("should fail when being over 5 characters long", function() {
        consumer.locale = "12345678";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer locale");
        expect(validationError.elementName).to.equal("consumer[locale]");
        expect(validationError.translationKey).to.equal("invalid.consumer.locale");
        expect(validationError.value).to.equal("Consumer locale must be 5 characters");
      });
      /*it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          consumer.locale = "es" + BLACKLISTED_CHARACTERS[i] + "ES";
          var params = {
            consumer: consumer,
            optionalFields: optionalFields
          };
          var validationError = new ConsumerValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer locale");
          expect(validationError.translationKey).to.equal("invalid.consumer.locale");
          expect(validationError.value).to.equal("Consumer locale is not URL encoded");
        }
      });*/
      it("should fail with all spaces", function() {
        consumer.locale = "     ";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer locale");
        expect(validationError.translationKey).to.equal("invalid.consumer.locale");
        expect(validationError.elementName).to.equal("consumer[locale]");
        expect(validationError.value).to.equal("Consumer locale is mandatory");
      });
    });

    describe("Mobile phone number", function() {
      it("can be optional", function() {
        delete consumer.mobilePhoneNumber;
        optionalFields = ["mobilePhoneNumber"];
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete consumer.mobilePhoneNumber;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer mobile phone number");
        expect(validationError.translationKey).to.equal("invalid.consumer.mobilePhoneNumber");
        expect(validationError.elementName).to.equal("consumer[mobilePhoneNumber]");
        expect(validationError.value).to.equal("Consumer mobile phone number is mandatory");
      });
      it("should succeed with a valid mobile phone number", function() {
        consumer.mobilePhoneNumber = "34615344819";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(new ConsumerValidator(params).validate()).to.be.empty;
      });

      it("should fail with an invalid mobile phone number (wrong format)", function() {
        consumer.mobilePhoneNumber = "1234567890";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer mobile phone number");
        expect(validationError.elementName).to.equal("consumer[mobilePhoneNumber]");
        expect(validationError.translationKey).to.equal("invalid.consumer.mobilePhoneNumber");
        expect(validationError.value).to.equal("Consumer mobile phone number format is wrong");
      });

      it("should success with a valid phone number if '+' included ", function () {
        consumer.mobilePhoneNumber = "+34615344810";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(new ConsumerValidator(params).validate()).to.be.empty;
      });

      it("should success with a valid phone number if init zeros included", function () {
        consumer.mobilePhoneNumber = "034615344810";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(new ConsumerValidator(params).validate()).to.be.empty;
      });
      /* it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          consumer.mobilePhoneNumber = "63445 " + BLACKLISTED_CHARACTERS[i] + " 3393";
          var params = {
            consumer: consumer,
            optionalFields: optionalFields
          };
          var validationError = new ConsumerValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer mobile phone number");
          expect(validationError.translationKey).to.equal("invalid.consumer.mobilePhoneNumber");
          expect(validationError.value).to.equal("Consumer mobile phone number is not URL encoded");
        }
      }); */
      it("should fail with all spaces", function() {
        consumer.mobilePhoneNumber = "               ";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer mobile phone number");
        expect(validationError.translationKey).to.equal("invalid.consumer.mobilePhoneNumber");
        expect(validationError.elementName).to.equal("consumer[mobilePhoneNumber]");
        expect(validationError.value).to.equal("Consumer mobile phone number is mandatory");
      });
    });

    describe("Email address", function() {
      it("can be optional", function() {
        delete consumer.email;
        optionalFields = ["email"];
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(new ConsumerValidator(params).validate())
          .to.be.empty;
      });
      it("can be mandatory", function() {
        delete consumer.email;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer email");
        expect(validationError.translationKey).to.equal("invalid.consumer.email");
        expect(validationError.elementName).to.equal("consumer[email]");
        expect(validationError.value).to.equal("Consumer email is mandatory");
      });
      it("should succeed with email nosuchemailaddress@payapi.io", function() {
        consumer.email = "nosuchemailaddress@payapi.io";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect( new ConsumerValidator(params).validate())
          .to.be.empty;
      });
      it("should fail with email diiba", function() {
        consumer.email = "diiba";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer email");
        expect(validationError.translationKey).to.equal("invalid.consumer.email");
        expect(validationError.elementName).to.equal("consumer[email]");
        expect(validationError.value).to.equal("Consumer email is not valid");
      });

     /* it("should fail with blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          consumer.email = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            consumer: consumer,
            optionalFields: optionalFields
          };
          var validationError = new ConsumerValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer email");
          expect(validationError.translationKey).to.equal("invalid.consumer.email");
          expect(validationError.elementName).to.equal("consumer[email]");
          expect(validationError.value).to.equal("Consumer email is not URL encoded");
        }
      });*/
      it("should fail with all spaces", function() {
        consumer.email = "               ";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer email");
        expect(validationError.translationKey).to.equal("invalid.consumer.email");
        expect(validationError.elementName).to.equal("consumer[email]");
        expect(validationError.value).to.equal("Consumer email is mandatory");
      });
    });

    describe("consumer id", function() {
      it("can be optional", function() {
        delete consumer.consumerId;
        optionalFields = ["consumerId"];
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(new ConsumerValidator(params).validate())
          .to.be.empty;
      });
      it("can be mandatory", function() {
        delete consumer.consumerId;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer consumerId");
        expect(validationError.translationKey).to.equal("invalid.consumer.consumerId");
        expect(validationError.elementName).to.equal("consumer[consumerId]");
        expect(validationError.value).to.equal("Consumer consumerId is mandatory");
      });
      it("should succeed with consumerId happyConsumer63", function() {
        consumer.consumerId = "happyConsumer63";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect( new ConsumerValidator(params).validate())
          .to.be.empty;
      });
      it("should not fail with consumerId 1 char", function() {
        consumer.consumerId = "3";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect( new ConsumerValidator(params).validate())
          .to.be.empty;
      });
      it("should fail with consumerId 101 char", function() {
        consumer.consumerId = new Array(102).join("x");
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer consumerId");
        expect(validationError.translationKey).to.equal("invalid.consumer.consumerId");
        expect(validationError.elementName).to.equal("consumer[consumerId]");
        expect(validationError.value).to.equal("Consumer consumerId must be between 1 and 100 characters");
      });
      /*it("should fail with blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          consumer.consumerId = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            consumer: consumer,
            optionalFields: optionalFields
          };
          var validationError = new ConsumerValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid consumer consumerId");
          expect(validationError.translationKey).to.equal("invalid.consumer.consumerId");
          expect(validationError.elementName).to.equal("consumer[consumerId]");
          expect(validationError.value).to.equal("Consumer consumerId is not URL encoded");
        }
      });*/
    });

    describe("Social security number", function() {
      it("can be optional", function() {
        delete consumer.ssn;
        optionalFields = ["ssn"];
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect(
          new ConsumerValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete consumer.ssn;
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer social security number");
        expect(validationError.translationKey).to.equal("invalid.consumer.ssn");
        expect(validationError.elementName).to.equal("consumer[ssn]");
        expect(validationError.value).to.equal("Consumer social security number is mandatory");
      });
      it("should fail with social security number longer than 11 characters", function() {
        consumer.ssn = "123456789012";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer social security number");
        expect(validationError.elementName).to.equal("consumer[ssn]");
        expect(validationError.translationKey).to.equal("invalid.consumer.ssn");
        expect(validationError.value).to.equal("Consumer social security number is not valid");
      });
      it("should fail if not optional but is empty", function() {
        consumer.ssn = "";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer social security number");
        expect(validationError.translationKey).to.equal("invalid.consumer.ssn");
        expect(validationError.elementName).to.equal("consumer[ssn]");
        expect(validationError.value).to.equal("Consumer social security number is mandatory");
      });
      it("should fail with all spaces", function() {
        consumer.ssn = "          ";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer social security number");
        expect(validationError.translationKey).to.equal("invalid.consumer.ssn");
        expect(validationError.elementName).to.equal("consumer[ssn]");
        expect(validationError.value).to.equal("Consumer social security number is mandatory");
      });
      it("should succeed with social security number 071259-999M", function() {
        consumer.ssn = "071259-999M";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        return expect( new ConsumerValidator(params).validate())
          .to.be.empty;
      });
      it("should fail with social security number 071259999M and countryCode FI", function() {
        consumer.ssn = "071259999M";
        consumer.countryCode = "FI";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer social security number");
        expect(validationError.translationKey).to.equal("invalid.consumer.ssn");
        expect(validationError.elementName).to.equal("consumer[ssn]");
        expect(validationError.value).to.equal("Consumer social security number is not valid");
      });
      it("should fail with social security number 071399-999M and countryCode FI", function() {
        consumer.ssn = "071399-999M";
        consumer.countryCode = "FI";
        var params = {
          consumer: consumer,
          optionalFields: optionalFields
        };
        var validationError = new ConsumerValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid consumer social security number");
        expect(validationError.translationKey).to.equal("invalid.consumer.ssn");
        expect(validationError.elementName).to.equal("consumer[ssn]");
        expect(validationError.value).to.equal("Consumer social security number is not valid");
      });
    });

  });
}());

