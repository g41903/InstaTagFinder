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

	elements = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid:only-child img', 'src');
	elementsAlts = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid:only-child img', 'alt');
	elementsTitles = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid', 'title');
	elementsHrefs = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid', 'href');
	elemNum = elements.length;
	for (var i = 0; i < elemNum; i++) {
		var newUrl = queue(elements[i]);
		pageResults.push([newUrl, elementsAlts[i], elementsTitles[i], elementsHrefs[i]]);
		// pageResults.push(newUrl);
	}
	casper.echo("processingpageResults:" + elemNum, 'INFO');
	processQueue();
}

function processQueue() {
	// casper.echo('pageResultsJSON: ' + JSON.stringify(pageResults));
	if (pageResults.length === 0) {
		return;
	}

	//Interate through every pageResults (instagram content array)
	casper.eachThen(pageResults, function(response) {
		// casper.echo('pageResults_resonse:' + JSON.stringify(response));

		var modified = new Date(response.headers.get("Last-Modified"));
		var pic_id = response.url.split("/").pop();
		var pic_date = [modified.getUTCFullYear(), modified.getUTCMonth() + 1, modified.getUTCDate()].join("-");
		var filePath = "SimpleSraper/" + pic_date + "/" + response.url.split("/").pop();
		var location = instagramTag;



		this.thenOpen(response.data[0], function(response) {
			// casper.echo("picUrlResponseJSON: " + JSON.stringify(response));

			casper.echo('Download #' + (++downloadCounts) + ' – ' + response.url, 'INFO');
			casper.download(
				response.url, filePath
			);
		});



		//JSON format example
		var jsonEx = {
			"img_id": "12552252_111555322559991_1132579006_n.jpg",
			"img_date": "2016-1-18",
			"img_url": "https://scontent.cdninstagram.com/hphotos-xtp1/t51.2885-15/s150x150/e35/12523772_483208711850519_437376415_n.jpg",
			"img_file_path": "/home/g41903/instagram-hashtag-gist/2016-1-19/12552252_111555322559991_1132579006_n.jpg",
			"img_tags": "#cohiba #cuba #cigar #barolo #smoking #taiwan #redwine #cigars #mrricco #cuban #botl #menslife #sotl #mensfashion #menstyle #taipei #wine",
			"img_title": "榕樹下 #Taiwan#Tainan#HKU#DCCI#travel",
			"page_url": "http://iconosquare.com/p/1165793648548442906_371962235",
			"img_location": "Andorra",
			"image_result": "Update the result of image recognition: {key: Object_name,value: Object_score}",
			"text_result": "Update the result of text processing",
			"created_time": "20160-01-19",
			"updated_time": "20160-01-20"
		}

		//Generate one JSON object
		var jsonRecord = {
			"img_id": pic_id,
			"img_date": pic_date,
			"img_url": response.data[0],
			"img_file_path": filePath,
			"img_tags": response.data[1],
			"img_title": response.data[2],
			"page_url": response.data[3],
			"img_location": location,
			"img_result": "",
			"text_result": "",
			"created_time": Date(),
			"updated_time": Date()
		}

		jsonArray.push(jsonRecord);
		console.log("DOWNLAOD TIME!!!");
		timeDiff = Math.abs(new Date() - startTime);
		sumDownLoadTime = sumDownLoadTime + timeDiff;
		casper.echo("TimeSlotTest: " + timeDiff);
		casper.echo("SumDownloadTime:" + sumDownLoadTime);
		startTime = new Date();



	});

};


casper.start(baseUrl, scrollAndclick);

casper.then(function() {
	var fs = require('fs');

	var completeTime = new Date();
	var path = 'simple_json_tag_' + instagramTag + '_counts_' + downloadCounts + '_' + completeTime + '.txt'
	// casper.echo("JSONresults: " + JSON.stringify(jsonArray));
	var content = JSON.stringify(jsonArray);
	fs.write(path, content, 'w');
	casper.echo('Finally, write JSON to path file! Completed!!');
	// phantom.exit();
})

casper.run();