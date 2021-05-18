const TestActions = require("../actions/tests/read");
const SurveysActions = require("../actions/surveys/read");
const responses = require("../constants/responses");
const { sendEmailTest, sendEmailSurvey } = require("../modules/sendgrid");

exports.sendEmail = async (req, res) => {
  const { id, type, email } = req.body;

  try {
    if (type == "test") {
      const test = await TestActions.getById(id);
      sendEmailTest(email, test.accessUrl.token);
      res.status(200).json({ data: `Email sent correctly to: ${email}` });
    } else if (type == "survey") {
      const survey = await SurveysActions.getById(id);
      sendEmailSurvey(email, survey.accessUrl.token);
      res.status(200).json({ data: `Email sent correctly to: ${email}` });
    } else {
      res
        .status(409)
        .json({ status: responses.ERROR_STATUS, error: "Type not valid" });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};
