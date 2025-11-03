import { awarenesPreWarningService } from '../../src/api/_AwarenessPreWarningService';

const { expect } = require('chai');


describe("Merwarn Rest", async() => {

    it("updateMerwarn", async() => {
        const response = await awarenesPreWarningService.updateMerwarn();
        expect(response).to.be.true;
    })

    it("getMerwarnListByIdList",async() => {
        const response = await awarenesPreWarningService.getMerwarnListByIdList();
        expect(response).to.be.an("array");
    })

    it("addMerwarn", async() => {
        const response = await awarenesPreWarningService.addMerwarn();
        expect(response).to.be.an("object");
    })

    it("getMerwarnById",async() => {
        const response = await awarenesPreWarningService.getMerwarnById();
        expect(response).to.be.an("object");
    })
})