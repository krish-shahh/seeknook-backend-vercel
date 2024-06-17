const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const businessController = require('../../controllers/businessController');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', businessController.getBusinesses);
app.post('/', businessController.createBusiness);
app.put('/:id/like', businessController.updateBusinessLikes);
app.put('/:uuid', businessController.updateBusiness);
app.delete('/:uuid', businessController.deleteBusiness);

module.exports = app;
