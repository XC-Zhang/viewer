(function ($) {

	function viewerCanvas(el, params) {
		// Properties
		el.setImage = function (img) {
			image = img;
		}
		// Methods
		el.onResize = function () {
			resize();
		}

		var canvas = $("<canvas></canvas>");
		var canvasElement = canvas.get(0);
		var image = null;
		var mouseDownPosition = { x: 0, y: 0 };
		var imageDrawPosition = { x: 0, y: 0 };

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
				y: imageDrawPosition.y + e.clientY - mouseDownPosition.y
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
			imageDrawPosition.y = imageDrawPosition.y + e.clientY - mouseDownPosition.y;
			drawImage(imageDrawPosition);
		}
		var drawImage = function (position) {

		}
		var doubleClick = function (e) {

		}
		var resize = function () {
			
		}

		canvas.mousedown(mouseDown);
		canvas.dblclick(doubleClick);

		el.append(canvas);
	}

	// jQuery Plugin Initialisation
	$.fn.zxcviewerCanvas = function (params) {
		viewerCanvas(this, params);
		return this;
	}
})(jQuery);