const stripe = require("stripe")(process.env.STRIPE_SECRET);

const crearCargo = async (payment_source_id, amount, correo, metadata) => {
  const charge = await stripe.charges.create({
    amount: amount * 100,
    currency: "mxn",
    source: payment_source_id,
    metadata,
    receipt_email: correo,
  });
  return charge;
};

const crearMetodoPago = async (token_id) => {
  const paymentMethod = await stripe.paymentMethods.create({
    type: "card",
    card: {
      token: token_id,
    },
  });
  return paymentMethod;
};

const crearPrecioSimple = async (product_id, precio) => {
  const price = await stripe.prices.create({
    unit_amount: precio,
    currency: "mxn",
    product: product_id,
  });
  return price;
};

const crearSuscripcion = async (customer_id, title, price_id, metadata) => {
  const request = {
    customer: customer_id,
    items: [{ metadata: { title }, price: price_id }],
    metadata,
  };
  const { free_trial_length, discount_price } = metadata;
  if (
    free_trial_length &&
    free_trial_length !== null &&
    free_trial_length > 0
  ) {
    request.trial_period_days = free_trial_length;
  }
  if (discount_price && discount_price !== null) {
    const { product_id } = metadata;
    const price = await crearPrecioSimple(product_id, discount_price * 100);
    request.add_invoice_items = [{ price: price.id }];
    request.trial_period_days = 30;
  }
  const subscription = await stripe.subscriptions.create(request);
  return subscription;
};

const agregarMetodoPagoCliente = async (customer_id, payment_method_id) => {
  const paymentMethod = await stripe.paymentMethods.attach(payment_method_id, {
    customer: customer_id,
  });
  await stripe.customers.update(customer_id, {
    invoice_settings: {
      default_payment_method: payment_method_id,
    },
  });
  return paymentMethod;
};

const crearIntentoPago = async (cantidad, metadata) => {
  const amount = cantidad * 100;
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "mxn",
    description: metadata.package_name,
    metadata,
  });
  return paymentIntent;
};

const crearProducto = async (nombre) => {
  const product = await stripe.products.create({
    name: nombre,
  });
  return product;
};

const crearPrecio = async (product_id, precio, interval, period) => {
  const price = await stripe.prices.create({
    unit_amount: precio,
    currency: "mxn",
    recurring: { interval: period, interval_count: interval },
    product: product_id,
  });
  return price;
};

const crearSesion = async (price_id, client_reference_id) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: price_id,
        quantity: 1,
      },
    ],
    client_reference_id: client_reference_id + " " + price_id,
    mode: "subscription",
    success_url: "https://lab-cognicion.web.app/gracias",
    cancel_url: "https://lab-cognicion.web.app/memberships",
  });
  return session;
};

const crearSesionPago = async (price_id, client_reference_id) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: price_id,
        quantity: 1,
      },
    ],
    client_reference_id: client_reference_id + " " + price_id,
    mode: "payment",
    success_url: "https://lab-cognicion.web.app/gracias",
    cancel_url: "https://lab-cognicion.web.app/memberships",
  });
  return session;
};

const cancelarSuscripcion = async (subscription_id) => {
  let transaction;
  try {
    transaction = await stripe.subscriptions.del(subscription_id);
  } catch (error) {
    if (error.statusCode !== 404) {
      throw error;
    }
  }
  return transaction;
};

const cambiarSuscripcion = async (subscription_id, price_id) => {
  const subscription = await stripe.subscriptions.retrieve(subscription_id);
  const cambio = await stripe.subscriptions.update(subscription_id, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: price_id,
      },
    ],
  });
  return cambio;
};

const createSubscriptionSchedule = async (
  customer_id,
  price_id,
  start_date
) => {
  const subscriptionSchedule = await stripe.subscriptions.create({
    customer: customer_id,
    billing_cycle_anchor: start_date,
    items: [
      {
        price: price_id,
      },
    ],
  });
  return subscriptionSchedule;
};

const createCustomer = async (email, name) => {
  const customer = await stripe.customers.create({
    email,
    name,
  });
  return customer;
};

const findCustomerByStripeId = async (stripe_id) => {
  const customer = await stripe.customers.retrieve(stripe_id);
  return customer;
};

module.exports = {
  crearCargo,
  crearSesion,
  crearPrecio,
  createCustomer,
  findCustomerByStripeId,
  crearProducto,
  crearMetodoPago,
  crearSesionPago,
  crearSuscripcion,
  crearIntentoPago,
  cambiarSuscripcion,
  cancelarSuscripcion,
  agregarMetodoPagoCliente,
  createSubscriptionSchedule,
};
