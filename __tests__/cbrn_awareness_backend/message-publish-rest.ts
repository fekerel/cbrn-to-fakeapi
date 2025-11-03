import { awarenessMessageService } from '../../src/api/_AwarenessMessageService';

const { expect } = require('chai');

describe('Message Publish Rest', async () => {
    it('withdraw', async () => {
        const response = await awarenessMessageService.withdraw();
        expect(response).to.be.false;
    });

    // it('publishMsgForDoob', async () => { // Burada sıkıntı varmış. O yüzden boş bırakıldı.
    //     // const response = await awarenessMessageService.publishMsgForDoob();
    // });

    it('publishMessage', async () => {
        const response = await awarenessMessageService.publishMessage();
        expect(response).to.be.an('number');
    });

    it('listSentPublishedMessages', async () => {
        const response = await awarenessMessageService.listSentPublishedMessages();
        expect(response).to.be.an('array');
    });

    it('listReceivedPublishedMessages', async () => {
        const response = await awarenessMessageService.listSentPublishedMessages();
        expect(response).to.be.an('array');
    });

    it('importToOwnSystem', async () => {
        const response = await awarenessMessageService.importToOwnSystem();
        expect(response).to.be.true;
    });

    it('forwardMessage', async () => {
        const response = await awarenessMessageService.forwardMessage();
        expect(response).to.be.true;
    });

    it('deleteReceivedMessages', async () => {
        const response = await awarenessMessageService.deleteReceivedMessages();
        expect(response).to.be.true;
    });

    it('deletePublishedMessages', async () => {
        const response = await awarenessMessageService.deletePublishedMessages();
        expect(response).to.be.true;
    });

    it('cancelPublishFromOutbox/{idList}', async () => {
        const response = await awarenessMessageService.cancelPublishFromOutboxIdList();
        expect(response).to.be.true;
    });

    it('cancelPublishFromMailbox', async () => {
        const response = await awarenessMessageService.cancelPublishFromMailbox();
        expect(response).to.be.true;
    });

    it('listOrganisationUnits', async () => {
        const response = await awarenessMessageService.listOrganisationUnits();
        expect(response).to.be.equal(200);
    });

    it('getSentMessageById', async () => {
        const response = await awarenessMessageService.getSentMessageById();
        expect(response).to.be.true;
    });

    it('getReceivedMessageById', async () => {
        const response = await awarenessMessageService.getReceivedMessageById();
        expect(response).to.be.true;
    });
});
