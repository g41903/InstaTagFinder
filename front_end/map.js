//global variables 
var map;
var markers = {
  "Andorra La Vella": new google.maps.LatLng(42.51, 1.52),
  "Escaldes-Engordany": new google.maps.LatLng(42.5167, 1.55),
  "Encamp": new google.maps.LatLng(42.5361, 1.5828),
  "Sant Julià de Lòria": new google.maps.LatLng(42.465, 1.4911),
  "La Massana": new google.maps.LatLng(42.5444, 1.5144),
  "Santa Coloma": new google.maps.LatLng(42.4939, 1.4977),
  "Ordino": new google.maps.LatLng(42.555, 1.5331),
  "El Pas de la Casa": new google.maps.LatLng(42.5423, 1.7338),
  "Canillo": new google.maps.LatLng(42.5667, 1.6),
  "Arinsal": new google.maps.LatLng(42.5766, 1.4833)
};
var infowindow;


var words = ["mountains", "ski", "shop", "eat", "people", "snow", "cold", "food", "clothes", "magic", "mounds of snow", "delicious"];

// var styles=[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];
var styles = "MapStyle_subtle_grayscale.json";

var encamp_json='simple_json_tag_encamp_counts_187_Sun Jan 24 2016 08:56:22 GMT-0500 (EST).json'

// var test_json=JSON.parse(encamp_json);
// alert(test_json[1]);

var mcircle1f = {
  path: 'M0,0m-2,0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0',
  fillColor: 'yellow',
  fillOpacity: 1,
  scale: 2,

  strokeWeight: 0
};

var image = 'Ernie.jpg';
var pie_chart_nested = 'popup_pie_chart_nesting.txt'
  // var pie_chart_nested=new EJS({ 
  //     url: "maps.html"
  // }).update('popup_pie_chart_nesting.html', {
  //     "foobar": "Suprise"
  // });

// var pie_chart_nested='/popup_pie_chart_nesting.html';

// var pie_chart_nested=$.getScript("popup_pie_chart_nesting.js", function(){

//    alert("Script loaded but not necessarily executed.");

// });



