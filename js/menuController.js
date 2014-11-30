angular.module('Viewer')

.directive('menu', [function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/menu.html',
		controller: function ($scope) {
			$scope.line = $scope.$root.line;
			$scope.current = $scope.$root.current;
			$scope.onclick = function (index) {
				$scope.$root.current.section = index;
			}
		}
	};
}])

;