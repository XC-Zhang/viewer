(function ($) {
	function viewer(el, params) {
		// create global object
		this.viewer = {
			"mapenlarged": true,
			"current": {
				"section": -1,
				"index": 0,
				"info": null
			},
			"loadimg": function () {
				var img1 = new Image();
				img1.src = "http://line12-images.qiniudn.com/image/" 
					+ (options.line - 0) + "/" 
					+ this.current.section + "/" 
					+ ((this.current.index + 1) > 9 ? (this.current.index + 1) : "0" + (this.current.index + 1)) + "_" 
					+ "0.jpg";
				img1.onload = function () {
					var index = parseInt(this.src.substr(this.src.length - 8, 2)) - 1;
					var section = parseInt(this.src.substr(this.src.length - 10, 1));
					if (index != window.viewer.current.index || section != window.viewer.current.section) 
						return;
					window.viewer.framework.setImage(this);
					var img2 = new Image();
					img2.src = "http://line12-images.qiniudn.com/image/" 
						+ (options.line - 0) + "/" 
						+ window.viewer.current.section + "/" 
						+ ((window.viewer.current.index + 1) > 9 ? (window.viewer.current.index + 1) : "0" + (window.viewer.current.index + 1)) + "_" 
						+ "1.jpg";
					img2.onload = function () {
						var index = parseInt(this.src.substr(this.src.length - 8, 2)) - 1;
						var section = parseInt(this.src.substr(this.src.length - 10, 1));
						if (index != window.viewer.current.index || section != window.viewer.current.section) 
							return;
						window.viewer.framework.setImage(this);
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
					window.viewer.mapenlarged = true;
				}
				else {
					window.viewer.maps.removeClass('large');
					window.viewer.maps.addClass('normal');
					window.viewer.canvas.removeClass('normal');
					window.viewer.canvas.addClass('large');
					window.viewer.mapenlarged = false;
				}
				setTimeout(window.viewer.maps.onResize, 500);
				setTimeout(window.viewer.framework.onResize, 500);
			}
		};

		var options = {
			"height" : el.height(),
		};
		$.extend(options, params);

		(function () {
			this.framework = $("<div class='viewer'></div>");
			this.menu = $("<div id='menu'></div>")
			this.maps = $("<div id='map' class='large'></div>");
			this.indexer = $("<div id='indexer'></div>")
			this.switch = $("<div id='switch'></div>");

			// check if using mobile
			if (isMobile())
				this.framework.addClass("mobile");

			// prepare framework
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
				this.switch
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
							window.viewer.menu.onClick(0);
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
						window.viewer.maps.showSection(index, data);
						window.viewer.indexer.siteSelected(0);
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
					window.viewer.maps.siteSelected = function (index) {
						window.viewer.indexer.siteSelected(index);
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
				window.viewer.indexer.showSite(index);
				window.viewer.maps.showSite(index);
			};

			// prepare exchange button
			this.switch.click(
				function () {
					window.viewer.mapdoubleclick();
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