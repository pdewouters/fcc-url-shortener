'use strict';

Object.defineProperty(exports, "__esModule", {
            value: true
});
var mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://' + process.env.MONGOLAB_USER + ':' + process.env.MONGOLAB_PASS + '@ds055925.mongolab.com:55925/fccdev');

var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(connection);

var UrlSchema = new mongoose.Schema({
            original: String
});

UrlSchema.plugin(autoIncrement.plugin, 'Url');
exports.default = connection.model('Url', UrlSchema);
//# sourceMappingURL=url_model.js.map