var http = require('http');
var moment = require('moment-timezone');
var snmp = require('net-snmp')
//var moment = require('/home/rbalak/node/node_modules/moment-timezone/moment-timezone');
var config = require("./config.js");
var influxDb = require("./influxDbFunctions.js");
//Poll the 2 stats - transmitted and recieved bytes from ODL
//Poll data for past 2 minutes
//Check if data is already available in DB. if no, insert data into the InfluxDB.
   

var poll = function(id){

	var header = 
	{ 
		'content-type': 'application/json'
	};

	var until = Math.floor((new Date())/1000);
	var from = until - config.pollHistory;

	var host =  config.odlHost;
	var port = config.odlPort;
	var txTrafficpath = config.path
	+ config.portStats
	+ config.txTraffic
	+ id
	+ "&from=" + from
	+ "&until=" + until;
	var rxTrafficpath = config.path
	+ config.portStats
	+ config.rxTraffic
	+ id
	+ "&from=" + from
	+ "&until=" + until;

	//Set options for TxBytes polling
	var txOptions = {
		header: header,
		host: host,
		port: port,
		path: txTrafficpath, 
		method: 'GET'
	};

	//Set optons for RXBytes polling
	 var rxOptions = {
		header: header,
		host: host,
		port: port,
		path: rxTrafficpath,
		method: 'GET'
    };

	console.log("TxPath = " + txTrafficpath);
	console.log("RxPath = " + rxTrafficpath);

	//Make HTTP call & parse the response
	var txReq = http.request(txOptions,function(res){
		//console.log("Parsing Response from ODL - TxBytes");
		parseResponse(res);
	});
	txReq.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	txReq.end();

	//Make HTTP call & parse the response
    var rxReq = http.request(rxOptions,function(res){
		//console.log("Parsing Response from ODL - RxBytes");
        parseResponse(res);
    });
	rxReq.on('error', function(e) {
                console.log('problem with request: ' + e.message);
    });
	rxReq.end();

	
	var mininetHost =  config.mininetHost;
        var mininetPort = config.mininetPort;
        var bwPath = config.mininetBwPath

	var bwOptions = {
                header: header,
                host: mininetHost,
                port: mininetPort,
                path: bwPath,
                method: 'GET'
        };


        //Make HTTP call & parse the response
        var bwReq = http.request(bwOptions,function(res){
				//console.log("Parsing Response from Mininet - BW Information");
                parseBWResponse(res);
        });
        bwReq.on('error', function(e) {
                console.log('problem with request: ' + e.message);
        });

        bwReq.end();

	//Repeat polling after waiting for polling interval
	setTimeout(function() {
		poll(id);	
	},config.pollInterval);

}

var parseResponse = function(res){
	
	var responseData = "";
	
	res.on('data', function (chunk) {
        //console.log(chunk);
        responseData += chunk;
    });
	
	res.on('end', function () {
		var data = JSON.parse(responseData);
		var content;
		var metricRecords = data.metricRecords;
		for(var i=0;i<metricRecords.length;i++){
			var metricRecord = metricRecords[i];
			var metricName = metricRecord.metricName;
			var metricRecordKey = "";
			var recordKeys= metricRecord.recordKeys;
			for(var j=0;j<recordKeys.length;j++)
			{
				recordKey = recordKeys[j];
				metricRecordKey = metricRecordKey + recordKey.keyName + "="+ recordKey.keyValue;
				if (j<recordKeys.length-1){
					metricRecordKey=metricRecordKey+",";
				}
			}
			var metricValue = metricRecord.metricValue;
			//We have problem with the time stamp and zone. Hardcoding substraction of 19800000ms 
			var metricTimestamp = (moment(metricRecord.timeStamp,"ddd MMM DD HH:mm:ss z YYYY").valueOf()) - 19800000;
			content = metricName + "," + metricRecordKey + " value=" + metricValue + " " + metricTimestamp;
			console.log(content);
			influxDb.write(content);
		}
	});
}

var parseBWResponse = function(res){
	
	var responseData = "";
	
	res.on('data', function (chunk) {
            responseData += chunk;
    });
	
	
	
	res.on('end', function () {
		var data = JSON.parse(responseData);
		var bandwidth = data.linkbandwidth;
		var metricName = "linkbandwidth";
		var metricRecordKey = "Node=openflow:1,NodeConnector=openflow:1:2";
		var metricValue = bandwidth;
		var metricTimestamp = Math.floor(new Date());
		var content =  metricName + "," + metricRecordKey +  " value=" + metricValue + " " + metricTimestamp;
		influxDb.write(content);
	});
}


module.exports = 
{
	poll: poll
}


