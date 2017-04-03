'use strict';

var meuApp = angular.module('meuApp');

meuApp.service('logService', function ($http, config) {
	
	this.getLogs = function () {
		return $http.get(config.baseUrl + "/logs");
	}

	this.setLog = function (log) {
		return $http.post(config.baseUrl + "/logs", log);
	}

	this.clearLog = function () {
		return $http.delete(config.baseUrl + "/logs");
	}
});