const responses = require("../constants/responses");
const { Membership } = require("../models");

exports.getMemberships = async (req, res) => {
  try {
    const memberships = await Membership.findAll({
      where: {
        deletedAt: null,
      },
    });
    res.status(200).json({ data: memberships });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.getSingleMembership = async (req, res) => {
  try {
    const { params } = req;
    const { idMembership } = params;
    const current_membership = await Membership.findOne({
      where: {
        id: idMembership,
      },
    });
    res.status(200).json({
      status: responses.SUCCESS_STATUS,
      data: { membership: current_membership },
    });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.postMembership = async (req, res) => {
  try {
    const { body } = req;
    const { name, price, test_amount, expiration_days } = body;
    const current_membership = await Membership.create({
      name,
      price,
      test_amount,
      expiration_days,
    });
    res
      .status(200)
      .json({ status: responses.SUCCESS_STATUS, data: current_membership });
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.updateMembership = async (req, res) => {
  try {
    const { body } = req;
    const { idMembership, name, price, test_amount, expiration_days } = body;
    await Membership.update(
      {
        name,
        price,
        test_amount,
        expiration_days,
      },
      {
        where: {
          id: idMembership,
        },
      }
    );
    res.status(200).json({ status: responses.SUCCESS_STATUS });
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.deleteMembership = async (req, res) => {
  try {
    const { params } = req;
    const { idMembership } = params;
    await Membership.destroy({
      where: {
        id: idMembership,
      },
    });
    res.status(200).json({ status: responses.SUCCESS_STATUS });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};
