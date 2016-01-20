 

"use strict"; 
 
var casper = require('casper').create({ 
  verbose: true, 
  logLevel: "debug", 
 
  waitTimeout: 100000, 
  pageSettings: { 
    loadImages:  false, 
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
 
if (!instagramTag){ 
  casper.echo('Requiring at least a valid Instagram hashtag to query.').exit(); 
} 
 
 
function queue(url){ 
  queued.push(url.replace(/_s.jpg/, '_n.jpg')); 
} 
 
function processQueue(){ 
  if (queued.length === 0){ 
    return; 
  } 
 
  console.log("DOWNLAOD TIME!!!"); 
  var count = 0; 
 
  casper.eachThen(queued, function(response){ 
    this.thenOpen(response.data, function(response) { 
      var modified = new Date(response.headers.get("Last-Modified")); 
      var position = queued.indexOf(response.url); 
   
      casper.echo('Download #' + (++count) + ' – '+response.url, 'INFO'); 
      casper.download( 
        response.url, 
       [modified.getUTCFullYear(), modified.getUTCMonth()+1, modified.getUTCDate()].join("-") + "/" + response.url.split("/").pop( ) 
      ); 
 
      // Stacking in downloaded 
      // and removing the url from the queued array 
      downloaded.push(response.url); 
      queued = queued.slice(0, position).concat(queued.slice(position + 1)); 
    }); 
  }); 
} 
 
function clickAndLoad(){ 
  casper.click('.more'); 
 
  casper.waitWhileVisible('#conteneurLoaderEnCours', function(){}); 
 
  casper.then(function(){ 
    // var elements = casper.getElementsAttribute('.photos-wrapper .lienPhotoGrid:only-child img', 'src'); 
    var elements = casper.getElementsAttribute('.photos-wrapper .image-wrapper .lienPhotoGrid:only-child img', 'src'); 
    console.log("Found " + elements.length + " pictures…"); 
 
    if (elements.length < threshold){ 
      casper.waitForSelector(".more", clickAndLoad, function(){ 
        elements.map(queue); 
        processQueue(); 
      }); 
    }
    else{ 
      elements.map(queue); 
      processQueue(); 
    } 
  }); 
} 
 
casper.start(baseUrl, clickAndLoad); 
 
casper.run(); 
