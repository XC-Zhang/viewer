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
		"mouseup" : canvasMouseUp,
		"mouseleave" : canvasMouseLeave
	});
});

function canvasMouseMove(e) {
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

function canvasMouseLeave() {

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