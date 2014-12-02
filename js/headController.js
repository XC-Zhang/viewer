angular.module('Viewer')

.directive('header', [function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/head.html'
	};
}])

;