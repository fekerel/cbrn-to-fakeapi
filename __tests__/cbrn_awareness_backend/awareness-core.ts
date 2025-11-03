import { awarenessMessageService } from '@/api/_AwarenessMessageService';

const { expect } = require('chai');

describe('Awareness Core', async () => {
    it('transformLocationsAndDates', async () => {
        const response = await awarenessMessageService.transformLocationsAndDates();
        expect(response).to.be.true;
    });

    it('transferCbrnMessages', async () => {
        const response = await awarenessMessageService.transferCbrnMessages();
        expect(response).to.be.true;
    });

    it('searchCbrnMessages', async () => {
        const response = await awarenessMessageService.searchCbrnMessages();
        expect(response).to.be.an('array');
    });

    it('searchCbrnMessagesIgnoreUnit', async () => {
        const response = await awarenessMessageService.searchCbrnMessagesIgnoreUnit();
        expect(response).to.be.an('array');
    });

    it('revertDeletedMessages', async () => {
        const status = await awarenessMessageService.revertDeletedMessages();
        expect(status).to.be.true;
    });

    it('restoreArchivedCbrnMessages', async () => {
        const response = await awarenessMessageService.restoreArchivedCbrnMessages();
        expect(response).to.be.true;
    });

    it('isAlfaNull', async () => { // Bu sorulacak
        const response = await awarenessMessageService.isAlfaNull();
        expect(response).to.be.true;
    });

    // it('getcbrnMessagesByEventId', async () => { // Bunu sor. İstenilen İsteğe göre yapılmadı
    //     // const response = await awarenessMessageService.getcbrnMessagesByEventId();
    //     // expect(response).to.be.true;
    // });

    // it('getOverwrittenMtf', async () => {

    // });

    it('getCbrnCommonByIdList', async () => {
        const response = await awarenessMessageService.getCbrnCommonByIdList();
        expect(response).to.be.an('array');
    });

    it('deleteCbrnMessages', async () => {
        const response = await awarenessMessageService.deleteCbrnMessages();
        expect(response).to.be.true;
    });

    it('checkMainEventOfArchivedMessages', async () => {
        const response = await awarenessMessageService.checkMainEventOfArchivedMessages();
        expect(response).to.be.true;
    });

    it('archiveCbrnMessages', async () => {
        const response = await awarenessMessageService.archiveCbrnMessages();
        expect(response).to.be.true;
    });

    it('getDeletedMessages', async () => {
        const response = await awarenessMessageService.getDeletedMessages();
        expect(response).to.be.an('array');
    });

    it('getCbrnMainEventLocation', async () => {
        const status = await awarenessMessageService.getCbrnMainEventLocation();
        expect(status).to.be.equal(200);
    });

    it('getCbrnCommon', async () => {
        const response = await awarenessMessageService.getCbrnCommon();
        expect(response).to.be.true;
    });

    it('disapproveCbrnMessage', async () => {
        const response = await awarenessMessageService.disapproveCbrnMessage();
        expect(response).to.be.true;
    });

    it('approveCbrnMessage', async () => {
        const response = await awarenessMessageService.approveCbrnMessage();
        expect(response).to.be.true;
    });
});
