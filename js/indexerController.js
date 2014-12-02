angular.module('Viewer')

.directive('indexer', [function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/indexer.html',
		controller: function ($scope) {
			$scope.expand = function () {
				if ($scope.$root.current.section < 0)
					return;
				$scope.expanded = !$scope.expanded;
			};
			$scope.siteSelected = function (index) {
				if (index === $scope.$root.current.site)
					return;
				$scope.$root.current.site = index;
			};
		}
	};
}])

;