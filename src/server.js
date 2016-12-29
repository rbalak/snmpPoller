var rawPoller = require('./rawPoller.js');
var influxDb = require('./influxDbFunctions.js');
influxDb.createdb();
var oids = ["1.3.6.1.2.1.2.2.1.1.1"];
rawPoller.poll(process.env.POLL_DEVICE, "demo", oids,process.env.POLL_FREQUENCY);

