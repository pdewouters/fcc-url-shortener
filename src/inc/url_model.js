'use strict'
const mongoose = require('mongoose')
const connection = mongoose.createConnection('mongodb://' + process.env.MONGOLAB_USER + ':' + process.env.MONGOLAB_PASS + '@ds055925.mongolab.com:55925/fccdev')

const autoIncrement = require('mongoose-auto-increment')

autoIncrement.initialize(connection)

const UrlSchema = new mongoose.Schema({
            original: String
})

UrlSchema.plugin(autoIncrement.plugin, 'Url')
export default connection.model( 'Url', UrlSchema )