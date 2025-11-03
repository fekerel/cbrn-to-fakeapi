import { awarenesCbrnService } from '@/api/_AwarenessCbrnService';
import { randomInt } from 'node:crypto';

const { expect } = require('chai');

const cbrnNumber: number = 1;
const list:number[] = [0,2,3];

describe('cbrn-1-rest', async () => {
    it('updateCbrn1', async () => {
        const response = await awarenesCbrnService.updateCbrn(cbrnNumber);
        expect(response).to.be.equal(200);
    });

    it('getCbrn1ListByIdList', async () => {
        const response = await awarenesCbrnService.getCbrnXListByIdList(cbrnNumber);
        expect(response).to.be.an('array');
    });

    it('addCbrn1', async () => {
        const response = await awarenesCbrnService.addCbrn(cbrnNumber);
        expect(response).to.be.an('object');
    });

    it('updateCbrn1MainEvent', async () => {
        const response = await awarenesCbrnService.updateCbrnXMainEvent(cbrnNumber);
        expect(response).to.be.true;
    });

    it('getCbrn1ById', async () => {
        const response = await awarenesCbrnService.getCbrnXById(cbrnNumber);
        expect(response).to.be.an('object');
    });

    it('updateCbrn1AttOfTarget', async () => {
        const response = await awarenesCbrnService.updateCbrn1AttOfTarget(list[randomInt(list.length)]);
        expect(response).to.be.true;
    });

    it('deleteOldMessagesAfterUpdateCbrn1', async () => {
        const response = await awarenesCbrnService.deleteOldMessagesAfterUpdateCbrn1();
        expect(response).to.be.true;
    });

    it('deallocateCbrn1ListToCbrn2Manuel', async () => {
        const response = await awarenesCbrnService.deallocateCbrn1ListToCbrn2Manuel();
        expect(response).to.be.an('array');
    });

    it('checkOfTargetMessages', async () => {
        const response = await awarenesCbrnService.checkOfTargetMessages(list[randomInt(list.length)]);
        expect(response).to.be.an('object');
    });
});
