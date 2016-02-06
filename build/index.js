'use strict';

require('dotenv').config();
var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var validurl = require('valid-url');
var UrlModel = require('./inc/url_model');

app.set('port', process.env.PORT || 3000);

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    var baseUrl = req.protocol + '://' + req.get('Host');
    res.render('home', { baseUrl: baseUrl });
});

// New URL to shorten
app.get('/new/*', function (req, res) {
    res.header("Content-Type", "application/json");
    var baseUrl = req.protocol + '://' + req.get('Host') + '/';

    if (validurl.isUri(req.params[0])) {

        if (baseUrl.indexOf(req.params[0]) !== -1) {
            res.send(JSON.stringify({ error: 'you can\'t shorten a URL from this domain!' }));
        } else {
            UrlModel.findOne({ original: req.params[0] }, function (err, url) {
                if (err) console.log(err);
                if (url) {
                    res.send(JSON.stringify({ original: url.original, short: baseUrl + url.id }));
                } else {
                    var _url = new UrlModel({ original: req.params[0] });

                    _url.save(function (err, url) {
                        if (err) return err;
                        res.send(JSON.stringify({ original: url.original, short: baseUrl + url.id }));
                    });
                }
            });
        }
    } else {
        res.send(JSON.stringify({ error: 'invalid url' }));
    }
});

// Redirect to original URL http://siteurl/4
app.get('/:id(\\d+)', function (req, res) {
    UrlModel.findById(req.params.id, function (err, url) {
        if (err) console.log(err);
        if (url) {
            res.redirect(url.original);
        }
    });
});

// Fallback
app.get('/*', function (req, res) {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify({ 'error': 'invalid route' }));
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
//# sourceMappingURL=index.js.map