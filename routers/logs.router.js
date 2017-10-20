module.exports = function (app, db) {
    app.route('/logs')
        .get(function (req, res) {
            db.logs.find().sort({
                date: -1
            }, function (err, docs) {
                console.log(docs);
                res.json(docs);
                console.log("GET Response respondido.");
            });
        })
        .post(function (req, res) {
            console.log(req.body);
            db.logs.insert(req.body, function (err, doc) {
                res.json(doc);
                console.log("POST Response respondido.");
            })
        })
        .put(function (req, res) {
            res.send('Update the book');
        }).delete(function (req, res) {
            db.logs.remove(function (err, doc) {
                res.json(doc);
                console.log("DELETE Response enviado.");
            });
        });
}
