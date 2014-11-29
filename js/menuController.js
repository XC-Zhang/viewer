angular.module('Viewer')

.directive('menu', [function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/menu.html',
		controller: function ($scope) {
			$scope.line = $scope.$root.line;
			$scope.current = $scope.$root.current.section;
			$scope.onclick = function (index) {
				$scope.current = index;
			}
		}
	};
}])

;