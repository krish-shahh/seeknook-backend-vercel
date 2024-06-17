const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const listingsController = require('../../controllers/listingsController');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', listingsController.getListings);
app.delete('/:uuid', listingsController.deleteListing);
app.put('/:uuid/favorite', listingsController.toggleFavorite);

module.exports = app;
