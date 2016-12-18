'use strict';

angular.module('myApp')
    .controller("restInfoCtrl", restInfoCtrl)
restInfoCtrl.$inject = ["$scope", "$uibModalInstance", "$location", "info"];

function restInfoCtrl($scope, $uibModalInstance, $location, info) {
    $scope.info = info;

    $scope.orderNow = function (url) {
        window.location.href = url;
    }

    $scope.close = function () {
        $uibModalInstance.close();
    }
}