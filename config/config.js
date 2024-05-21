module.exports = {
    port: process.env.PORT || 3000,
    mongodb_uri: process.env.MONGODB_URI || 'mongodb://localhost/mydb',
    jwt_key: 'your-secret-key'
    // Add other configuration options here
};