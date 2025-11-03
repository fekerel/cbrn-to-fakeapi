/* eslint-disable no-param-reassign, array-callback-return, import/no-cycle, max-len, no-restricted-syntax, consistent-return, global-require */

class JiraService {// User disable date : 12.04.2024
    testExecution:any[] = [];
    mochaResults = { PASSED: 0, FAILED: 0, PENDING: 0 };
    async addMochaResult(ctx:{ 'status':string }) {
        if (ctx.status === 'passed')
            this.mochaResults.PASSED += 1;
        else if (ctx.status === 'failed')
            this.mochaResults.FAILED += 1;
        else
            this.mochaResults.PENDING += 1;
        return '1';
    }

    async getMochaResults() {
        return this.mochaResults;
    }

    async checkIfTestLinked(ctx:{ 'title':string, 'status':string, 'body':string }) {
        if (ctx.body.includes('Test Link')) {
            let testBody = ctx.body;
            const searchText = "title: 'Test Link', value: 'https://gojira.havelsan.com.tr/browse/C4IUMMAN";
            while (testBody.indexOf(searchText) >= 0) { // 1 test 2 link kontrol et
                testBody = testBody.substring(testBody.indexOf(searchText) + 66);
                const testID = testBody.substring(0, testBody.indexOf("'"));
                let status;
                if (ctx.status === 'passed')
                    status = 'PASS';
                else if (ctx.status === 'failed')
                    status = 'FAIL';
                else
                    status = 'ABORTED';

                const testRun = { testKey: testID, status };
                const prevResult = this.testExecution.find((result) => result.testKey === testID);
                if (prevResult !== undefined) {
                    if (testRun.status === 'FAIL' || (testRun.status === 'ABORTED' && prevResult.status === 'PASS')) {
                        this.testExecution = this.testExecution.filter((el) => el.testKey !== testID);
                        this.testExecution.push(testRun);
                    }
                } else {
                    this.testExecution.push(testRun);
                }
            }
        }
        return true;
    }

    async getResults() {
        return this.testExecution;
    }
}
export const jiraService = new JiraService();
