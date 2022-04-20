const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

// test /auth/login route
describe("/POST auth/login", () => {
  it("it should POST login", (done) => {
    const login = {
      email: "",
      password: "",
    };
    chai
      .request(server)
      .post("/auth/login")
      .send(login)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("isSuccess").eql(false);
        res.body.should.have
          .property("message")
          .eql("Incorrect email or password");
        done();
      });
  });
});
