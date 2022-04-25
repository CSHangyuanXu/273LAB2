const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

//test shop/create route
describe("/POST shop/create", () => {
  it("it should POST create shop", (done) => {
    const createShop = {
      name: "",
    };
    chai
      .request(server)
      .post("/shop/create")
      .send(createShop)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("isNotLoggedIn").eql(true);

        done();
      });
  });
});
