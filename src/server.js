var rawPoller = require('./rawPoller.js');
var metricCalculator = require("./metricCalculator.js");
var oids = ["1.3.6.1.2.1.2.2.1.1.1"];
rawPoller.poll("192.168.99.100", "demo", oids,3000);
//metricCalculator.run();
