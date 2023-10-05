const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  stock: {
    type: String,
    require: true,
  },
  likes: [String],
});

module.exports = mongoose.model("stock", stockSchema);
