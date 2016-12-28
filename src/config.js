//metricPollerConfiguration

function define(name, value) {
	Object.defineProperty(exports, name, {
	        value:      value,
        	enumerable: true
    	});
}

define("pollInterval",60000);
define("pollHistory",120);
define("influxDBHost", "192.168.99.100");
define("influxDBPort",8086);
define("influxDBwritePath","/write");
define("pmStatsDB","pm_stats");
define("influxDReadPath", "/query?pretty=true");
define("precisionms",  "&precision=ms");



