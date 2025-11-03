import addUserJSON from "@api/body/fakeApi/addUser.json";
import ApiService from "./ApiService";

class Service { // npm run test:fake
    public async addUser() {

        const uniqueEmail = `test+${Date.now()}@example.com`;
        const body = JSON.parse(JSON.stringify(addUserJSON));
        body.email = uniqueEmail;

        const res = await ApiService.getInstance().instance.post(`/users`, body);
        return res.data;     
    
    }
}

export const service = new Service();