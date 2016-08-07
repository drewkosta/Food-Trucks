// Create the Google Map…
// var data = require('data.json');
// var truckData;
// d3.request('/data')
//   .get({}, function (data) {
//     console.log(data);
//     truckData = data.response;
//     console.log(truckData);
//     initmap();
//   });

var map;
var initmap = function() {
  map = new google.maps.Map(d3.select("#map").node(), {
    zoom: 12,
    center: new google.maps.LatLng(37.76487, -122.41948),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  });
}
var reqData = {
  day: 'Friday'
}
// Load the station data. When the data comes back, create an overlay.
d3.request('/data').post(reqData, function(error, data) {
  console.log(data);
  if (error) throw error;
  var overlay = new google.maps.OverlayView();
  data = data.data;
  // Add the container when the overlay is added to the map.
  overlay.onAdd = function() {
    var layer = d3.select(this.getPanes().overlayLayer).append("div")
        .attr("class", "stations");

    // Draw each marker as a separate SVG element.
    // We could use a single SVG, but what size would it have?
    overlay.draw = function() {
      var projection = this.getProjection(),
          padding = 10;

      var marker = layer.selectAll("svg")
          .data(d3.entries(data))
          .each(transform) // update existing markers
        .enter().append("svg")
          .each(transform)
          .attr("class", "marker");

      // Add a circle.
      marker.append("circle")
          .attr("r", 4.5)
          .attr("cx", padding)
          .attr("cy", padding);

      // Add a label.
      marker.append("text")
          .attr("x", padding + 7)
          .attr("y", padding)
          .attr("dy", ".31em")
          .text(function(d) { return d.value[15]; });

      function transform(d) {
        d = new google.maps.LatLng(d.value[29], d.value[30]);
        d = projection.fromLatLngToDivPixel(d);
        return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px");
      }
    };
  };

  // Bind our overlay to the map…
  overlay.setMap(map);
});
