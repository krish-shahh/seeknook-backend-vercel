const dynamoDB = require('../config/db');

exports.getServiceTypes = async (req, res) => {
    const params = {
        TableName: 'services'
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        const services = data.Items.map(item => item.service);
        res.json(services);
    } catch (error) {
        console.error('Error fetching services from DynamoDB:', error);
        res.status(500).json({ error: 'Failed to fetch services.' });
    }
};
