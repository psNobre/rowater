module.exports = function (app, db) {
    app.route('/users')
        .get(function (req, res) {
            db.users.find().sort({
                position: 1
            }, function (err, docs) {
                res.json(docs);
                console.log("[" + new Date().toLocaleString().replace(/T/, ' ').replace(/\..+/, '') + "]" + " GET Response respondido.");
            });
        })
        .post(function (req, res) {
            db.users.insert(req.body, function (err, doc) {
                res.json(doc);
                console.log("[" + new Date().toLocaleString().replace(/T/, ' ').replace(/\..+/, '') + "]" + " POST Response respondido.");
            })
        });
}
