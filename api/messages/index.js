const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const messageController = require('../../controllers/messageController');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/admin-message', messageController.getAdminMessage);

module.exports = app;
