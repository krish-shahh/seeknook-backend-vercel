const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const serviceController = require('../../controllers/serviceController');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', serviceController.getServiceTypes);

module.exports = app;
