var rawPoller = require('./rawPoller.js');
var metricCalculator = require("./metricCalculator.js");

rawPoller.poll("[RK=Node:openflow:1,NodeConnector:openflow:1:2]");
metricCalculator.run();
