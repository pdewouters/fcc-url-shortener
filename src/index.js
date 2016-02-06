'use strict'
require('dotenv').config();
import express from 'express'
const app = express()
import exphbs from 'express-handlebars'
import validurl from 'valid-url'
import UrlModel from './inc/url_model'

app.set('port', (process.env.PORT || 5000))

app.engine('handlebars', exphbs({layoutsDir: __dirname + "/views/layouts/", defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')
app.get('/', (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('Host')
    res.render('home', {baseUrl: baseUrl})
})

// New URL to shorten
app.get('/new/*', (req, res) => {
    res.header("Content-Type", "application/json")
    const baseUrl = req.protocol + '://' + req.get('Host') + '/'
    
    if(validurl.isUri(req.params[0])){

        if(baseUrl.indexOf(req.params[0]) !== -1) {
            res.send(JSON.stringify({error:'you can\'t shorten a URL from this domain!'}))
        } else {
            UrlModel.findOne({original:req.params[0]},(err, url) => {
                if (err) console.log(err)
                if(url) {
                    res.send(JSON.stringify({original:url.original, short: baseUrl + url.id}))
                } else {
                    let url = new UrlModel( {original: req.params[0]} )
        
                    url.save( (err, url ) => {
                        if (err) return err
                            res.send(JSON.stringify({original:url.original, short: baseUrl + url.id}))
                    })
                }
            })
        }
    
    } else {
        res.send(JSON.stringify({error: 'invalid url'}))
    }
})

// Redirect to original URL http://siteurl/4
app.get('/:id(\\d+)', (req, res) => {
    UrlModel.findById(req.params.id, (err, url) => {
        if (err) console.log(err)
        if(url) {
            res.redirect(url.original)
        }
    })
})

// Fallback
app.get('/*', (req, res) => {
    res.header("Content-Type", "application/json")
    res.send(JSON.stringify({'error':'invalid route'}))
})

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
})