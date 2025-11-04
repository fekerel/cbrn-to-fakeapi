import ApiService from "@/api/ApiService";

import { service } from "@/api/fakeApi/Service";
import { randomPassword, uniqueEmail } from "@/common/fakeApi/Utils";

const { expect } = require('chai');

describe('Fake JSON-Server toy API tests', function () {
  this.timeout(20000);
  let createdUserId = null;

  it.only("add a user", async() => {
    const response = await service.addUser(
      {
        email: uniqueEmail(),
        password: randomPassword(),
        address: { city: "Eskisehir" }
      }  
    );
    expect(response.status).to.be.equal(201);
  })

  it('GET /users with nested field and status filter returns matches', async () => {
    const res = await ApiService.getInstance().instance.get(`/users`, {
      params: { status: 'inactive', 'address.city': 'Ondrickatown' },
      validateStatus: null
    });
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
    expect(res.data.length).to.be.greaterThan(0);
    const u = res.data[0];
    expect(u).to.have.property('email');
    expect(u.address).to && expect(u.address.city).to.equal('Ondrickatown');
  });

  it('POST /users creates a user and can be deleted (cleanup)', async () => {
    const uniqueEmail = `test+${Date.now()}@example.com`;
    const payload = {
      email: uniqueEmail,
      password: 'P@ssw0rd!',
      firstName: 'Auto',
      lastName: 'Tester',
      role: 'buyer',
      address: { street: 'Test St', city: 'Testville', country: 'Nowhere', zipCode: '00000' },
      phone: '000-000-0000',
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    const createRes = await ApiService.getInstance().instance.post(`/users`, payload, { validateStatus: null });
    expect([200, 201]).to.include(createRes.status);
    expect(createRes.data).to.have.property('id');
    createdUserId = createRes.data.id;

    // verify it is queryable by email
    const queryRes = await ApiService.getInstance().instance.get(`/users`, { params: { email: uniqueEmail }, validateStatus: null });
    expect(queryRes.status).to.equal(200);
    expect(queryRes.data).to.be.an('array').that.is.not.empty;
    expect(queryRes.data[0].email).to.equal(uniqueEmail);
  });

  it('GET /products with tags_like and numeric range returns filtered results', async () => {
    const res = await ApiService.getInstance().instance.get(`/products`, {
      params: { tags_like: 'trending', price_gte: 200, price_lte: 400, _limit: 5 },
      validateStatus: null
    });
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
    // if there are results, assert they match expected filters
    if (res.data.length > 0) {
      for (const p of res.data) {
        expect(p).to.have.property('price');
        const price = Number(p.price);
        expect(price).to.be.at.least(200);
        expect(price).to.be.at.most(400);
        expect(p.tags || []).to.satisfy(tags => tags.includes('trending'));
      }
    }
  });

  it('GET /orders for a specific userId with sorting and limit', async () => {
    const res = await ApiService.getInstance().instance.get(`/orders`, {
      params: { userId: 21, _sort: 'createdAt', _order: 'desc', _limit: 3 },
      validateStatus: null
    });
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array').that.has.length.of.at.most(3);
    // if there are results, ensure userId matches
    if (res.data.length > 0) {
      for (const o of res.data) {
        expect(o.userId).to.equal(21);
        expect(o).to.have.property('items').that.is.an('array');
      }
    }
  });

  after(async () => {
    if (createdUserId) {
      try {
        await ApiService.getInstance().instance.delete(`/users/${createdUserId}`, { validateStatus: null });
      } catch (e) {
        // ignore cleanup errors
      }
    }
  });
});