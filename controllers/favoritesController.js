const dynamoDB = require('../config/db');

// Add a favorite listing
exports.addFavorite = async (req, res) => {
  const { useruid, listingId } = req.body;

  const params = {
    TableName: 'userFavorites',
    Item: {
      useruid,
      listingId,
    },
  };

  try {
    await dynamoDB.put(params).promise();
    res.status(201).json({ message: 'Listing added to favorites successfully' });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite.' });
  }
};

// Remove a favorite listing
exports.removeFavorite = async (req, res) => {
  const { useruid, listingId } = req.body;

  const params = {
    TableName: 'userFavorites',
    Key: {
      useruid,
      listingId,
    },
  };

  try {
    await dynamoDB.delete(params).promise();
    res.json({ message: 'Listing removed from favorites successfully' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite.' });
  }
};

// Get all favorites for a user
exports.getFavorites = async (req, res) => {
  const { useruid } = req.params;

  const params = {
    TableName: 'userFavorites',
    KeyConditionExpression: 'useruid = :useruid',
    ExpressionAttributeValues: {
      ':useruid': useruid,
    },
  };

  try {
    const data = await dynamoDB.query(params).promise();
    res.json(data.Items);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites.' });
  }
};  