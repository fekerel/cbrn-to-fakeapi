import { awarenessMessageService } from '@/api/_AwarenessMessageService';

import { awarenesCbrnService } from '@/api/_AwarenessCbrnService';
import { randomInt } from 'node:crypto';

const { expect } = require('chai');

const cbrnNumber: number = 2;
const list:number[] = [0,2,3];

describe('cbrn-2-rest', async () => {
    it('Make Master', async () => {
        const response = await awarenessMessageService.makeMaster();
        expect(response).to.be.true;
    });

    it('getCbrn2ById', async () => {
        const response = await awarenesCbrnService.getCbrnXById(cbrnNumber);
        expect(response).to.be.an('object');
    });

    it('addCbrn2', async () => {
        const response = await awarenesCbrnService.addCbrn(cbrnNumber,list[randomInt(list.length)]);
        expect(response).to.be.an('object');
    });

    it('updateCbrn2', async () => {
        const response = await awarenesCbrnService.updateCbrn(cbrnNumber);
        expect(response).to.be.equal(200);
    });

    it('getCbrn2ListByIdList', async () => {
        const response = await awarenesCbrnService.getCbrnXListByIdList(cbrnNumber);
        expect(response).to.be.an('array');
    });

    it('updateCbrn2MainEvent', async () => {
        const response = await awarenesCbrnService.updateCbrnXMainEvent(cbrnNumber);
        expect(response).to.be.true;
    });

    //Nasıl yapılacağını anlamadım
    // it.only("updateCbrn2AfterCbrn1/{cbrn1Id}", async() => {
    //     const response = await awarenesCbrnService.updateCbrn2AfterCbrn1();
    //     expect(response).to.be.an('array');
    // })

    it("processCbrn2AfterAllocation", async() => {
        const response = await awarenesCbrnService.processCbrn2AfterAllocation();
        expect(response).to.be.an('boolean');
    })

    it('isValidCorrelationProcess', async () => {
        const response = await awarenesCbrnService.isValidCorrelationProcess();
        expect(response).to.be.an('boolean');
    });

    it('isUsedCbrn2ForCbrn3', async () => {
        const response = await awarenesCbrnService.isUsedCbrn2ForCbrn3();
        expect(response).to.be.an('boolean');
    });

    it('isAvailableMeteorologyOrYankeeZuluSetExist', async () => {
        const response = await awarenesCbrnService.isAvailableMeteorologyOrYankeeZuluSetExist();
        expect(response).to.be.an('boolean');
    });

    it("getFilteredMasterCbrn2ListWithEventType", async() => {
        const response = await awarenesCbrnService.getFilteredMasterCbrn2ListWithEventType();
        expect(response).to.be.an('array');

    })

    it("correlateCbrn2ListToCbrn2ByManuel", async() => {
        const response = await awarenesCbrnService.correlateCbrn2ListToCbrn2ByManuel();
        expect(response).to.be.an('array');
    })

    it('correlateCbrn2ListByAepkernel', async () => {
        const response = await awarenesCbrnService.correlateCbrn2ListByAepkernel();
        expect(response).to.be.an('object');
    });

    it("calculateCbrn3FromCbrn2", async() => {
        const response = await awarenesCbrnService.calculateCbrn3FromCbrn2();
        expect(response).to.be.true;
    })

    it("calculateCbrn3AfterUpdatingCbrn2", async() => {
        const response = await awarenesCbrnService.calculateCbrn3AfterUpdatingCbrn2();
        expect(response).to.be.true;
    })

    // it.only("calculateCbrn2", async() => {
    //     const response = await awarenesCbrnService.calculateCbrn2();
    //     expect(response).to.be.an("array");
    // })

    it("calculateCbrn2FromCbrn4isAutomaticonTargetIdList", async() => {
        const response = await awarenesCbrnService.calculateCbrn2FromCbrn4isAutomaticonTargetIdList();
        expect(response).to.be.an("array");
    })

    it('automaticCalculateFromCbrn2ToCbrn3', async () => {
        const response = await awarenesCbrnService.automaticCalculateFromCbrn2ToCbrn3();
        expect(response).to.be.an('array');
    });

    //Bazen çalışıyor bazen çalışmıyor
    it('automaticCalculateFromCbrn1ToCbrn3', async () => {
        const response = await awarenesCbrnService.automaticCalculateFromCbrn1ToCbrn3();
        expect(response).to.be.an('array');
    });

    it('autoCorrelateCbrn2InImported', async () => {
        const response = await awarenesCbrnService.autoCorrelateCbrn2InImported();
        expect(response).to.be.an('object');
    });

    it("allocateCbrn1ListToCbrn2Manuel", async() => {
        const response = await awarenesCbrnService.allocateCbrn1ListToCbrn2Manuel();
        expect(response).to.be.an('object')

    })

    it("allocateCbrn1ListToCbrn2ByAepkernel", async() => {
        const response = await awarenesCbrnService.allocateCbrn1ListToCbrn2ByAepkernel();
        expect(response).to.be.an('object')
    })

    // it("sendDoobCbrn2UpdateNotification", async() => {

    // })

    it("isExistMasterCbrn2InEventMainEventId", async() => {
        const response = await awarenesCbrnService.isExistMasterCbrn2InEventMainEventId();
        expect(response).to.be.an('boolean')

    })

    it("getMasterList", async() => {
        const response = await awarenesCbrnService.getMasterList();
        expect(response).to.be.an('object');

    })

    it("getMasterCbrn2List",async() => {
        const response = await awarenesCbrnService.getMasterCbrn2List();
        expect(response).to.be.an('object');
    })
});
