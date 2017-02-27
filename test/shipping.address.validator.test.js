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
  var ShippingAddressValidator = require("../lib/shipping.address.validator");
  var shippingAddress;
  var optionalFields;

  beforeEach(function() {
    shippingAddress = {
      recipientName: "John Doe",
      co: "Jane Doe",
      streetAddress: "Calle Estados Unidos",
      streetAddress2: "Apartment 1122",
      postalCode: "90210",
      city: "Fuengirola",
      stateOrProvince: "Malaga",
      countryCode: "ES"
    };
    optionalFields = [];
  });

  describe("ShippingAddress", function() {
    describe("Recipient name", function() {
      it("can be optional", function() {
        delete shippingAddress.recipienteName;
        optionalFields = ["recipientName"];
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        return expect(
          new ShippingAddressValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete shippingAddress.recipientName;
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress recipientName");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.recipientName");
        expect(validationError.value).to.equal("ShippingAddress recipientName is mandatory");
      });
      it("should fail if not optional but is empty", function() {
        shippingAddress.recipientName = "";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress recipientName");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.recipientName");
        expect(validationError.elementName).to.equal("shippingAddress[recipientName]");
        expect(validationError.value).to.equal("ShippingAddress recipientName is mandatory");
      });
      it("should succeed with a western recipient name", function() {
        shippingAddress.recipientName = "Matti Meikäläinen";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        return expect(
          new ShippingAddressValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with a chinese recipient name", function() {
        shippingAddress.name = "王 秀英";
        shippingAddress.locale = "zh-CN";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        return expect(
          new ShippingAddressValidator(params).validate()
        ).to.be.empty;
      });
      it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          shippingAddress.recipientName = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            shippingAddress: shippingAddress,
            optionalFields: optionalFields
          };
          var validationError = new ShippingAddressValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid shippingAddress recipientName");
          expect(validationError.translationKey).to.equal("invalid.shippingAddress.recipientName");
          expect(validationError.value).to.equal("ShippingAddress recipientName is not URL encoded");
        }
      });
      it("should fail with recipient name shorter than 2 characters", function() {
        shippingAddress.recipientName = "x";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress recipientName");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.recipientName");
        expect(validationError.elementName).to.equal("shippingAddress[recipientName]");
        expect(validationError.value).to.equal("ShippingAddress recipientName is must be between 2 and 52 characters");
      });
      it("should fail with recipientName longer than 53 characters", function() {
        shippingAddress.recipientName = "Bithurasdinhournimlousgon Kleslinfarjilpourginjdesher2";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress recipientName");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.recipientName");
        expect(validationError.elementName).to.equal("shippingAddress[recipientName]");
        expect(validationError.value).to.equal("ShippingAddress recipientName is must be between 2 and 52 characters");
      });
      it("should fail with all spaces", function() {
        shippingAddress.recipientName = "     ";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress recipientName");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.recipientName");
        expect(validationError.elementName).to.equal("shippingAddress[recipientName]");
        expect(validationError.value).to.equal("ShippingAddress recipientName is mandatory");
      });
    }); // recipientName

    describe("c/o (care of)", function() {
      it("can be optional", function() {
        delete shippingAddress.co;
        optionalFields = ["co"];
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        return expect(
          new ShippingAddressValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed when left empty", function() {
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        return expect(
          new ShippingAddressValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete shippingAddress.co;
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress c/o");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.co");
        expect(validationError.value).to.equal("ShippingAddress co is mandatory");
      });
      it("should fail with co longer than 53 characters", function() {
        shippingAddress.co = "Bithurasdinhournimlousgon Kleslinfarjilpourginjdesher2";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress c/o");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.co");
        expect(validationError.elementName).to.equal("shippingAddress[co]");
        expect(validationError.value).to.equal("ShippingAddress c/o must be between 2 and 52 characters");
      });
      it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          shippingAddress.co = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            shippingAddress: shippingAddress,
            optionalFields: optionalFields
          };
          var validationError = new ShippingAddressValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid shippingAddress c/o");
          expect(validationError.translationKey).to.equal("invalid.shippingAddress.co");
          expect(validationError.value).to.equal("ShippingAddress c/o is not URL encoded");
        }
      });
      it("should fail with all spaces", function() {
        shippingAddress.co = "     ";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress c/o");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.co");
        expect(validationError.elementName).to.equal("shippingAddress[co]");
        expect(validationError.value).to.equal("ShippingAddress co is mandatory");
      });
    }); // co

    describe("Street address", function() {
      it("can be optional", function() {
        delete shippingAddress.streetAddress;
        optionalFields = ["streetAddress"];
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        return expect(
          new ShippingAddressValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail if not optional but is empty", function() {
        shippingAddress.streetAddress = "";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress street address");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.streetAddress");
        expect(validationError.elementName).to.equal("shippingAddress[streetAddress]");
        expect(validationError.value).to.equal("ShippingAddress street address is mandatory");
      });
      it("can be mandatory", function() {
        delete shippingAddress.streetAddress;
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress street address");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.streetAddress");
        expect(validationError.elementName).to.equal("shippingAddress[streetAddress]");
        expect(validationError.value).to.equal("ShippingAddress street address is mandatory");
      });
      it("should fail with streetAddress longer than 53 characters", function() {
        shippingAddress.streetAddress = "123456789012345678901234567890123456789012345678901234";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress street address");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.streetAddress");
        expect(validationError.elementName).to.equal("shippingAddress[streetAddress]");
        expect(validationError.value).to.equal("ShippingAddress street address must be between 2 and 52 characters");
      });
      it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          shippingAddress.streetAddress = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            shippingAddress: shippingAddress,
            optionalFields: optionalFields
          };
          var validationError = new ShippingAddressValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid shippingAddress street address");
          expect(validationError.translationKey).to.equal("invalid.shippingAddress.streetAddress");
          expect(validationError.value).to.equal("ShippingAddress street address is not URL encoded");
        }
      });
      it("should fail with all spaces", function() {
        shippingAddress.streetAddress = "     ";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress street address");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.streetAddress");
        expect(validationError.elementName).to.equal("shippingAddress[streetAddress]");
        expect(validationError.value).to.equal("ShippingAddress street address is mandatory");
      });
    });

    describe("Street address 2", function() {
      it("can be optional", function() {
        delete shippingAddress.streetAddress2;
        optionalFields = ["streetAddress2"];
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        return expect(
          new ShippingAddressValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete shippingAddress.streetAddress2;
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress street address 2");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.streetAddress2");
        expect(validationError.elementName).to.equal("shippingAddress[streetAddress2]");
        expect(validationError.value).to.equal("ShippingAddress street address 2 is mandatory");
      });
      it("should fail with streetAddress longer than 53 characters", function() {
        shippingAddress.streetAddress2 = "123456789012345678901234567890123456789012345678901234";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress street address 2");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.streetAddress2");
        expect(validationError.elementName).to.equal("shippingAddress[streetAddress2]");
        expect(validationError.value).to.equal("ShippingAddress street address 2 must be between 2 and 52 characters");
      });
      it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          shippingAddress.streetAddress2 = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            shippingAddress: shippingAddress,
            optionalFields: optionalFields
          };
          var validationError = new ShippingAddressValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid shippingAddress street address 2");
          expect(validationError.translationKey).to.equal("invalid.shippingAddress.streetAddress2");
          expect(validationError.value).to.equal("ShippingAddress street address 2 is not URL encoded");
        }
      });
      it("should fail with all spaces", function() {
        shippingAddress.streetAddress2 = "     ";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress street address 2");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.streetAddress2");
        expect(validationError.elementName).to.equal("shippingAddress[streetAddress2]");
        expect(validationError.value).to.equal("ShippingAddress street address 2 is mandatory");
      });
    });

    describe("Postal code", function() {
      it("can be optional", function() {
        delete shippingAddress.postalCode;
        optionalFields = ["postalCode"];
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        return expect(
          new ShippingAddressValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete shippingAddress.postalCode;
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress postal code");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.postalCode");
        expect(validationError.elementName).to.equal("shippingAddress[postalCode]");
        expect(validationError.value).to.equal("ShippingAddress postal code is mandatory");
      });
      it("should fail with postalCode longer than 10 characters", function() {
        shippingAddress.postalCode = "12345678901";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress postal code");
        expect(validationError.elementName).to.equal("shippingAddress[postalCode]");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.postalCode");
        expect(validationError.value).to.equal("ShippingAddress postal code must be between 2 and 10 characters");
      });
      it("should fail if not optional but is empty", function() {
        shippingAddress.postalCode = "";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress postal code");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.postalCode");
        expect(validationError.elementName).to.equal("shippingAddress[postalCode]");
        expect(validationError.value).to.equal("ShippingAddress postal code is mandatory");
      });
      it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          shippingAddress.postalCode = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            shippingAddress: shippingAddress,
            optionalFields: optionalFields
          };
          var validationError = new ShippingAddressValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid shippingAddress postal code");
          expect(validationError.translationKey).to.equal("invalid.shippingAddress.postalCode");
          expect(validationError.value).to.equal("ShippingAddress postal code is not URL encoded");
        }
      });
      it("should fail with all spaces", function() {
        shippingAddress.postalCode = "      ";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress postal code");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.postalCode");
        expect(validationError.elementName).to.equal("shippingAddress[postalCode]");
        expect(validationError.value).to.equal("ShippingAddress postal code is mandatory");
      });
    });

    describe("City", function() {
      it("can be optional", function() {
        delete shippingAddress.city;
        optionalFields = ["city"];
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        return expect(
          new ShippingAddressValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete shippingAddress.city;
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress city");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.city");
        expect(validationError.elementName).to.equal("shippingAddress[city]");
        expect(validationError.value).to.equal("ShippingAddress city is mandatory");
      });
      it("should fail if not optional but is empty", function() {
        shippingAddress.city = "";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress city");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.city");
        expect(validationError.elementName).to.equal("shippingAddress[city]");
        expect(validationError.value).to.equal("ShippingAddress city is mandatory");
      });
      it("should fail with city longer than 53 characters", function() {
        shippingAddress.city = "123456789012345678901234567890123456789012345678901234";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress city");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.city");
        expect(validationError.elementName).to.equal("shippingAddress[city]");
        expect(validationError.value).to.equal("ShippingAddress city must be between 2 and 53 characters");
      });
      it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          shippingAddress.city = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            shippingAddress: shippingAddress,
            optionalFields: optionalFields
          };
          var validationError = new ShippingAddressValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid shippingAddress city");
          expect(validationError.translationKey).to.equal("invalid.shippingAddress.city");
          expect(validationError.value).to.equal("ShippingAddress city is not URL encoded");
        }
      });
      it("should fail with all spaces", function() {
        shippingAddress.city = "     ";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress city");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.city");
        expect(validationError.elementName).to.equal("shippingAddress[city]");
        expect(validationError.value).to.equal("ShippingAddress city is mandatory");
      });
    });

    describe("State or province", function() {
      it("can be optional", function() {
        delete shippingAddress.stateOrProvince;
        optionalFields = ["stateOrProvince"];
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        return expect(
          new ShippingAddressValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete shippingAddress.stateOrProvince;
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress state or province");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.stateOrProvince");
        expect(validationError.elementName).to.equal("shippingAddress[stateOrProvince]");
        expect(validationError.value).to.equal("ShippingAddress state or province is mandatory");
      });
      it("should succeed when left empty", function() {
        shippingAddress.stateOrProvince = "";
        optionalFields = ["stateOrProvince"];
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        return expect(
          new ShippingAddressValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail with stateOrProvince longer than 53 characters", function() {
        shippingAddress.stateOrProvince = "123456789012345678901234567890123456789012345678901234";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress state or province");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.stateOrProvince");
        expect(validationError.elementName).to.equal("shippingAddress[stateOrProvince]");
        expect(validationError.value).to.equal("ShippingAddress state or province must be between 2 and 52 characters");
      });
      it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          shippingAddress.stateOrProvince = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            shippingAddress: shippingAddress,
            optionalFields: optionalFields
          };
          var validationError = new ShippingAddressValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid shippingAddress state or province");
          expect(validationError.translationKey).to.equal("invalid.shippingAddress.stateOrProvince");
          expect(validationError.value).to.equal("ShippingAddress state or province is not URL encoded");
        }
      });
      it("should fail with all spaces", function() {
        shippingAddress.stateOrProvince = "     ";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress state or province");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.stateOrProvince");
        expect(validationError.elementName).to.equal("shippingAddress[stateOrProvince]");
        expect(validationError.value).to.equal("ShippingAddress state or province is mandatory");
      });
    });

    describe("Country code", function() {
      it("can be optional", function() {
        delete shippingAddress.countryCode;
        optionalFields = ["countryCode"];
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        return expect(
          new ShippingAddressValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete shippingAddress.countryCode;
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress country code");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.countryCode");
        expect(validationError.elementName).to.equal("shippingAddress[countryCode]");
        expect(validationError.value).to.equal("ShippingAddress country code is mandatory");
      });
      it("should fail if not optional but is empty", function() {
        shippingAddress.countryCode = "";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress country code");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.countryCode");
        expect(validationError.elementName).to.equal("shippingAddress[countryCode]");
        expect(validationError.value).to.equal("ShippingAddress country code is mandatory");
      });
      it("should fail if it doesn't exist in list of country codes", function() {
        shippingAddress.countryCode = "foo";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress country code");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.countryCode");
        expect(validationError.elementName).to.equal("shippingAddress[countryCode]");
        expect(validationError.value).to.equal("ShippingAddress country code is not valid");
      });
      it("should fail with all spaces", function() {
        shippingAddress.countryCode = "  ";
        var params = {
          shippingAddress: shippingAddress,
          optionalFields: optionalFields
        };
        var validationError = new ShippingAddressValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid shippingAddress country code");
        expect(validationError.translationKey).to.equal("invalid.shippingAddress.countryCode");
        expect(validationError.elementName).to.equal("shippingAddress[countryCode]");
        expect(validationError.value).to.equal("ShippingAddress country code is mandatory");
      });
    });
  });
}());