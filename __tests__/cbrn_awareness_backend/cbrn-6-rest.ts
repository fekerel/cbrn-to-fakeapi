import { awarenesCbrnService } from '@/api/_AwarenessCbrnService';

const { expect } = require('chai');

const cbrnNumber: number = 6;

describe('cbrn-6-rest', async () => {
    it('updateCbrn6', async () => {
        const response = await awarenesCbrnService.updateCbrn(cbrnNumber);
        expect(response).to.be.equal(200);
    });

    it('getCbrn6ListByIdList', async () => {
        const response = await awarenesCbrnService.getCbrnXListByIdList(cbrnNumber);
        expect(response).to.be.an('array');
    });

    it('addCbrn6', async () => {
        const response = await awarenesCbrnService.addCbrn(cbrnNumber);
        expect(response).to.be.an('object');
    });

    it('getCbrn6ById', async () => {
        const response = await awarenesCbrnService.getCbrnXById(cbrnNumber);
        expect(response).to.be.an('object');
    });

    // it("calculateCbrn6", async() => { //Sorulacak
    //     //const response = await awarenesCbrnService.calculateCbrn6();
    // })

    // it("autoAllocateCbrn6ToCbrn2InImported", async() => { //Sorulacak
    //     //const response = await awarenesCbrnService.autoAllocateCbrn6ToCbrn2InImported();
    // })

    // it("allocateCbrn6ListToCbrn2ByAepkernel/{isAutomaticMode}", async() => { //Sorulacak
    //     //const response = await awarenesCbrnService.allocateCbrn6ListToCbrn2ByAepkernelisAutomaticMode();
    // })
});
