angular.module('Viewer')

.directive('indexer', [function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/indexer.html',
		controller: function ($scope, $timeout) {
			$scope.siteSelected = function (index) {
				if (index === $scope.$root.current.site)
					return;
				$scope.$root.current.site = index;
			};
			$scope.$root.$watch('current.information', function (newValue) {
				if (!newValue)
					return;
			});
		}
	};
}])

;