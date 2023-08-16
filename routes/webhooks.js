const express = require("express");
const webhooks = express.Router();
const WebhooksController = require("../controllers/webhooks");

// POST
webhooks.post("/stripe", WebhooksController.stripeWebhook);

module.exports = webhooks;
