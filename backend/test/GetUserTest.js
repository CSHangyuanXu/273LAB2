const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

// test /auth/user route should fail as user is not logged in
describe("/GET auth/user", () => {
  it("it should GET user", (done) => {
    chai
      .request(server)
      .get("/auth/user")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("isLogin").eql(false);
        done();
      });
  });
});
