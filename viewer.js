(function ($) {
	function viewer(el, params) {
		// create global object
		this.viewer = {
			"mapenlarged": false,
			"current": {
				"section": -1,
				"index": 0,
				"info": null
			},
			"loadimg": function () {
				for (var i = 0; i < 2; i++) {
					var img = new Image();
					img.src = "image/" 
						+ (options.line - 12) + "/" 
						+ this.current.section + "/" 
						+ ((this.current.index + 1) > 9 ? (this.current.index + 1) : "0" + (this.current.index + 1)) + "_" 
						+ i + ".jpg";
					img.onload = function () {
						var index = parseInt(this.src.substr(this.src.length - 8, 2)) - 1;
						var section = parseInt(this.src.substr(this.src.length - 10, 1));
						if (
							index == window.viewer.current.index 
							&& section == window.viewer.current.section 
						) {
							window.viewer.canvas.setImage(this);
						}
					};
				}
				// show position on map
				if (this.map) {
					var pos = this.current.info[this.current.index];
					if (typeof this.marker == "undefined") {
						this.marker = L.marker(pos);
						this.marker.addTo(this.map);
						this.map.setView(pos);
					}
					else {
						this.marker.setLatLng(pos);
						this.map.setView(pos);
					}
				}
			},
			"mapdoubleclick": function (pixel) {
				if (window.viewer.current.section == -1) {
					return;
				}

				if (!window.viewer.mapenlarged) {
					window.viewer.maps.removeClass('normal');
					window.viewer.maps.addClass('large');
					window.viewer.canvas.removeClass('large');
					window.viewer.canvas.addClass('normal');
					window.viewer.menu.slideUp();
					window.viewer.mapenlarged = true;
				}
				else {
					//window.viewer.mapreduce.call(this);
					window.viewer.maps.removeClass('large');
					window.viewer.maps.addClass('normal');
					window.viewer.canvas.removeClass('normal');
					window.viewer.canvas.addClass('large');
					window.viewer.menu.slideDown();
					window.viewer.mapenlarged = false;
				}
				window.viewer.maps.onResize();
				window.viewer.framework.onResize();
			},
			"mapenlarge": function () {
				window.viewer.mapenlarged = true;

				this.removeLayer(window.viewer.marker);
				for (var i = 0; i < window.viewer.current.info.length; i++) {
					var pos = window.viewer.current.info[i];
					var marker = L.marker(pos, {
						icon: new L.Icon.Default(),
						title: i + 1
					}).addTo(this);
/*					TEvent.addListener(
						marker, 
						"mouseover",
						function () {
							var i = this.getTitle() - 1;
							window.viewer.indexer.children().eq(i).mouseenter();
						}
					);
					TEvent.addListener(
						marker,
						"mouseout",
						function () {
							var i = this.getTitle() - 1;
							window.viewer.indexer.children().eq(i).mouseleave();
						}
					)
					TEvent.addListener(
						marker,
						"click",
						function () {
							var i = this.getTitle() - 1;
							window.viewer.indexer.children().eq(i).click();
						}
					)
*/				}
			},
			"mapreduce": function () {
				window.viewer.mapenlarged = false;
//				this.clearOverLays();
//				this.addOverLay(window.viewer.marker);
			},
		};

		var options = {
			"height" : el.height(),
			"width": el.width(),
		};
		$.extend(options, params);

		(function () {
			this.framework = $("<div class='viewer'></div>");
			this.menu = $("<div id='menu'></div>")
			this.maps = $("<div id='map' class='large'>未能加载地图</div>");
			this.indexer = $("<div id='indexer'></div>")
			this.hint = $("<table id='hint' class='hide'></table>");
			this.exchange = $("<div id='switch'></div>");

			// prepare framework
			this.framework.width(options.width);
			this.framework.height(options.height);
			this.framework.css({
				"background": options.background,
				"color": options.foreground,
				"font-family": "Microsoft Yahei UI",
				"position": "relative"
			});
			this.framework.append(
				this.menu,
				this.maps,
				this.canvas,
				this.indexer,
				this.hint,
				this.exchange
			);
			this.framework.ready(
				function () {
					window.viewer.canvas = $("canvas");
					window.viewer.canvas.addClass("normal");
					// get lines and sections
					$.getJSON(
						"image/" + (options.line - 12) + "/lineinfo.json",
						function (data) {
							window.viewer.lineinfo = data;
							window.viewer.menu.setLineInfo(data);
							window.viewer.maps.setLineInfo(data);
						}
					);
					// get ring numbers
					$.getJSON(
						"image/0/ringnumbers.json",
						function (data) {
							window.viewer.ringnumbers = data;
						}
					);
				}
			);
			$(document).keyup(
				function (e) {
					switch (e.which) {
					case 32:
						// SPACE pressed
						window.viewer.mapdoubleclick.call(window.viewer.map);
						break;
					case 38:
						// arrow key UP pressed
						if (window.viewer.current.index != window.viewer.current.info.length - 1) {
							window.viewer.indexer.children().eq(++window.viewer.current.index).click();							
						}
						break;
					case 40:
						// arrow key DOWN pressed
						if (window.viewer.current.index != 0) {
							window.viewer.indexer.children().eq(--window.viewer.current.index).click();
						}
						break;
					case 37:
						// arrow key LEFT pressed
						break;
					case 39:
						// arrow key RIGHT pressed
						break;
					default:
						break;
					}
				}
			);
			this.framework.bind(
				"selectstart",
				function () {
					return false;
				}
			);

			// prepare list
			this.menu.zxcviewerMenu({
				color: options.linecolor,
				title: options.line
			});
			this.menu.sectionClick = function (index) {
				// update current status
				window.viewer.current.section = index;
				window.viewer.current.index = 0;
				// update maps
				window.viewer.maps.showSection(index);
				// show image
				window.viewer.loadimg();
				// get section information
				$.getJSON(
					"image/" + (options.line - 12) + "/" + window.viewer.current.section + "/data.json",
					function (data) {
						window.viewer.current.info = data;
						window.viewer.indexer.empty();
						for (var i = 0; i < data.length; i++) {
							var b = $("<span></span>");
							b.width(30);
							b.text(i + 1);
							b.mouseover(
								function () {
									$(this)[0].showhint();
								}
							);
							b.click(
								function () {
									if (window.viewer.mapenlarged) {
										window.viewer.mapreduce.call();
									}
									$(this).siblings("span").removeClass("selected");
									$(this).addClass("selected");
									window.viewer.current.index = parseInt($(this).text()) - 1;
									setTimeout("window.viewer.loadimg()", 500);
									$(this)[0].showhint();
								}
							);
							b[0].showhint = function () {
								if (!window.viewer.ringnumbers) {
									window.viewer.hint.html("<p>无环号信息</p>");
								}
								else {
									var ring = window.viewer.ringnumbers[window.viewer.current.section][parseInt($(this).text()) - 1];
									window.viewer.hint.html(
										"<tr><td align='right'>最近环号</td><td align='left'>" + ring.Number + "</td></tr>"
										+ "<tr><td align='right'>里&nbsp;&nbsp;程</td><td align='left'>" + ring.Mileage + "</td></tr>"
										+ (ring.Warning ? "<tr style='color:red'><td align='right'>距&nbsp;&nbsp;离</td><td align='left'>超过50米</td></tr>" : "")
										+ "<tr><td align='right'>拍摄日期</td><td align='left'>" + window.viewer.current.info[parseInt($(this).text()) - 1].date + "</td></tr>"
									);
								}
								window.viewer.hint.offset({
									"top": $(this).offset().top - window.viewer.hint.height(),
									"left": $(this).offset().left - window.viewer.hint.width() / 2
								});	
								window.viewer.hint.css("opacity", "1.0");
							};
							window.viewer.indexer.append(b);
						}
						window.viewer.indexer.children().first().click();
					}
				)
			}

			// prepare maps
			this.maps.ready(
				function () {
					window.viewer.maps.zxcviewerMaps();
					window.viewer.maps.sectionSelected = function (index) {
						window.viewer.menu.onClick(index);
					}
				}
			);

			// prepare canvas
			this.framework.zxcviewerCanvas();
			this.framework.onResize();

			// prepare indexer
			this.indexer.css({
				"left": "230px",
			});
			this.indexer.mouseout(
				function () {
					if ($(this).children().length == 0) {
						return;
					};
					$(this).children().eq(window.viewer.current.index)[0].showhint();
				}
			);

			// prepare exchange button
			this.exchange.append(
				"<img src='image/exchange.png' style='width: 30px; height: 30px'>"
			);
			this.exchange.click(
				function () {
					window.viewer.mapdoubleclick.call();
				}
			);

		}).call(this.viewer);

		// remove related handlers and dom elements
		el.empty();
		el.append(this.viewer.framework);

	}

	// jQuery Plugin Initialisation
	$.fn.zxcviewer = function (params) {
		viewer(this, params);
		return this;
	}
})(jQuery);