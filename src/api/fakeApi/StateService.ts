import ApiService from "../ApiService";
import { AxiosResponse } from "axios";

class StateService {
    public async resetDb() {
        const response: AxiosResponse = await ApiService.getInstance().instance.post("/_admin/reset-db");
        if (response.status !== 204) {
            throw new Error(`Failed to reset DB. Status code: ${response.status}`);
        }
        return response;
    }
}

export const stateService = new StateService();


