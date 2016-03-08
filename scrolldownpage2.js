// scrolldownpage2.js
// scrolldownpage.js

"use strict";

var casper = require('casper').create({
	// verbose: true,
	// logLevel: "debug",
	waitTimeout: 1000000000000000000,
	pageSettings: {
		loadImages: false,
		loadPlugins: false,
		javascript: false
	},
	viewportSize: {
		height: 1000,
		width: 1024
	}

});

// casper.onResourceTimeout = 500;


var instagramTag = casper.cli.get(0);
var clickMaxNum = casper.cli.get(1);
var threshold = casper.cli.get('limit') || clickMaxNum;
var baseUrl = "http://iconosquare.com/tag/" + instagramTag + '/';
var downloaded = [];
var queued = [];
var pageResults = [];
var jsonArray = [];
var startTime = new Date();
var timeDiff = 0;
var page_time = 0;
var page_location = "";


var elements = "";
var elementsAlts = "";
var elementsTitles = "";
var elementsHrefs = "";

var downloadCounts = 0;

var clickMoreTimes = 0;
var sumTime = 0;
var sumDownLoadTime = 0;

var elemNum = 0;

var currentClickNum = 0;


var intervalId = 0;

function queue(url) {
	// casper.echo("MapURL: " + url);
	//queued.push(url.replace(/_s.jpg/, '_n.jpg'));
	return url.replace(/_s.jpg/, '_n.jpg');
}


function scrollAndclick() {
	// Checks for bottom div and scrolls down from time to time

	// casper.click('.more');



	// currentClickNum++;
	// casper.echo(currentClickNum + ' click!', 'INFO');



	// if (currentClickNum < clickMaxNum) {
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
				// this.echo('Click ' + clickMoreTimes + ' times');
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
		getContent()
	});


}

function getContent() {

	// elements = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid:only-child img', 'src');
	// elementsAlts = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid:only-child img', 'alt');
	// elementsTitles = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid', 'title');
	elementsHrefs = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid', 'href');
	// elemNum = elements.length;
	elemNum=elementsHrefs.length;
	for (var i = 0; i < elemNum; i++) {
		// var newUrl = queue(elements[i]);
		// pageResults.push([newUrl, elementsAlts[i], elementsTitles[i], elementsHrefs[i]]);
		// pageResults.push(newUrl);
		var newUrl=elementsHrefs[i];
		pageResults.push(newUrl);
	}
	casper.echo("processingpageResults:" + elemNum, 'INFO');
	processQueue();
}

function processQueue() {
	// casper.echo('pageResultsJSON: ' + JSON.stringify(pageResults));
	if (pageResults.length === 0) {
		casper.echo('No hrefs');
		return;
	}

	function openInstagramPage(value,index,array){
		casper.echo('Download #'+ index+' - '+value,'INFO');	
		casper.thenOpen(value,function(res){
			// casper.echo('open instagram page');
			// casper.echo('Download #' + (++downloadCounts) + ' – ' + response.url, 'INFO');
			casper.echo('pageContentResponse:'+JSON.stringify(res));
			// casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid', 'title');
			var latitude=casper.getElementsAttribute('.conteneurPhotoListGauche .PhotoListGauchePhoto .latitude', 'value');
			var longitute=casper.getElementsAttribute('.conteneurPhotoListGauche .PhotoListGauchePhoto .longitute', 'value');
			casper.echo('latitude:',latitude,'INFO');
			casper.echo('longitute:',longitute,'INFO');


		});	
	}
	
	pageResults.forEach(
		openInstagramPage
		);

};


casper.start(baseUrl, scrollAndclick);


// casper.then(function() {
// 	var fs = require('fs');

// 	var completeTime = new Date();
// 	var path = 'simple_json_tag_' + instagramTag + '_counts_' + downloadCounts + '_' + completeTime + '.txt'
// 	// casper.echo("JSONresults: " + JSON.stringify(jsonArray));
// 	var content = JSON.stringify(jsonArray);
// 	fs.write(path, content, 'w');
// 	casper.echo('Finally, write JSON to path file! Completed!!');
// 	// phantom.exit();
// })

// casper.then(function() {
// 	var fs = require('fs');

// 	var completeTime = new Date();
// 	var path = 'JSONs/Downloaded/simple_json_tag_' + instagramTag + '_counts_' + downloadCounts + '_' + completeTime + '.json'
// 		// casper.echo("JSONresults: " + JSON.stringify(jsonArray));
// 	var content = JSON.stringify(jsonArray);
// 	fs.write(path, content, 'w');
// 	casper.echo('Finally, write JSON to path file! Completed!!');
// 	// phantom.exit();
// })

casper.run();