'use strict';

var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');

var app = express();
var db = mongojs('test', ['users', 'logs']);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

//GETs
app.get('/users', function (req, res) {
    db.users.find().sort({
        position: 1
    }, function (err, docs) {
        res.json(docs);
        console.log("[" + new Date().toLocaleString().replace(/T/, ' ').replace(/\..+/, '') + "]" + " GET Response respondido.");
    });
});

app.get("/users/:id", function (req, res) {
    var id = req.params.id;
    db.users.findOne({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
        console.log("[" + new Date().toLocaleString().replace(/T/, ' ').replace(/\..+/, '') + "]" + " GET Response respondido.");
    });
});

//POSTs
app.post('/users', function (req, res) {
    db.users.insert(req.body, function (err, doc) {
        res.json(doc);
        console.log("[" + new Date().toLocaleString().replace(/T/, ' ').replace(/\..+/, '') + "]" + " POST Response respondido.");
    })
});

//DELETEs
app.delete('/users/:id', function (req, res) {
    var id = req.params.id;
    db.users.remove({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
        console.log("[" + new Date().toLocaleString().replace(/T/, ' ').replace(/\..+/, '') + "]" + " DELETE Response enviado.");
    });
});

//PUTs
app.put('/users/:id', function (req, res) {
    var id = req.params.id;
    db.users.findAndModify({
        query: {
            _id: mongojs.ObjectId(id)
        },
        update: {
            $set: {
                name: req.body.name,
                count: req.body.count,
                position: req.body.position,
                data: new Date()
            }
        },
        new: true
    }, function (err, doc) {
        res.json(doc);
        console.log("[" + new Date().toLocaleString().replace(/T/, ' ').replace(/\..+/, '') + "]" + " PUT Response enviado.");
    });

});

//------------------------- Logs ---------------------------------------------

app.get('/logs', function (req, res) {
    db.logs.find().sort({
        date: -1
    }, function (err, docs) {
        console.log(docs);
        res.json(docs);
        console.log("GET Response respondido.");
    });
});

app.post('/logs', function (req, res) {
    console.log(req.body);
    db.logs.insert(req.body, function (err, doc) {
        res.json(doc);
        console.log("POST Response respondido.");
    })
});

app.delete('/logs', function (req, res) {
    db.logs.remove(function (err, doc) {
        res.json(doc);
        console.log("DELETE Response enviado.");
    });
});

app.listen(3000);
console.log("Server Rodando: porta 3000");
