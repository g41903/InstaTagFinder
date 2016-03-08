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

var page_url=0;
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
var elementsHrefs=0;


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
	elementsHrefs = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid', 'href');
	// elemNum = elements.length;
	elemNum=elementsHrefs.length;
	for (var i = 0; i < elemNum; i++) {
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
		page_url=value;	
		casper.thenOpen(page_url,function(res){
			// casper.echo('open instagram page');
			// casper.echo('Download #' + (++downloadCounts) + ' – ' + response.url, 'INFO');
			downloadCounts++;
			casper.echo('pageContentResponse:'+JSON.stringify(res));
			// casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid', 'title');

			var page_owner=casper.fetchText('.list-username-user','class');
			var img_url=casper.getElementsAttribute('.photo-mode-liste','src');
			var img_latitude=casper.getElementsAttribute('.conteneurPhotoListGauche .PhotoListGauchePhoto .latitude', 'value');
			var img_longitude=casper.getElementsAttribute('.conteneurPhotoListGauche .PhotoListGauchePhoto .longitude', 'value');
			// 1.10 pm 3/8/2016
			var img_date=casper.fetchText('.pic-created','class');
			var img_tags=casper.fetchText('.htCaption','class');
			var detail_tags=casper.fetchText('.unTag','class');


			// schema

		// 	var jsonRecord={"img_date": "2.56 pm 3/8/2016", 
		// 	"img_url": ["https://scontent.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/12751595_1074805932563334_2018748999_n.jpg?ig_cache_key=MTIwMTY0MjU0MDA0OTA3ODA1OQ%3D%3D.2.l"], 
		// 	"img_tags": "#friends#andorra#hotelcosmos", 
		// 	"detail_tags": "andorrafriendshotelcosmos", 
		// 	"page_url": "/p/1201569514467056575_46559053", 
		// 	"img_latitude": ["42.534824182"], 
		// 	"img_longitude": ["1.587413623"], 
		// 	"img_result": "", 
		// 	"text_result": "", 
		// 	"created_time": "Tue Mar 08 2016 15:07:42 GMT-0500 (EST)", 
		// 	"updated_time": "Tue Mar 08 2016 15:07:42 GMT-0500 (EST)" 
		// },


		var jsonRecord = {
				// "img_id": pic_id,
				"img_date": img_date,
				"img_url":img_url,
				// "img_file_path": filePath,
				"img_tags": img_tags,
				"detail_tags":detail_tags,
				// "img_title": response.data[2],
				"page_url": page_url,
				// "img_location": location,
				"img_latitude":img_latitude,
				"img_longitude":img_longitude,
				"img_result": "",
				"text_result": "",
				"created_time": Date(),
				"updated_time": Date()
			}



			casper.echo('latitude: '+img_latitude,'INFO');
			casper.echo('longitude: '+img_longitude,'INFO');
			casper.echo('date: '+img_date,'INFO');
			casper.echo('tags: '+img_tags,'INFO');

			jsonArray.push(jsonRecord);


			// console.log("DOWNLAOD TIME!!!");
			timeDiff = Math.abs(new Date() - startTime);
			sumDownLoadTime = sumDownLoadTime + timeDiff;
			casper.echo("TimeSlotTest: " + timeDiff);
			casper.echo("SumDownloadTime:" + sumDownLoadTime);
			startTime = new Date();



		});	
}

pageResults.forEach(
	openInstagramPage
	);
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
});

// casper.then(function() {
// 	var fs = require('fs');

// 	var completeTime = new Date();
// 	var path = 'JSONs/Downloaded/simple_json_tag_' + instagramTag + '_counts_' + downloadCounts + '_' + completeTime + '.json'
// 		// casper.echo("JSONresults: " + JSON.stringify(jsonArray));
// 		var content = JSON.stringify(jsonArray);
// 		fs.write(path, content, 'w');
// 		casper.echo('Finally, write JSON to path file! Completed!!');
// 	// phantom.exit();
// })

casper.run();