var mData;

function getStationInfo(line, station) {
	$.getJSON("image/" + line + "/" + station + "/data.json", onSuccess);
}

function onSuccess(data) {
	mData = data;
	var buttonsContainer = $("#buttons");
	buttonsContainer.empty();
	for (var i = 0; i < data.length; i++) {
		var button = $("<span></span>");
		button.text(i + 1);
		button.click(function () {
			loadSpecific(parseInt($(this).text()) - 1);
		});
		buttonsContainer.append(button);
		if (i == 0) {
			button.click();
		}
	}
}