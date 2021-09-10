'use strict';

const request = require('request');

// You can use your favorite http client package to make REST calls, however, the node fetch API is pre-installed with the bots-node-sdk.
// Documentation can be found at https://www.npmjs.com/package/node-fetch
// Un-comment the next line if you want to make REST calls using node-fetch.
// const fetch = require("node-fetch");

module.exports = {
  metadata: () => ({
    name: 'update',
    properties: {
       url: { required: true, type: 'string' },
       token: { required: true, type: 'string' },
       siteid: { required: true, type: 'string' },
       status: { required: true, type: 'string' },
    },
    supportedActions: ['next', 'error', 'tryagain']
  }),
  invoke: (context, done) => {
    const { url } = context.properties();
    const { token } = context.properties();
    var { siteid } = context.properties();
    var id = JSON.parse(siteid);
    var { status } = context.properties();

    var operation = (status == 'active' ? "deactivate" : "activate");
    var new_status = "";
    context.logger().info(url + "/" + operation);
    context.logger().info(siteid);
    context.logger().info(id.number);
    context.logger().info(status);
    context.logger().info(operation);
    context.logger().info(url);
    context.logger().info(token);

    request({
            followAllRedirects: true,
            url: url + "/" + operation,
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              'Api_token': token,
              'p_site_id': id.number
            },
            json: { 'foo' : 'bar'}
          }, function (error, response, body){
          if (error) {
                context.logger().info("Error: " + error);
                context.keepTurn(true);
                context.error(true);
          } else {
                context.logger().info(response);
                context.logger().info(body);
                var new_status = (status == 'active' ? "inactive" : "active");
                context.reply("Sited id " + id.number + " is now " + new_status);
                context.keepTurn(true);
                context.transition('next');
                context.error(false);
          }
          done();
    });
  }
};
