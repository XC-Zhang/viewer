angular.module('Viewer')

.directive('menu', [function () {
	return {
		restrict: 'A',
		templateUrl: 'partials/menu.html',
		controller: function ($scope) {
			$scope.onclick = function (index) {
				$scope.$root.current.section = index;
			}
		}
	};
}])

;