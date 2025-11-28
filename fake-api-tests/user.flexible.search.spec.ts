import { userFlexibleSearchService } from '@/api/fakeApi/UserFlexibleSearchService';
import { expect } from 'chai';

describe('POST /users/flexible-search', () => {

    describe('Basic Search Functionality', () => {
        
        it('should find user by email and return single object', async () => {
            const result = await userFlexibleSearchService.searchByEmail();
            
            expect(result.response.status).to.equal(result.expectedStatus);
            expect(result.isValidResponse).to.be.true;
            expect(result.response.data).to.be.an('object');
            expect(result.response.data).to.not.be.an('array');
            expect(result.response.data).to.have.property('email');
            expect(result.response.data).to.have.property('id');
        });

        it('should find user by phone and return single object', async () => {
            const result = await userFlexibleSearchService.searchByPhone();
            
            expect(result.response.status).to.equal(result.expectedStatus);
            expect(result.isValidResponse).to.be.true;
            expect(result.response.data).to.be.an('object');
            expect(result.response.data).to.not.be.an('array');
            expect(result.response.data).to.have.property('phone');
        });

        it('should find users by firstName and return array', async () => {
            const result = await userFlexibleSearchService.searchByFirstName();
            
            expect(result.response.status).to.equal(result.expectedStatus);
            expect(result.isValidResponse).to.be.true;
            expect(result.response.data).to.be.an('array');
        });

        it('should find users by firstName and lastName combination', async () => {
            const result = await userFlexibleSearchService.searchByFullName();
            
            expect(result.response.status).to.equal(result.expectedStatus);
            expect(result.isValidResponse).to.be.true;
            expect(result.response.data).to.be.an('array');
        });
    });

    describe('Error Handling', () => {
        
        it('should return 400 when no search fields provided', async () => {
            const result = await userFlexibleSearchService.searchWithNoFields();
            
            expect(result.response.status).to.equal(400);
            expect(result.response.data).to.have.property('error');
            expect(result.response.data).to.have.property('code', 'MISSING_SEARCH_FIELDS');
        });

        it('should return 422 for invalid email format', async () => {
            const result = await userFlexibleSearchService.searchWithInvalidEmail();
            
            expect(result.response.status).to.equal(422);
            expect(result.response.data).to.have.property('code', 'INVALID_EMAIL_FORMAT');
        });

        it('should return 404 for non-existent user', async () => {
            const result = await userFlexibleSearchService.searchNonExistentUser();
            
            expect(result.response.status).to.equal(404);
            expect(result.response.data).to.have.property('code', 'NOT_FOUND');
        });
    });

    describe('Breaking Change Sensitive Tests', () => {
        /**
         * These tests are designed to PASS when the server runs normally,
         * but FAIL when specific breaking changes are active.
         * This allows testing of "healing" capabilities.
         */

        describe('FIELD_RENAME Breaking Change', () => {
            
            it('should accept firstName field (fails when FIELD_RENAME active)', async () => {
                const result = await userFlexibleSearchService.searchWithOldFieldName();
                
                expect(result.response.status).to.equal(200, 
                    'Expected status 200 but got ' + result.response.status + 
                    '. Response: ' + JSON.stringify(result.response.data));
                expect(result.response.data).to.be.an('array');
            });

            it('should accept lastName field (fails when FIELD_RENAME active)', async () => {
                const user = await userFlexibleSearchService.getRandomUser();
                
                const response = await userFlexibleSearchService.rawSearch({
                    lastName: user.lastName
                });
                
                expect(response.status).to.equal(200,
                    'Expected status 200 but got ' + response.status + 
                    '. Response: ' + JSON.stringify(response.data));
            });
        });

        describe('STATUS_CODE Breaking Change', () => {
            
            it('should return status 200 for successful search (fails when STATUS_CODE active)', async () => {
                const result = await userFlexibleSearchService.searchExpectingStatus200();
                
                expect(result.response.status).to.equal(200,
                    'Expected status 200 but got ' + result.response.status);
            });

            it('should return status 200 for email search (fails when STATUS_CODE active)', async () => {
                const result = await userFlexibleSearchService.searchByEmail();
                
                expect(result.response.status).to.equal(200,
                    'Expected status 200 but got ' + result.response.status);
            });
        });

        describe('RESPONSE_STRUCTURE Breaking Change', () => {
            
            it('should return direct array without wrapper (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await userFlexibleSearchService.searchExpectingDirectResponse();
                
                expect(result.response.data, 
                    'Expected direct array but got: ' + JSON.stringify(result.response.data))
                    .to.be.an('array');
                expect(result.response.data, 
                    'Response should not be wrapped in { data: ... }')
                    .to.not.have.property('data');
            });

            it('should return direct object for email search (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await userFlexibleSearchService.searchByEmail();
                
                expect(result.response.data, 'Expected user object with email property')
                    .to.have.property('email');
                expect(result.response.data, 'Response should not be wrapped')
                    .to.not.have.property('data');
            });
        });

        describe('REQUIRED_FIELD Breaking Change', () => {
            
            it('should work without limit field (fails when REQUIRED_FIELD active)', async () => {
                const result = await userFlexibleSearchService.searchWithoutLimit();
                
                expect(result.response.status).to.equal(200,
                    'Expected status 200 but got ' + result.response.status + 
                    '. Response: ' + JSON.stringify(result.response.data));
            });

            it('should search by email without limit (fails when REQUIRED_FIELD active)', async () => {
                const user = await userFlexibleSearchService.getRandomUser();
                
                const response = await userFlexibleSearchService.rawSearch({
                    email: user.email
                });
                
                expect(response.status).to.not.equal(400,
                    'Request should not fail. Response: ' + JSON.stringify(response.data));
            });
        });
    });

    describe('Edge Cases with Real Data', () => {
        
        it('should handle search with partial firstName match', async () => {
            const user = await userFlexibleSearchService.getRandomUser();
            const partialName = user.firstName.substring(0, 3);
            
            const response = await userFlexibleSearchService.rawSearch({
                firstName: partialName
            });
            
            expect(response.status).to.be.oneOf([200, 404]);
            if (response.status === 200) {
                expect(response.data).to.be.an('array');
            }
        });

        it('should be case insensitive for email search', async () => {
            const user = await userFlexibleSearchService.getRandomUser();
            const uppercaseEmail = user.email.toUpperCase();
            
            const response = await userFlexibleSearchService.rawSearch({
                email: uppercaseEmail
            });
            
            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('email');
        });

        it('should search multiple users with different criteria', async () => {
            const users = await userFlexibleSearchService.getRandomUsers(3);
            
            for (const user of users) {
                const response = await userFlexibleSearchService.rawSearch({
                    email: user.email
                });
                
                expect(response.status).to.equal(200);
                expect(response.data.id).to.equal(user.id);
            }
        });
    });
});
