var mRingNumbers;

function getRingNumbers() {
	$.getJSON("image/0/ringnumbers.json", onRingNumberSuccess);
}

function onRingNumberSuccess(data) {
	mRingNumbers = data;
}