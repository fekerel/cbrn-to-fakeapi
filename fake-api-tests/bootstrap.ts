import { stateService } from "@/api/fakeApi/StateService";

beforeEach(async function () {
    this.timeout(20000);
    await stateService.resetDb();
});