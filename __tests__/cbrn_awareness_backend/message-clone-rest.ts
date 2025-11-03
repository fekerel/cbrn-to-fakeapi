import { awarenessMessageService } from '@/api/_AwarenessMessageService';

const { expect } = require('chai');

describe('Message Clone Rest', async () => {
    it('cloneMessage', async () => {
        const response = await awarenessMessageService.cloneMessage();
        expect(response).to.be.true;
    });
});
