angular.module('Viewer')

.directive('indexer', [function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/indexer.html',
		controller: function ($scope) {
			$scope.current = $scope.$root.current;
			$scope.expand = function () {
				$scope.expanded = !$scope.expanded;
			};
			$scope.siteSelected = function (index) {
				if (index === $scope.current.site)
					return;
				$scope.current.site = index;
			};
		}
	};
}])

;