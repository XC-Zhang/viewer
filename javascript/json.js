var mData;

function getStationInfo(line, station) {
	$.getJSON("image/" + line + "/" + station + "/data.json", onSuccess);
}

function onSuccess(data) {
	mData = data;
	var buttonsContainer = $("#buttons");
	buttonsContainer.empty();
	buttonsContainer.mouseenter(function () {
		mHint.fadeIn();
	});
	buttonsContainer.mouseleave(function () {
		mHint.fadeOut();
	});
	for (var i = 0; i < data.length; i++) {
		var button = $("<span></span>");
		button.text(i + 1);
		button.css("margin","1px");
		button.click(function () {
			loadSpecific(parseInt($(this).text()) - 1);
		});
		button.mouseover(function () {
			mHint.text("环号" + $(this).text());
			mHint.offset({
				left: $(this).offset().left, 
				top : $(this).offset().top - mHint.height()
			});
		});

		buttonsContainer.append(button);
		if (i == 0) {
			button.click();
		}
	}
}