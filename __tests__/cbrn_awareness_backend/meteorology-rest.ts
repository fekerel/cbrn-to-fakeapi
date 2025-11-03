import { awarenessMessageService } from '@/api/_AwarenessMessageService';

const { expect } = require('chai');

describe('Meteorology Rest', async () => {
    it('getAreaOfValidityFromLocation', async () => {
        const response = await awarenessMessageService.getAreaOfValidityFromLocation();
        expect(response).to.be.true;
    });
});
