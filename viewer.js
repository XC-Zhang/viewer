(function ($) {
	function viewer(el, params) {
		// create global object
		this.viewer = {
			"current": {
				"line": 0,
				"section": 0,
				"index": 0,
				"image": null,
				"info": null
			},
			"draw": {
				"position": {
					"x": 0,
					"y": 0
				},
				"prevoffset": {
					"x": 0,
					"y": 0
				},
				"offset": {
					"x": 0,
					"y": 0
				}
			},
			"drawimg": function () {
				var mCanvas = this.canvas[0].getContext("2d");
				var mImage = this.current.image;
				if (!mImage) {
					return;
				}
				var mHeight = this.canvas.height();
				var mWidth = mImage.width * mHeight / mImage.height;
				var x = this.draw.offset.x;
				if (x > mWidth) {
					x = x - mWidth;
				}
				if (mWidth + x < 0) {
					x = x + mWidth;
				}
				mCanvas.drawImage(mImage, x, 0, mWidth, mHeight);
				if (x > 0) {
					mCanvas.drawImage(mImage, x - mWidth, 0, mWidth, mHeight);
					return;
				}
				if (mWidth + x < this.canvas.width()) {
					mCanvas.drawImage(mImage, mWidth + x, 0, mWidth, mHeight);
					return;
				}
			},
			"loadimg": function () {
				for (var i = 0; i < 2; i++) {
					var img = new Image();
					img.src = "image/" 
						+ this.current.line + "/" 
						+ this.current.section + "/" 
						+ ((this.current.index + 1) > 9 ? (this.current.index + 1) : "0" + (this.current.index + 1)) + "_" 
						+ i + ".jpg";
					img.onload = function () {
						var index = parseInt(this.src.substr(this.src.length - 8, 2)) - 1;
						var section = parseInt(this.src.substr(this.src.length - 10, 1));
						var line = parseInt(this.src.substr(this.src.length - 12, 1));
						if (
							index == window.viewer.current.index 
							&& section == window.viewer.current.section 
							&& line == window.viewer.current.line
						) {
							window.viewer.current.image = this;
							window.viewer.drawimg();
						}
					};
				}
				// show position on map
				if (this.map) {
					if (typeof this.marker == "undefined") {
						this.marker = new TMarker(
							new TLngLat(this.current.info.lng, this.current.info.lat)
						);
						this.map.addOverLay(this.marker);
					}
					else {
						this.marker.setLngLat(
							new TLngLat(this.current.info.lng, this.current.info.lat)
						);
					}
				}
			}
		};

		var options = {
			"height" : $(window).height() - 32,
			"width": $("body").width() - 32,
		};
		$.extend(options, params);

		(function () {
			this.framework = $("<div></div>");
			this.table = $("<table></table>");
	        this.tablerow = $("<tr></tr>");
			this.leftsider = $("<td></td>");
			this.rightsider = $("<td></td>");
			this.list = $("<ul></ul>");
			this.maps = $("<div>未能加载天地图</div>");
			this.canvas = $("<canvas>浏览器不受支持</canvas>");
			this.indexer = $("<div></div>")
			this.hint = $("<div></div>");

			// prepare framework
			this.framework.width(options.width);
			this.framework.height(options.height);
			this.framework.css({
				"background": "black",
				"color": "white",
				"font-family": "Microsoft Yahei UI",
				"position": "relative"
			});
			this.framework.append(
				this.table.append(
					this.tablerow.append(
						this.leftsider.append(this.list, this.maps), 
						this.rightsider.append(this.canvas)
					)
				),
				this.indexer,
				this.hint
			);
			this.framework.ready(
				function () {
					// get lines and sections
					$.getJSON(
						"lines.json",
						function (data) {
							window.viewer.lines = data;
							for (var line in data) {
								var ul = $("<ul></ul>");
								for (var i = 0; i < data[line].stations.length - 1; i++) {
									var li = $("<li>" 
										+ data[line].stations[i].name
										+ " - " 
										+ data[line].stations[i + 1].name
										+ "</li>"
									);
									li.css({
										"border": "thin solid black",
										"transition": "all 0.5s"
									});
									li.click(
										function () {
											// change others background
											$(this).siblings().css("background", "black");
											$(this).parents("li").siblings().find("li").css("background", "black");
											// change background
											$(this).css("background", "blue");
											// update current status
											window.viewer.current.line = $(this).parents("li").index();
											window.viewer.current.section = $(this).index();
											window.viewer.current.index = 0;
											// get section information
											$.getJSON(
												"image/" + window.viewer.current.line + "/" + window.viewer.current.section + "/data.json",
												function (data) {
													window.viewer.current.info = data;
													window.viewer.indexer.empty();
													for (var i = 0; i < data.length; i++) {
														var b = $("<span></span>");
														b.width(30);
														b.css({
															"border": "thin solid black",
															"display": "inline-block",
															"font-size": "150%",
															"text-align": "center",
															"transition": "all 0.5s"
														});
														b.text(i + 1);
														b.hover(
															function () {
																$(this).css("border", "thin solid yellow");
																$(this)[0].showhint();
															},
															function () {
																$(this).css("border", "thin solid black");
															}
														);
														b.click(
															function () {
																$(this).siblings().css("background", "black");
																$(this).css("background", "blue");
																window.viewer.current.index = parseInt($(this).text()) - 1;
																window.viewer.loadimg();
																$(this)[0].showhint();
															}
														);
														b[0].showhint = function () {
															if (window.viewer.current.line == 1 || !window.viewer.ringnumbers) {
																window.viewer.hint.html("<p>无环号信息</p>");
															}
															else {
																var ring = window.viewer.ringnumbers[window.viewer.current.section][parseInt($(this).text()) - 1];
																window.viewer.hint.html(
																	"<p>最近环号：" + ring.Number + "</p>"
																	+ "<p>里程：" + ring.Mileage + "</p>"
																	+ (ring.Warning ? "<p style='color:red'>距离超过50米</p>" : "")
																);
															}
															window.viewer.hint.css({
																"top": $(this).position().top - window.viewer.hint.height(),
																"left": $(this).position().left - window.viewer.hint.width() / 2,
																"opacity": "1.0"
															});	
														};
														window.viewer.indexer.append(b);
													}
													window.viewer.indexer.css("margin-left", (window.viewer.framework.width() - (30) * data.length) / 2);
													window.viewer.indexer.children().first().click();
												}
											)
											// show section location on map
											if (typeof window.viewer.map == "undefined") {
												return;
											}
											var view = [
												new TLngLat(
													window.viewer.lines[window.viewer.current.line].stations[window.viewer.current.section].lng, 
													window.viewer.lines[window.viewer.current.line].stations[window.viewer.current.section].lat
												),
												new TLngLat(
													window.viewer.lines[window.viewer.current.line].stations[window.viewer.current.section + 1].lng, 
													window.viewer.lines[window.viewer.current.line].stations[window.viewer.current.section + 1].lat
												)
											];
											window.viewer.map.setViewport(view);
										}
									);
									li.hover(
										function () {
											$(this).css("border", "thin solid yellow");
										}, 
										function () {
											$(this).css("border", "thin solid black");
										}
									);
									ul.append(li);
								}
								var li = $("<li>" + data[line].name + "</li>").append(ul);
								window.viewer.list.append(li);
							}
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
			this.framework.mouseup(
				function () {
					window.viewer.canvas.css("cursor", "default");						
					window.viewer.canvas.unbind("mousemove", window.viewer.canvas.mousemovehandler);
				}
			);
			$(document).keyup(
				function (e) {
					if (e.which == 37 || e.which == 40) {
						if (window.viewer.current.index == 0) {
							return;
						}
						window.viewer.indexer.children().eq(--window.viewer.current.index).click();
						return;
					}
					if (e.which == 39 || e.which == 38) {
						if (window.viewer.current.index == window.viewer.current.info.length - 1) {
							return;
						}
						window.viewer.indexer.children().eq(++window.viewer.current.index).click();
						return;
					}
				}
			);
			this.framework.bind(
				"selectstart",
				function () {
					return false;
				}
			);

			// prepare leftsider
			this.leftsider.width(232);
			this.leftsider.ready(
				function () {
					// initialize Tianditu Map
					if (typeof TMap == "undefined") {
						return;
					}
					if (!(window.viewer.map = new TMap(window.viewer.maps[0]))) {
						return;
					}
					var mShanghai = new TLngLat(121.48, 31.22);
					window.viewer.map.centerAndZoom(mShanghai, 11);
					window.viewer.map.enableHandleMouseScroll();						
				}
			);

			// prepare rightsider
			this.rightsider.width(this.framework.width() - 248);
			this.rightsider.ready(
				function () {
					// invoke resize event
					window.viewer.rightsider.resize();
				}
			);
			this.rightsider.resize(
				function () {
					window.viewer.canvas.width($(this).width() - 16);
					window.viewer.canvas.height($(this).height() - 16);
				}
			);

			// prepare list
			this.list.css({
				"cursor": "default"
			});

			// prepare maps
			this.maps.height(this.leftsider.width());
			this.maps.css("text-align", "center");

			// prepare canvas
			this.canvas.resize(
				function () {
					this.width = $(this).width();
					this.height = $(this).height();
					window.viewer.drawimg();
				}
			);
			this.canvas.mousedown(
				function (e) {
					window.viewer.draw.position.x = e.clientX;
					window.viewer.draw.position.y = e.clientY;
					window.viewer.draw.prevoffset.x = window.viewer.draw.offset.x;
					window.viewer.draw.prevoffset.y = window.viewer.draw.offset.y;
					window.viewer.canvas.css("cursor", "pointer");
					window.viewer.canvas.mousemove(window.viewer.canvas.mousemovehandler);
				}
			);
			this.canvas.mousemovehandler = function (e) {
				if (!window.viewer.current.image) {
					return;
				}
				window.viewer.draw.offset.x = e.clientX - window.viewer.draw.position.x + window.viewer.draw.prevoffset.x;
				canvasDrawImage(mCurrentImage, mOffset.X, mOffset.Y);
				if (window.viewer.draw.offset.x > this.width()) {
					window.viewer.draw.offset.x -= this.width();
					return;
				}
				if (this.width() + window.viewer.draw.offset.x < 0) {
					window.viewer.draw.offset.x += this.width();
					return;
				}
			};

			// prepare indexer
			this.indexer.css("padding", "10px");
			this.indexer.mouseout(
				function () {
					$(this).children().eq(window.viewer.current.index)[0].showhint();
				}
			);

			// prepare hint
			this.hint.css({
				"background": "black",
				"border": "thin solid white",
				"height": 124,
				"opacity": 0,
				"position": "absolute",
				"text-align": "center",
				"transition": "all 0.5s"
			});

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