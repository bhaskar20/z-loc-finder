'use strict';

angular.module('myApp', [
  'ui.bootstrap',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'ngMap'
])
  .config(["$routeProvider",function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'mainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
