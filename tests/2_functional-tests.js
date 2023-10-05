const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("Viewing one stock => GET request to /api/stock-prices/", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({
        stock: "GOOG",
      })
      .set("content-type", "application/json")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "stockData");
        assert.isObject(res.body.stockData);
        assert.property(res.body.stockData, "stock");
        assert.property(res.body.stockData, "price");
        assert.property(res.body.stockData, "likes");
        done();
      });
  });

  test("Viewing one stock and liking it => GET request to /api/stock-prices/", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({
        stock: "AAPL",
        like: true,
      })
      .set("content-type", "application/json")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "stockData");
        assert.isString(res.body.stockData.stock);
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        assert.equal(res.body.stockData.likes, 1);
        done();
      });
  });

  test("Viewing the same stock and liking it again => GET request to /api/stock-prices/", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({
        stock: "AAPL",
        like: true,
      })
      .set("content-type", "application/json")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "stockData");
        assert.isString(res.body.stockData.stock);
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        assert.equal(res.body.stockData.likes, 1);
        done();
      });
  });

  test("Viewing two stocks => GET request to /api/stock-prices/", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({
        stock: ["AMZN", "TSLA"],
      })
      .set("content-type", "application/json")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "stockData");
        assert.lengthOf(res.body.stockData, 2);
        assert.isObject(res.body.stockData[0]);
        assert.property(res.body.stockData[0], "stock");
        assert.isString(res.body.stockData[0].stock);
        assert.property(res.body.stockData[0], "price");
        assert.isNumber(res.body.stockData[0].price);
        assert.property(res.body.stockData[0], "rel_likes");
        assert.isNumber(res.body.stockData[0].rel_likes);
        assert.isObject(res.body.stockData[1]);
        assert.property(res.body.stockData[1], "stock");
        assert.isString(res.body.stockData[1].stock);
        assert.property(res.body.stockData[1], "price");
        assert.isNumber(res.body.stockData[1].price);
        assert.property(res.body.stockData[1], "rel_likes");
        assert.isNumber(res.body.stockData[1].rel_likes);
        done();
      });
  });

  test("Viewing two stocks and liking them => GET request to /api/stock-prices/", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({
        stock: ["AMZN", "TSLA"],
        like: true,
      })
      .set("content-type", "application/json")
      .end((err, res) => {
        let rel_likes_test = res.body.stockData[0].rel_likes;
        assert.equal(res.status, 200);
        assert.property(res.body, "stockData");
        assert.lengthOf(res.body.stockData, 2);
        assert.equal(res.body.stockData[0].rel_likes, rel_likes_test);
        assert.equal(res.body.stockData[1].rel_likes, -rel_likes_test);
        done();
      });
  });
});
