var config = require("./config.js");
var influxDb = require("./influxDbFunctions.js");

var run = function(){
	
	var rxBytesQuery = "SELECT MAX(value) FROM " + config.rxSeries 
	+ "  WHERE time > now() - " +  config.metricCalculationHistory + "s"
	+ " GROUP BY time(120s)";

	var txBytesQuery = "SELECT MAX(value) FROM " + config.txSeries
	+ "  WHERE time > now() - " +  config.metricCalculationHistory + "s"
	+ " GROUP BY time(120s)"; 
	
	var bwQuery =  "SELECT MAX(value) FROM " + "linkbandwidth"
        + "  WHERE time > now() - " +  config.metricCalculationHistory + "s"
        + " GROUP BY time(120s)";


	var queries = [rxBytesQuery, txBytesQuery, bwQuery];
	var completed_Request = 0;
	var responses = [];

	for (i in queries){
		influxDb.read(queries[i], function(res){
			var responseData = "";
			res.on('data', function (chunk) {
				//console.log(chunk);
				responseData += chunk;
			});
			res.on("end", function(){
				responses.push(responseData);
				completed_Request++;
				if (completed_Request==queries.length){
					calculateMetric(responses);
				} 
			});
		});

        }

	setTimeout(function(){
                run();
        },config.metricCalulationInterval);
}

var calculateMetric= function(responses){

	var linkBandwidth;
	var txBytes;
	var rxBytes;
	
	for (i in responses){
		var response =responses[i];
		var data = JSON.parse(response); 
		if (data.results[0].hasOwnProperty('series')) {
			if ((data.results[0].series[0].name)== "linkbandwidth"){
				linkBandwidth = data.results[0].series[0].values
			}
			if ((data.results[0].series[0].name)== "TransmittedBytes"){
                        	txBytes  = data.results[0].series[0].values
	                }	
			if ((data.results[0].series[0].name)== "ReceivedBytes"){
                	        rxBytes  = data.results[0].series[0].values
                	}
		}
	}

	

	if (typeof linkBandwidth  !== 'undefined' && linkBandwidth  &&
	typeof txBytes  !== 'undefined' && txBytes &&	
	typeof rxBytes  !== 'undefined' && rxBytes){

		
		if (txBytes[1][1] !== "null" &&
		txBytes[0][1] !== "null" &&
		rxBytes[0][1] !== "null" &&
		rxBytes[1][1] != "null" &&
		linkBandwidth[1][1] != "null") {

			var deltaTxBytes = txBytes[1][1] - txBytes[0][1];
			var deltaRxBytes = rxBytes[1][1] - rxBytes[0][1];
				
			var trafficUtil = (deltaTxBytes *8)/((1000*1000)*120);
			var trafficUtilPct = trafficUtil/linkBandwidth[1][1]*100;
	
			var metricName = "trafficUtil";
			var metricRecordKey = "Node=openflow:1,NodeConnector=openflow:1:2";
			var metricValue = trafficUtil;
			var metricTimestamp = txBytes[1][0]*1000
			var content =  metricName + "," + metricRecordKey +  " value=" + metricValue + " " + metricTimestamp;
			influxDb.write(content);

			metricName = "trafficUtilPct";
			metricTimestamp = txBytes[1][0]*1000
			metricValue = trafficUtilPct;
			content =  metricName + "," + metricRecordKey +  " value=" + metricValue + " " + metricTimestamp;
			influxDb.write(content);
		}
	}

}

module.exports =
{
	run: run
}

