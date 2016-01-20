//contentScraper.js



"use strict";

var casper = require('casper').create({
	verbose: true,
	logLevel: "debug",

	waitTimeout: 100000,
	pageSettings: {
		loadImages: false,
		loadPlugins: false
	},
	viewportSize: {
		height: 1000,
		width: 1024
	}
});

var instagramTag = casper.cli.get(0);
var threshold = casper.cli.get('limit') || 10;
var baseUrl = "http://iconosquare.com/tag/" + instagramTag + '/';
var downloaded = [];
var queued = [];
var pageResults = [];
var jsonArray = [];
var startTime = new Date();
var timeDiff = 0;
var page_time = 0;
var page_location = "";


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
	var count = 0;

	casper.eachThen(pageResults, function(response) {

		timeDiff = Math.abs(new Date() - startTime);
		casper.echo("TimeSlotTest: " + timeDiff);
		startTime = new Date();

		var modified = new Date(response.headers.get("Last-Modified"));
		var pic_id = response.url.split("/").pop();
		var pic_date = [modified.getUTCFullYear(), modified.getUTCMonth() + 1, modified.getUTCDate()].join("-");
		var filePath = ["Test1", modified.getUTCFullYear(), modified.getUTCMonth() + 1, modified.getUTCDate()].join("-") + "/" + response.url.split("/").pop();
		var location = "";
		//this.thenOpen(response.data[3], function(response) {
		this.thenOpen(response.data[3], function(response) {
			// casper.echo('OpenDetialPageTest: ' + JSON.stringify(response));
			// casper.echo("DateTest: " + this.getElementsAttribute('.conteneurPhotoListGauche .PhotoListGauchePhoto .bloc-footer .pic-created'));

			page_time = casper.fetchText('.conteneurPhotoListGauche .PhotoListGauchePhoto .bloc-footer .pic-created');
			casper.echo("Page_TimeTest: " + page_time);
			casper.echo("Pic_TimeTest: " + pic_date);

			// casper.echo("LocationTest: " + this.getElementsAttribute('.conteneurPhotoListGauche .PhotoListGauchePhoto .bloc-footer .pic-location'));
			page_location = casper.fetchText('.conteneurPhotoListGauche .PhotoListGauchePhoto .bloc-footer .pic-location');
			casper.echo("LocationTest: " + page_location);
			// casper.page.close();
			// casper.page = require('webpage').create();

			var k = 0;
			k++;
			if (k > 3) {
				phantom.exit();

			};

		});

		// casper.echo("ResponseObject: " + JSON.stringify(response));
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


		var jsonRecord = {
			"img_id": pic_id,
			"img_date": page_time,
			"img_url": response.data[0],
			"img_file_path": filePath,
			"img_tags": response.data[1],
			"img_title": response.data[2],
			"page_url": response.data[3],
			"img_location": page_location,
			"img_result": "",
			"text_result": "",
			"created_time": Date(),
			"updated_time": Date()
		}

		jsonArray.push(jsonRecord);
		casper.echo("JSONrecord: " + JSON.stringify(jsonRecord));
		casper.echo('Download #' + (++count) + ' – ' + response.data[0], 'INFO');
		casper.echo('Myfilepath: ' + filePath);
		casper.download(
			response.data[0], filePath
		);

		// this.thenOpen(response.data[0], function(response) {

		// 	casper.download(
		// 		response.url, filePath
		// 	);



		// });



		/***
				// var pageDetail = response;
				this.thenOpen(response.data[0], function(response) {
					//casper.echo("ResponseObject02: " + JSON.stringify(response));


					var position = queued.indexOf(response.url);
					casper.echo('Download #' + (++count) + ' – ' + response.url, 'INFO');
					var j = 0

					// casper.echo("PageDetail: " + JSON.stringify(pageDetail));
					// casper.echo("PageTime: " + JSON.stringify(modified));

					casper.download(
						response.url, filePath
					);
					j = j + 1;
					// Stacking in downloaded 
					// and removing the url from the queued array 
					downloaded.push(response.url);
					//queued = queued.slice(0, position).concat(queued.slice(position + 1));
				});
		***/

	});



}

function clickAndLoad() {
	casper.click('.more');

	casper.waitWhileVisible('#conteneurLoaderEnCours', function() {});

	casper.then(function() {
		// var elements = casper.getElementsAttribute('.photos-wrapper .lienPhotoGrid:only-child img', 'src'); 
		// var elementsTest = casper.getElementsAttribute('.photos-wrapper .pseudo').text();
		// var elementsTest2=casper.fetchText('.photos-wrapper .pseudo a');
		// casper.echo('TestSelector: ' + elementsTest2);
		// phantom.exit();

		var elements = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid:only-child img', 'src');
		var elementsAlts = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid:only-child img', 'alt');
		var elementsTitles = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid', 'title');
		var elementsHrefs = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid', 'href');
		for (var i = 0; i < elements.length; i++) {
			casper.log('elementsLength: ' + elements[i], 'debug');
			casper.echo('altLength: ' + elementsAlts[i]);
			casper.echo('titleLength: ' + elementsTitles[i]);
			casper.echo('hrefLength: ' + elementsHrefs[i]);
		};



		//getPageDetail(elementsHref);
		// casper.echo('tagAlts: '+elementsAlts);
		// casper.echo('tagAlts01: '+elementsAlts[0]);
		// casper.echo('tagTitles: '+elementsTitles);
		// casper.echo('tagTitles01: '+elementsTitles[0]);

		//casper.echo("Ernie! These are tags alt: "+elementsAlt);
		//casper.echo("Handsome guy! here are titles: " +elementsTitle);


		// var tagTime = casper.getElementsAttribute('')

		console.log("Found " + elements.length + " pictures…");

		if (elements.length < threshold) {
			casper.waitForSelector(".more", clickAndLoad, function() {
				//elements.map(queue);
				//elements.map()

				for (var i = 0; i < elements.length; i++) {
					var newUrl = queue(elements[i]);
					pageResults.push([newUrl, elementsAlts[i], elementsTitles[i], elementsHrefs[i]]);
				}

				// casper.echo('PageResults: ' + pageResults);
				// casper.echo('PageResults01: ' + pageResults[0]);
				processQueue();
			});
		} else {
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


function getPageDetail(allUrls) {
	casper.echo('Here fristUrl:' + allUrls);
	var strUrl = JSON.stringify(allUrls);
	var strArray = JSON.parse(strUrl);
	casper.echo('showurl: ' +
		strArray);
	// var urlArray = strUrl.split(",");


	// casper.echo('Here splitUrl:'+urlArray);

	for (var i = 0; i < strArray.length; i++) {
		casper.echo('showarray0: ' +
			strArray[i]);

		casper.open(strArray[i], function() {
			casper.echo("UrlArray" + strArray[i]);
			casper.echo('urlResponse' + JSON.stringify(response));
			//require('utils').dump(this.getElementsAttribute('div[title="Google"]', 'title')); // "['Google']"
			casper.echo("These are dates: " + this.getElementsAttribute('.conteneurPhotoListGauche .PhotoListGauchePhoto .bloc-footer .pic-created', 'class'));
		});
		casper.page.close();
	}


}

casper.start(baseUrl, clickAndLoad);

casper.then(function() {
	var fs = require('fs');
	var path = 'json_output_new.txt';
	// casper.echo("JSONresults: " + JSON.stringify(jsonArray));
	var content = JSON.stringify(jsonArray);
	// casper.echo("JSONresult: " + JSON.stringify(jsonArray));
	fs.write(path, content, 'w');
	// phantom.exit();
})

casper.run();