import { awarenesCbrnService } from '@/api/_AwarenessCbrnService';

const { expect } = require('chai');

const cbrnNumber: number = 3;

describe('cbrn-3-rest', async () => {
    it('getCbrn3ById', async () => {
        const response = await awarenesCbrnService.getCbrnXById(cbrnNumber);
        expect(response).to.be.an('object');
    });

    it('updateCbrn3', async () => {
        const response = await awarenesCbrnService.updateCbrn(cbrnNumber);
        expect(response).to.be.equal(200);
    });

    it('getCbrn3ListByIdList', async () => {
        const response = await awarenesCbrnService.getCbrnXListByIdList(cbrnNumber);
        expect(response).to.be.an('array');
    });

    it('addCbrn3', async () => {
        const response = await awarenesCbrnService.addCbrn3();
        expect(response).to.be.an('object');
    });

    it('updateCbrn3MainEvent', async () => {
        const response = await awarenesCbrnService.updateCbrn3MainEvent(cbrnNumber);
        expect(response).to.be.an('object');
    });

    it('getCbrn3WithCoordinateById', async () => {
        const response = await awarenesCbrnService.getCbrnXWithCoordinateById(cbrnNumber);
        expect(response).to.be.an('object');
    });

    it('getCbrn3List', async () => {
        const response = await awarenesCbrnService.getCbrn3List();
        expect(response).to.be.an('array');
    });

    it('getCbrn3ListByEventType', async () => {
        const response = await awarenesCbrnService.getCbrn3ListByEventType();
        expect(response).to.be.an('object');
    });

    it('checkIsThereCbrn3', async () => {
        const response = await awarenesCbrnService.checkIsThereCbrn3();
        expect(response).to.be.true;
    });

    // it.only("simulation", async() => {
    //     const response = await awarenesCbrnService.simulation()
    //     expect(response).to.be.an("object");
    // })

    // it("setUnallocatedMainEventTrigger", async() => {

    // })

    // it("isCbrn3WithSameEdrAndCbrn2Exist", async() => {

    // })

    // it("isCbrn3WithSameCdrAndCbrn2Exist", async() => {

    // })

    // it("isCbrn3WithSameBwrAndCbrn2Exist", async() => {

    // })

    // it("checkIsCalculatedCbrn3FromCbrn4", async() => {

    // })

    // it("calculateCbrn3WithMir", async() => {

    // })

    // it("calculateCbrn3BioChemRad", async() => {

    // })

    // it("calculateCbrn3NucWithSimplifiedProcedureAndBwr", async() => {

    // })

    // it("calculateCbrn3NucWithEdr", async() => {

    // })

    // it("calculateCbrn3NucWithBwr", async() => {

    // })

    it("calculateCbrn3FromCbrn4", async() => {
        const response = await awarenesCbrnService.calculateCbrn3FromCbrn4();
        expect(response).to.be.an("object");

    })

    // it("calculateCbrn3BioChemWithSimplifiedProcedure",async() => {

    // })

    // it("calculateAnalysis", async() => {

    // })
});
