'use strict';

var meuApp = angular.module('meuApp');

meuApp.service('contatoService', function ($http, config) {
	
	this.getContatos = function () {
		return $http.get(config.baseUrl + "/users");
	}

//	this.getOneContato = function (id) {
//		return $http.get(config.baseUrl + "/contatos/"+id);
//	}

	this.setContato = function (contato) {
		return $http.post(config.baseUrl + "/users", contato);
	}

	this.rmvContato = function (id) {
		return $http.delete(config.baseUrl + "/users/"+id);
	}

	this.updContato = function (id, contato) {
		return $http.put(config.baseUrl + "/users/"+id, contato);
	}
});