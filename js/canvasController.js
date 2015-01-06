angular.module("Viewer")

.directive('canvas', [function () {
	return {
		restrict: 'E',
		controller: function ($scope) {
			var pano = document.getElementById('pano');
			pano.width = pano.clientWidth;
			pano.height = pano.clientHeight;
			var hammer = new Hammer(pano);
			var canvas = pano.getContext('2d');
			var image = null;
			var mouseDownPosition = { x: 0, y: 0 };
			var imageDrawPosition = { x: 0, y: 0 };
			var imageDrawSize = { w: 0, h: 0 };

			var setImage = function (img) {
				image = img;
				setImageDrawSize();
				drawImage(imageDrawPosition);
			};

			var setImageDrawSize = function () {
				if (!image) return;
				if (imageDrawSize.h != 0)
					imageDrawPosition.x = imageDrawPosition.x * pano.height / imageDrawSize.h;
				imageDrawSize.h = pano.height;
				imageDrawSize.w = image.width * pano.height / image.height;
			};

			var reloadImage = function () {
				if ($scope.$root.current.section < 0 || $scope.$root.current.site < 0)
					return;
				var img1 = new Image();
				img1.src = "http://7i7im8.com1.z0.glb.clouddn.com/image/" 
					+ ($scope.$root.current.line - 0) + "/" 
					+ $scope.$root.current.section + "/" 
					+ (($scope.$root.current.site + 1) > 9 ? ($scope.$root.current.site + 1) : "0" + ($scope.$root.current.site + 1)) + "_" 
					+ "0.jpg";
				img1.onload = function () {
					var index = parseInt(this.src.substr(this.src.length - 8, 2)) - 1;
					var section = parseInt(this.src.substr(this.src.length - 10, 1));
					var line = parseInt(this.src.substr(this.src.length - 13, 2));
					if (index != $scope.$root.current.site || section != $scope.$root.current.section || line != $scope.$root.current.line) 
						return;
					setImage(this);
					var img2 = new Image();
					img2.src = "http://7i7im8.com1.z0.glb.clouddn.com/image/" 
						+ ($scope.$root.current.line - 0) + "/" 
						+ $scope.$root.current.section + "/" 
						+ (($scope.$root.current.site + 1) > 9 ? ($scope.$root.current.site + 1) : "0" + ($scope.$root.current.site + 1)) + "_" 
						+ "1.jpg";
					img2.onload = function () {
						var index = parseInt(this.src.substr(this.src.length - 8, 2)) - 1;
						var section = parseInt(this.src.substr(this.src.length - 10, 1));
						var line = parseInt(this.src.substr(this.src.length - 13, 2));
						if (index != $scope.$root.current.site || section != $scope.$root.current.section || line != $scope.$root.current.line) 
							return;
						setImage(this);
					}
				}
			};

			var drawImage = function (position) {
				if (!image) return;
				if (position.x > pano.width) {
					position.x = position.x - imageDrawSize.w;
				}
				if (position.x + imageDrawSize.w < 0) {
					position.x = position.x + imageDrawSize.w;
				}
				canvas.drawImage(image, position.x, position.y, imageDrawSize.w, imageDrawSize.h);
				if (position.x > 0) {
					canvas.drawImage(image, position.x - imageDrawSize.w, position.y, imageDrawSize.w, imageDrawSize.h);
				}
				if (position.x + imageDrawSize.w < pano.width) {
					canvas.drawImage(image, position.x + imageDrawSize.w, position.y, imageDrawSize.w, imageDrawSize.h);
				}
			};

			hammer.on('panmove', function (e) {
				if (!image) return;
				var tempPosition = {
					x: imageDrawPosition.x + e.deltaX,
					y: 0
				};
				drawImage(tempPosition);	
			});

			hammer.on('panend', function (e) {
				imageDrawPosition.x = imageDrawPosition.x + e.deltaX;
			});

			$scope.$root.$watch('current.line', function (newValue) {
				if (newValue < 0)
					return;
				reloadImage();
			});

			$scope.$root.$watch('current.section', function (newValue) {
				if (newValue < 0)
					return;
				reloadImage();
			});

			$scope.$root.$watch('current.site', function (newValue) {
				if (newValue < 0)
					return;
				reloadImage();
			});
		}
	};
}])

;