// geoScraper.js


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

if (!instagramTag) {
	casper.echo('Requiring at least a valid Instagram hashtag to query.').exit();
}


function queue(url) {
	casper.echo("MapURL: " + url);
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
		casper.echo("PageResultsTest: " + pageResults);
		casper.echo("ResponseObject: " + JSON.stringify(response));

		var pageDetail = response;
		this.thenOpen(response.data[0], function(response) {
			casper.echo("ResponseObject02: " + JSON.stringify(response));
			var modified = new Date(response.headers.get("Last-Modified"));
			
			var jsonFile=
			
			var position = queued.indexOf(response.url);
			casper.echo('Download #' + (++count) + ' – ' + response.url, 'INFO');
			var j = 0

			casper.echo("PageDetail: " + JSON.stringify(pageDetail));
			casper.echo("PageTime: " + JSON.stringify(modified));
			var filePath = ["Ernie", modified.getUTCFullYear(), modified.getUTCMonth() + 1, modified.getUTCDate()].join("-") + "/" + response.url.split("/").pop();
			casper.download(
				response.url, filePath
			);
			j = j + 1;
			// Stacking in downloaded 
			// and removing the url from the queued array 
			downloaded.push(response.url);
			//queued = queued.slice(0, position).concat(queued.slice(position + 1));
		});
	});
}

function clickAndLoad() {
	casper.click('.more');

	casper.waitWhileVisible('#conteneurLoaderEnCours', function() {});

	casper.then(function() {
		// var elements = casper.getElementsAttribute('.photos-wrapper .lienPhotoGrid:only-child img', 'src'); 

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
		var fs = require('fs');

		var path = 'output.txt';
		var content = 'Hello World!';





		fs.write(path, content, 'w');

		phantom.exit();


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
				// processQueue();
			});
		} else {
			for (var i = 0; i < elements.length; i++) {
				var newUrl = queue(elements[i]);
				pageResults.push([newUrl, elementsAlts[i], elementsTitles[i], elementsHrefs[i]]);
			}

			// casper.echo('PageResults: ' + pageResults);
			// casper.echo('PageResults01: ' + pageResults[0]);
			// elements.map(queue);
			// processQueue();

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

casper.run();