const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode.js')
const forcast = require('./utils/forecast.js')

const app = express()
const port = process.env.PORT || 3000 

// define paths for express config
const publicDirectoryPath = path.join(__dirname,'../puclic')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')
//set up handlerbars engine and location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

//set up static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('',(req,res)=>{
    res.render('index',{
        title: 'Main Page',
        name: 'kaokao'
    })
})


app.get('/about',(req,res)=>{
    res.render('about',{
        title: 'about',
        name: 'kaokao'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        helpText: 'this is to help you',
        title: 'help',
        name: 'kaokao'
    })
})

app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({
            error: 'plz provide an address'
        })
    }

    geocode(req.query.address,(error,{latitude,longitude,location}={})=>{
        if(error){
            return res.send({error})
        }

        forcast(latitude,longitude,(error,forcastData)=>{
            if(error){
                return res.send({error})
            }

            res.send({
                forecast: forcastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products',(req,res)=>{
    if(!req.query.search){
        return res.send({
            error: 'you must provide a search term'
        })
    }
    res.send({
        products: []
    })
})

app.get('/help/*',(req,res)=>{
    res.render('404page',{
        title: 'Error Help',
        name: 'kaokao',
        errorMessage: 'no help article'
    })
})

app.get('*',(req,res)=>{
    res.render('404page',{
        title: '404',
        name: 'kaokao',
        errorMessage: 'wrong page'
    })
})


app.listen(port, ()=>{
    console.log('server is on on port '+ port);
})