$(function() {

});
$(document).ready(function() {
      function initialize() {
        var latlng = new google.maps.LatLng(42.51, 1.593);
        var mapOptions = {
          zoom: 12,
          styles: styles,
          center: latlng
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        infowindow = new google.maps.InfoWindow({
          // content:'<div id="info1">'+'I\'m Ernie'+'</div>'
          content:'<body></body>'
        });
        addMarkers();
        fetchWordData();
      }

      function addMarkers() {
        for (marker in markers) {
          addMarker(marker, markers[marker]);
        }
      }

      function fetchWordData() {
        // TODO: read in the list of words and their counts associated with the word

        $("#autocomplete").autocomplete({
          source: words,
          minLength: 2,
          select: function(event, ui) {
            searchTerm(ui.item.label)
          }
        });
        $("#autocomplete").keyup(function(e) {
          if (e.keyCode == 13) {
            val = $("#autocomplete").val();
            searchTerm(val);
          }
        });
      }

      function searchTerm(term) {
        alert("I AM SEARCHING FOR: " + term);
        // TODO: Search the term in the list and change the map display
      }

      function addMarker(place, myLatLng) {
        var marker = new google.maps.Marker({
          // draggable: true,
          // animation: google.maps.Animation.DROP,
          position: myLatLng,
          title: place,
          map: map
        });
        // marker.addListener('click', toggleBounce);
        // marker.setIcon(mcircle1f);
        //image can not change size when map zoom in or out
        // marker.setIcon(image);

        // This can be changed from 'click' to 'hover' if desired
        google.maps.event.addListener(marker, 'click', function() {
            // TODO: Add more information about each location in the popup window
            // infowindow.setContent("<h3>"+place+"I love you"+"</h3>");
            // alert(pie_chart_text1);
              
            // infowindow.setContent('<div id="info1">'+'I\'m Ernie'+'</div>');
            
// Load the flight data asynchronously.
d3.csv("flights.csv", function(flights) {

  // Define the margin, radius, and color scale. Colors are assigned lazily, so
  // if you want deterministic behavior, define a domain for the color scale.
  var m = 10,
      r = 100,
      z = d3.scale.category20c();

  // Define a pie layout: the pie angle encodes the count of flights. Since our
  // data is stored in CSV, the counts are strings which we coerce to numbers.
  var pie = d3.layout.pie()
      .value(function(d) { return +d.count; })
      .sort(function(a, b) { return b.count - a.count; });

  // Define an arc generator. Note the radius is specified here, not the layout.
  var arc = d3.svg.arc()
      .innerRadius(r / 2)
      .outerRadius(r);

  // Nest the flight data by originating airport. Our data has the counts per
  // airport and carrier, but we want to group counts by aiport.
  var airports = d3.nest()
      .key(function(d) { return d.origin; })
      .entries(flights);

  // Insert an svg element (with margin) for each airport in our dataset. A
  // child g element translates the origin to the pie center.
  var svg = d3.select("body").selectAll("div")
      .data(airports)
    .enter().append("div") // http://code.google.com/p/chromium/issues/detail?id=98951
      .style("display", "inline-block")
      .style("width", (r + m) * 2 + "px")
      .style("height", (r + m) * 2 + "px")
    .append("svg:svg")
      .attr("width", (r + m) * 2)
      .attr("height", (r + m) * 2)
    .append("svg:g")
      .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

  // Add a label for the airport. The `key` comes from the nest operator.
  svg.append("svg:text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.key; });

  // Pass the nested per-airport values to the pie layout. The layout computes
  // the angles for each arc. Another g element will hold the arc and its label.
  var g = svg.selectAll("g")
      .data(function(d) { return pie(d.values); })
    .enter().append("svg:g");

  // Add a colored arc path, with a mouseover title showing the count.
  g.append("svg:path")
      .attr("d", arc)
      .style("fill", function(d) { return z(d.data.carrier); })
    .append("svg:title")
      .text(function(d) { return d.data.carrier + ": " + d.data.count; });

  // Add a label to the larger arcs, translated to the arc centroid and rotated.
  g.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
      .text(function(d) { return d.data.carrier; });

  // Computes the label angle of an arc, converting from radians to degrees.
  function angle(d) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
    return a > 90 ? a - 180 : a;
  }
});


              // alert(pie_chart_text2);
              infowindow.setContent(pie_chart_text2);


              infowindow.open(map, marker,pie_chart_text2);
            });


        }
        // function toggleBounce() {
        //   if (marker.getAnimation() !== null) {
        //     marker.setAnimation(null);
        //   } else {
        //     marker.setAnimation(google.maps.Animation.BOUNCE);
        //   }};
        google.maps.event.addDomListener(window, 'load', initialize);
      });



    // var pie_chart_json=$.getJSON('popup_pie_chart_nesting.txt');
    // var pie_chart_text=JSON.stringify(pie_chart_json);
    // var popup_pie_chart_nesting_js=$.getScript("popup_pie_chart_nesting.js", function(){

    // function read(textFile){
    //     var xhr=new XMLHttpRequest;
    //     xhr.open('GET',textFile);
    //     xhr.onload=show;
    //     xhr.send()
    // }

    // function show(){
    //     var pre=document.createElement('pre');
    //     pre.textContent=this.response;
    //     document.body.appendChild(pre)
    // }

    // var pie_chart_text=read('popup_pie_chart_nesting.txt');

    var pie_chart_text = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the '+
      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
      'south west of the nearest large town, Alice Springs; 450&#160;km '+
      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
      'Aboriginal people of the area. It has many springs, waterholes, '+
      'rock caves and ancient paintings. Uluru is listed as a World '+
      'Heritage Site.</p>'+
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';


    // function populatePre(url) {
    //   var xhr = new XMLHttpRequest();
    //   xhr.onload = function() {
    //     pie_chart_text = this.responseText;
    //     // alert(pie_chart_text);
    //   };
    //   xhr.open('GET', url);
    //   xhr.send();
    // }
    // populatePre('popup_pie_chart_nesting.txt');


    //    alert("Script loaded but not necessarily executed.");


    // });
    // var pie_html=  <% include popup_pie_chart_nesting%>
var pie_chart_text1='<html><head><meta name="generator" content="HTML Tidy for Linux (vers 6 November 2007), see www.w3.org"><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>Pie Multiples with Nesting</title><script type="text/javascript" src="http://mbostock.github.com/d3/d3.js?2.4.5"></script><script type="text/javascript" src="http://mbostock.github.com/d3/d3.csv.js?2.4.5"></script><script type="text/javascript" src="http://mbostock.github.com/d3/d3.layout.js?2.4.5"></script><style type="text/css">body { text-align: center;}svg { font: 10px sans-serif;}</style></head><body><script type="text/javascript">// Load the flight data asynchronously.d3.csv("flights.csv", function(flights) { // Define the margin, radius, and color scale. Colors are assigned lazily, so // if you want deterministic behavior, define a domain for the color scale. var m = 10, r = 100, z = d3.scale.category20c(); // Define a pie layout: the pie angle encodes the count of flights. Since our // data is stored in CSV, the counts are strings which we coerce to numbers. var pie = d3.layout.pie() .value(function(d) { return +d.count; }) .sort(function(a, b) { return b.count - a.count; }); // Define an arc generator. Note the radius is specified here, not the layout. var arc = d3.svg.arc() .innerRadius(r / 2) .outerRadius(r); // Nest the flight data by originating airport. Our data has the counts per // airport and carrier, but we want to group counts by aiport. var airports = d3.nest() .key(function(d) { return d.origin; }) .entries(flights); // Insert an svg element (with margin) for each airport in our dataset. A // child g element translates the origin to the pie center. var svg = d3.select("body").selectAll("div") .data(airports) .enter().append("div") // http://code.google.com/p/chromium/issues/detail?id=98951 .style("display", "inline-block") .style("width", (r + m) * 2 + "px") .style("height", (r + m) * 2 + "px") .append("svg:svg") .attr("width", (r + m) * 2) .attr("height", (r + m) * 2) .append("svg:g") .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")"); // Add a label for the airport. The `key` comes from the nest operator. svg.append("svg:text") .attr("dy", ".35em") .attr("text-anchor", "middle") .text(function(d) { return d.key; }); // Pass the nested per-airport values to the pie layout. The layout computes // the angles for each arc. Another g element will hold the arc and its label. var g = svg.selectAll("g") .data(function(d) { return pie(d.values); }) .enter().append("svg:g"); // Add a colored arc path, with a mouseover title showing the count. g.append("svg:path") .attr("d", arc) .style("fill", function(d) { return z(d.data.carrier); }) .append("svg:title") .text(function(d) { return d.data.carrier + ": " + d.data.count; }); // Add a label to the larger arcs, translated to the arc centroid and rotated. g.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text") .attr("dy", ".35em") .attr("text-anchor", "middle") .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; }) .text(function(d) { return d.data.carrier; }); // Computes the label angle of an arc, converting from radians to degrees. function angle(d) { var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90; return a > 90 ? a - 180 : a; }});</script></body></html>'
var pie_chart_text2='<body><script type="text/javascript">// Load the flight data asynchronously.d3.csv("flights.csv", function(flights) { // Define the margin, radius, and color scale. Colors are assigned lazily, so // if you want deterministic behavior, define a domain for the color scale. var m = 10, r = 100, z = d3.scale.category20c(); // Define a pie layout: the pie angle encodes the count of flights. Since our // data is stored in CSV, the counts are strings which we coerce to numbers. var pie = d3.layout.pie() .value(function(d) { return +d.count; }) .sort(function(a, b) { return b.count - a.count; }); // Define an arc generator. Note the radius is specified here, not the layout. var arc = d3.svg.arc() .innerRadius(r / 2) .outerRadius(r); // Nest the flight data by originating airport. Our data has the counts per // airport and carrier, but we want to group counts by aiport. var airports = d3.nest() .key(function(d) { return d.origin; }) .entries(flights); // Insert an svg element (with margin) for each airport in our dataset. A // child g element translates the origin to the pie center. var svg = d3.select("body").selectAll("div") .data(airports) .enter().append("div") // http://code.google.com/p/chromium/issues/detail?id=98951 .style("display", "inline-block") .style("width", (r + m) * 2 + "px") .style("height", (r + m) * 2 + "px") .append("svg:svg") .attr("width", (r + m) * 2) .attr("height", (r + m) * 2) .append("svg:g") .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")"); // Add a label for the airport. The `key` comes from the nest operator. svg.append("svg:text") .attr("dy", ".35em") .attr("text-anchor", "middle") .text(function(d) { return d.key; }); // Pass the nested per-airport values to the pie layout. The layout computes // the angles for each arc. Another g element will hold the arc and its label. var g = svg.selectAll("g") .data(function(d) { return pie(d.values); }) .enter().append("svg:g"); // Add a colored arc path, with a mouseover title showing the count. g.append("svg:path") .attr("d", arc) .style("fill", function(d) { return z(d.data.carrier); }) .append("svg:title") .text(function(d) { return d.data.carrier + ": " + d.data.count; }); // Add a label to the larger arcs, translated to the arc centroid and rotated. g.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text") .attr("dy", ".35em") .attr("text-anchor", "middle") .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; }) .text(function(d) { return d.data.carrier; }); // Computes the label angle of an arc, converting from radians to degrees. function angle(d) { var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90; return a > 90 ? a - 180 : a; }});</script></body>'
var pie_chart_text3='// Load the flight data asynchronously.d3.csv("flights.csv", function(flights) { // Define the margin, radius, and color scale. Colors are assigned lazily, so // if you want deterministic behavior, define a domain for the color scale. var m = 10, r = 100, z = d3.scale.category20c(); // Define a pie layout: the pie angle encodes the count of flights. Since our // data is stored in CSV, the counts are strings which we coerce to numbers. var pie = d3.layout.pie() .value(function(d) { return +d.count; }) .sort(function(a, b) { return b.count - a.count; }); // Define an arc generator. Note the radius is specified here, not the layout. var arc = d3.svg.arc() .innerRadius(r / 2) .outerRadius(r); // Nest the flight data by originating airport. Our data has the counts per // airport and carrier, but we want to group counts by aiport. var airports = d3.nest() .key(function(d) { return d.origin; }) .entries(flights); // Insert an svg element (with margin) for each airport in our dataset. A // child g element translates the origin to the pie center. var svg = d3.select("body").selectAll("div") .data(airports) .enter().append("div") // http://code.google.com/p/chromium/issues/detail?id=98951 .style("display", "inline-block") .style("width", (r + m) * 2 + "px") .style("height", (r + m) * 2 + "px") .append("svg:svg") .attr("width", (r + m) * 2) .attr("height", (r + m) * 2) .append("svg:g") .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")"); // Add a label for the airport. The `key` comes from the nest operator. svg.append("svg:text") .attr("dy", ".35em") .attr("text-anchor", "middle") .text(function(d) { return d.key; }); // Pass the nested per-airport values to the pie layout. The layout computes // the angles for each arc. Another g element will hold the arc and its label. var g = svg.selectAll("g") .data(function(d) { return pie(d.values); }) .enter().append("svg:g"); // Add a colored arc path, with a mouseover title showing the count. g.append("svg:path") .attr("d", arc) .style("fill", function(d) { return z(d.data.carrier); }) .append("svg:title") .text(function(d) { return d.data.carrier + ": " + d.data.count; }); // Add a label to the larger arcs, translated to the arc centroid and rotated. g.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text") .attr("dy", ".35em") .attr("text-anchor", "middle") .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; }) .text(function(d) { return d.data.carrier; }); // Computes the label angle of an arc, converting from radians to degrees. function angle(d) { var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90; return a > 90 ? a - 180 : a; }});'
