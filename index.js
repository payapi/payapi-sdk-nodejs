'use strict';
var jwt = require('jwt-simple');
var Promise = require('promise');
var apiKey;
var secret;
var payment;
var consumer;
var delivery;
var payment;
var callbacks;
var paymentToken;
var authenticationToken;

module.exports = function PayapiClient(params) {

  function print(key, value) {
    console.log(key + ':' + JSON.stringify(value, null, 2));
  }

  this.apiKey = params.apiKey;
  this.secret = params.secret;
  this.payment = params.payment;
  this.consumer = params.consumer;
  this.delivery = params.delivery;
  this.payment = params.payment;
  this.products = params.products;
  this.callbacks = params.callbacks;
  this.authenticationToken = params.authenticationToken;
  this.paymentToken = params.paymentToken;

  function validateApiKey(params) {
    return new Promise(function(resolve, reject) {
      if(!apiKey) {
        reject('apiKey must not be empty');
      }
      resolve(params);
    });
  }

  function validateSecret(params) {
    return new Promise(function(resolve, reject) {
      if(!secret) {
        reject('secret must not be empty');
      }
      resolve(params);
    });
  }

  function validatePayment(params) {
    return new Promise(function(resolve, reject) {
      if(!payment) {
        reject('payment must not be empty');
      }
      resolve(params);
    });
  }

  function validateConsumer(params) {
    return new Promise(function(resolve, reject) {
      if(!consumer) {
        reject('consumer must not be empty');
      }
      resolve(params);
    });
  }

  function validateDelivery(params) {
    return new Promise(function(resolve, reject) {
      if(!delivery) {
        reject('delivery must not be empty');
      }
      resolve(params);
    });
  }

  function validatePayment(params) {
    return new Promise(function(resolve, reject) {
      if(!payment) {
        reject('payment must not be empty');
      }
      resolve(params);
    });
  }

  function validateOrCreateToken(params) {
    return new Promise(function(resolve, reject) {
      if(!params.paymentToken) {
        var payload = {
          payment: params.payment,
          consumer: params.consumer,
          delivery: params.delivery,
          products: params.products,
          payment: params.payment,
          callbacks: params.callbacks
        }
        params.paymentToken = jwt.encode(payload, params.secret, 'HS512');
      }
      resolve(params);
    });
  }

  function doRestCall(params) {
    return new Promise(function(resolve, reject) {
      resolve(params);
    });
  }

  function handleError(err) {
    return new Promise(function(resolve, reject) {
      reject(err);
    });
  }

  return {
    call: function(token) {
      if(token) {
        var params = {paymentToken: token};
        return validateOrCreateToken(params)
          .then(doRestCall)
          .catch(handleError);
      } else {
        return validateApiKey(params)
          .then(validateSecret)
          .then(validatePayment)
          .then(validateConsumer)
          .then(validateDelivery)
          .then(validatePayment)
          .then(validateOrCreateToken)
          .then(doRestCall)
          .catch(handleError);
      }
    },
    paymentToken: function() {
      return validateOrCreateToken(params)
        .then(function(params) {
          return new Promise(function(resolve, reject) {
            resolve(params.paymentToken);
          });
        })
        .catch(function(err) {
          throw err;
        });
    }
  };
};

