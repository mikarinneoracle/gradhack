'use strict';

const request = require('request');

// You can use your favorite http client package to make REST calls, however, the node fetch API is pre-installed with the bots-node-sdk.
// Documentation can be found at https://www.npmjs.com/package/node-fetch
// Un-comment the next line if you want to make REST calls using node-fetch.
// const fetch = require("node-fetch");

module.exports = {
  metadata: () => ({
    name: 'find',
    properties: {
       url: { required: true, type: 'string' },
       token: { required: true, type: 'string' },
       siteid: { required: true, type: 'string' },
    },
    supportedActions: ['next', 'error', 'tryagain']
  }),
  invoke: (context, done) => {
    const { url } = context.properties();
    const { token } = context.properties();
    var { siteid } = context.properties();
    var id = JSON.parse(siteid);
    var msg = "";

    context.logger().info(siteid);
    context.logger().info(url);
    context.logger().info(token);

    request({
            followAllRedirects: true,
            url: url + "/status",
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Api_token': token,
              'p_site_id': id.number
            }
          }, function (error, response, body){
          if (error) {
            context.logger().info("Error: " + error);
            context.keepTurn(true);
            context.error(true);
          } else {
                var bodyResponse = JSON.parse(body);
                 context.logger().info("Data received: \n" + JSON.stringify(bodyResponse));
                 if(bodyResponse.items)
                 {
                     if(bodyResponse.items.length == 0)
                     {
                         msg = "Site not found with id " + id.number;
                         context.logger().info(msg);
                         context.reply(msg);
                         context.keepTurn(true);
                         context.transition('tryagain');
                         context.error(false);
                     } else {
                         var item = bodyResponse.items[0];
                         msg = "Details for the " + item.site_name + " are:\n" +
                                        "id: " + item.site_id + "\n" +
                                        "name: " + item.site_name + "\n" +
                                        "city " + item.site_city + "\n" +
                                        "country: " + item.site_country_code + "\n" +
                                        "lat: " + item.lat + "\n" +
                                        "long: " + item.long_ + "\n" +
                                        "status: " + item.site_status + "\n" +
                                        "aqi: " + item.aqi + "\n" +
                                        "co: " + item.co + "\n" +
                                        "sync date: " + item.sync_date + "\n";
                         context.logger().info(msg);
                         context.reply(msg);
                         context.variable("status", item.site_status);
                         context.keepTurn(true);
                         context.transition('next');
                         context.error(false);
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
