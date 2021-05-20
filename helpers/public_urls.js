const axios = require("axios");

const serializeUrl = (obj) => {
    var str = "";
    for (var key in obj) {
        if (str != "") {
            str += "&";
        }
        str += key + "=" + encodeURIComponent(obj[key]);
    }
    return str
}

const getPublicTestUrl = async (test) => {
  const { token } = test.accessUrl;
  const testApiUrl = process.env.TESTS_API;
  const { id: idTest } = test;
  const request = await axios.get(`${testApiUrl}/settings`, {
    params: { idTest },
  });
  settings = request.data.data[0]
  settings.token = token
  return serializeUrl(settings);
};

module.exports = {
  getPublicTestUrl,
};
