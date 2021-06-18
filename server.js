require('dotenv').config()
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path")
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const session = require("express-session");
const flash = require('express-flash');
const MongoStore = require('connect-mongo');

//Database Connection
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected');
}).catch(err => {
    console.log('Connection Failed!');
});

//Session Store
// let mongoStore = new MongoDbStore({
//     mongooseConnection: connection,
//     collection: 'sessions'
// })

//Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL
        // client: connection.getClient()
    }),
    cookie: {maxAge: 1000* 60* 60* 24}//24 hrs
}));

app.use(flash());

//Assests
app.use(express.static('public'));

//Set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web.js')(app)



app.listen(PORT, () => {
    console.log("Server running on port " + PORT)
})