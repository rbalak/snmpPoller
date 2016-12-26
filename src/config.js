//metricPollerConfiguration

function define(name, value) {
	Object.defineProperty(exports, name, {
	        value:      value,
        	enumerable: true
    	});
}

define("txTraffic","[MN=TransmittedBytes]");
define("rxTraffic","[MN=ReceivedBytes]");
define("portStats","[DC=PORTSTATS]");
define("odlHost", "192.168.231.103");
define("odlPort",8181);
define("path","/tsdr/metrics/query?tsdrkey=");
define("pollInterval",60000);
define("pollHistory",120);
define("influxDBHost", "influxdbos-sdnorchestrator.apps.10.2.2.2.xip.io");
define("influxDBPort",80);
define("influxDBwritePath","/write");
define("pmStatsDB","pm_stats");
define("influxDReadPath", "/query?pretty=true");
define("precisionms",  "&precision=ms");
define("metricCalulationInterval", 120000);
define("metricCalculationHistory",240);
define("txSeries", "TransmittedBytes");
define("rxSeries", "ReceivedBytes");
define("mininetHost", "192.168.231.102");
define("mininetPort", "8182");
define("mininetBwPath", "/linkbandwidth/s1-s2");



