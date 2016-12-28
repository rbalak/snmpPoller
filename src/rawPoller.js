var http = require('http');
var moment = require('moment-timezone');
var influxDb = require("./influxDbFunctions.js");
var snmp = require('net-snmp');
   
var poll = function(ip, cString, oids, frequency ){

	var session = snmp.createSession (ip, cString);
	session.get(oids, function (error, varbinds) {
		if (error) {
			console.error (error);
		} 
		else {
			parseResponse(ip, varbinds);
		}
	});
	//setTimeout(function(){
	//	run(ip, cString, oids, frequency);
    //}frequency);
}
	

var parseResponse = function(ip, varbinds){
	for (var i = 0; i < varbinds.length; i++)
	{
		if (snmp.isVarbindError (varbinds[i])){
            console.error (snmp.varbindError (varbinds[i]));
		}
        else
		{
			var metricName = "Metric1";
			metricRecordKey = "Device=D1";
			metricValue = varbinds[i].value;
			metricTimestamp = Math.floor(new Date());
			content = metricName + "," + metricRecordKey + " value=" + metricValue + " " + metricTimestamp;
			console.log(content);
			influxDb.write(content);
		}
	}
}

module.exports = 
{
	poll: poll
}


