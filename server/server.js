const app = require('./app');
require('dotenv').config();
const { db } = require('./config/firebase');

// Test Firebase connection
db.collection('test').doc('test').set({
  test: 'connection'
}).then(() => {
  console.log('Firebase connected successfully');
  app.listen(5000, () => console.log('Server running on http://localhost:5000'));
}).catch((err) => {
  console.error('Firebase connection error:', err);
});
