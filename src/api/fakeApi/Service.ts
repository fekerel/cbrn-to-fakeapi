import addUserJSON from "@api/body/fakeApi/addUser.json";
import ApiService from "../ApiService";
import { DeepPartial } from "../../common/fakeApi/Types";
import merge from "lodash.merge";

class Service {
    /**
     * Create a user. `userData` will be deep-merged onto the default template.
     * Use a unique email in tests (timestamp/uuid).
     */
    public async addUser(userData: DeepPartial<typeof addUserJSON> = {}) {
        const overrides = userData;
        const body = merge({}, addUserJSON, overrides);
        const res = await ApiService.getInstance().instance.post("/users", body);
        return res;
    }
}

export const service = new Service();