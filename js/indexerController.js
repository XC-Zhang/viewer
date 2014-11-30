angular.module('Viewer')

.directive('indexer', [function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/indexer.html',
		controller: function ($scope) {
			$scope.current = $scope.$root.current;
		}
	};
}])

;