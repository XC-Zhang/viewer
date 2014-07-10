var mHeight;
var mWidth;
var mCanvas;
var mMarker;
var mCurrentImage;

function initViewer() {
	mCanvas = document.getElementById("canvas").getContext("2d");
	mCanvas.canvas.width = mCanvas.canvas.clientWidth;
	mCanvas.canvas.height = mCanvas.canvas.clientHeight;
	mHeight = mCanvas.canvas.height;
}
if (window.attachEvent) {
	// Internet Explorer
	window.attachEvent('onload', initViewer);
} else {
	// Firefox
	window.addEventListener('load', initViewer, false);
}

function loadImg(line, section, index) {
	for (var i = 0; i < 2; i++) {
		var img = new Image();
		img.src = "image/" + line + "/" + section + "/" + toString(index + 1) + "_" + i + ".jpg";
		img.onload = function () {
			if (checkImg(this.src)) {
				mWidth = this.width * mHeight / this.height;
				canvasDrawImage(this, mOffset.X, mOffset.Y, mWidth, mHeight);
				mCurrentImage = this;				
			}
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

function checkImg(src) {
	var index = parseInt(src.substr(src.length - 8, 2)) - 1;
	var station = parseInt(src.substr(src.length - 10, 1));
	var line = parseInt(src.substr(src.length - 12, 1));
	if (index == mCurrent.Index && station == mCurrent.Station && line == mCurrent.Line) {
		return true;
	}
	else
	{
		return false;
	}
}

function loadSpecific(index) {
	mCurrent.Index = index;
	loadImg(mCurrent.Line, mCurrent.Station, mCurrent.Index);
	$("#buttons").children().attr("class", "");
	$("#buttons").children().eq(index).attr("class", "highlight");
}