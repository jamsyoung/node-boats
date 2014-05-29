var boat = angular.module('boat', []);

boat.controller('boatController',['$scope', '$http', '$timeout', function ($scope, $http, $timeout){

        function log (method, message) {
            console.log(method + ': ' + message);
        }

        function trigger (method) {
            $http({ method: 'GET', url: '/api/v1/' + method + '/' + $scope[method] })
                .success(function (data, status, headers, config) {
                    log(method, 'it worked');
                })
                .error(function (data, status, headers, config) {
                    log(method, 'it failed');
                });
        }

        var timeoutPromise,
            timeoutPromise2;

        $scope.motorspeed = 0;
        $scope.angle = 90;

        $scope.togglePower = function () {
            $scope.motorspeed = 0
            trigger('motorspeed');
        };

        $scope.$watch('motorspeed', function () {

            if (timeoutPromise) {
                $timeout.cancel(timeoutPromise);
            }

            timeoutPromise = $timeout(function () {
                trigger('motorspeed');
            }, 500);
        });

        $scope.$watch('angle', function () {

            if (timeoutPromise2) {
                $timeout.cancel(timeoutPromise2);
            }

            timeoutPromise2 = $timeout(function () {
                trigger('angle');
            }, 500);
        });

}]);
