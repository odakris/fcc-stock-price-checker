const axios = require("axios");
const stock = require("../models/stock");

const getQuote = async (req, res) => {
  let symbol = req.query.stock;
  let ip = req.ip;
  let like = req.params.like || req.query.like;
  let quote;
  let likes;

  try {
    if (Array.isArray(symbol)) {
      quote = [await getPrice(symbol[0]), await getPrice(symbol[1])];

      if (
        quote[0].hasOwnProperty("error") ||
        quote[1].hasOwnProperty("error")
      ) {
        quote = { error: "Invalid Stock Symbol" };
      } else {
        likes = [
          await getLikes(symbol[0], ip, like),
          await getLikes(symbol[1], ip, like),
        ];
        quote[0].rel_likes = likes[0] - likes[1];
        quote[1].rel_likes = likes[1] - likes[0];
      }
    } else {
      quote = await getPrice(symbol);

      if (quote.hasOwnProperty("error")) {
        quote = { error: "Invalid Stock Symbol" };
      } else {
        likes = await getLikes(symbol, ip, like);
        quote.likes = likes;
      }
    }

    let stockData = {
      stockData: quote,
    };

    res.json(stockData);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getPrice = async (symbol) => {
  let url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol.toUpperCase()}/quote`;

  return await axios.get(url).then((response) => {
    let data = response.data;

    if (typeof data === "string") return { error: "Invalid Stock Symbol" };

    return {
      stock: data.symbol,
      price: data.latestPrice,
    };
  });
};

const getLikes = async (symbol, ip, like) => {
  let quote = await stock.findOne({ stock: symbol });

  if (!quote) {
    quote = await stock.create({ stock: symbol });
  }

  if (like !== "true" || quote.likes.includes(ip)) return quote.likes.length;

  let addLike = await stock.findOneAndUpdate(
    { stock: symbol },
    { $push: { likes: ip } },
    { new: true }
  );

  return addLike.likes.length;
};

module.exports = { getQuote };
