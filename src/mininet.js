var http = require("http");
var config = require("./config.js");



var setBw = function(bW){
	
	var host =  config.mininetHost;
        var port = config.mininetPort;
        var path = config.mininetBwPath
	var Options = {
                header: header,
                host: host,
                port: port,
                path: path,
                method: 'POST'
        };

	var req = http.request(Options,function(res){
        });

	req.end();

}

var getBw = function(callBack){

	var host =  config.mininetHost;
        var port = config.mininetPort;
        var path = config.mininetBwPath
        var Options = {
                header: header,
                host: host,
                port: port,
                path: path,
                method: 'GET'
        };

        var req = http.request(Options,function(res){
		var Bw;
		res.on("data", function(chunk){
			//parse Response and get Bw 
			callBack(Bw);		
		});
	});
	
	req.end();

}

module.exports = 
{
	setBw = setBw,
	getBw = getBw 
}

