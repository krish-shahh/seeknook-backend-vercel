const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

// Function to fetch businesses
exports.getBusinesses = async (req, res) => {
  const params = {
    TableName: 'businesses',
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
  } catch (error) {
    console.error('Error fetching businesses from DynamoDB:', error);
    res.status(500).json({ error: 'Failed to fetch businesses.' });
  }
};

// Function to fetch franchises
exports.getFranchises = async (req, res) => {
  const params = {
    TableName: 'franchises',
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
  } catch (error) {
    console.error('Error fetching franchises from DynamoDB:', error);
    res.status(500).json({ error: 'Failed to fetch franchises.' });
  }
};

// Function to delete business
exports.deleteBusiness = async (req, res) => {
  const { uuid } = req.params;

  const params = {
    TableName: 'businesses',
    Key: { uuid },
  };

  try {
    await dynamoDB.delete(params).promise();
    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({ error: 'Failed to delete business.' });
  }
};

// Function to delete franchise
exports.deleteFranchise = async (req, res) => {
  const { uuid } = req.params;

  const params = {
    TableName: 'franchises',
    Key: { uuid },
  };

  try {
    await dynamoDB.delete(params).promise();
    res.json({ message: 'Franchise deleted successfully' });
  } catch (error) {
    console.error('Error deleting franchise:', error);
    res.status(500).json({ error: 'Failed to delete franchise.' });
  }
};

// Function to update business status
exports.updateBusinessStatus = async (req, res) => {
  const { uuid } = req.params;
  const { status } = req.body;

  const params = {
    TableName: 'businesses',
    Key: { uuid },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { ':status': status },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamoDB.update(params).promise();
    res.json(result.Attributes);
  } catch (error) {
    console.error('Error updating business status:', error);
    res.status(500).json({ error: 'Failed to update business status.' });
  }
};

// Function to update franchise status
exports.updateFranchiseStatus = async (req, res) => {
  const { uuid } = req.params;
  const { status } = req.body;

  const params = {
    TableName: 'franchises',
    Key: { uuid },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { ':status': status },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamoDB.update(params).promise();
    res.json(result.Attributes);
  } catch (error) {
    console.error('Error updating franchise status:', error);
    res.status(500).json({ error: 'Failed to update franchise status.' });
  }
};
