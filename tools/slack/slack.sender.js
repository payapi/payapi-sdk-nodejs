"use strict";
var SlackSender = function(params) {
  if (!params.webHookUrl || !params.channel) {
    throw new Error({message: "params.webHookUrl or params.channel is missing"});
  }

  var os = require("os");
  var SlackNode = require("slack-node");
  var appHostname = os.hostname();
  var user = process.env.USER;
  var appEnv = process.env.NODE_ENV || "development";
  var slack = new SlackNode();
  slack.setWebhook(params.webHookUrl);

  function send(message) {
    // append environment details to message
    message = appHostname+"/"+appEnv+"/" + user +": "+message;

    // define Slack message
    slack.webhook({
      channel: params.channel,
      username: "payapi",
      text: message
    }, function(err, response) {
      if (!err) {
        console.error("Notified " + params.channel);
        return true;
      } else {
        console.error("Slack message sending failed; Error below:");
        console.error(err);
        return false;
      }
    });
  }

  return {
    send: function(message) {
      return send(message);
    }
  };
};
module.exports = SlackSender;

var command = process.argv[2];
if(command) {
  switch(command) {
    case "newClientPublished":
      new SlackSender({
        webHookUrl: require("../../config/env/secrets").slack.incomingWebhookUrl,
        channel: "#general"
      }).send("v" + require("../../package.json").version + " of PayapiClient published");
  }
} else {
  console.log("Usage: node slack.sender <command>. Eg: node slack.sender newClientPublished");
}
