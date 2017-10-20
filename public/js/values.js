'use strict';

var meuApp = angular.module('meuApp');

meuApp.value('config', {
    baseUrl: "http://localhost:3000"
    //    baseUrl: "http://136.166.96.168:3000"
});

meuApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/listUsers");

    $stateProvider
        .state('listUsers', {
            url: "/listUsers",
            templateUrl: "template/users.html",
            controller: "appCtrl"
        })

        .state('listLogs', {
            url: "/listLogs",
            templateUrl: "template/logs.html",
            controller: "appCtrl"
        });
});
