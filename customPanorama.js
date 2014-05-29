var panorama;

function initialize() {
	
	// Set up Street View and initially set it visible. Register the
	// custom panorama provider function. Set the streetview to display
	// the custom panorama 'reception' which we check for below.
	var panoOptions = {
		pano : 'reception',
		visible : true,
		panoProvider : getCustomPanorama
	}

	panorama = new google.maps.StreetViewPanorama(
		document.getElementById('map_canvas'), panoOptions);
}

// Return a pano image given the panoID
function getCustomPanoramaTileUrl(pano, zoom, tileX, tileY) {

	// Note: robust custom panorama methods would require tiled pano data.
	// Here we're just using a single tile, set to the tile size and equal
	// to the pano "world" size.
	return 'img/14/01__.jpg';
}

// Construct the appropriate StreetViewPanoramaData given
// the passed pano IDs.
function getCustomPanorama(pano, zoom, tileX, tileY) {

	switch(pano) {

		case 'reception' :
			return {
				location : {
					pano : 'reception',
					description : "Google Sydney - Reception",
					latLng : new google.maps.LatLng(31.2818300, 121.6118578)
				},
				// The text for the copyright control.
				copyright : 'Imagery (c) 2014 SGIDI',
				// The definition of the tiles for this panorama.
				tiles : {
					tileSize : new google.maps.Size(1024, 512),
					worldSize : new google.maps.Size(1024, 512),
					// The heading at the origin of the panorama tile set.
					centerHeading : 105,
					getTileUrl : getCustomPanoramaTileUrl
				}
			};
			break;
	}
}