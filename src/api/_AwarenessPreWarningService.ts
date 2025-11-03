import { AxiosResponse } from "axios";
import ApiService from "./ApiService";
import { awarenessMessageService,username } from "./_AwarenessMessageService";
import { randomInt } from "crypto";
import addStrikwarn from './body/awareness/importUsed2_JSON/PreWarning/strikwarn_0.json';
import addMerwarn from './body/awareness/importUsed2_JSON/PreWarning/merwarn_0.json';

class AwarenessPreWarningService {
    public async updateStrikwarn() {
        const message = await this.addStrikwarn();
        if (message === false)
            return false;
        message.isArchived = true;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/updateStrikwarn', message);
        if (response.status !== 200)
            return false;
        const archivedMessageList = await awarenessMessageService.archivedSearchCbrnMessages([], ['STRIKWARN']);
        return archivedMessageList.some((msg: { id: number }) => msg.id === message.id);
    }

    public async getStrikwarnListByIdList() {
        const message = await this.addStrikwarn();
        if (message === false)
            return false;
        const msgList = await awarenessMessageService.searchCbrnMessages([], ['STRIKWARN']);
        const IDList: number[] = msgList.map((msg) => msg.id);
        const response:AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/getStrikwarnListByIdList', [IDList[randomInt(IDList.length)]]);
        return IDList.includes(response.data[0].id);
    }

    public async getStrikwarnById(msgId?:number) {
        if (msgId === undefined) {
            const msgList = await awarenessMessageService.searchCbrnMessages([], ['STRIKWARN']);
            msgId = msgList[randomInt(msgList.length)].id;
        }
        const response = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getStrikwarnById?id=${msgId}`);
        const message = response.data;
        if (typeof message === 'object')
            return message;
        return false;
    }

    public async addPreWarningMessageMTF(message){
        const body = JSON.parse(JSON.stringify(message));
        const messageWithEncodedSpaces = body.mtfFile.replace(/ /g, '%20');
        let url = `/cbrn-awareness-backend/importMtfFromText?mtfFile=${messageWithEncodedSpaces}&isCbrnMessage=true&publishUnitNames=null&isApproved=false`;
        if (body.mainEventId !== null)
            url += `&mainEventId=${body.mainEventId}`;
        const response: AxiosResponse = await ApiService.getInstance().instance.post(url, body);
        return response;

    }

    public async addStrikwarn() {
        const response = await this.addPreWarningMessageMTF(addStrikwarn[0])
        await awarene

        if (response.status === 200) {
            const newSWMessageId:number = response.data[0];
            const message = await this.getStrikwarnById(newSWMessageId);
            if (message)
                return message;
        }
        return false;
    }

    public async getStrikwarnWithCoordinateById() {
        const message = await this.addStrikwarn();
        if (message !== false) {
            const response = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getStrikwarnWithCoordinateById?id=${message.id}`);
            return response.data;
        }
        return false;
    }

    public async getStrikwarnOutOfDate() {
        const response = await ApiService.getInstance().instance.get('/cbrn-awareness-backend/getStrikwarnOutOfDate');
        return response.data;
    }

    public async deleteStrikwarnOutOfDateById() {
        const list = await this.getStrikwarnOutOfDate();
        const randomMessage = list[randomInt(list.length)];
        const response = await ApiService.getInstance().instance.delete(`/cbrn-awareness-backend/deleteStrikwarnOutOfDateById?username=${username}&idList=${randomMessage.id}`);
        if (response.status !== 200)
            return false;
        const list2 = await this.getStrikwarnOutOfDate();
        return list2.some((msg: { id: number }) => msg.id === randomMessage.id);
    }

    public async deleteStrikwarnOutOfDateUsername() {
        await this.addStrikwarn();
        const list = await this.getStrikwarnOutOfDate();
        const response = await ApiService.getInstance().instance.delete(`/cbrn-awareness-backend/deleteStrikwarnOutOfDate/${username}`);
        if (response.status !== 200)
            return false;
        const list2 = await this.getStrikwarnOutOfDate();
        return list2.length < list.length;
    }

    public async updateMerwarn(){

    }

    public async getMerwarnListByIdList(){

    }

    public async addMerwarn(){
        addMerwarn

    }
    
    public async getMerwarnById(){

    }
}

export const awarenesPreWarningService = new AwarenessPreWarningService()