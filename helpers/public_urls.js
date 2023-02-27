const { Setting } = require("../mongoose");

const getTypeUrl = (idTestType) => {
  switch (idTestType) {
    case 2:
      return "atencion/condicional";
    case 3:
      return "atencion/hemi";
    case 4:
      return "hanoi";
    case 5:
      return "flanker";
    default:
      return "atencion";
  }
};

const getPublicTestUrl = async (test) => {
  const { token } = test.accessUrl;
  const { id: idTest } = test;
  const settings = await Setting.find({ idTest });
  settings.token = token;
  const args = Object.keys(settings)
    .map((key) =>
      settings[key] !== "" && settings[key] !== null && settings[key]
        ? `${key}=${settings[key]}`
        : null
    )
    .filter((obj) => obj !== null)
    .join("&");
  const url =
    `https://lab-cognicion.web.app/${getTypeUrl(settings.idTestType)}` +
    `?idTest=${idTest}&token=${token}&` +
    args;
  return url;
};

module.exports = {
  getPublicTestUrl,
};
