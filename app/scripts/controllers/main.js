'use strict';

angular.module('myApp')
  .controller("mainCtrl", mainCtrl)
mainCtrl.$inject = ["$scope", "NgMap", "$http", "$uibModal"];

function mainCtrl($scope, NgMap, $http, $uibModal) {
  var restMarkers = [];
  $scope.nearbyRes = [];


  // map func
  NgMap.getMap().then(function (evtMap) {
    $scope.map = evtMap;
    checkGeoLoc();
  });

  $scope.changeUserRestPos = function (e) {
    if ($scope.marker) {
      $scope.marker.setMap(null);
    }
    console.log(e.latLng.lat());
    console.log(e.latLng.lng());
    $scope.marker = new google.maps.Marker({
      position: e.latLng,
      map: $scope.map
    });
    $scope.map.panTo(e.latLng);
    $scope.map.setZoom(12);
    getRestraunts(e.latLng);
  }

  function getRestraunts(latLng) {
    var headers = {
      "Accept": "application/json",
      "user-key": "1d6e387a44a449b655310a8e6dd35170"
    }
    var url = "https://developers.zomato.com/api/v2.1/geocode?"
    url += "lat=" + latLng.lat() + "&lon=" + latLng.lng();
    $http.get(url, {
      headers: headers
    }).then(function (res) {
      $scope.nearbyRes = res.data.nearby_restaurants;
      placeRestMarkers($scope.nearbyRes);
    }, function (res) {
      //console.log(res);
      removeRestMarkers();
      window.alert("No Restraunts found for this location");
    })
  }

  function placeRestMarkers(rest) {
    // removing restMarkers if any
    removeRestMarkers();
    // add new markers
    for (var i = 0; i < rest.length; i++) {
      var restInfo = rest[i].restaurant;
      var icon = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
      var loc = new google.maps.LatLng(Number(restInfo.location.latitude), Number(restInfo.location.longitude));
      var marker = new google.maps.Marker({
        position: loc,
        icon: icon,
        map: $scope.map,
        title: restInfo.name,
        snippet: restInfo.cuisines
      });
      setupListener(restInfo);
      restMarkers.push(marker);
    }
    function setupListener(details){
        var detailsRes = details;
        marker.addListener('click', function () {
          showDetails(detailsRes);
      })
    }
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < restMarkers.length; i++) {
      bounds.extend(restMarkers[i].getPosition());
    }
    bounds.extend($scope.marker.getPosition());
    $scope.map.fitBounds(bounds);
  }

  function removeRestMarkers() {
    for (var i = 0; i < restMarkers.length; i++) {
      restMarkers[i].setMap(null);
    }
    restMarkers = [];
  }

  //search func
  $scope.search = function () {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=";
    var add = formatSearch($scope.searchText);
    url += add;
    url += "&key=AIzaSyC9eGxd2dRKtP8mU2dzFTaOC4wmdvC14h8";
    $http.get(url).then(function (res) {
      if (res.data.results.length == 0) {
        window.alert("Unable to get location");
      } else {
        changeUserRestPosText(res.data.results[0].geometry.location);
      }
    }, function (res) {
      window.alert("Unable to get location");
    })
  }

  function changeUserRestPosText(latLngObj) {
    if ($scope.marker) {
      $scope.marker.setMap(null);
    }
    var latLng = new google.maps.LatLng(Number(latLngObj.lat), Number(latLngObj.lng));
    $scope.marker = new google.maps.Marker({
      position: latLng,
      map: $scope.map
    });
    $scope.map.panTo(latLng);
    $scope.map.setZoom(12);
    getRestraunts(latLng);
  }

  function formatSearch(str) {
    var fStr = str.split(" ");
    return fStr.join("+");
  }

  // html5 geolocation
  function checkGeoLoc() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(usePosition);
    }

    function usePosition(position) {
      var latLng = new google.maps.LatLng(Number(position.coords.latitude), Number(position.coords.longitude));
      $scope.marker = new google.maps.Marker({
        position: latLng,
        map: $scope.map
      });
      $scope.map.panTo(latLng);
      $scope.map.setZoom(12);
      getRestraunts(latLng);
    }
  }

  function showDetails(details) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/restInfo.html',
      controller: 'restInfoCtrl',
      backdrop: 'static',
      size: 'lg',
      resolve: {
        info: function () {
          return details;
        }
      }
    });
    modalInstance.result.then(function (item) {
      //refresh or do nothing
    }, function () {
      //refresh or do nothing, show err
    });
  }
}