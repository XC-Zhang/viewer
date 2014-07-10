var mPosition = {
	X : 0,
	Y : 0
};
var mOffset = {
	X : 0,
	Y : 0
}
var mPreservedOffset = {
	X : 0,
	Y : 0
}

$(document).ready(function () {
	$("#canvas").mousedown(function (e) {
		mPosition.X = e.clientX;
		mPosition.Y = e.clientY;
		mPreservedOffset.X = mOffset.X;
		mPreservedOffset.Y = mOffset.Y
		$("#canvas").bind("mousemove", canvasMouseMove);
		$("#canvas").css("cursor", "pointer");
	});
	$(document).bind({
		"keyup" : canvasKeyUp,
		"mouseup" : canvasMouseUp,
		"selectstart" : canvasSelectStart,
		"resize": canvasResize
	});
});

function canvasMouseMove(e) {
	if (!mCurrentImage) {
		return;
	}
	mOffset.X = e.clientX - mPosition.X + mPreservedOffset.X;
	mOffset.Y = 0 + mPreservedOffset.Y;
	canvasDrawImage(mCurrentImage, mOffset.X, mOffset.Y);
	if (mOffset.X > mWidth) {
		mOffset.X = mOffset.X - mWidth;
		return;
	}
	if (mWidth + mOffset.X < 0) {
		mOffset.X = mOffset.X + mWidth;
		return;
	}
}

function canvasMouseUp() {
	$("#canvas").unbind("mousemove", canvasMouseMove);
	$("#canvas").css("cursor", "default");
}

function canvasSelectStart() {
	return false;
}

function canvasKeyUp(e) {
	if (!mCurrentImage) {
		return;
	}
	if (e.which == 37 || e.which == 40) {
		loadPrev();
		return;
	}
	if (e.which == 39 || e.which == 38) {
		loadNext();
		return;
	}
}

function canvasDrawImage(image, x, y) {
	if (x > mWidth) {
		x = x - mWidth;
	}
	if (mWidth + x < 0) {
		x = x + mWidth;
	}
	mCanvas.drawImage(image, x, y, mWidth, mHeight);
	if (x > 0) {
		mCanvas.drawImage(image, x - mWidth, y, mWidth, mHeight);
		return;
	}
	if (mWidth + x < mCanvas.canvas.width) {
		mCanvas.drawImage(image, mWidth + x, y, mWidth, mHeight);
		return;
	}
}

function canvasResize() {
	$("#viewer").width($(window).width() - 274);
	$("#viewer").height($(window).height() - 16);
	$("#canvas").width($(window).width() - 274);
	$("#canvas").height($(window).height() - 16);
	if (mCanvas) {
		mCanvas.canvas.width = mCanvas.canvas.clientWidth;
		mCanvas.canvas.height = mCanvas.canvas.clientHeight;		
	}
}