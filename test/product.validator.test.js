(function () {
  "use strict";

  var should = require("should");
  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");
  var expect = chai.expect;
  var jwt = require("jwt-simple");
  //const BLACKLISTED_CHARACTERS = ["`", "´", "\"", "{", "}", "<", ">"];
  chai.use(chaiAsPromised);
  var ProductValidator = require("../lib/product.validator");
  var product;
  var optionalFields;

  beforeEach(function() {
    product = {
      priceIncVat: 1,
      priceExcVat: 1,
      vat: 1,
      priceInCentsIncVat: 1,
      priceInCentsExcVat: 1,
      vatInCents: 1,
      vatPercentage: 22.5,
      quantity: 1,
      description: "description",
      title: "title",
      category: "category",
      model: "model",
      imageUrl: "https://example.com/doge.jpg",
      extraData: "foo=bar&diiba=daaba&11=1",
      options: ["size=1","color=blue"]
    };
    optionalFields = [];
  });

  describe("Product", function() {
    describe("priceIncVat", function() {
      it("can be optional", function() {
        delete product.priceIncVat;
        optionalFields = ["priceIncVat"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("can be optional but must be valid anyway", function() {
        product.priceIncVat = "diiba";
        optionalFields = ["priceIncVat"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        var validationError = new ProductValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid product price including VAT");
        expect(validationError.translationKey).to.equal("invalid.product.priceIncVat");
        expect(validationError.value).to.equal("diiba");
      });
      it("should succeed with integer 1", function() {
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '1'", function() {
        product.priceIncVat = "1";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with integer 0", function() {
        product.priceIncVat = 0;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
       it("should fail if priceIncVat empty", function() {
        delete product.priceIncVat;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        var validationError = new ProductValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid product price including VAT");
        expect(validationError.translationKey).to.equal("invalid.product.priceIncVat");
      });
      it("should succeed with string '0'", function() {
        product.priceIncVat = "0";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with 150000", function() {
        product.priceIncVat = 150000;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with fractional 0.1", function() {
        product.priceIncVat = 0.1;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
    });
    describe("priceInCentsIncVat", function() {
      it("can be optional", function() {
        delete product.priceInCentsIncVat;
        optionalFields = ["priceInCentsIncVat"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("can be optional but must be valid anyway", function() {
        product.priceInCentsIncVat = "diiba";
        optionalFields = ["priceInCentsIncVat"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        var validationError = new ProductValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid product price in cents including VAT");
        expect(validationError.translationKey).to.equal("invalid.product.priceInCentsIncVat");
        expect(validationError.value).to.equal("diiba");
      });
      it("should succeed with integer 1", function() {
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '1'", function() {
        product.priceInCentsIncVat = "1";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with integer 0", function() {
        product.priceInCentsIncVat = 0;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '0'", function() {
        product.priceInCentsIncVat = "0";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with 150000", function() {
        product.priceInCentsIncVat = 150000;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail with fractional 0.1", function() {
        product.priceInCentsIncVat = 0.1;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        var validationError = new ProductValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid product price in cents including VAT");
        expect(validationError.translationKey).to.equal("invalid.product.priceInCentsIncVat");
        expect(validationError.value).to.equal("" + product.priceInCentsIncVat);
      });
    });
    describe("priceInCentsExcVat", function() {
      it("can be optional", function() {
        delete product.priceInCentsExcVat;
        optionalFields = ["priceInCentsExcVat"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("can be optional but must be valid anyway", function() {
        product.priceInCentsExcVat = "diiba";
        optionalFields = ["priceInCentsExcVat"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        var validationError = new ProductValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid product price in cents excluding VAT");
        expect(validationError.translationKey).to.equal("invalid.product.priceInCentsExcVat");
        expect(validationError.value).to.equal("diiba");
      });
      it("should succeed with integer 1", function() {
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '1'", function() {
        product.priceInCentsExcVat = "1";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '0'", function() {
        product.priceInCentsExcVat = "0";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string 0", function() {
        product.priceInCentsExcVat = 0;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '99900'", function() {
        product.priceInCentsExcVat = "99900";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail with fractional 0.1", function() {
        product.priceInCentsExcVat = 0.1;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        var validationError = new ProductValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid product price in cents excluding VAT");
        expect(validationError.translationKey).to.equal("invalid.product.priceInCentsExcVat");
        expect(validationError.value).to.equal("" + product.priceInCentsExcVat);
      });
    });
    describe("vatPercentage", function() {
      it("can be optional", function() {
        var vatPercentage = product.vatPercentage;
        delete product.vatPercentage;
        optionalFields = ["vatPercentage"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with integer 1", function() {
        product.vatPercentage = 1;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with integer 0", function() {
        product.vatPercentage = 0;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '1'", function() {
        product.vatPercentage = "1";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '22.5'", function() {
        product.vatPercentage = "22.5";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '22.12345'", function() {
        product.vatPercentage = "22.12345";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should fail with string '22,5'", function() {
        product.vatPercentage = "22,5";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        var validationError = new ProductValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid product vatPercentage");
        expect(validationError.translationKey).to.equal("invalid.product.vatPercentage");
        expect(validationError.value).to.equal("" + product.vatPercentage);
      });
      it("should succeed with fractional 0.1", function() {
        product.vatPercentage = 0.1;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
    });
    describe("quantity", function() {
      it("can be optional", function() {
        delete product.quantity;
        optionalFields = ["quantity"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with integer 1", function() {
        product.quantity = 1;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with integer 0", function() {
        product.quantity = 0;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should succeed with string '1'", function() {
        product.quantity = "1";
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("should pass with fractional 0.1", function() {
        product.quantity = 0.1;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
    }); // quantity

    describe("imageUrl", function() {
      it("can be optional", function() {
        delete product.imageUrl;
        optionalFields = ["imageUrl"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("is successful with staging image", function() {
        product.imageUrl = "https://store.multimerchantshop.xyz/media/983ab1519a8b553ec58125a13bf09471/image/cache/catalog/hp_1-228x228.jpg";
        optionalFields = ["imageUrl"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("can be null if optional", function() {
        product.imageUrl = null;
        optionalFields = ["imageUrl"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      /*it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          product.imageUrl = "https://store.mult" + BLACKLISTED_CHARACTERS[i] + "imerchantshop.xyz/media/983ab1519a8b553ec58125a13bf09471/image/cache/catalog/hp_1-228x228.jpg";
          var params = {
            product: product,
            optionalFields: optionalFields
          };
          var validationError = new ProductValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid product imageUrl");
          expect(validationError.translationKey).to.equal("invalid.product.imageUrl");
          expect(validationError.value).to.equal("Product imageUrl is not URL encoded");
        }
      });*/
    }); // imageUrl

  /*  describe("description", function() {
      it("can be optional", function() {
        delete product.description;
        optionalFields = ["description"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          product.description = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            product: product,
            optionalFields: optionalFields
          };
          var validationError = new ProductValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid product description");
          expect(validationError.translationKey).to.equal("invalid.product.description");
          expect(validationError.value).to.equal("Product description is not URL encoded");
        }
      });
    }); // description */

   /* describe("title", function() {
      it("can be optional", function() {
        delete product.title;
        optionalFields = ["title"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          product.title = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            product: product,
            optionalFields: optionalFields
          };
          var validationError = new ProductValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid product title");
          expect(validationError.translationKey).to.equal("invalid.product.title");
          expect(validationError.value).to.equal("Product title is not URL encoded");
        }
      });
    }); // title */

    describe("category", function() {
      it("can be optional", function() {
        delete product.category;
        optionalFields = ["category"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      /*it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          product.category = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            product: product,
            optionalFields: optionalFields
          };
          var validationError = new ProductValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid product category");
          expect(validationError.translationKey).to.equal("invalid.product.category");
          expect(validationError.value).to.equal("Product category is not URL encoded");
        }
      });*/
    }); // category

    describe("model", function() {
      it("can be optional", function() {
        delete product.model;
        optionalFields = ["model"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete product.model;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        var validationError = new ProductValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid product model");
        expect(validationError.translationKey).to.equal("invalid.product.model");
        expect(validationError.value).to.equal("Product model is mandatory");
      });
      /*it("cannot contain blacklisted characters", function() {
        for(var i = 0; i < BLACKLISTED_CHARACTERS.length; i++) {
          product.model = "abc " + BLACKLISTED_CHARACTERS[i] + " xyz";
          var params = {
            product: product,
            optionalFields: optionalFields
          };
          var validationError = new ProductValidator(params).validate()[0];
          expect(validationError.message).to.equal("Invalid product model");
          expect(validationError.translationKey).to.equal("invalid.product.model");
          expect(validationError.value).to.equal("Product model is not URL encoded");
        }
      });*/
    }); // model

    describe("extraData", function() {
      it("can be optional", function() {
        delete product.extraData;
        optionalFields = ["extraData"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete product.extraData;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        var validationError = new ProductValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid product extraData");
        expect(validationError.translationKey).to.equal("invalid.product.extraData");
        expect(validationError.value).to.equal("Product extraData is mandatory");
      });
    }); // extraData

    describe("options", function() {
      it("can be optional", function() {
        delete product.options;
        optionalFields = ["options"];
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        return expect(
          new ProductValidator(params).validate()
        ).to.be.empty;
      });
      it("can be mandatory", function() {
        delete product.options;
        var params = {
          product: product,
          optionalFields: optionalFields
        };
        var validationError = new ProductValidator(params).validate()[0];
        expect(validationError.message).to.equal("Invalid product options");
        expect(validationError.translationKey).to.equal("invalid.product.options");
        expect(validationError.value).to.equal("Product options is mandatory");
      });
    }); // options
  });
}());
