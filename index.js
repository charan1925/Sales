/****************************************************************************** ***
                            * ITE5315 – Project
* I declare that this assignment is my own work in accordance with Humber Academic Policy. *
No part of this assignment has been copied manually or electronically from any other source *
(including web sites) or distributed to other students. 
*
* Name: Charandeep Singh Student ID: N01515226 Date: 19/03/2023 
*
* ****************************************************************************** **/

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const routes = require('./routes/api/profile')
const session = require('express-session');
require('dotenv').config()
const profile = require('./routes/api/person')
const auth = require('./routes/api/auth')
const passport = require('passport')
// const bcrypt = require('bcryptjs')
const secretKey = process.env.SECRET_KEY;

const port = process.env.PORT || 3000;
const app = express();


// setup handlebars
app.engine(
    '.hbs',
    exphbs.engine(
        {
            extname: '.hbs',
            helpers: {
                zeroToWord: function (value) {
                    return value === 0 ? "zero" : value;
                },
            }
        }
    )
)

app.set(
    'view engine',
    '.hbs'
)


// Connect to MongoDB Atlas
app.use(bodyParser.urlencoded({ extended: false }))

// get settings
const settings = require('./config/settings')

// mongo db 
const db = process.env.DB_URL

// //Environment Variable
// mongoose.connect(process.env.URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

// attempt to connect with DB
// mongoose
//     .connect(db)
//     .then(() => console.log('MongoDB connected successfully.'))
//     .catch(err => console.log(err))

// Using .env
// mongoose.connect(db, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
mongoose.connect(db, { dbName: 'final_project',useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));


// Middleware
app.use(bodyParser.json());
app.use('/api', routes);

app.use('/api/profile', profile)

app.use('/api/auth', auth)

// Config for JWT strategy
require('./strategies/jsonwtStrategy')(passport)

app.get('/register', (req, res) => {
    res.render('register',
        {
            title: 'Registration'
        });
});

app.get('/', (req, res) => {
    res.render('login')
    app.get('/api/sales-ui');

});

// app.get('/jwt', (req, res) => {
//     res.render('jwt',
//         {
//             title: 'Enter the token'
//         });
// });

app.listen(port, () => console.log(`Server listening on port ${port}...`));
