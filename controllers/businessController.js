const { v4: uuidv4 } = require('uuid');
const dynamoDB = require('../config/db');

exports.getBusinesses = async (req, res) => {
  const params = {
    TableName: 'businesses',
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    const businessData = data.Items.map(business => ({
      ...business,
      sponsorStatus: business.payment_preferences?.includes('gold')
        ? 'gold'
        : business.payment_preferences?.includes('bronze')
        ? 'bronze'
        : null,
      likes: business.likes || 0
    }));

    // Sort businesses based on sponsor status and likes
    businessData.sort((a, b) => {
      if (a.sponsorStatus === 'gold' && b.sponsorStatus !== 'gold') return -1;
      if (a.sponsorStatus !== 'gold' && b.sponsorStatus === 'gold') return 1;
      if (a.sponsorStatus === 'bronze' && b.sponsorStatus !== 'bronze') return -1;
      if (a.sponsorStatus !== 'bronze' && b.sponsorStatus === 'bronze') return 1;
      return b.likes - a.likes;
    });

    res.json(businessData);
  } catch (error) {
    console.error('Error fetching businesses from DynamoDB:', error);
    res.status(500).json({ error: 'Failed to fetch businesses.' });
  }
};

exports.createBusiness = async (req, res) => {
  const { name, service_type, email, phone, zipcode, city, website, instagram, facebook, whatsapp, description, display_preferences, service_area, business_type, referred_by, useruid } = req.body;
  const uuid = uuidv4();

  const params = {
    TableName: 'businesses',
    Item: {
      uuid,
      name,
      service_type,
      email,
      phone,
      zipcode,
      city,
      website,
      instagram,
      facebook,
      whatsapp,
      description,
      display_preferences,
      service_area,
      business_type,
      referred_by,
      useruid,
      created_at: new Date().toISOString(),
      status: 'pending',
      likes: 0,
    },
  };

  try {
    await dynamoDB.put(params).promise();
    res.status(201).json({ message: 'Business created successfully', uuid });
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({ error: 'Failed to create business.' });
  }
};

exports.updateBusiness = async (req, res) => {
  const { uuid } = req.params;
  const updateFields = req.body;

  const expressionAttributeNames = {};
  const expressionAttributeValues = {};
  const updateExpression = Object.keys(updateFields).map((key) => {
    const attributeName = `#${key}`;
    expressionAttributeNames[attributeName] = key;
    expressionAttributeValues[`:${key}`] = updateFields[key];
    return `${attributeName} = :${key}`;
  }).join(', ');

  const params = {
    TableName: 'businesses',
    Key: { uuid },
    UpdateExpression: `set ${updateExpression}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamoDB.update(params).promise();
    res.json(result.Attributes);
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({ error: 'Failed to update business.' });
  }
};

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

exports.updateBusinessLikes = async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;

  const params = {
    TableName: 'businesses',
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
    console.error('Error updating business likes:', error);
    res.status(500).json({ error: 'Failed to update likes.' });
  }
};