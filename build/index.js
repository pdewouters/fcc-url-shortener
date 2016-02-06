'use strict';

var _expressHandlebars = require('express-handlebars');

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _url_model = require('./inc/url_model');

var _url_model2 = _interopRequireDefault(_url_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();
var express = require('express');
var app = express();

var validurl = require('valid-url');

app.set('port', process.env.PORT || 5000);

app.engine('handlebars', (0, _expressHandlebars2.default)({ layoutsDir: __dirname + "/views/layouts/", defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
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
            _url_model2.default.findOne({ original: req.params[0] }, function (err, url) {
                if (err) console.log(err);
                if (url) {
                    res.send(JSON.stringify({ original: url.original, short: baseUrl + url.id }));
                } else {
                    var _url = new _url_model2.default({ original: req.params[0] });

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
    _url_model2.default.findById(req.params.id, function (err, url) {
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