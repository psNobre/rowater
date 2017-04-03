'use strict';

var meuApp = angular.module('meuApp',['ngTable','ui.router','ngMask']);

meuApp.controller('appCtrl',function ($scope, $window, contatoService, logService, NgTableParams) {

    $scope.contatos = [];

    var carregarContatos = function () {
        contatoService.getContatos().success(function  (response) {
            $scope.contatos = response;
        });

    }

    var carregarLogs = function () {
        logService.getLogs().success(function  (response) {
            $scope.logs = response;  

            $scope.tableParams = new NgTableParams({
                page: 1,
                count: 10
            }, {
                total: $scope.logs.length, 
                dataset: $scope.logs
            });
        });
    }

    var createLog = function (type, description, date) {
        var log = {
            type: type,
            description: description,
            date: date    
        }

        logService.setLog(log).success(function (response){
//            console.log(response);
        });

    }

    var reOrderRow = function (rowater) {
        $scope.contatos.forEach(function (element, index){      
            rowater.forEach(function (element2, index2){
                if(element.name == element2){
                    element.position = index2;
                    rowater[index2] = element.name;
                    contatoService.updContato(element._id, element).success(function  (response) {
                    });
                }                                
            })
        })
    }

    $("#rowater").sortable({
        connectWith: ".connectList",
        update: function( event, ui ) {
            var rowater = $( "#rowater" ).sortable( "toArray" );
            createLog("move_type","Lista foi reordenada.", new Date());
            reOrderRow(rowater);
        }

    }).disableSelection();

    $scope.adicionaContato = function (contato) {
        contato.data = new Date();
        contato.count = 0

        contatoService.setContato(contato).success(function (response){
            delete $scope.contato;
            $scope.contatoForm.$setPristine();

            createLog("isert_type",contato.name + " foi inserido.", new Date());

            carregarContatos();
        });
    }

    $scope.deleteContato = function (contato) {
        contatoService.rmvContato(contato._id).success(function (response){
            createLog("delete_type",contato.name + " foi deletado.", new Date());
        });

        carregarContatos();         
    }
    
    $scope.incrementCount = function (contato) {
        contato.count++;
        contatoService.updContato(contato._id, contato).success(function  (response) {
            console.log(response + " Atualizado com sucesso.");

            createLog("increment_type",contato.name + " foi incrementado para "+contato.count, new Date());

            carregarContatos();

        });
    }

    $scope.decrementCount = function (contato) {
        contato.count--;
        contatoService.updContato(contato._id, contato).success(function  (response) {
            console.log(response + " Atualizado com sucesso.");

            createLog("decrement_type",contato.name + " foi decrementado para "+contato.count, new Date());

            carregarContatos();

        });
    }
    
    $scope.clearLog = function () {
        logService.clearLog().success(function (response){
//            console.log(response);
            
            $window.location.reload();
        });
              
    }

    carregarContatos();
    carregarLogs();

});