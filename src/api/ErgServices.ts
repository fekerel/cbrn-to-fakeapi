import { AxiosResponse } from 'axios';
import ApiService from '@api/ApiService';
import newErgAgent from '@api/body/Erg/newErgAgent.json';

class ErgService {
    public async getExistingErgDetails(): Promise<any[]> {
        const response: AxiosResponse = await ApiService.getInstance().instance.get('/cbrn-erg-backend/getErg?name=&unId=');
        return response.data;
    }

    public generateUniqueUnID(existingUnIDs: number[]): number {
        let newUnID = 1001;
        while (existingUnIDs.includes(newUnID))
            newUnID++;

        return newUnID;
    }

    public getRandomGuideID(existingGuideIDs: string[]): string {
        const randomIndex = Math.floor(Math.random() * existingGuideIDs.length);
        return existingGuideIDs[randomIndex];
    }

    public async createErg(name: string) {
        const existingErgDetails = await this.getExistingErgDetails();
        const existingUnIDs = existingErgDetails.map((element: any) => element.unId);
        const existingGuideIDs = existingErgDetails.map((element: any) => element.guideId);
        const newUnID = this.generateUniqueUnID(existingUnIDs);
        const randomGuideID = this.getRandomGuideID(existingGuideIDs);

        const body = JSON.parse(JSON.stringify(newErgAgent));
        body.unId = newUnID;
        body.guideId = randomGuideID;
        body.name = name;

        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-erg-backend/erg', body);
        return response.status;
    }

    public async checkERGs(ergName: string) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get('/cbrn-erg-backend/getErg?name=&unId=');
        const ERG = response.data.find((element:any) => element.name === ergName);
        return ERG;
    }
}
export const ergService = new ErgService();
