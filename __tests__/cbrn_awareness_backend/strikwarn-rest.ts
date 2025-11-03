import { awarenesPreWarningService } from '../../src/api/_AwarenessPreWarningService';

const { expect } = require('chai');

describe('Strikewarn Rest', async () => {
    it('updateStrikwarn', async () => {
        const response = await awarenesPreWarningService.updateStrikwarn();
        expect(response).to.be.true;
    });

    it('getStrikwarnListByIdList', async () => {
        const response = await awarenesPreWarningService.getStrikwarnListByIdList();
        expect(response).to.be.true;
    });

    it('addStrikwarn', async () => {
        const response = await awarenesPreWarningService.addStrikwarn();
        expect(response).to.be.an('object');
    });

    it('getStrikwarnWithCoordinateById', async () => {
        const response = await awarenesPreWarningService.getStrikwarnWithCoordinateById();
        expect(response).to.be.an('object');
    });

    it('getStrikwarnOutOfDate', async () => {
        const response = await awarenesPreWarningService.getStrikwarnOutOfDate();
        expect(response).to.be.an('array');
    });

    it('getStrikwarnById', async () => {
        const response = await awarenesPreWarningService.getStrikwarnById();
        expect(response).to.be.an('object');
    });

    it('deleteStrikwarnOutOfDateById', async () => {
        const response = await awarenesPreWarningService.deleteStrikwarnOutOfDateById();
        expect(response).to.be.false;
    });

    it('deleteStrikwarnOutOfDate/{username}', async () => {
        const response = await awarenesPreWarningService.deleteStrikwarnOutOfDateUsername();
        expect(response).to.be.true;
    });
});
