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
							window.viewer.framework.setImage(this);
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
				setTimeout(window.viewer.maps.onResize, 500);
				setTimeout(window.viewer.framework.onResize, 500);
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
				this.indexer,
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
				// update maps
				window.viewer.maps.showSection(index);
				// get section information
				$.getJSON(
					"image/" + (options.line - 12) + "/" + window.viewer.current.section + "/data.json",
					function (data) {
						window.viewer.current.info = data;
						window.viewer.indexer.showSection(window.viewer.ringnumbers[index], data);
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

			// prepare indexer
			this.indexer.zxcviewerIndexer();
			this.indexer.siteSelected = function (index) {
				window.viewer.current.index = index;
				window.viewer.loadimg();
			};

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