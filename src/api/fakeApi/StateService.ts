import ApiService from "../ApiService";

class StateService {
    public async resetDb() {
        const res = await ApiService.getInstance().instance.post('_admin/reset-db');
        if(res.status !== 204) {
            throw new Error(`reset-db failed: ${res.status} ${res.statusText}`)
        }
        console.log("reset başarılı");
    }
}

export const stateService = new StateService();