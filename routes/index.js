const UsersRoutes = require('./users');
const TestsRoutes = require('./tests');
const SurveysRoutes = require('./surveys');
const PatientsRoutes = require('./patients');
const EmailsRoutes = require('./emails');

module.exports = (app, io) => {
  app.get('/', (req, res) => {
    res.send('<h1> LAB COGNICION API Working 0.1 </h1>');
  });
  app.use('/users', UsersRoutes);
  app.use('/tests', TestsRoutes);
  app.use('/patients', PatientsRoutes);
  app.use('/surveys', SurveysRoutes);
  app.use('/emails', EmailsRoutes);
};