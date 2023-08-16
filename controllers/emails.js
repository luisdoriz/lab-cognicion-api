const TestActions = require("../actions/tests");
const SurveysActions = require("../actions/surveys/read");
const responses = require("../constants/responses");
const { sendEmailTest, sendEmailSurvey } = require("../modules/sendgrid");
const { getPublicTestUrl } = require("../helpers/public_urls");

exports.sendEmail = async (req, res) => {
  const { id, type, email } = req.body;
  try {
    if (type == "test") {
      const test = await TestActions.getById(id);
      const url = await getPublicTestUrl(test);
      sendEmailTest(email, url);
      res.status(200).json({ data: `Email sent correctly to: ${email}` });
    } else if (type == "survey") {
      const survey = await SurveysActions.getById(id);
      const { token } = survey.accessUrl;
      const surveyTypes = [
        "cuestionario",
        "cuestionario/nechapi",
        "cuestionario/cupom",
      ];
      const url = `https://lab-cognicion.web.app/${
        surveyTypes[survey.type - 1]
      }?token=${token}`;
      sendEmailSurvey(email, url);
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
