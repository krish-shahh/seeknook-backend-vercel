const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const adminController = require('../../controllers/adminController');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/businesses', adminController.getBusinesses);
app.get('/franchises', adminController.getFranchises);
app.delete('/businesses/:uuid', adminController.deleteBusiness);
app.delete('/franchises/:uuid', adminController.deleteFranchise);
app.put('/businesses/:uuid', adminController.updateBusinessStatus);
app.put('/franchises/:uuid', adminController.updateFranchiseStatus);

module.exports = app;
