var mMap;

function initMap() {
	mMap = new TMap("map");
	// Check if mMap has been successfully initialized
	if (!mMap) {
		return;
	}
	mMap.centerAndZoom(new TLngLat(121.48, 31.22), 11);
	mMap.enableHandleMouseScroll();
	mMap.move = function (center, flag) {
	};
	TEvent.addListener(mMap, "move", mMap.move);
}
if (window.attachEvent) {
	// Internet Explorer
	window.attachEvent('onload', initMap);
} else {
	// Firefox
	window.addEventListener('load', initMap, false);
}