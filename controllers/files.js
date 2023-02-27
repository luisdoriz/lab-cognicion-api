const { File } = require("../models");
const fs = require("fs");

const processFileName = (name) => {
  name = name.split(".")[0];
  if (String(name).length > 200) {
    name = name.substring(200);
  }
  name = name.replace(" ", "_");
  name = name.replace(":", "_");
  const momentString = moment().format("YYYY_MM_DD_HH_mm_ss");
  if (String(name).length > 200) {
    name = `${name.substring(200)}_${momentString}`;
  } else {
    name = `${name}_${momentString}`;
  }
  return name;
};

const getFile = async (req, res, next) => {
  try {
    let { file_id } = req.params;
    let current_file;
    if (String(file_id).includes(".")) {
      let fileSplit = String(file_id).split(".");
      let name = fileSplit[0];
      let type = fileSplit[1];
      if (fileSplit.length > 2) {
        tyoe = fileSplit[fileSplit.length - 1];
      }
      current_file = await File.findOne({
        where: {
          name,
          type,
        },
      });
    } else {
      current_file = await File.findOne({
        where: {
          file_id,
        },
      });
    }
    let filePath;
    if (current_file === null) {
      filePath = `${__dirname}/files/${file_id}`;
      if (!fs.existsSync(filePath)) {
        return res.sendStatus(404);
      }
    } else {
      current_file = current_file.toJSON();
      filePath = `${__dirname}/files/${current_file.name}.${current_file.type}`;
      if (!fs.existsSync(filePath)) {
        return res.sendStatus(404);
      }
    }
    res.status(200).sendFile(filePath);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const createFile = async (req, res, next) => {
  try {
    const fileName = processFileName(req.file.originalname);
    const fileType = req.file.originalname
      .match(/\.[0-9a-z]+$/i)[0]
      .replace(".", "");
    const current_file = await File.create({
      name: fileName,
      type: fileType,
    });
    fs.writeFileSync(
      `${__dirname}/files/${fileName}.${fileType}`,
      req.file.buffer
    );
    res.status(200).send({ file_id: current_file.file_id });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};

module.exports = { getFile, createFile };
