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

mongoose.connect(process.env.DB_URL, function(){
   console.log('Connected to Database')
})

mongoose.Promise = global.Promise;

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

app.listen(port, function () {
    console.log(`Running at http://localhost:${port}`)
})