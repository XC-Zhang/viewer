angular.module('Viewer')

.directive('ringnumber', [function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/ringnumber.html',
		controller: function ($scope, $mdToast) {
			var refresh = function (obj) {
				if ($scope.$root.ringNumbers) {
					$scope.ringNumber = $scope.$root.ringNumbers[$scope.$root.current.section][$scope.$root.current.site].Number | "无";
					$scope.mileage = $scope.$root.ringNumbers[$scope.$root.current.section][$scope.$root.current.site].Mileage | "无";
					$scope.warning = $scope.$root.ringNumbers[$scope.$root.current.section][$scope.$root.current.site].Warning | false;
				}
				else {
					$scope.ringNumber = "无";
					$scope.mileage = "无";
					$scope.warning = false;					
				}
				$scope.date = obj.date.replace(/\//g, '-');
			};
			$scope.warning = false;
			$scope.$root.$watch('current.site', function (newValue) {
				if (newValue < 0)
					return;
				else {
					refresh($scope.$root.current.information[newValue]);
				}
			});
			$scope.$root.$watch('current.information', function (newValue) {
				if (!newValue || $scope.$root.current.site < 0)
					return;
				else {
					refresh(newValue[$scope.$root.current.site]);
				}
			});
		}
	};
}])

;