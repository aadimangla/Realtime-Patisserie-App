const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path")
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

//Database Connection
mongoose.connect("mongodb://localhost:27017/cakesDB", { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected');
}).catch(err => {
    console.log('Connection Failed!');
});

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