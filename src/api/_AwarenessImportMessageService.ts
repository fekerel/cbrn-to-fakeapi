import { AxiosResponse } from "axios";
import ApiService from "./ApiService";
import { awarenessMessageService } from "./_AwarenessMessageService";

class AwarenessImportMessage {
    
    public async importMessageFromTXT(message:any){
        const body = JSON.parse(JSON.stringify(message));
        const isMeteoMessage = ['BWR', 'EDR', 'CDR'].includes(body.split('/')[1].slice(5));
        if (isMeteoMessage) {
            const type = body.split('/')[1].slice(5);
            const meteoMessageList = await awarenessMessageService.searchCbrnMessagesIgnoreUnit([], ['BWR', 'EDR', 'CDR'], false, false);
            const message = meteoMessageList.find((msg: { cbrnMessageType: string }) => msg.cbrnMessageType === type);
            if (message)
                return message.id;
        }
        const messageWithEncodedSpaces = body.replace(/ /g, '%20');
        let url = `/cbrn-awareness-backend/importMtfFromText?mtfFile=${messageWithEncodedSpaces}&isCbrnMessage=${!['BWR', 'EDR', 'CDR'].includes(body.split('/')[1].slice(5))}&publishUnitNames=null&isApproved=false`;
        const response: AxiosResponse = await ApiService.getInstance().instance.post(url, body);
        return response.data[0];
    }

    public async importMessageFromJSON(message:any){
        const body = JSON.parse(JSON.stringify(message));
        const isMeteoMessage = ['BWR', 'EDR', 'CDR'].includes(body.mtfFile.split('/')[1].slice(5));
        if (isMeteoMessage) {
            const type = body.mtfFile.split('/')[1].slice(5);
            const meteoMessageList = await awarenessMessageService.searchCbrnMessagesIgnoreUnit([], ['BWR', 'EDR', 'CDR'], false, false);
            const message = meteoMessageList.find((msg: { cbrnMessageType: string }) => msg.cbrnMessageType === type);
            if (message)
                return message.id;
        }
        const messageWithEncodedSpaces = body.mtfFile.replace(/ /g, '%20');
        let url = `/cbrn-awareness-backend/importMtfFromText?mtfFile=${messageWithEncodedSpaces}&isCbrnMessage=${!['BWR', 'EDR', 'CDR'].includes(body.mtfFile.split('/')[1].slice(5))}&publishUnitNames=null&isApproved=false`;
        const response: AxiosResponse = await ApiService.getInstance().instance.post(url, body);
        return response.data[0];
    }

}

export const awarenessImportMessage = new AwarenessImportMessage();