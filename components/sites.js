'use strict';

const request = require('request');

// You can use your favorite http client package to make REST calls, however, the node fetch API is pre-installed with the bots-node-sdk.
// Documentation can be found at https://www.npmjs.com/package/node-fetch
// Un-comment the next line if you want to make REST calls using node-fetch.
// const fetch = require("node-fetch");

module.exports = {
  metadata: () => ({
    name: 'sites',
    properties: {
       url: { required: true, type: 'string' },
       token: { required: true, type: 'string' },
    },
    supportedActions: ['next', 'tryagain']
  }),
  invoke: (context, done) => {
    const { url } = context.properties();
    const { token } = context.properties();

    context.logger().info(url);
    context.logger().info(token);

    request({
            followAllRedirects: true,
            url: url + "/list",
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Api_token': token
            }
          }, function (error, response, body){
          if (error) {
            context.keepTurn(true);
            context.error(true);
          } else {
                var bodyResponse = JSON.parse(body);
                 context.logger().info("Data received: \n" + JSON.stringify(bodyResponse));
                 if(bodyResponse.items)
                 {
                     if(bodyResponse.items.length == 0)
                     {
                         msg = "No sites found, please try again later.";
                         context.logger().info(msg);
                         context.reply(msg);
                         context.keepTurn(true);
                         context.transition('tryagain');
                         context.error(false);
                     } else {
                         var items = bodyResponse.items;
                         context.logger().info(items);
                         context.keepTurn(true);
                         context.transition('next');
                         context.error(false);
                         context.variable("sites", bodyResponse.items);
                         context.variable("hasMore", bodyResponse.hasMore);
                     }
                 } else {
                   context.keepTurn(true);
                   context.error(true);
                 }
          }
          done();
    });
  }
};
