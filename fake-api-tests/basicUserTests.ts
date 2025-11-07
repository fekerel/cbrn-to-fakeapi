import { expect } from "chai";
import { userService } from "../src/api/fakeApi/UserService";


describe("UserService (fakeapi) - basic CRUD", function () {
  this.timeout(20000);

  it("Get User By ID", async () => {
    const response = await userService.getUserByID();
    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
    expect(response.data).to.be.an("object");
    expect(response.data).to.have.property('id').that.is.a('number');
    expect(response.data).to.have.property('firstName').that.is.a('string');
    expect(response.data).to.have.property('lastName').that.is.a('string');
    expect(response.data).to.have.property('email').that.is.a('string');
    expect(response.data).to.have.property('address').that.is.an('object');
    expect(response.data).to.have.property('status').that.is.a('string');
    expect(response.data).to.have.property('phone').that.is.a('string');
    expect(response.data).to.have.property('password').that.is.a('string');


  })


  it("Get All Users", async () => {
    const response = await userService.getAllUsers();
    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
    expect(response.data).to.be.an("array");

    const firstData = response.data[0];
    expect(firstData).to.be.an("object");
    expect(firstData).to.have.property('id').that.is.a('number');
    expect(firstData).to.have.property('firstName').that.is.a('string');
    expect(firstData).to.have.property('lastName').that.is.a('string');
    expect(firstData).to.have.property('email').that.is.a('string');
    expect(firstData).to.have.property('address').that.is.an('object');
    expect(firstData).to.have.property('status').that.is.a('string');
    expect(firstData).to.have.property('phone').that.is.a('string');
    expect(firstData).to.have.property('password').that.is.a('string');
  });

  it("Create New User", async () => {
    const response = await userService.createNewUser();

    if (typeof response !== "object") {
      return;
    }

    expect(response.status).to.be.equal(201);

    expect(response.data).to.be.an("object");
    expect(response.data).to.have.property('id').that.is.a('number');
    expect(response.data).to.have.property('firstName').that.is.a('string');
    expect(response.data).to.have.property('lastName').that.is.a('string');
    expect(response.data).to.have.property('email').that.is.a('string');
    expect(response.data).to.have.property('address').that.is.an('object');
    expect(response.data).to.have.property('status').that.is.a('string');
    expect(response.data).to.have.property('phone').that.is.a('string');
    expect(response.data).to.have.property('password').that.is.a('string');
  });

  it("Delete User", async () => {
    const response = await userService.deleteUser();
    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
  })

  it("Update User", async () => {
    const response = await userService.updateUser();

    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
    expect(response.data).to.be.an("object");
    expect(response.data).to.have.property('id').that.is.a('number');
    expect(response.data).to.have.property('firstName').that.is.a('string');
    expect(response.data).to.have.property('lastName').that.is.a('string');
    expect(response.data).to.have.property('email').that.is.a('string');
    expect(response.data).to.have.property('address').that.is.an('object');
    expect(response.data).to.have.property('status').that.is.a('string');
    expect(response.data).to.have.property('phone').that.is.a('string');
    expect(response.data).to.have.property('password').that.is.a('string');
  })
});