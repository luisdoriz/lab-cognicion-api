const responses = require("../constants/responses");
const { Membership, Payment, User } = require("../models");

exports.getMyPayments = async (req, res) => {
  try {
    const { user } = req.body;
    const payments = await Payment.findAll({
      where: {
        idUser: user.id,
      },
    });
    res.status(200).json({ status: responses.SUCCESS_STATUS, data: payments });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { idUser, idMembership, payment_method } = req.body;
    let current_membership = await Membership.findOne({
      where: {
        id: idMembership,
      },
    });
    current_membership = current_membership.toJSON();
    let current_user = await User.findOne({
      where: {
        id: idUser,
      },
    });
    if (current_user.stripe_id === null) {
      let stripe_customer = await createCustomer(
        current_user.email,
        current_user.name
      );
      await User.update(
        {
          stripe_id: stripe_customer.id,
        },
        {
          where: {
            id: idUser,
          },
        }
      );
      current_user.stripe_id = stripe_customer.id;
    }
    if (!payment_method.paymentMethod) {
      return res.sendStatus(400);
    }
    await agregarMetodoPagoCliente(
      current_user.stripe_id,
      payment_method.paymentMethod.id
    );
    let current_payment = await Payment.create({
      idMembership,
      idUser,
      test_amount: current_membership.test_amount,
      expiration_date: moment()
        .add(current_membership.expiration_days, "days")
        .format("YYYY-MM-DD"),
      status: "pending",
    });
    const subscription = await crearSuscripcion(
      current_user.stripe_id,
      current_membership.name,
      current_membership.price_id,
      { ...current_payment, ...current_user, current_membership }
    );
    await Payment.update(
      {
        subscription_id: subscription.id,
      },
      {
        where: {
          id: current_payment.id,
        },
      }
    );
    res.status(200).json({
      status: responses.SUCCESS_STATUS,
      data: { current_payment, subscription },
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.cancelPayment = async (req, res) => {
  try {
    const { params } = req;
    const { idPayment } = params;
    let current_payment = await Payment.findOne({
      where: {
        id: idPayment,
      },
    });
    if (current_payment === null) {
      return res.sendStatus(400);
    }
    current_payment = current_payment.toJSON();
    await Payment.destroy({
      where: {
        id: idPayment,
      },
    });
    await cancelarSuscripcion(current_payment.subscription_id);
    res.status(200).json({ status: responses.SUCCESS_STATUS });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};
