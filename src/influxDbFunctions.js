var http = require('http');
var config = require("./config.js");

var createdb =function(){
	var header =
        {
                'content-type': 'text/plain'
        };
        var host = process.env.INFLUX_DB_HOST;
        var port = process.env.INFLUX_DB_PORT;
        var path = config.influxDReadPath+ "&q=" + encodeURIComponent("CREATE DATABASE " + config.pmStatsDB);
        var options = {
                        header: header,
                        host: host,
                        port: port,
                        path: path,
                        method: 'POST'
                        };
        var req = http.request(options,function(res){

        });
        req.end();
}

var write = function(content){

        var header =
        {
                'content-type': 'text/plain'
        };
        var host = process.env.INFLUX_DB_HOST;
        var port = process.env.INFLUX_DB_PORT;
        var path = config.influxDBwritePath + "?db=" + config.pmStatsDB + config.precisionms;
        var options = {
                        header: header,
                        host: host,
                        port: port,
                        path: path,
                        method: 'POST'
                        };
		console.log(options);
		console.log(content);
        var req = http.request(options,function(res){

        });
        req.write(content);
        req.end();
}


var read = function(query, callback){

        var header =
        {
                'content-type': 'text/plain'
        };
        var host = process.env.INFLUX_DB_HOST;
        var port = process.env.INFLUX_DB_PORT;
        var path = config.influxDReadPath + "&db=" + config.pmStatsDB + "&epoch=s" + "&q="+ encodeURIComponent(query);
        var options = {
                        header: header,
                        host: host,
                        port: port,
                        path: path,
                        method: 'GET'
                        };
        
        var req = http.request(options,function(res){
		callback(res);
//              console.log(res.statusCode);
//		res.on("data", function(chunk){
//			console.log("data:" + chunk);
//			callback(chunk);	
//		});		
        });
        req.end();
}


module.exports =
{
	write: write,
	read: read,
	createdb: createdb
}


