//contentScraper.js



"use strict";

var casper = require('casper').create({
	// verbose: true,
	// logLevel: "debug",

	waitTimeout: 100000,
	pageSettings: {
		loadImages: false,
		loadPlugins: false,
		javascript:false
	},
	viewportSize: {
		height: 1000,
		width: 1024
	}
});

var instagramTag = casper.cli.get(0);
var maxDownloadPageIndex = casper.cli.get(1)
var threshold = casper.cli.get('limit') || maxDownloadPageIndex;
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
if (!instagramTag) {
	casper.echo('Requiring at least a valid Instagram hashtag to query.').exit();
}


function queue(url) {
	// casper.echo("MapURL: " + url);
	//queued.push(url.replace(/_s.jpg/, '_n.jpg'));
	return url.replace(/_s.jpg/, '_n.jpg');
}

function processQueue() {
	if (pageResults.length === 0) {
		return;
	};

	console.log("DOWNLAOD TIME!!!");


	//Interate through every pageResults (instagram content array)
	casper.eachThen(pageResults, function(response) {

		timeDiff = Math.abs(new Date() - startTime);
		sumDownLoadTime = sumDownLoadTime + timeDiff;
		casper.echo("TimeSlotTest: " + timeDiff);
		casper.echo("SumDownloadTime:" + sumDownLoadTime);
		startTime = new Date();

		var modified = new Date(response.headers.get("Last-Modified"));
		// casper.echo("GetLastModified: "+modified);
		var pic_id = response.url.split("/").pop();
		var pic_date = [modified.getUTCFullYear(), modified.getUTCMonth() + 1, modified.getUTCDate()].join("-");
		var filePath = "SimpleSraper/" + pic_date + "/" + response.url.split("/").pop();
		var location = instagramTag;


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


		// var pageDetail = response;
		this.thenOpen(response.data[0], function(response) {
			//casper.echo("ResponseObject02: " + JSON.stringify(response));

			var position = queued.indexOf(response.url);
			casper.echo('Download #' + (++downloadCounts) + ' – ' + response.url, 'INFO');
			casper.download(
				response.url, filePath
			);
			// Stacking in downloaded 
			// and removing the url from the queued array 
			downloaded.push(response.url);
			queued = queued.slice(0, position).concat(queued.slice(position + 1));
		});

	});

}

function clickAndLoad() {
	// if (!casper.exists('.more')) {
	// 	casper.echo("If no 'more' button...");
	// 	clickMoreTimes = threshold + 1;
	// } else {
	// 	casper.click('.more');
	// }
	casper.click('.more');
	casper.waitWhileVisible('#conteneurLoaderEnCours', function() {});

	casper.then(function() {

		timeDiff = Math.abs(new Date() - startTime);
		sumTime = sumTime + timeDiff;
		casper.echo("TimeSlotTest: " + timeDiff);
		casper.echo("SumTime: " + sumTime);
		startTime = new Date();

		// console.log("Found " + elements.length + " pictures…");
		clickMoreTimes++;
		console.log("Click next page " + clickMoreTimes + " times");


		if (clickMoreTimes < threshold) {
			casper.waitForSelector(".more", clickAndLoad, function() {
				//elements.map(queue);
				//elements.map()
				casper.echo("I'm here");
				// for (var i = 0; i < elements.length; i++) {
				// 	var newUrl = queue(elements[i]);
				// 	pageResults.push([newUrl, elementsAlts[i], elementsTitles[i], elementsHrefs[i]]);
				// }

				// casper.echo('PageResults: ' + pageResults);
				// casper.echo('PageResults01: ' + pageResults[0]);
				processQueue();
			});
		} else {
			elements = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid:only-child img', 'src');
			elementsAlts = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid:only-child img', 'alt');
			elementsTitles = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid', 'title');
			elementsHrefs = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid', 'href');

			for (var i = 0; i < elements.length; i++) {
				var newUrl = queue(elements[i]);
				pageResults.push([newUrl, elementsAlts[i], elementsTitles[i], elementsHrefs[i]]);
			}

			// casper.echo('PageResults: ' + pageResults);
			// casper.echo('PageResults01: ' + pageResults[0]);
			// elements.map(queue);
			processQueue();

		}
	});
}



casper.start(baseUrl, clickAndLoad);

casper.then(function() {
	var fs = require('fs');

	var completeTime = new Date();
	var path = 'simple_json_tag_' + instagramTag + '_counts_' + downloadCounts + '_' + completeTime + '.txt'
		// casper.echo("JSONresults: " + JSON.stringify(jsonArray));
	var content = JSON.stringify(jsonArray);
	// casper.echo("JSONresult: " + JSON.stringify(jsonArray));
	fs.write(path, content, 'w');
	// phantom.exit();
})

