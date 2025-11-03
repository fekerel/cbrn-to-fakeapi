import { awarenesCbrnService } from '@/api/_AwarenessCbrnService';

const { expect } = require('chai');

const cbrnNumber: number = 4;

describe('cbrn-4-rest', async () => {
    it('updateCbrn4', async () => {
        const response = await awarenesCbrnService.updateCbrn(cbrnNumber);
        expect(response).to.be.equal(200);
    });

    it('getCbrn4ListByIdList', async () => {
        const response = await awarenesCbrnService.getCbrnXListByIdList(cbrnNumber);
        expect(response).to.be.an('array');
    });

    it('addCbrn4', async () => {
        const response = await awarenesCbrnService.addCbrn(cbrnNumber);
        expect(response).to.be.an('object');
    });

    it('getCbrn4ById', async () => {
        const response = await awarenesCbrnService.getCbrnXById(cbrnNumber);
        expect(response).to.be.an('object');
    });

    it('updateCbrn4MainEvent', async () => {
        const response = await awarenesCbrnService.updateCbrnXMainEvent(cbrnNumber);
        expect(response).to.be.an('array');
    });

    it("getCbrn4ListByMainEventId/{mainEventId}", async() => {
        const response = await awarenesCbrnService.getCbrn4ListByMainEventId();
        expect(response).to.be.an("array");
    })

    it("isExistXrayzOrOscarzInCbrn4", async() => {
        const response = await awarenesCbrnService.isExistXrayzOrOscarzInCbrn4();
        expect(response).to.be.an("boolean");

    })

    it("isCbrn4QuebecHasWater", async() => { 
        const response = await awarenesCbrnService.isCbrn4QuebecHasWater();
        expect(response).to.be.an("array");

    })

    it("deallocateCbrn4ListToCbrn2Manuel", async() => {
        const response = await awarenesCbrnService.deallocateCbrn4ListToCbrn2Manuel();
        expect(response).to.be.an("array");

    })

    it("calculateCbrn4FromCbrn1", async() => {
        const response = await awarenesCbrnService.calculateCbrn4FromCbrn1();
        expect(response).to.be.an("object");

    })

    it("autoCorrelateCbrn4ToCbrn2InImported", async() => {
        const response = await awarenesCbrnService.autoCorrelateCbrn4ToCbrn2InImported();
        expect(response).to.be.an("object");

    })

    it("allocateCbrn4ListToCbrn3Manuel", async() => {
        const response = await awarenesCbrnService.allocateCbrn4ListToCbrn3Manuel();
        expect(response).to.be.an("object");

    })

    it("allocateCbrn4ListToCbrn3ByAepkernel/{isAutomaticMode}", async() => {
        const response = await awarenesCbrnService.allocateCbrn4ListToCbrn3ByAepkernel();
        expect(response).to.be.an("object");
    })

    it("allocateCbrn4ListToCbrn2ByManuel", async() => {
        const response = await awarenesCbrnService.allocateCbrn4ListToCbrn2ByManuel();
        expect(response).to.be.an("object");
    })

    it("allocateCbrn4ListToCbrn2ByManuelCalculateCbrn5", async() => { //CBRN 5 mesajı hesaplamadı
        const response = await awarenesCbrnService.allocateCbrn4ListToCbrn2ByManuelCalculateCbrn5();
        expect(response).to.be.an("object");
    })

    it("allocateCbrn4ListToCbrn2ByAepkernel/{isAutomaticMode}", async() => {
        const response = await awarenesCbrnService.allocateCbrn4ListToCbrn2ByAepkernel();
        expect(response).to.be.an("object");
    })
});
