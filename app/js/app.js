var boat = angular.module('boat', []);

boat.controller('boatController',['$scope', '$http', function ($scope, $http){

        function log (method, message) {
            // $http.get('/log/add', message).success(function(){console.log('win')});
            console.log(method + ': ' + message);
        }

        function trigger (method) {
            $http({ method: 'GET', url: '/api/v1/' + method + '/' + $scope[method] }).
                success(function (data, status, headers, config) {
                    log(method, 'it worked');
                }).
                error(function (data, status, headers, config) {
                    log(method, 'it failed');
                });
        }

        $scope.motorspeed = 0;
        $scope.angle = 90;

        $scope.togglePower = function () {
            $scope.motorspeed = 0
        };

        $scope.$watch('motorspeed', function () {
            trigger('motorspeed');
        });

        $scope.$watch('angle', function () {
            trigger('angle');
        });
}]);
