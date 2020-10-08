const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
// const basicAuth = require('express-basic-auth');
const cron = require('node-cron');

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');

// app.use(basicAuth({
//     users: { 'admin': 'mindwebs' }
// }))

// MongoDB Configuration
const uri = process.env.connection_uri;
mongoose
    .connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then()
    .catch(err => console.log('Error:' + err));
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connection Successful.');
})

const main = require('./routes/main');
const api = require('./routes/api');

app.use('/', main);
app.use('/api', api);

app.listen(port, () => {
    console.log(`Listening to requests on ${port}`);
});