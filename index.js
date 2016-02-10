'use strict';
var Promise = require('promise');
var apiKey;
var secret;
var payment;
var consumer;
var delivery;
var payment;
var callbacks;

module.exports = function PayapiClient(params) {
  this.apiKey = params.apiKey;
  this.secret = params.secret;
  this.payment = params.payment;
  this.consumer = params.consumer;
  this.delivery = params.delivery;
  this.payment = params.payment;
  this.callbacks = params.callbacks;

  function validateApiKey(err) {
    return new Promise(function(resolve, reject) {
      if(!apiKey) {
        reject('apiKey must not be empty');
      }
    });
  }

  function validateSecret(err) {
    return new Promise(function(resolve, reject) {
      if(!secret) {
        reject('secret must not be empty');
      }
    });
  }

  function validatePayment(err) {
    return new Promise(function(resolve, reject) {
      if(!secret) {
        reject('secret must not be empty');
      }
    });
  }

  function handleError(err) {
    return new Promise(function(resolve, reject) {
      reject(err);
    });
  }

  return {
    call: function() {
      return validateApiKey(params)
        .then(validateSecret)
        .then(validatePayment)
        .then(validateConsumer)
        .then(validateDelivery)
        .then(validatePayment)
        .then(createToken)
        .then(doRestCall)
        .catch(handleError);
    }
  };
};

