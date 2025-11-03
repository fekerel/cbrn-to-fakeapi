import { awarenesCbrnService } from '@/api/_AwarenessCbrnService';

const { expect } = require('chai');

const cbrnNumber: number = 5;

describe('cbrn-5-rest', async () => {
    it('updateCbrn5', async () => {
        const response = await awarenesCbrnService.updateCbrn(cbrnNumber);
        expect(response).to.be.equal(200);
    });

    it('getCbrn5ListByIdList', async () => {
        const response = await awarenesCbrnService.getCbrnXListByIdList(cbrnNumber);
        expect(response).to.be.an('array');
    });

    it('addCbrn5', async () => {
        const response = await awarenesCbrnService.addCbrn(cbrnNumber);
        expect(response).to.be.an('object');
    });

    it('getCbrn5WithCoordinateById', async () => {
        const response = await awarenesCbrnService.getCbrnXWithCoordinateById(cbrnNumber);
        expect(response).to.be.an('object');
    });

    it('getCbrn5ById', async () => {
        const response = await awarenesCbrnService.getCbrnXById(cbrnNumber);
        expect(response).to.be.an('object');
    });

    // it("calculateContourList", async() => {
    //     //const response = await awarenesCbrnService.();
    // })

    // it("calculateCbrn5", async() => {
    //     //const response = await awarenesCbrnService.();
    // })

    // it("updateCbrn5AfterUpdateCbrn4", async() => {
    //     //const response = await awarenesCbrnService.();
    // })

    // it("isRequireToCalculateCbrn5AfterUpdateCbrn4/{cbrn4Id}", async() => {
    //     // const response = await awarenesCbrnService.();
    //     // expect(response).to.be.an("object");
    // })
});
