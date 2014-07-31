(function ($) {
	function viewer(el, params) {
		// create global object
		this.viewer = {
			"mapenlarged": false,
			"current": {
				"line": 0,
				"section": -1,
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
					var pos = new TLngLat(this.current.info[this.current.index].lng, this.current.info[this.current.index].lat);
					if (typeof this.marker == "undefined") {
						this.marker = new TMarker(pos);
						this.map.addOverLay(this.marker);
						this.map.panTo(pos);
					}
					else {
						this.marker.setLngLat(pos);
						this.map.panTo(pos);
					}
				}
			},
			"mapdoubleclick": function (pixel) {
				if (window.viewer.current.section == -1) {
					return;
				}

				if (!window.viewer.mapenlarged) {
					window.viewer.mapenlarge.call(this);
				}
				else {
					window.viewer.mapreduce.call(this);
				}
			},
			"setmapviewport": function () {
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
			},
			"mapenlarge": function () {
				window.viewer.listcontainer.fadeTo("fast", 0.5);
				window.viewer.maps.css({
					"height": window.viewer.framework.height() - 60,
					"width": window.viewer.framework.width() - window.viewer.listcontainer.width()
				});
				window.viewer.canvas.css({
					"height": window.viewer.listcontainer.width(),
					"width": window.viewer.listcontainer.width()
				});
				window.viewer.mapenlarged = true;

				this.removeOverLay(window.viewer.marker);
				for (var i = 0; i < window.viewer.current.info.length; i++) {
					var pos = new TLngLat(window.viewer.current.info[i].lng, window.viewer.current.info[i].lat);
					var marker = new TLabel({
						text: "<span>" + (i + 1) + "</span>",
						offset: new TPixel(0, 0),
						position: pos
					});
					marker.setTitle(i + 1);
					TEvent.addListener(
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
					this.addOverLay(marker);
				}
				this.zoomIn();
				setTimeout("window.viewer.map.checkResize()", 500);
				setTimeout(window.viewer.setmapviewport, 500);
			},
			"mapreduce": function () {
				window.viewer.listcontainer.fadeTo("fast", 1.0);
				window.viewer.maps.css({
					"height": window.viewer.listcontainer.width(),
					"width": window.viewer.listcontainer.width()
				});
				window.viewer.canvas.css({
					"height": window.viewer.framework.height() - 60,
					"width": window.viewer.framework.width() - window.viewer.listcontainer.width()
				});
				window.viewer.mapenlarged = false;
				this.clearOverLays();
				this.addOverLay(window.viewer.marker);
				this.zoomOut();
				setTimeout("window.viewer.map.checkResize()", 500);
				setTimeout(window.viewer.setmapviewport, 500);
			},
			"canvasresize": function () {
				var w = window.viewer.framework.width() - window.viewer.listcontainer.width();
				var h = window.viewer.framework.height() - window.viewer.indexer.height()
				window.viewer.canvas.width(w);
				window.viewer.canvas.height(h);
				window.viewer.canvas[0].width = w;
				window.viewer.canvas[0].height = h;
			}
		};

		var options = {
			"height" : el.height(),
			"width": el.width(),
		};
		$.extend(options, params);

		(function () {
			this.framework = $("<div></div>");
			this.listcontainer = $("<div></div>")
			this.list = $("<ul></ul>");
			this.maps = $("<div>未能加载天地图</div>");
			this.canvas = $("<canvas>浏览器不受支持</canvas>");
			this.indexer = $("<div></div>")
			this.hint = $("<div></div>");
			this.exchange = $("<div></div>");

			// prepare framework
			this.framework.width(options.width);
			this.framework.height(options.height);
			this.framework.css({
				"background": "#111111",
				"color": "white",
				"font-family": "Microsoft Yahei UI",
				"position": "relative"
			});
			this.framework.append(
				this.listcontainer.append(this.list),
				this.maps,
				this.canvas,
				this.indexer,
				this.hint,
				this.exchange
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
										"border": "thin solid transparent",
										"transition": "all 0.5s",
										"width": ""
									});
									li.click(
										function () {
											// change others background
											$(this).siblings().css("background", "#111111");
											$(this).parents("li").siblings().find("li").css("background", "#111111");
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
															"border": "thin solid #111111",
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
																$(this).css("border", "thin solid #111111");
															}
														);
														b.click(
															function () {
																if (window.viewer.mapenlarged) {
																	window.viewer.mapreduce.call(window.viewer.map);
																}
																$(this).siblings().css("background", "#111111");
																$(this).css("background", "blue");
																window.viewer.current.index = parseInt($(this).text()) - 1;
																setTimeout("window.viewer.loadimg()", 500);
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
																	+ "<p>" + window.viewer.current.info[parseInt($(this).text()) - 1].date + "</p>"
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
											window.viewer.setmapviewport();
										}
									);
									li.hover(
										function () {
											$(this).css("border", "thin solid yellow");
										}, 
										function () {
											$(this).css("border", "thin solid #111111");
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
					// resize
					window.viewer.canvasresize();
				}
			);
			this.framework.mouseup(
				function () {
					if (!window.viewer.current.image) {
						return;
					}
					if (window.viewer.mapenlarged) {
						return;
					}
					window.viewer.canvas.css("cursor", "default");						
					window.viewer.canvas.unbind("mousemove", window.viewer.canvas.mousemovehandler);
					var mHeight = window.viewer.canvas.height();
					var mWidth = window.viewer.current.image.width * mHeight / window.viewer.current.image.height;
					if (window.viewer.draw.offset.x + mWidth < 0) {
						window.viewer.draw.offset.x += mWidth;
						return;
					}
					if (window.viewer.draw.offset.x > mWidth) {
						window.viewer.draw.offset.x-= mWidth;
						return;
					}
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

			// prepare list
			this.listcontainer.css({
				"background": "#111111",
				"cursor": "default",
				"position": "absolute",
				"width": "230px",
				"z-index": "200"
			});
			this.list.css("padding", "20px");

			// prepare maps
			this.maps.height(this.list.width());
			this.maps.css({
				"bottom": "60px",
				"height": "230px",
				"position": "absolute",
				"text-align": "center",
				"transition": "all 0.5s",
				"width": "230px"
			});
			this.maps.ready(
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
					TEvent.addListener(window.viewer.map, "dblclick", window.viewer.mapdoubleclick);
				}
			);

			// prepare canvas
			this.canvas.css({
				"position": "absolute",
				"right": "0",
				"transition": "all 0.5s",
				"top": "0"
			});
			this.canvas.mousedown(
				function (e) {
					if (window.viewer.mapenlarged) {
						return;
					}
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
				window.viewer.drawimg();
			};
			this.canvas.dblclick(
				function () {
					if (window.viewer.current.section == -1) {
						return;
					}
					if (window.viewer.mapenlarged) {
						window.viewer.mapreduce.call(window.viewer.map);
					}
					else {
						window.viewer.mapenlarge.call(window.viewer.map);
					}
				}
			);

			// prepare indexer
			this.indexer.css({
				"bottom": "0",
				"height": "60px",
				"left": "230px",
				"position": "absolute",
				"right": "0",
				"text-align": "center"
			});
			this.indexer.mouseout(
				function () {
					if ($(this).children().length == 0) {
						return;
					};
					$(this).children().eq(window.viewer.current.index)[0].showhint();
				}
			);

			// prepare hint
			this.hint.css({
				"background": "black",
				"border": "thin solid white",
				"opacity": 0,
				"position": "absolute",
				"text-align": "center",
				"transition": "all 0.5s",
				"z-index": 200
			});

			// prepare exchange button
			this.exchange.css({
				"border": "thin solid white",
				"cursor": "pointer",
				"height": "30px",
				"opacity": "0.7",
				"position": "absolute",
				"right": "10px",
				"top": "10px",
				"width": "30px",
				"z-index": "200"
			});
			this.exchange.append(
				"<img src='image/exchange.png' style='width: 30px; height: 30px'>"
			);
			this.exchange.hover(
				function () {
					$(this).fadeTo("fast", 1.0);
				},
				function () {
					$(this).fadeTo("fast", 0.7);
				}
			);
			this.exchange.click(
				function () {
					window.viewer.mapdoubleclick.call(window.viewer.map);
				}
			);

			$(window).resize(
				function () {
					window.viewer.canvasresize();
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