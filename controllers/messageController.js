const dynamoDB = require('../config/db');

exports.getAdminMessage = async (req, res) => {
  const params = {
    TableName: 'messages', // Replace with your DynamoDB table name
    Limit: 1 // Assuming you want the first message
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    const messages = data.Items.map((item) => item.message);
    if (messages.length > 0) {
      res.json({ message: messages[0] });
    } else {
      res.status(404).json({ message: 'No admin messages found.' });
    }
  } catch (error) {
    console.error('Error fetching admin message from DynamoDB:', error);
    res.status(500).json({ error: 'Failed to fetch admin message.' });
  }
};
