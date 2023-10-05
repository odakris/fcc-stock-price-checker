"use strict";
const express = require("express");
const app = express();
const router = express.Router();

const { getQuote } = require("../controllers/quoteController");

router.route("/api/stock-prices").get(getQuote);

module.exports = router;
