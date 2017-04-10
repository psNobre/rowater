'use strict';

var meuApp = angular.module('meuApp',['ngTable','ui.router','ngMask']);

meuApp.controller('appCtrl',function ($scope, $state, $window, contatoService, logService, NgTableParams) {

    $scope.editorEnabled = false;

    $scope.enableEditor = function (contato) {
        contatoService.getOneContato(contato._id).success(function  (response) {
            $scope.editorEnabled = true;
            $scope.editableTitle = response.name;
            $scope.editUserName = contato.name;

        });
    }

    $scope.disableEditor = function() {
        $scope.editorEnabled = false;
    };

    var carregarContatos = function () {
        contatoService.getContatos().success(function  (response) {
            $scope.contatos = response;
            reOrderRow();
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
        });

    }

    var updateEdit = function (rowater) {
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

    var reOrderRow = function () {
        $scope.contatos.forEach(function (element, index){
            element.position = index;
            contatoService.updContato(element._id, element).success(function  (response) {
            });
        });
    }

    function moveElementInArray (array, value, positionChange) {
        var oldIndex = array.indexOf(value);
        if (oldIndex > -1){
            var newIndex = (oldIndex + positionChange);

            if (newIndex < 0){
                newIndex = 0
            }else if (newIndex >= array.length){
                newIndex = array.length
            }

            var arrayClone = array.slice();
            arrayClone.splice(oldIndex,1);
            arrayClone.splice(newIndex,0,value);

            return arrayClone
        }
        return array
    }

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

    $scope.editModeActive = function () {
        if($scope.editMode){
            $scope.editMode = false;
            //            $window.location.reload();
            $state.go($state.current.name, {}, {reload: true});
        }else{
            $scope.editMode = true;
            $("#rowater").sortable({
                disabled: false,
                connectWith: ".connectList",
                update: function( event, ui ) {
                    var rowater = $( "#rowater" ).sortable( "toArray" );
                    createLog("reorder_type","Lista foi reorganizada.", new Date());
                    updateEdit(rowater);

                }

            }).disableSelection();

        }

    }

    $scope.deleteContato = function (contato) {
        contatoService.rmvContato(contato._id).success(function (response){
            createLog("delete_type",contato.name + " foi deletado.", new Date());
        });

        carregarContatos();         
    }

    $scope.editarContato = function (contato) {
        contatoService.getOneContato(contato._id).success(function  (response) {
            $scope.contato = response;
        });
    }

    $scope.atualizarContato = function (contato) {
        contatoService.updContato(contato._id, contato).success(function  (response) {
            delete $scope.contato;
            $scope.contatoForm.$setPristine();
            carregarContatos();

        });
        $scope.editorEnabled = false;
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

    $scope.endRow = function (contato) {

        if(contato.count < 0){
            contato.count++;
            $scope.contatos = moveElementInArray($scope.contatos, contato, $scope.contatos.length);
            createLog("move_type",contato.name+" foi enviado para o final da fila e decrementado para "+contato.count+".", new Date());
        }else if (contato.count > 0){
            contato.count--;
            createLog("move_type",contato.name+" foi enviado para o final da fila, mas por seu saldo ser "+contato.count+", permanceu no lugar.", new Date());
        }else{
            $scope.contatos = moveElementInArray($scope.contatos, contato, $scope.contatos.length);
            createLog("move_type",contato.name+" foi enviado para o final da fila.", new Date());
        }

        reOrderRow();

    }

    $scope.passTurn = function (contato) { 
        contato.count++;

        $scope.contatos = moveElementInArray($scope.contatos, contato, $scope.contatos.length);
        createLog("move_type",contato.name+" passou a vez.", new Date());

        reOrderRow();

    }

    $scope.clearLog = function () {
        logService.clearLog().success(function (response){
            $window.location.reload();
        });

    }

    carregarContatos();
    carregarLogs();

});