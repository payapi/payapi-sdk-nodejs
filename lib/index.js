(function () {
  "use strict";
  var jwt = require("jwt-simple");
  var rp = require("request-promise");
  var InputDataValidator = require("./validators");
  var Url = require("url");
  var moment = require("moment");

  module.exports = function PayapiClient(params) {
    function rejectUnsafeEnvironmentVariable(params) {
      return new Promise(function(resolve, reject) {
        if(process.env.NODE_TLS_REJECT_UNAUTHORIZED && ["development", "test"].indexOf(process.env.NODE_ENV) < 0) {
          return reject(new Error("NODE_TLS_REJECT_UNAUTHORIZED is not allowed in environment '" + process.env.NODE_ENV+ "'"));
        } else {
          return resolve(params);
        }
      });
    }

    function print(key, value) {
      console.log(key + ":" + JSON.stringify(value, null, 2));
    }

    function toPaymentObject() {
      var jwtHeader64 = params.paymentToken.split(".")[0];
      var jwtHeader = JSON.parse(new Buffer(jwtHeader64, "base64").toString());
      var alg = jwtHeader.alg;
      if (alg === "HS512" ||
          alg === "HS384" ||
          alg === "HS256" ||
          alg === "RS256") {
        return jwt.decode(params.paymentToken, params.apiKey);
      } else {
        throw new Error("Only HS256, HS384, HS512 and RS256 algorithms are supported for JWT.");
      }
    }

    function sanitizeAndExtractBinAndLast4(apiKeyAndToken) {
      var paymentObject = toPaymentObject();
      if(params.optionalFields.indexOf("payment") < 0 &&
          params.optionalFields.indexOf("payment.creditCardNumber") < 0) {
        paymentObject.payment.creditCardNumber = paymentObject.payment.creditCardNumber.replace(/\s/g,"");
        paymentObject.payment.cardBin = paymentObject.payment.creditCardNumber
          .replace(/\s/g, "")
          .substring(0, 6);
      }
      return paymentObject;
    }

    function toPaymentToken() {
      return jwt.encode(params.payload, params.apiKey, "HS512");
    }

    if(params) {
      params.returningConsumer = params.returningConsumer || false;
      params.optionalFields = params.optionalFields || [];
      params.extra = params.extra || {};

      if(params.payment && params.payment.creditCardNumber) {
        params.payment.creditCardNumber = params.payment.creditCardNumber.replace(/\s/g, "");
        params.payment.cardBin = params.payment.creditCardNumber
          .replace(/\s/g, "")
          .substring(0, 6);
      }

      if(params.paymentToken) {
        // decode, sanitize and re-package
        params.payload = sanitizeAndExtractBinAndLast4();
        params.paymentToken = toPaymentToken();
      }
    }

    function validateApiKey(params) {
      return new Promise(function(resolve, reject) {
        if(!params.apiKey) {
          reject("apiKey must not be empty");
        } else {
          resolve(params);
        }
      });
    }

    // secret is unused in v1, but is here as a placeholder for v2
    function validateSecret(params) {
      return new Promise(function(resolve, reject) {
        if(!params.secret) {
          reject("secret must not be empty");
        } else {
          resolve(params);
        }
      });
    }

    function encodePayloadUriComponents(payload) {
      // product image
      if(payload.products && payload.products.length > 0) {
        for(var i = 0; i < payload.products.length; i++) {
          if(payload.products[i].imageUrl) {
            payload.products[i].imageUrl = Url.parse(payload.products[i].imageUrl).href;
          }
        }
      }

      // callbacks
      if(payload.callbacks && payload.callbacks.success) {
        payload.callbacks.success = Url.parse(payload.callbacks.success).href;
      }
      if(payload.callbacks && payload.callbacks.failed) {
        payload.callbacks.failed = Url.parse(payload.callbacks.failed).href;
      }
      if(payload.callbacks && payload.callbacks.chargeback) {
        payload.callbacks.chargeback = Url.parse(payload.callbacks.chargeback).href;
      }
      if(payload.callbacks && payload.callbacks.processing) {
        payload.callbacks.processing = Url.parse(payload.callbacks.processing).href;
      }

      // returnUrls
      if(payload.returnUrls && payload.returnUrls.success) {
        payload.returnUrls.success = Url.parse(payload.returnUrls.success).href;
      }
      if(payload.returnUrls && payload.returnUrls.cancel) {
        payload.returnUrls.cancel = Url.parse(payload.returnUrls.cancel).href;
      }
      if(payload.returnUrls && payload.returnUrls.failed) {
        payload.returnUrls.failed = Url.parse(payload.returnUrls.failed).href;
      }

      // ToS
      if(payload.order && payload.order.tosUrl) {
        payload.order.tosUrl = Url.parse(payload.order.tosUrl).href;
      }
      return payload;
    }

    function encodeURIComponentRecursive(extra) {
      for (var key in extra) {
        if (extra.hasOwnProperty(key) && extra[key] && typeof extra[key] === "object") {
          extra[encodeURIComponent(key)] = encodeURIComponentRecursive(extra[key]);
        } else if(extra.hasOwnProperty(key) && extra[key]) {
          extra[encodeURIComponent(key)] = encodeURIComponent(extra[key]);
        }
      }
      return extra;
    }

    function encodePayloadExtraComponents(payload) {
      if(payload.extra) {
        payload.extra = encodeURIComponentRecursive(payload.extra);
      }
      return payload;
    }

    function convertNumbersToStrings(payload) {
      if(payload.products && payload.products.length > 0) {
        for(var i = 0; i < payload.products.length; i++) {
          if(typeof payload.products[i].id === "number") {
            payload.products[i].id = payload.products[i].id + "";
          }
        }
      }
      return payload;
    }

    function validatePayload(params) {
      return new Promise(function(resolve, reject) {
        var payload = {
          transactionUuid: params.transactionUuid,
          authenticationToken: params.authenticationToken,
          payment: params.payment,
          consumer: params.consumer,
          order: params.order,
          products: params.products,
          callbacks: params.callbacks,
          shippingAddress: params.shippingAddress,
          returnUrls: params.returnUrls,
          returningConsumer: params.returningConsumer || false,
          optionalFields: params.optionalFields || [],
          extra: params.extra || {}
        };
        payload = encodePayloadUriComponents(payload);
        //payload = encodePayloadExtraComponents(payload);
        payload = convertNumbersToStrings(payload);
        var validationErrors = new InputDataValidator(payload).validate();
        if(validationErrors.length > 0) {
          reject(validationErrors);
        } else {
          params.payload = payload;
          resolve(params);
        }
      });
    }

    function createToken(params) {
      return new Promise(function(resolve, reject) {
        if(params.payload) {
          params.paymentToken = toPaymentToken(params.payload, params.apiKey, "HS512");
          resolve(params);
        } else if(params.paymentToken) {
          resolve(params);
        } else {
          reject(new Error("No payment token or payload to create a payment token from. Unable to continue."));
        }
      });
    }

    function stopMoment(timerName, startMoment, noisy, logger) {
      if(noisy === true) {
        if(!logger) {
          logger = console;
        }
        if(logger.log && logger.log.constructor && logger.log.constructor.name === "Function") {
          logger.log("%s took %s ms to execute", timerName, moment().diff(startMoment));
        } else {
          console.warn("The logger you have provided does not have a log('message') interface");
        }
      }
    }

    function doRestCall(params) {
      return new Promise(function(resolve, reject) {
        var uri;
        var startMoment = moment();
        var logger = params.logger;
        var debug = params.debug;
        switch(process.env.NODE_ENV) {
          case "production":
            uri = process.env.PA_PAYMENTS_URI || "https://input.payapi.io/v1/api/authorized/payments";
            break;
          case "staging":
            uri = process.env.PA_PAYMENTS_URI || "https://staging-input.payapi.io/v1/api/authorized/payments";
            break;
          default:
            uri = process.env.PA_PAYMENTS_URI || "http://localhost:3000/v1/api/authorized/payments";
        }
        rp({
          method: "POST",
          uri: uri,
          body: {
            authenticationToken: params.authenticationToken,
            paymentToken: params.paymentToken
          },
          json: true,
          timeout: 5000
        }).then(function(params) {
          stopMoment("POST to " + uri, startMoment, debug, logger);
          resolve(params);
        }).catch(function(err) {
          reject(err);
        });
      });
    }

    function handleError(err) {
      return new Promise(function(resolve, reject) {
        console.log("Payapi Client Error:" + JSON.stringify(err, null, 2));
        reject(err);
      });
    }

    function convertNumberToNumber(params) {
      return new Promise(function(resolve, reject) {
        if(params.payload.products && params.payload.products.length > 0) {
          for(var i = 0; i < params.payload.products.length; i++) {
            params.payload.products[i].quantity = Number(params.payload.products[i].quantity);
            params.payload.products[i].priceInCentsIncVat = Number(params.payload.products[i].priceInCentsIncVat);
            params.payload.products[i].priceInCentsExcVat = Number(params.payload.products[i].priceInCentsExcVat);
            params.payload.products[i].vatPercentage = Number(params.payload.products[i].vatPercentage);
          }
        }
        params.payload.order.sumInCentsIncVat = Number(params.payload.order.sumInCentsIncVat);
        params.payload.order.sumInCentsExcVat = Number(params.payload.order.sumInCentsExcVat);
        resolve(params);
      });
    }

    return {
      call: function(callParams) {
        if(callParams) {
          return rejectUnsafeEnvironmentVariable(callParams)
            .then(doRestCall)
            .catch(handleError);
        } else {
          return rejectUnsafeEnvironmentVariable(params)
            .then(validateApiKey)
            .then(validateSecret)
            .then(validatePayload)
            .then(convertNumberToNumber)
            .then(createToken)
            .then(doRestCall)
            .catch(handleError);
        }
      },
      paymentToken: function() {
        return validatePayload(params)
          .then(convertNumberToNumber)
          .then(createToken)
          .then(function(params) {
            return new Promise(function(resolve, reject) {
              resolve(params.paymentToken);
            });
          })
          .catch(function(err) {
            throw err;
          });
      },
      validate: function() {
        return validatePayload(params);
      },
      encodePaymentToken: function() {
        return toPaymentToken();
      },
      decodePaymentToken: function() {
        var paymentObject = toPaymentObject();
        paymentObject.optionalFields = params.optionalFields;
        return validatePayload(paymentObject)
          .then(convertNumberToNumber)
          .then(function(result) {
            return result.payload;
          })
          .catch(function(err) {
            throw err;
          });
      },
    };
  };
}());
