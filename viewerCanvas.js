(function ($) {

	function viewerCanvas(el, params) {
		// Properties
		el.setImage = function (img) {
			image = img;
			setImageDrawSize();
			drawImage(imageDrawPosition);
		}
		// Methods
		el.onResize = function () {
			resize();
		}

		var canvas = $("<canvas></canvas>");
		var canvasElement = canvas.get(0);
		var canvasContext = canvasElement.getContext("2d");
		var image = null;
		var mouseDownPosition = { x: 0, y: 0 };
		var imageDrawPosition = { x: 0, y: 0 };
		var imageDrawSize = { w: 0, h: 0 };

		var mouseDown = function (e) {
			if (!image) return;
			mouseDownPosition.x = e.clientX;
			mouseDownPosition.y = e.clientY;
			canvas.bind({
				mousemove: mouseMove,
				mouseup: mouseUpAndMouseLeave,
				mouseleave: mouseUpAndMouseLeave
			});
		}
		var mouseMove = function (e) {
			if (!image) return;
			var tempPosition = {
				x: imageDrawPosition.x + e.clientX - mouseDownPosition.x,
				y: 0
			};
			drawImage(tempPosition);
		}
		var mouseUpAndMouseLeave = function (e) {
			canvas.unbind({
				mousemove: mouseMove,
				mouseup: mouseUpAndMouseLeave,
				mouseleave: mouseUpAndMouseLeave
			});
			imageDrawPosition.x = imageDrawPosition.x + e.clientX - mouseDownPosition.x;
			drawImage(imageDrawPosition);
		}

		var touchStart = function (e) {
			if (e.originalEvent.touches.length != 1) return;
			if (!image) return;
			mouseDownPosition.x = e.originalEvent.touches[0].clientX;
			mouseDownPosition.y = e.originalEvent.touches[0].clientY;
			canvas.bind({
				touchmove: touchMove,
				touchend: touchEnd
			});
		}
		var touchMove = function (e) {
			if (!image) return;
			var tempPosition = {
				x: imageDrawPosition.x + e.originalEvent.touches[0].clientX - mouseDownPosition.x,
				y: 0
			};
			drawImage(tempPosition);
		}
		var touchEnd = function (e) {
			canvas.unbind({
				touchmove: touchMove,
				touchend: touchEnd
			});
			imageDrawPosition.x = imageDrawPosition.x + e.originalEvent.touches[0].clientX - mouseDownPosition.x;
			drawImage(imageDrawPosition);
		}

		var setImageDrawSize = function () {
			if (!image) return;
			if (imageDrawSize.h != 0)
				imageDrawPosition.x = imageDrawPosition.x * canvasElement.height / imageDrawSize.h;
			imageDrawSize.h = canvasElement.height;
			imageDrawSize.w = image.width * canvasElement.height / image.height;
		}
		var drawImage = function (position) {
			if (!image) return;
			if (position.x > canvasElement.width) {
				position.x = position.x - imageDrawSize.w;
			}
			if (position.x + imageDrawSize.w < 0) {
				position.x = position.x + imageDrawSize.w;
			}
			canvasContext.drawImage(image, position.x, position.y, imageDrawSize.w, imageDrawSize.h);
			if (position.x > 0) {
				canvasContext.drawImage(image, position.x - imageDrawSize.w, position.y, imageDrawSize.w, imageDrawSize.h);
			}
			if (position.x + imageDrawSize.w < canvasElement.width) {
				canvasContext.drawImage(image, position.x + imageDrawSize.w, position.y, imageDrawSize.w, imageDrawSize.h);
			}
		}
		
		var doubleClick = function (e) {

		}
		var resize = function () {
			canvasElement.width = canvas.width();
			canvasElement.height = canvas.height();
			setImageDrawSize();
			drawImage(imageDrawPosition);
		}

		canvas.mousedown(mouseDown);
		canvas.bind("touchstart", touchStart);
		canvas.dblclick(doubleClick);

		el.append(canvas);
	}

	// jQuery Plugin Initialisation
	$.fn.zxcviewerCanvas = function (params) {
		viewerCanvas(this, params);
		return this;
	}
})(jQuery);