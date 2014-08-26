(function ($) {
	
	function viewerIndexer(el, params) {
		var hintpop = $("<table></table>");
		var spans = new Array();
		var ringNumbers = null;
		var infomation;

		// Events
		el.siteSelected = null;

		// Methods
		el.showSection = function (ringnumbers, info) {
			ringNumbers = ringnumbers;
			information = info;
			if (info.length > spans.length) {
				for (var i = 0; i < spans.length; i++) {
					spans[i].appendTo(el);
					spans[i].removeClass("selected");
				}
				for (var i = spans.length; i < info.length; i++) {
					spans.push($("<span></span>"));
					spans[i].text(i + 1);
					spans[i].click(spanClick);
					spans[i].appendTo(el);
				}
			} else {
				for (var i = 0; i < info.length; i++) {
					spans[i].appendTo(el);
					spans[i].removeClass("selected");
				}
				for (var i = info.length; i < spans.length; i++)
					spans[i].detach();
			}
			hintpop.removeClass("show");
			hintpop.addClass("hide");
		}
		el.onSiteSelect = function (index) {
			spans[index].click();
		}

		var spanClick = function (e) {
			$(this).siblings("span").removeClass("selected");
			$(this).addClass("selected");
			var index = $(this).text() - 1;
			showHint(index);
			if (el.siteSelected)
				el.siteSelected(index);
		}
		var showHint = function (index) {
			hintpop.removeClass("hide");
			hintpop.addClass("show");
			if (ringNumbers)
				hintpop.html(
					"<tr><td align='right'>最近环号</td><td align='left'>" + ringNumbers[index].Number + "</td></tr>" +
					"<tr><td align='right'>里&nbsp;&nbsp;&nbsp;&nbsp;程</td><td align='left'>" + ringNumbers[index].Mileage + "</td></tr>" +
					(ringNumbers[index].Warning ? "<tr style='color: red'><td align='right'>距&nbsp;&nbsp;&nbsp;&nbsp;离</td><td align='left'>超过50米</td></tr>" : "") +
					"<tr><td align='right'>拍摄日期</td><td align='left'>" + information[index].date + "</td></tr>"
				);
			else
				hintpop.html("<tr><td>无环号信息</td></tr>");
			var left = spans[index].position().left + spans[index].width() / 2 - hintpop.width() / 2;
			if (left < 0) left = 0;
			hintpop.css({
				"top": spans[index].position().top - hintpop.height() + "px",
				"left":  left + "px"
			});
		}

		hintpop.addClass("hide");

		el.append(hintpop);
	}

	// jQuery Plugin Initialisation
	$.fn.zxcviewerIndexer = function (params) {
		viewerIndexer(this, params);
		return this;
	}
})(jQuery);