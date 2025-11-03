/* eslint-disable max-len, import/no-cycle */

import ConfigUtils from '@common/ConfigUtils';
import { awarenessEventService } from '@api/_AwarenessEventService';
import moment from 'moment-timezone';
import { randomInt } from 'crypto';

const { expect } = require('chai');

const eventType: string[] = ['RAD', 'NUC', 'CHEM', 'BIO'];

export function randomMainEventName() {
    return ConfigUtils.generateUniqueWord();
}

export function randomEventType() {
    return eventType[randomInt(eventType.length)];
}

export function currentDate() {
    const CurrentDate = moment().subtract(3, 'hours');
    return `${CurrentDate.format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`;
}

describe('CBRN Main Event', async () => {
    it('addNewMainEvent', async () => {
        const CURRENTDATE = currentDate();
        const EVENTYPE:string = randomEventType();
        const CBRNMAINTEVENTNAME:string = randomMainEventName();
        const response = await awarenessEventService.addNewMainEvent(CURRENTDATE, EVENTYPE, CBRNMAINTEVENTNAME);
        expect(response).to.be.an('object');
    });

    it('searchCbrnEvents', async () => {
        const response = await awarenessEventService.searchCbrnEvents();
        expect(response).to.be.an('array');
    });

    it('updateCbrnMainEvent', async () => {
        const response = await awarenessEventService.updateCbrnMainEvent();
        expect(response).to.be.true;
    });

    it('archiveMainEventList', async () => {
        const status = await awarenessEventService.archiveMainEventList();
        expect(status).to.be.true;
    });

    it('revertMainEventList', async () => {
        const status = await awarenessEventService.revertMainEventList();
        expect(status).to.be.true;
    });

    it('searchCbrnEventsWithLocation', async () => {
        const status = await awarenessEventService.searchCbrnEventsWithLocation();
        expect(status).to.be.equal(200);
    });

    it('deleteMainEventList', async () => {
        const status = await awarenessEventService.deleteMainEventList();
        expect(status).to.be.true;
    });

    it('getMainEventById', async () => {
        const status = await awarenessEventService.getMainEventById();
        expect(status).to.be.true;
    });

    it('listMainEventsByTypeList', async () => {
        const status = await awarenessEventService.listMainEventsByTypeList();
        expect(status).to.be.an('array');
    });

    it('getCbrnMainEventByIdAndIsDeletedFalse', async () => {
        const status = await awarenessEventService.getCbrnMainEventByIdAndIsDeletedFalse();
        expect(status).to.be.true;
    });

    it('transformMainEvent', async () => {
        const response = await awarenessEventService.transformMainEvent();
        expect(response).to.be.true;
    });

    it('saveMainEvent', async () => {
        const response = await awarenessEventService.saveMainEvent();
        expect(response).to.be.true;
    });

    it('restoreMainEventList', async () => {
        const response = await awarenessEventService.restoreMainEventList();
        expect(response).to.be.true;
    });

    it('listArchivedMainEventsByTypeList', async () => {
        const response = await awarenessEventService.listArchivedMainEventsByTypeList();
        expect(response).to.be.an('array');
    });

    it('listDeletedMainEventsByTypeList', async () => {
        const response = await awarenessEventService.listDeletedMainEventsByTypeList();
        expect(response).to.be.an('array');
    });

    it('listAllMainEventsByIdList', async () => {
        const response = await awarenessEventService.listAllMainEventsByIdList();
        expect(response).to.be.an('array');
    });

    it('deleteMainEvent', async () => {
        const response = await awarenessEventService.deleteMainEvent();
        expect(response).to.be.an('array');
    });

    it('listMainEventsByTypeAndState', async () => {
        const response = await awarenessEventService.listMainEventsByTypeAndState();
        expect(response).to.be.an('array');
    });

    it('listAllMainEvents', async () => {
        const response = await awarenessEventService.listAllMainEvents();
        expect(response).to.be.an('array');
    });

    it('isMainEventUndefined', async () => {
        const response = await awarenessEventService.isMainEventUndefined();
        expect(response).to.be.equal(200);
    });
});
