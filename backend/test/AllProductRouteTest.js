const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

/// all product route test
describe("/GET all product route", () => {
  it("it should GET all product route", (done) => {
    chai
      .request(server)
      .get("/product/all")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("isSuccess").eql(true);

        const products = res.body.products;
        products.should.be.a("array");
        done();
      });
  });
});
