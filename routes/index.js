const UsersRoutes = require('./users');
const TestsRoutes = require('./tests');
const PatientsRoutes = require('./patients');

module.exports = (app, io) => {
  app.get('/', (req, res) => {
    res.send('<h1> LAB COGNICION API Working 0.1 </h1>');
  });
  app.use('/users', UsersRoutes);
  app.use('/tests', TestsRoutes);
  app.use('/patients', PatientsRoutes)
};