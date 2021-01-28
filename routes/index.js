const UsersRoutes = require('./users');

module.exports = (app, io) => {
  app.get('/', (req, res) => {
    res.send('<h1> LAB COGNICION API Working 0.1 </h1>');
  });
  app.use('/users', UsersRoutes);
};