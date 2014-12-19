angular.module('Viewer')

.directive('header', [function () {
	return {
		restrict: 'A',
		templateUrl: 'partials/head.html',
		controller: function ($scope, $mdSidenav) {
			$scope.toggleMenu = function () {
				$mdSidenav('left').toggle();
			};
		}
	};
}])

;