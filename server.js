'use strict';

var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');

var app = express();
var db = mongojs('test',['users','logs']);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

//GETs
app.get('/users', function (req, res) {
	console.log('GET Request recebido.');
    db.users.find().sort({position: 1}, function (err, docs) {
        console.log(docs);
        res.json(docs);
        console.log("GET Response respondido.");
    });
});

//app.get("/contatos/:id", function (req, res) {
//    console.log('GET Request recebido.');
//    var id = req.params.id;
//    db.contatos.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
//        console.log(doc);
//        res.json(doc);
//        console.log("GET Response respondido.");
//    });
//});
//
//POSTs
app.post('/users', function (req, res) {
    console.log('POST Request recebido.');
    console.log(req.body);
    db.users.insert(req.body, function (err, doc) {
        res.json(doc);
        console.log("POST Response respondido.");
    })
});

//DELETEs
app.delete('/users/:id', function (req, res) {
    var id = req.params.id;
    console.log("DELETE Request recebido: objectId - "+id);
    db.users.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
        res.json(doc);
        console.log("DELETE Response enviado.");
    });
});

//PUTs
app.put('/users/:id', function (req, res) {
     var id = req.params.id;
     console.log("PUT Request recebido.");
     db.users.findAndModify({query: {_id: mongojs.ObjectId(id)},
     update: {$set: {count: req.body.count, position: req.body.position, data: new Date()}}, new: true}, function (err, doc) {
         res.json(doc);
         console.log("PUT Response enviado.");
        });

});

//---------------------------------------------------------------------------

app.get('/logs', function (req, res) {
	console.log('GET Request recebido.');
    db.logs.find().sort({date: -1}, function (err, docs) {
        console.log(docs);
        res.json(docs);
        console.log("GET Response respondido.");
    });
});

app.post('/logs', function (req, res) {
    console.log('POST Request recebido.');
    console.log(req.body);
    db.logs.insert(req.body, function (err, doc) {
        res.json(doc);
        console.log("POST Response respondido.");
    })
});

app.delete('/logs', function (req, res) {
    console.log("DELETE Request recebido: objectId - ");
    db.logs.remove(function (err, doc) {
        res.json(doc);
        console.log("DELETE Response enviado.");
    });
});

app.listen(3000);
console.log("Server Rodando: porta 3000");