'use strict';

var app = angular.module('twitterApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', { url: '/', templateUrl: '/partials/home.html', controller: 'homeCtrl' })
    .state('profile', { url: '/profile', templateUrl: '/partials/profile.html', controller: 'profileCtrl' })

  $urlRouterProvider.otherwise('/');
});
