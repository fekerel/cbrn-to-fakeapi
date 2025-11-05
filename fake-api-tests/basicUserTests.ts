import { expect } from "chai";
import { userService } from "../src/api/fakeApi/UserService";
import ApiService from "../src/api/ApiService";
import { uniqueEmail, randomPassword } from "../src/common/fakeApi/Utils";

describe("UserService (fakeapi) - basic CRUD", function () {
  this.timeout(20000);

  let createdId: number | string | null = null;

  it("creates a user (addUserRandom) and returns created resource", async function (this: Mocha.Context) {
    const created = await userService.addUserRandom({
      firstName: "UT",
      address: { city: "TestCity" },
    });
    expect(created).to.have.property("id");
    expect(created).to.have.property("email");
    createdId = created.id;
  });

  it("retrieves the created user (getUser)", async function (this: Mocha.Context) {
    const got = await userService.getUser(createdId);
    expect(got).to.have.property("id", createdId);
    expect(got).to.have.property("address");
    expect(got.address).to.have.property("city", "TestCity");
  });

  it("updates the user safely (updateUser -> PUT-after-merge) and returns updated resource", async function (this: Mocha.Context) {
    if (!createdId) this.skip();
    const updated = await userService.updateUser(createdId, { lastName: "UpdatedLN" });
    expect(updated).to.have.property("lastName", "UpdatedLN");
  });

  it("deletes the user (deleteUser) and subsequent GET returns 404", async function (this: Mocha.Context) {
    if (!createdId) this.skip();
    const ok = await userService.deleteUser(createdId);
    expect(ok).to.be.true;
    const res = await ApiService.getInstance().instance.get(`/users/${createdId}`, { validateStatus: null });
    expect(res.status).to.equal(404);
  });

  it("Get All Users", async () => {
    const response = await userService.getAllUsers();
    expect(response).to.be.an("array");
  });
});