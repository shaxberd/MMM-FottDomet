const NodeHelper = require("node_helper");
//var fetch = require("node-fetch");
var request = require("request");

module.exports = NodeHelper.create({
  start: function() {
    this.dataset = "";
  },
  socketNotificationReceived: function(notification, payload) {
    var startDate = new Date(Date.now());
    var toDate = new Date(Date.now());
    toDate.setDate(toDate.getDate() + payload.daysAhead);
    var startYear = startDate.getFullYear();
    var startMonth = startDate.getMonth() + 1;
    var endYear = toDate.getFullYear();
    var endMonth = toDate.getMonth() + 1;

    var binUrl = "https://www.awbkoeln.de/api/calendar?building_number="+payload.streetNo+"&street_code="+payload.streetCode+"&start_year="+startYear+"&end_year="+endYear+"&start_month="+startMonth+"&end_month="+endMonth+"&form=json";

    request({url: binUrl, method: 'GET'}, function(error, response, message) {
      if (!error && (response.statusCode == 200 || response.statusCode == 304)) {
        dataset = JSON.parse(message);
      }
    });

    this.sendSocketNotification("RESPONSE_DATA", dataset);

//    const response = await fetch("https://jsonplaceholder.typicode.com/users/2");
//    const data = await response.json();
  },
});

