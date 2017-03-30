(function () {
  "use strict";

  const should = require("should");
  const chai = require("chai");
  const chaiAsPromised = require("chai-as-promised");
  const expect = chai.expect;
  const jwt = require("jwt-simple");
  const moment = require("moment");
  const BLACKLISTED_CHARACTERS = ["`", "´", "\"", "{", "}", "<", ">"];
  chai.use(chaiAsPromised);
  var PaymentValidator = require("../lib/payment.validator");
  var payment;
  var optionalFields;

  beforeEach(function() {
    payment = {
      cardHolderEmail: "diiba@example.com",
      ip: "1.2.3.4",
      cardHolderName: "diiba",
      paymentMethod: "visa",
      creditCardNumber: "4242 4242 4242 4242",
      ccv: "123",
      expiresMonth: moment().month() + 1 + "",
      expiresYear: moment().year() + "",
      locale: "en-US"
    };
    optionalFields = [];
  });

  describe("Payment", function() {
    describe("Email address", function() {
      it("should succeed with email nosuchemailaddress@payapi.io", function() {
        payment.cardHolderEmail = "nosuchemailaddress@payapi.io";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });

      it("can be optional", function() {
        delete payment.cardHolderEmail;
        optionalFields = ["cardHolderEmail"];
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });

      it("should fail with email diiba", function() {
        payment.cardHolderEmail = "diiba";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment cardHolderEmail");
        expect(validationError.translationKey).to.equal("invalid.payment.cardHolderEmail");
        expect(validationError.elementName).to.equal("payment[cardHolderEmail]");
        expect(validationError.value).to.equal(payment.cardHolderEmail);
      });

      it("should fail with blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          payment.cardHolderEmail = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            payment: payment,
            optionalFields: optionalFields
          };
          var validationError = new PaymentValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment cardHolderEmail");
          expect(validationError.translationKey).to.equal("invalid.payment.cardHolderEmail");
          expect(validationError.elementName).to.equal("payment[cardHolderEmail]");
          expect(validationError.value).to.equal("Payment cardHolderEmail is not URL encoded");
        }
      });
    });

    describe("IP address", function() {
      it("should succeed with ip 8.8.8.8", function() {
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });

      it("can be optional", function() {
        delete payment.ip;
        optionalFields = ["ip"];
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });

      it("can be mandatory", function() {
        delete payment.ip;
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment ip");
        expect(validationError.translationKey).to.equal("invalid.payment.ip");
        expect(validationError.elementName).to.equal("payment[ip]");
        expect(validationError.value).to.equal("Payment ip is mandatory");
      });

      it("should fail with ip ::1:127.0.0.1.ö", function() {
        payment.ip = "::1:127.0.0.1.ö";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment ip");
        expect(validationError.translationKey).to.equal("invalid.payment.ip");
        expect(validationError.elementName).to.equal("payment[ip]");
        expect(validationError.value).to.equal(payment.ip);
      });

      it("should fail with ip :", function() {
        payment.ip = ":";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment ip");
        expect(validationError.translationKey).to.equal("invalid.payment.ip");
        expect(validationError.elementName).to.equal("payment[ip]");
        expect(validationError.value).to.equal(payment.ip);
      });

      it("should fail with ip that contains blacklisted characters", function() {
        payment.ip = "::1{:127.0.0.1";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment ip");
        expect(validationError.translationKey).to.equal("invalid.payment.ip");
        expect(validationError.elementName).to.equal("payment[ip]");
        expect(validationError.value).to.equal("Payment ip is not URL encoded");
      });

      it("should fail with all spaces", function() {
        payment.ip = "                ";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment ip");
        expect(validationError.translationKey).to.equal("invalid.payment.ip");
        expect(validationError.elementName).to.equal("payment[ip]");
        expect(validationError.value).to.equal("Payment ip is mandatory");
      });

      it("should succeed with ip ::1:127.0.0.1", function() {
        payment.ip = "::1:127.0.0.1";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });
    });

    describe("cardHolderName", function() {
      it("should succeed with a western cardHolderName", function() {
        payment.cardHolderName = "Matti Meikäläinen";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });

      it("should succeed with a chinese cardHolderName", function() {
        payment.cardHolderName = "王 秀英";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });

      it("can be optional", function() {
        optionalFields = ["cardHolderName"];
        delete payment.cardHolderName;
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });

      it("should fail with empty cardHolderName", function() {
        delete payment.cardHolderName;
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment cardHolderName");
        expect(validationError.translationKey).to.equal("invalid.payment.cardHolderName");
        expect(validationError.elementName).to.equal("payment[cardHolderName]");
        expect(validationError.value).to.equal("Payment cardHolderName is mandatory");
      });

      it("should fail with all spaces", function() {
        payment.cardHolderName = "                ";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment cardHolderName");
        expect(validationError.translationKey).to.equal("invalid.payment.cardHolderName");
        expect(validationError.elementName).to.equal("payment[cardHolderName]");
        expect(validationError.value).to.equal("Payment cardHolderName is mandatory");
      });

      it("should fail with blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          payment.cardHolderName = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            payment: payment,
            optionalFields: optionalFields
          };
          var validationError = new PaymentValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment cardHolderName");
          expect(validationError.translationKey).to.equal("invalid.payment.cardHolderName");
          expect(validationError.elementName).to.equal("payment[cardHolderName]");
          expect(validationError.value).to.equal("Payment cardHolderName is not URL encoded");
        }
      });

      it("should fail with cardHolderName shorter than 2 characters", function() {
        payment.cardHolderName = "x";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment cardHolderName");
        expect(validationError.elementName).to.equal("payment[cardHolderName]");
        expect(validationError.translationKey).to.equal("invalid.payment.cardHolderName");
        expect(validationError.value).to.equal(payment.cardHolderName);
      });

      it("should fail with cardHolderName longer than 53 characters", function() {
        payment.cardHolderName = "Bithurasdinhournimlousgon Kleslinfarjilpourginjdesher2";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment cardHolderName");
        expect(validationError.elementName).to.equal("payment[cardHolderName]");
        expect(validationError.translationKey).to.equal("invalid.payment.cardHolderName");
        expect(validationError.value).to.equal(payment.cardHolderName);
      });
    });

    describe("paymentMethod", function() {
      it("should be valid with alpha characters", function() {
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });

      it("should be valid with underscore character", function() {
        payment.paymentMethod = "visa_prepaid";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });

      it("can be optional", function() {
        delete payment.paymentMethod;
        optionalFields = ["paymentMethod"];
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });

      it("can be mandatory", function() {
        delete payment.paymentMethod;
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment paymentMethod");
        expect(validationError.elementName).to.equal("payment[paymentMethod]");
        expect(validationError.translationKey).to.equal("invalid.payment.paymentMethod");
        expect(validationError.value).to.equal("Payment paymentMethod is mandatory");
      });

      it("should fail with numeric characters", function() {
        payment.paymentMethod = "visa2";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment paymentMethod");
        expect(validationError.elementName).to.equal("payment[paymentMethod]");
        expect(validationError.translationKey).to.equal("invalid.payment.paymentMethod");
        expect(validationError.value).to.equal(payment.paymentMethod);
      });

      it("should fail with all spaces", function() {
        payment.paymentMethod = "                ";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment paymentMethod");
        expect(validationError.translationKey).to.equal("invalid.payment.paymentMethod");
        expect(validationError.elementName).to.equal("payment[paymentMethod]");
        expect(validationError.value).to.equal("Payment paymentMethod is mandatory");
      });

      it("should fail with blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          payment.paymentMethod = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            payment: payment,
            optionalFields: optionalFields
          };
          var validationError = new PaymentValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment paymentMethod");
          expect(validationError.translationKey).to.equal("invalid.payment.paymentMethod");
          expect(validationError.elementName).to.equal("payment[paymentMethod]");
          expect(validationError.value).to.equal("Payment paymentMethod is not URL encoded");
        }
      });
    });

    describe("creditCardNumber", function() {
      it("should be valid with a valid cc number of 16 integers", function() {
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });
      it("can be optional", function() {
        optionalFields = ["creditCardNumber"];
        delete payment.creditCardNumber;
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });

      it("can be mandatory", function() {
        delete payment.creditCardNumber;
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment creditCardNumber");
        expect(validationError.elementName).to.equal("payment[creditCardNumber]");
        expect(validationError.translationKey).to.equal("invalid.payment.creditCardNumber");
        expect(validationError.value).to.equal("Payment creditCardNumber is mandatory");
      });

      it("should fail with an invalid cc number of 15 integers", function() {
        payment.creditCardNumber = "123456789012345";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment creditCardNumber");
        expect(validationError.elementName).to.equal("payment[creditCardNumber]");
        expect(validationError.translationKey).to.equal("invalid.payment.creditCardNumber");
        expect(validationError.value).to.equal(payment.creditCardNumber);
      });

      it("should fail with blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          payment.creditCardNumber = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            payment: payment,
            optionalFields: optionalFields
          };
          var validationError = new PaymentValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment creditCardNumber");
          expect(validationError.translationKey).to.equal("invalid.payment.creditCardNumber");
          expect(validationError.elementName).to.equal("payment[creditCardNumber]");
          expect(validationError.value).to.equal("Payment creditCardNumber is not URL encoded");
        }
      });
    });

    describe("locale", function() {
      it("should be valid with a valid locale number of 3 integers", function() {
        // note: american express: 4 digits, everyone else: 3 digits
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });
      it("can be optional", function() {
        optionalFields = ["locale"];
        delete payment.locale;
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete payment.locale;
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment locale");
        expect(validationError.elementName).to.equal("payment[locale]");
        expect(validationError.translationKey).to.equal("invalid.payment.locale");
        expect(validationError.value).to.equal("Payment locale is mandatory");
      });

      it("should fail with all spaces", function() {
        payment.locale = "                ";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment locale");
        expect(validationError.translationKey).to.equal("invalid.payment.locale");
        expect(validationError.elementName).to.equal("payment[locale]");
        expect(validationError.value).to.equal("Payment locale is mandatory");
      });

      it("should fail with blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          payment.locale = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            payment: payment,
            optionalFields: optionalFields
          };
          var validationError = new PaymentValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment locale");
          expect(validationError.translationKey).to.equal("invalid.payment.locale");
          expect(validationError.elementName).to.equal("payment[locale]");
          expect(validationError.value).to.equal("Payment locale is not URL encoded");
        }
      });
      it("should fail with an invalid locale number of 2 integers", function() {
        payment.locale = "12";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment locale");
        expect(validationError.elementName).to.equal("payment[locale]");
        expect(validationError.translationKey).to.equal("invalid.payment.locale");
        expect(validationError.value).to.equal("Payment locale must be 5 characters");
      });
      it("should fail with an invalid locale number of 5 integers", function() {
        payment.locale = "12345";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment locale");
        expect(validationError.elementName).to.equal("payment[locale]");
        expect(validationError.translationKey).to.equal("invalid.payment.locale");
        expect(validationError.value).to.equal("Payment locale must be 5 characters");
      });
      it("should fail with an invalid locale other than integers", function() {
        payment.locale = "12a";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment locale");
        expect(validationError.elementName).to.equal("payment[locale]");
        expect(validationError.translationKey).to.equal("invalid.payment.locale");
        expect(validationError.value).to.equal("Payment locale must be 5 characters");
      });
    }); // locale

    describe("ccv", function() {
      it("should be valid with a valid ccv number of 3 integers", function() {
        // note: american express: 4 digits, everyone else: 3 digits
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });
      it("should be valid with a valid ccv number of 3 integers, preceding with zeros", function() {
        payment.ccv = "012";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });
      it("should be valid with a valid ccv number of 3 integers, all zeros", function() {
        payment.ccv = "000";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });
      it("can be optional", function() {
        optionalFields = ["ccv"];
        delete payment.ccv;
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete payment.ccv;
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment ccv");
        expect(validationError.elementName).to.equal("payment[ccv]");
        expect(validationError.translationKey).to.equal("invalid.payment.ccv");
        expect(validationError.value).to.equal("Payment ccv is mandatory");
      });

      it("should fail with all spaces", function() {
        payment.ccv = "                ";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment ccv");
        expect(validationError.translationKey).to.equal("invalid.payment.ccv");
        expect(validationError.elementName).to.equal("payment[ccv]");
        expect(validationError.value).to.equal("Payment ccv is mandatory");
      });

      it("should fail with blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          payment.ccv = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            payment: payment,
            optionalFields: optionalFields
          };
          var validationError = new PaymentValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment ccv");
          expect(validationError.translationKey).to.equal("invalid.payment.ccv");
          expect(validationError.elementName).to.equal("payment[ccv]");
          expect(validationError.value).to.equal("Payment ccv is not URL encoded");
        }
      });
      it("should fail with an invalid ccv number of 2 integers", function() {
        payment.ccv = "12";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment ccv");
        expect(validationError.elementName).to.equal("payment[ccv]");
        expect(validationError.translationKey).to.equal("invalid.payment.ccv");
        expect(validationError.value).to.equal(payment.ccv);
      });
      it("should fail with an invalid ccv number of 5 integers", function() {
        payment.ccv = "12345";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment ccv");
        expect(validationError.elementName).to.equal("payment[ccv]");
        expect(validationError.translationKey).to.equal("invalid.payment.ccv");
        expect(validationError.value).to.equal(payment.ccv);
      });
      it("should fail with an invalid ccv other than integers", function() {
        payment.ccv = "12a";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment ccv");
        expect(validationError.elementName).to.equal("payment[ccv]");
        expect(validationError.translationKey).to.equal("invalid.payment.ccv");
        expect(validationError.value).to.equal(payment.ccv);
      });
    });

    describe("expiresMonth", function() {
      it("should be valid with a valid month", function() {
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });
      it("can be optional", function() {
        optionalFields = ["expiresMonth"];
        delete payment.expiresMonth;
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete payment.expiresMonth;
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment expiresMonth");
        expect(validationError.elementName).to.equal("payment[expiresMonth]");
        expect(validationError.translationKey).to.equal("invalid.payment.expiresMonth");
        expect(validationError.value).to.equal("Payment expiresMonth is mandatory");
      });
      it("should be invalid with a zero month", function() {
        payment.expiresMonth = "0";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment expiresMonth");
        expect(validationError.elementName).to.equal("payment[expiresMonth]");
        expect(validationError.translationKey).to.equal("invalid.payment.expiresMonth");
        expect(validationError.value).to.equal(payment.expiresMonth);
      });
      it("should be invalid with a month larger than 12", function() {
        payment.expiresMonth = "13";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment expiresMonth");
        expect(validationError.elementName).to.equal("payment[expiresMonth]");
        expect(validationError.translationKey).to.equal("invalid.payment.expiresMonth");
        expect(validationError.value).to.equal(payment.expiresMonth);
      });
      it("should be invalid a non numeric", function() {
        payment.expiresMonth = "diiba";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment expiresMonth");
        expect(validationError.elementName).to.equal("payment[expiresMonth]");
        expect(validationError.translationKey).to.equal("invalid.payment.expiresMonth");
        expect(validationError.value).to.equal("NaN");
      });

      it("should fail with blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          payment.expiresMonth = "1" + BLACKLISTED_CHARACTERS[i];
          var params = {
            payment: payment,
            optionalFields: optionalFields
          };
          var validationError = new PaymentValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment expiresMonth");
          expect(validationError.translationKey).to.equal("invalid.payment.expiresMonth");
          expect(validationError.elementName).to.equal("payment[expiresMonth]");
          expect(validationError.value).to.equal("Payment expiresMonth is not URL encoded");
        }
      });
    });

    describe("expiresYear", function() {
      it("should be valid with a valid year", function() {
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });
      it("can be optional", function() {
        optionalFields = ["expiresYear"];
        delete payment.expiresYear;
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        return expect(
            new PaymentValidator(params).validate()
            ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete payment.expiresYear;
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment expiresYear");
        expect(validationError.elementName).to.equal("payment[expiresYear]");
        expect(validationError.translationKey).to.equal("invalid.payment.expiresYear");
        expect(validationError.value).to.equal("Payment expiresYear is mandatory");
      });
      it("should be invalid with a year smaller than current", function() {
        payment.expiresYear = moment().year() - 1;
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment expiresYear");
        expect(validationError.translationKey).to.equal("invalid.payment.expiresYear");
        expect(validationError.value).to.equal("" + payment.expiresYear);
      });
      it("should be invalid with a non numeric", function() {
        payment.expiresYear = "diiba";
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid payment expiresYear");
        expect(validationError.translationKey).to.equal("invalid.payment.expiresYear");
        expect(validationError.value).to.equal("NaN");
      });

      it("should fail with blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          payment.expiresYear = "1" + BLACKLISTED_CHARACTERS[i];
          var params = {
            payment: payment,
            optionalFields: optionalFields
          };
          var validationError = new PaymentValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid payment expiresYear");
          expect(validationError.translationKey).to.equal("invalid.payment.expiresYear");
          expect(validationError.elementName).to.equal("payment[expiresYear]");
          expect(validationError.value).to.equal("Payment expiresYear is not URL encoded");
        }
      });
    });

    describe("Expiration month and year", function() {
      it("should be current month or later", function() {
        var expiredDate = moment().subtract(1, "month");
        payment.expiresMonth = expiredDate.month() + 1;
        payment.expiresYear = expiredDate.year();
        var params = {
          payment: payment,
          optionalFields: optionalFields
        };
        var validationError = new PaymentValidator(params).validate()[0];
        if(payment.expiresYear === moment().year()) {
          expect(validationError.message).to.equal("Card has expired");
          expect(validationError.translationKey).to.equal("invalid.payment.cardHasExpired");
          expect(validationError.value).to.equal(payment.expiresMonth + "/" + payment.expiresYear);
        } else {
          expect(validationError.message).to.equal("Invalid payment expiresYear");
          expect(validationError.translationKey).to.equal("invalid.payment.expiresYear");
          expect(validationError.value).to.equal(payment.expiresYear);
        }
      });
    });
  });
}());
