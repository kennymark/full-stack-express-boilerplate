var path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    hbs = require('express-handlebars'),
    session = require('express-session'),
    validator = require('express-validator'),
    mongoose = require('mongoose'),
    encrypter = require('encrypter');
    require('dotenv').config();

var app = express();
var port = process.env.PORT || 8000;
var user = require('./models/users');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {useMongoClient: true}, function(err){
    if (err) throw err;
   console.log('Connected to Database')
})

//view engine
app.engine('hbs', hbs({
    defaultLayout: 'main',
    extname: 'hbs'
}));

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'));
app.use('/public/', express.static('public/'));

app.use(session({
    secret: 'whateveryoulike',
    resave: 'true',
    saveUninitialized: 'true'
}));

//body-parsing
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.use(validator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            msg: msg,
        };
    }
}));

app.get('/', function (req, res) {
    res.render('index',{title:'Home'})
});
app.get('/register', function (req, res) {
    res.render('register',{title:'Register'})
});

app.post('/register', function (req, res) {
    var data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    console.log(data)
    var User = new user(data);
    User.save(function(err, person){
        if (err){
            console.log(`Couldn't save to database`)
        }
        else{
            console.log(`New user saved sucessfully ${person}`)
        }
    });
    res.redirect('/')
});

app.listen(port, function () {
    console.log(`Running at http://localhost:${port}`)
})