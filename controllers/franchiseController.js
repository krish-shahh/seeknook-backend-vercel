const { v4: uuidv4 } = require('uuid');
const dynamoDB = require('../config/db');

exports.getFranchises = async (req, res) => {
  const params = {
    TableName: 'franchises',
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    const franchiseData = data.Items.map(f => ({
      ...f,
      sponsorStatus: f.payment_preferences === 'gold' ? 'gold'
        : f.payment_preferences === 'bronze' ? 'bronze'
        : null,
    }));

    franchiseData.sort((a, b) => {
      if (a.sponsorStatus === 'gold' && b.sponsorStatus !== 'gold') return -1;
      if (a.sponsorStatus !== 'gold' && b.sponsorStatus === 'gold') return 1;
      if (a.sponsorStatus === 'bronze' && b.sponsorStatus !== 'bronze') return -1;
      if (a.sponsorStatus !== 'bronze' && b.sponsorStatus === 'bronze') return 1;
      return b.likes - a.likes;
    });

    res.json(franchiseData);
  } catch (error) {
    console.error('Error fetching franchises from DynamoDB:', error);
    res.status(500).json({ error: 'Failed to fetch franchises.' });
  }
};

exports.createFranchise = async (req, res) => {
  const { email, uid, ...otherData } = req.body;
  const uuid = uuidv4();
  const params = {
    TableName: 'franchises',
    Item: {
      uuid,
      email,
      useruid: uid,
      ...otherData,
      likes: 0
    }
  };

  try {
    await dynamoDB.put(params).promise();
    res.status(201).json({ message: 'Franchise created successfully', uuid });
  } catch (error) {
    console.error('Error creating franchise:', error);
    res.status(500).json({ error: 'Failed to create franchise.' });
  }
};

exports.updateFranchise = async (req, res) => {
  const { id } = req.params;
  const { email, uid, ...updateData } = req.body;

  const updateExpression = 'set ' + Object.keys(updateData).map((key, idx) => `#key${idx} = :value${idx}`).join(', ');
  const expressionAttributeNames = Object.keys(updateData).reduce((acc, key, idx) => {
    acc[`#key${idx}`] = key;
    return acc;
  }, {});
  const expressionAttributeValues = Object.values(updateData).reduce((acc, value, idx) => {
    acc[`:value${idx}`] = value;
    return acc;
  }, {});

  const params = {
    TableName: 'franchises',
    Key: { uuid: id },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    const result = await dynamoDB.update(params).promise();
    res.json({ message: 'Franchise updated successfully', attributes: result.Attributes });
  } catch (error) {
    console.error('Error updating franchise:', error);
    res.status(500).json({ error: 'Failed to update franchise.' });
  }
};

exports.deleteFranchise = async (req, res) => {
  const { id } = req.params; // Ensure 'id' is used as the parameter name

  const params = {
    TableName: 'franchises',
    Key: { uuid: id },
  };

  try {
    await dynamoDB.delete(params).promise();
    res.json({ message: 'Franchise deleted successfully' });
  } catch (error) {
    console.error('Error deleting franchise:', error);
    res.status(500).json({ error: 'Failed to delete franchise.' });
  }
};


exports.updateFranchiseLikes = async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;

  const params = {
    TableName: 'franchises',
    Key: { uuid: id },
    UpdateExpression: 'set likes = :likes',
    ExpressionAttributeValues: {
      ':likes': likes
    },
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    const result = await dynamoDB.update(params).promise();
    res.json({ likes: result.Attributes.likes });
  } catch (error) {
    console.error('Error updating franchise likes:', error);
    res.status(500).json({ error: 'Failed to update likes.' });
  }
};

exports.initializeLikes = async (req, res) => {
  const params = {
    TableName: 'franchises',
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    const updatePromises = data.Items.map(async (franchise) => {
      if (franchise.likes === undefined) {
        const updateParams = {
          TableName: 'franchises',
          Key: { uuid: franchise.uuid },
          UpdateExpression: 'set likes = :likes',
          ExpressionAttributeValues: {
            ':likes': 0
          },
          ReturnValues: 'UPDATED_NEW'
        };
        await dynamoDB.update(updateParams).promise();
      }
    });

    await Promise.all(updatePromises);
    res.json({ message: 'Likes column initialized for all franchises.' });
  } catch (error) {
    console.error('Error initializing likes column:', error);
    res.status(500).json({ error: 'Failed to initialize likes column.' });
  }
};
