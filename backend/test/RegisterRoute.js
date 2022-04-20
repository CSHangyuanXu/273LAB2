const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

// test /auth/register route
describe("/POST auth/register", () => {
  it("it should POST register", (done) => {
    const register = {
      fullName: "",
      email: "",
      password: "",
    };
    chai
      .request(server)
      .post("/auth/register")
      .send(register)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("isSuccess").eql(false);
        res.body.should.have
          .property("message")
          .eql("Please fill in all fields");
        done();
      });
  });
});
