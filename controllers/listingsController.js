const dynamoDB = require('../config/db');

exports.getListings = async (req, res) => {
  const useruid = req.query.useruid;
  try {
    const businessParams = {
      TableName: 'businesses',
      FilterExpression: 'useruid = :useruid',
      ExpressionAttributeValues: { ':useruid': useruid },
    };

    const franchiseParams = {
      TableName: 'franchises',
      FilterExpression: 'useruid = :useruid',
      ExpressionAttributeValues: { ':useruid': useruid },
    };

    const [businessData, franchiseData] = await Promise.all([
      dynamoDB.scan(businessParams).promise(),
      dynamoDB.scan(franchiseParams).promise(),
    ]);

    const businesses = businessData.Items.map(item => ({ ...item, type: 'business' }));
    const franchises = franchiseData.Items.map(item => ({ ...item, type: 'franchise' }));

    res.json([...businesses, ...franchises]);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
};

exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;
  try {
    const params = {
      TableName: type === 'business' ? 'businesses' : 'franchises',
      Key: { uuid: id },
    };

    await dynamoDB.delete(params).promise();
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
};

exports.toggleFavorite = async (req, res) => {
  const { uuid } = req.params;
  const { useruid } = req.body; // Assuming useruid is sent in the body

  try {
    const getParams = {
      TableName: 'businesses',
      Key: { uuid },
    };

    const business = await dynamoDB.get(getParams).promise();
    if (!business.Item) {
      return res.status(404).json({ error: 'Business not found' });
    }

    let favorites = business.Item.favorites || [];
    if (favorites.includes(useruid)) {
      favorites = favorites.filter(uid => uid !== useruid); // Remove from favorites
    } else {
      favorites.push(useruid); // Add to favorites
    }

    const updateParams = {
      TableName: 'businesses',
      Key: { uuid },
      UpdateExpression: 'set favorites = :favorites',
      ExpressionAttributeValues: {
        ':favorites': favorites,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    await dynamoDB.update(updateParams).promise();
    res.json({ message: 'Favorite status updated', favorites });
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    res.status(500).json({ error: 'Failed to update favorite status' });
  }
};
