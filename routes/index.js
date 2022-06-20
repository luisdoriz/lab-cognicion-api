const UsersRoutes = require("./users");
const TestsRoutes = require("./tests");
const SurveysRoutes = require("./surveys");
const PatientsRoutes = require("./patients");
const EmailsRoutes = require("./emails");
const ReportsRoutes = require("./reports");
const CountriesRoutes = require("./countries");
const TrainingRoutes = require("./training");
const TestTypesRoutes = require("./testTypes");
const MembershipsRoutes = require("./memberships");
const PaymentsRoutes = require("./payments");
const MultiTestsRoutes = require("./multitest");

module.exports = (app, io) => {
  app.get("/", (req, res) => {
    res.send("<h1> LAB COGNICION API Working 0.1 </h1>");
  });
  app.use("/users", UsersRoutes);
  app.use("/tests", TestsRoutes);
  app.use("/patients", PatientsRoutes);
  app.use("/surveys", SurveysRoutes);
  app.use("/emails", EmailsRoutes);
  app.use("/reports", ReportsRoutes);
  app.use("/countries", CountriesRoutes);
  app.use("/training", TrainingRoutes);
  app.use("/testTypes", TestTypesRoutes);
  app.use("/memberships", MembershipsRoutes);
  app.use("/payments", PaymentsRoutes);
  app.use("/multitests", MultiTestsRoutes);
};
