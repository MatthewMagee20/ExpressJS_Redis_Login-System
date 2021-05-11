const express = require('express')
const mongoose = require('mongoose')
const mustache = require('mustache-express')
const dotenv = require('dotenv')
const app = express()
const port = 3005
const User = require('./models/User')

dotenv.config()

const session = require('express-session')
const redis = require('redis')
const connectRedis = require('connect-redis')
const RedisStore = connectRedis(session)

//Configure redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
})

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err)
})
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully')
})

// Connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected')
)

// Routes
const authRoutes = require('./public/js/routes/auth')

const html_path = __dirname + '/public/html/'

// Route Middleware
app.use(express.static('public/js/'))
app.use(express.static('public/css/'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000/') // update to match the domain you will make the request from
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})
app.engine('html', mustache())
app.set('view engine', 'html')
app.set('views', __dirname + '/public/views')

//Configure session middleware
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: 'secret$%^134',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // if true only transmit cookie over https
            httpOnly: false, // if true prevent client side JS from reading the cookie
            maxAge: 1000 * 60 * 10, // session max age in miliseconds
        },
    })
)

app.get('/', async (req, res) => {
    if (req.session.email && req.session.password) {
        const currentUser = await User.findOne({
            email: req.session.email,
        })
        res.render('home', {
            first_name: currentUser.first_name,
            last_name: currentUser.last_name,
            dob: currentUser.dob,
            city: currentUser.city_of_birth,
            email: currentUser.email,
            address: currentUser.address,
            gender: currentUser.gender,
            hobbies: currentUser.hobbies,
            civil_state: currentUser.civil_state,
            profession: currentUser.profession,
            salary: currentUser.salary,
            sport: currentUser.sport,
            image: currentUser.image,
        })
    } else {
        res.redirect('/login')
    }
})

app.get('/login', (req, res) => {
    res.sendFile('login.html', { root: html_path })
})

app.get('/register', (req, res) => {
    res.sendFile('register.html', { root: html_path })
})

app.get('/edit_profile', async (req, res) => {
    if (req.session) {
        const currentUser = await User.findOne({
            email: req.session.email,
        })

        res.render('edit_profile', {
            first_name: currentUser.first_name,
            last_name: currentUser.last_name,
            dob: currentUser.dob,
            city: currentUser.city_of_birth,
            email: currentUser.email,
            address: currentUser.address,
            gender: currentUser.gender,
            hobbies: currentUser.hobbies,
            civil_state: currentUser.civil_state,
            profession: currentUser.profession,
            salary: currentUser.salary,
            sport: currentUser.sport,
        })
    }
})

app.get('/change_password', async (req, res) => {
    if (req.session) {
        const currentUser = await User.findOne({
            email: req.session.email,
        })
        res.sendFile('change_password.html', { root: html_path })
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err)
        }
        res.redirect('/')
    })
})

app.use('/api/user', authRoutes)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
