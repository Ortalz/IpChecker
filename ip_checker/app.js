const express = require('express');
const app = express();
const cors = require('cors');
const Controller = require(__dirname + '/controller/appController');
const port = process.env.POST || 5000;
const path = require('path');
const bodyParser = require('body-parser');
const appController = new Controller();


/** Middlewares */
app.use(cors());
// app.use(express.static(path.join(__dirname, '/view')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

appController.setPaths(app);



app.listen(port, function() {
  console.log(`App is listening on port ${port}`);
});
