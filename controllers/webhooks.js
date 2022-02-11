const { Membership, Payment } = require("../models");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const moment = require("moment");

const stripeWebhook = async (req, res, next) => {
  try {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
      case "invoice.created": {
        const current_invoice = event.data.object;
        //Original Payment
        let subscription = await Payment.findOne({
          where: {
            subscription_id: current_invoice.subscription,
          },
          order: [["createdAt", "ASC"]],
          limit: 1,
        });
        subscription = subscription.toJSON();
        let current_membership = await Membership.findOne({
          where: {
            id: idMembership,
          },
        });
        current_membership = current_membership.toJSON();
        let expiration_date = moment()
          .add(current_membership.expiration_days, "days")
          .format("YYYY-MM-DD");
        await Payment.create({
          idUser: subscription.idUser,
          idMembership: subscription.idMembership,
          test_amount: subscription.test_amount,
          status: "pending",
          expiration_date,
        });
      }
      case "invoice.payment_failed": {
        const current_invoice = event.data.object;
        let subscription = await Payment.findOne({
          where: {
            subscription_id: current_invoice.subscription,
          },
          order: [["createdAt", "DESC"]],
          limit: 1,
        });
        if (subscription && subscription !== null) {
          subscription = subscription.toJSON();
          //Update status to failed
          await Payment.update(
            {
              status: "failed",
            },
            {
              where: {
                idPayment: subscription.idPayment,
              },
            }
          );
        }
        break;
      }
      case "invoice.paid": {
        const current_invoice = event.data.object;
        let subscription = await Payment.findOne({
          where: {
            subscription_id: current_invoice.subscription,
          },
          order: [["createdAt", "DESC"]],
          limit: 1,
        });
        if (subscription && subscription !== null) {
          subscription = subscription.toJSON();
          //Update status to failed
          await Payment.update(
            {
              status: "completed",
            },
            {
              where: {
                idPayment: subscription.idPayment,
              },
            }
          );
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
};

module.exports = { stripeWebhook };
