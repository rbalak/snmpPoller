var rawPoller = require('./rawPoller.js');
var metricCalculator = require("./metricCalculator.js");

rawPoller.poll("192.168.99.100", "demo", "1.3.6.1.2.1.2.2.1.1.1"," 3000);
//metricCalculator.run();
