
//global variables 
var map;
var markers ={"Andorra La Vella": new google.maps.LatLng(42.51,1.52), "Escaldes-Engordany": new google.maps.LatLng(42.5167,1.55),"Encamp": new google.maps.LatLng(42.5361,1.5828),"Sant Julià de Lòria": new google.maps.LatLng(42.465,1.4911),"La Massana": new google.maps.LatLng(42.5444,1.5144),"Santa Coloma": new google.maps.LatLng(42.4939,1.4977),"Ordino": new google.maps.LatLng(42.555,1.5331), "El Pas de la Casa": new google.maps.LatLng(42.5423,1.7338),"Canillo": new google.maps.LatLng(42.5667,1.6),"Arinsal": new google.maps.LatLng(42.5766,1.4833)};
var infowindow; 

var words= ["mountains","ski","shop","eat","people","snow","cold","food","clothes","magic","mounds of snow","delicious"];

// var styles=[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];
var styles="MapStyle_subtle_grayscale.json"

var mcircle1f = {
			path: 'M0,0m-2,0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0',
			fillColor: 'yellow',
			fillOpacity: 1,scale: 2,

            strokeWeight: 0
		};

var image='Ernie.jpg';
var pie_chart_nested='popup_pie_chart_nesting.txt'
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
$(document).ready(function(){
function initialize() 
{
  var latlng = new google.maps.LatLng(42.51, 1.593);
  var mapOptions =  {
    zoom: 12,
    styles: styles,
    center: latlng
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  infowindow = new google.maps.InfoWindow();
  addMarkers();
  fetchWordData();
}

function addMarkers() 
{
    for(marker in markers){
        addMarker(marker, markers[marker]);
    }
}
function fetchWordData() {
   // TODO: read in the list of words and their counts associated with the word
   
    $( "#autocomplete" ).autocomplete({
      source: words,
      minLength: 2,
     select: function( event, ui ) {searchTerm(ui.item.label)}
    });
    $("#autocomplete").keyup(function (e) {
    if (e.keyCode == 13) {
        val = $( "#autocomplete" ).val();
        searchTerm(val);
    }
});
}

function searchTerm(term){
    alert("I AM SEARCHING FOR: " +term);
    // TODO: Search the term in the list and change the map display
}
function addMarker(place,myLatLng) 
{
	  var marker = new google.maps.Marker(
      {
        // draggable: true,
        // animation: google.maps.Animation.DROP,
        position: myLatLng,
		    title:place,
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
    // alert(pie_chart_nested);
    infowindow.setContent(pie_chart_nested);


    infowindow.open(map, this);
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


// var popup_pie_chart_nesting_js=$.getScript("popup_pie_chart_nesting.js", function(){

//    alert("Script loaded but not necessarily executed.");


// });
// var pie_html=  <% include popup_pie_chart_nesting%>