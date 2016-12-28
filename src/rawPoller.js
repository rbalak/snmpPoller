var http = require('http');
var datetime = require('node-datetime');
var influxDb = require("./influxDbFunctions.js");
var snmp = require('net-snmp');
   
var poll = function(ip, cString, oids, frequency ){

	var session = snmp.createSession (ip, cString);
	session.get(oids, function (error, varbinds) {
		if (error) {
			//console.error (error);
		} 
		else {
			parseResponse(ip, varbinds);
		}
	});
	setTimeout(function(){
		run(ip, cString, oids, frequency);
    }frequency);
}
	

var parseResponse = function(varbinds){
	
	for (var i = 0; i < varbinds.length; i++){
		if (snmp.isVarbindError (varbinds[i])){
            // console.error (snmp.varbindError (varbinds[i]))
		}
        else
		{
			var metricName = varbinds[i].oid;
			metricRecordKey = "ip="+ip+"oid="+varbinds[i].oid;
			value = varbinds[i].value;
			metricTimestamp = datetime .now();
			content = metricName + "," + metricRecordKey + " value=" + metricValue + " " + metricTimestamp;
			console.write(content);
			//influxDb.write(content);
		}
		
	});
}

module.exports = 
{
	poll: poll
}


