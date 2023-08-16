exports.getOffset = (page) => (isNaN(page) ? 0 : (page - 1) * this.PAGE_SIZE);
exports.CANNOT_UPDATE_SUBSCRIPTION =
  "We're sorry, subscriptions cannot be altered";
exports.PURCHASE_NOT_FOUND = "We're sorry, we cannot find that purchase.";
exports.DISCOUNT_INVALID = "We're sorry, this discount code is invalid.";
exports.DISCOUNT_LIMIT = "We're sorry, you cannot use this discount anymore.";
exports.PURCHASE_LIMIT_REACHED =
  "We're sorry, you cannot purchase this product anymore.";
exports.USER_NOT_FOUND = "User does not exist";
exports.INVALID_PRICE = "Price is invalid";
exports.CANCEL_TIMEFRAME = 4;
exports.PAGE_SIZE = 12;
