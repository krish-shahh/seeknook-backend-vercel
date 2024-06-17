const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const franchiseController = require('../../controllers/franchiseController');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', franchiseController.getFranchises);
app.post('/', franchiseController.createFranchise);
app.put('/:id', franchiseController.updateFranchise);
app.delete('/:id', franchiseController.deleteFranchise);
app.put('/:id/like', franchiseController.updateFranchiseLikes);
app.post('/initialize-likes', franchiseController.initializeLikes);

module.exports = app;
