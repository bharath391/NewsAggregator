exports.getNotifications = (req, res) => {
  res.json([
    { id: 1, message: 'Welcome to the News Aggregator platform!' },
    { id: 2, message: 'New articles available in Technology.' }
  ]);
};
