var mHeight;
var mWidth;
var mCanvas;
var mPhotos = 
[
	[],
	[]
];
var mMarker;

function initViewer() {
	mCanvas = document.getElementById("canvas").getContext("2d");
	mCanvas.canvas.width = mCanvas.canvas.clientWidth;
	mCanvas.canvas.height = mCanvas.canvas.clientHeight;
	mHeight = mCanvas.canvas.height;
	for (var i = 0; i < 7; i++) {
		mPhotos[0][i] = new Array();
	};
	for (var i = 0; i < 4; i++) {
		mPhotos[1][i] = new Array();
	};
}
if (window.attachEvent) {
	// Internet Explorer
	window.attachEvent('onload', initViewer);
} else {
	// Firefox
	window.addEventListener('load', initViewer, false);
}

function loadImg(line, section, index) {
	for (var i = 0; i < 3; i++) {
		var img = new Image();
		img.src = "image/" + line + "/" + section + "/" + toString(index + 1) + "_" + i + ".jpg";
		img.onload = function () {
			mWidth = this.width * mHeight / this.height;
			canvasDrawImage(this, mOffset.X, mOffset.Y, mWidth, mHeight);
		};
	}
	// Show date
	$("#label").text("拍摄日期 " + mData[mCurrent.Index].date);
	// Show position on the map
	if (!mMap) {
		return;
	}
	if (!mMarker) {
		mMarker = new TMarker(new TLngLat(mData[mCurrent.Index].lng, mData[mCurrent.Index].lat));
		mMap.addOverLay(mMarker);
	}
	else {
		mMarker.setLngLat(new TLngLat(mData[mCurrent.Index].lng, mData[mCurrent.Index].lat));
	}
	//mMap.centerAndZoom(new TLngLat(mData[mCurrent.Index].lng, mData[mCurrent.Index].lat), 18);
}

function toString(value) {
	if (value < 10) {
		return "0" + value;
	} else {
		return "" + value;
	}
}
