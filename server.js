'use strict';

var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');

var app = express();
var db = mongojs('test', ['users', 'logs']);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

require("./routers/users.router")(app, db);
require("./routers/logs.router")(app, db);


app.get('/users/:id', function (req, res) {
    var id = req.params.id;
    db.users.findOne({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
        console.log("[" + new Date().toLocaleString().replace(/T/, ' ').replace(/\..+/, '') + "]" + " GET Response respondido.");
    });
});

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

app.delete('/users/:id', function (req, res) {
    var id = req.params.id;
    db.users.remove({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
        console.log("[" + new Date().toLocaleString().replace(/T/, ' ').replace(/\..+/, '') + "]" + " DELETE Response enviado.");
    });
});

app.listen(3000, function () {
    console.log("Server Rodando: porta 3000");
});
