(function ($) {

	function viewerMenu(el, params) {
		// Properties
		el.setLineInfo = function (value) {
			lists.empty();
			for (var i = 0; i < value.length - 1; i++) {
				var element = $("<li></li>");
				element.text(value[i].name + " - " + value[i + 1].name);
				element.appendTo(lists);
				element.click(elementClick);
			}
		}
		// Events
		el.sectionClick = null;
		// Methods
		el.onClick = function (index) {
			lists.children().eq(index).click();
		}
		el.slideUp = function () {
			lists.slideUp();
		}
		el.slideDown = function () {
			lists.slideDown();
		}

		var title = $("<div></div>");
		var lists = $("<ul></ul>");

		var titleClick = function (e) {
			lists.slideToggle();
		}
		var elementClick = function (e) {
			$(this).siblings().removeClass("selected");
			$(this).addClass("selected");
			if (el.sectionClick)
				el.sectionClick($(this).index());
		}

		title.text(params.title);
		title.css("background", params.color);
		title.click(titleClick);

		el.append(title, lists);
	}

	// jQuery Plugin Initialisation
	$.fn.zxcviewerMenu = function (params) {
		viewerMenu(this, params);
		return this;
	}	
})(jQuery);