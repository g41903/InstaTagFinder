// scrolldownpage2.js
// scrolldownpage.js

// "use strict";

var casper = require('casper').create({
    // verbose: true,
    // logLevel: "debug",
    waitTimeout: 1000000000000000000,
    pageSettings: {
    	loadImages: true,
    	loadPlugins: false,
    	javascript: false
    },
    viewportSize: {
    	height: 1000,
    	width: 1024
    },
    onResourceRequested : function(R, req, net) {
    	var match = req.url.match(/fbexternal-a\.akamaihd\.net\/safe_image|\.pdf|\.mp4|\.png|\.gif|\.avi|\.bmp|\.jpg|\.jpeg|\.swf|\.fla|\.xsd|\.xls|\.doc|\.ppt|\.zip|\.rar|\.7zip|\.gz|\.csv/gim);
    	if (match !== null) {
    		net.abort();
    	}
    }});

// var closeFunc = function() {
// 	phantom.exit(0);
// };
// casper.onResourceRequested = function(request) {
// 	console.log('Request ' + request.url);
// 	return closeFunc();
// };

// casper.onResourceTimeout = 500;


var instagramTag = casper.cli.get(0);
var clickMaxNum = casper.cli.get(1);
var threshold = casper.cli.get('limit') || clickMaxNum;
var baseUrl = "http://iconosquare.com/tag/" + instagramTag + '/';
var downloaded = [];
var queued = [];
var pageResults = [];
var jsonArray = [];

var page_url = 0;
var startTime = new Date();
var timeDiff = 0;
var page_time = 0;
var page_location = "";

var downloadCounts = 0;

var clickMoreTimes = 0;
var sumTime = 0;
var sumDownLoadTime = 0;

var elemNum = 0;
var currentClickNum = 0;
var elementsHrefs = 0;
// var fs = require('fs');
var completeTime = new Date();
var path="Nopath.txt";



function queue(url) {
    // casper.echo("MapURL: " + url);
    //queued.push(url.replace(/_s.jpg/, '_n.jpg'));
    return url.replace(/_s.jpg/, '_n.jpg');
}


function scrollAndclick() {

   casper.echo('Begin to scroll!!', 'INFO');

   casper.Clicker = function() {
        // this.click('#vote');
        casper.evaluate(
        	function() {
        		window.document.body.scrollTop = document.body.scrollHeight;
        	}
        	)
            // window.scrollTo(0, Math.max(Math.max(document.body.scrollHeight,document.documentElement.scrollHeig‌​ht),Math.max(document.body.offsetHeight,document.documentElement.offsetHeight),Ma‌​th.max(document.body.clientHeight, document.documentElement.clientHeight)));
            this.echo('I just clicked');
            return true;
        };

    //function to wait set time
    casper.Waiter = function() {
        // adjust wait time between clicks
        this.wait(1000, function() {
        	this.echo('I waited for 1 second');
        });
        return true;
    };

    // loop
    casper.then(function() {
    	this.repeat(clickMaxNum, function() {
    		this.waitFor(function check() {
    			return this.Clicker();
    		});
    		this.waitFor(function check() {
    			return this.Waiter();
    		}, function then() {
                // elements = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid:only-child img', 'src');
                clickMoreTimes++;
                casper.echo('Click ' + clickMoreTimes + ' times');
                timeDiff = Math.abs(new Date() - startTime);
                sumTime = sumTime + timeDiff;
                casper.echo("TimeSlotTest: " + timeDiff);
                casper.echo("SumTime: " + sumTime);
                startTime = new Date();
                this.echo(clickMoreTimes, 'Debug');
            });
    	});
    });

    casper.then(function() {
    	getContent();
    });


}

function getContent() {


	elementsHrefs = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid', 'href');
    // elemNum = elements.length;
    elemNum = elementsHrefs.length;
    // casper.then(function() {
    	var fs = require('fs');
    	var completeTime = new Date();
    	var path = 'ElementHrefs ' + elemNum + " " + completeTime+".json";
    // casper.echo("JSONresults: " + JSON.stringify(jsonArray));
    casper.echo('Total ' + elemNum + ' records');
    var content = JSON.stringify(elementsHrefs);
    fs.write(path, content, 'w');
    casper.echo('Here, write url JSON to path file! Completed!!', 'INFO');

}


casper.start(baseUrl, scrollAndclick);


casper.then(
	function(){
		phantom.exit();
	});


casper.run();
