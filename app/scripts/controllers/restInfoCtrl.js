'use strict';

angular.module('myApp')
    .controller("restInfoCtrl", restInfoCtrl)
restInfoCtrl.$inject = ["$scope", "$uibModalInstance", "info"];

function restInfoCtrl($scope, $uibModalInstance, info) {
    $scope.info = info;

    $scope.close = function(){
        $uibModalInstance.close();
    }
}