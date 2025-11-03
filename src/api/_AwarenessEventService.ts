/* eslint-disable max-len, import/no-cycle */

import { AxiosResponse } from 'axios';
import { randomInt } from 'crypto';
import { currentDate, randomMainEventName } from '@test/cbrn_awareness_backend/cbrn-main-event';
import addNewMainEvent from './body/_awareness/addNewMaintEvent.json';
import searchCbrnEvents from './body/_awareness/searchCbrnEvents.json';
import ApiService from './ApiService';
import { awarenessMessageService, messageListCbrn } from './_AwarenessMessageService';
import transformEvent from './body/_awareness/transformMessage.json';
import transformMainEvent from './body/_awareness/transformMainEvent.json';

const eventTypeEnumList:string[] = ['CHEM', 'BIO', 'RAD', 'NUC'];

class AwarenessEventService {
    public async updateCbrnMainEvent() {
        await this.addNewMainEvent(randomMainEventName(), eventTypeEnumList[randomInt(eventTypeEnumList.length)], currentDate());
        const listEventData = await this.searchCbrnEvents();
        const eventData = listEventData[randomInt(listEventData.length)];
        eventData.explanation = 'This Data Has Been Updated';
        await ApiService.getInstance().instance.post('cbrn-awareness-backend/updateCbrnMainEvent', eventData);
        const newListEventData = await this.searchCbrnEvents();
        if (newListEventData.find((data: { cbrnMainEventId:number, explanation:string }) => data.cbrnMainEventId === eventData.cbrnMainEventId && data.explanation === eventData.explanation))
            return true;
        return false;
    }

    public async searchCbrnEvents() {
        const body = JSON.parse(JSON.stringify(searchCbrnEvents));
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/searchCbrnEvents', body);
        return response.data;
    }

    public async addNewMainEvent(_cbrnMainEventName:string, _eventType:string, _currentDate:string) {
        const body = JSON.parse(JSON.stringify(addNewMainEvent));
        body.cbrnMainEventName = _cbrnMainEventName;
        body.eventType = _eventType;
        body.eventDate = _currentDate;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/addNewMainEvent', body);
        return response.data;
    }

    public async listArchivedMainEventsByTypeList() {
        const body = JSON.parse(JSON.stringify(searchCbrnEvents));
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/listArchivedMainEventsByTypeList', body);
        return response.data;
    }

    public async archiveMainEventList() {
        const newEvent = await this.addNewMainEvent(randomMainEventName(), eventTypeEnumList[randomInt(eventTypeEnumList.length)], currentDate());
        await ApiService.getInstance().instance.post('/cbrn-awareness-backend/archiveMainEventList', [newEvent.cbrnMainEventId]);
        const archiveEventDataList = await this.listArchivedMainEventsByTypeList();
        if (archiveEventDataList.find((data: { cbrnMainEventId:number }) => data.cbrnMainEventId === newEvent.cbrnMainEventId))
            return true;
        return false;
    }

    public async archiveMainEventById(cbrnMainEventId:number) {
        await ApiService.getInstance().instance.post('/cbrn-awareness-backend/archiveMainEventList', [cbrnMainEventId]);
        const archiveEventDataList = await this.listArchivedMainEventsByTypeList();
        if (archiveEventDataList.find((data: { cbrnMainEventId:number }) => data.cbrnMainEventId === cbrnMainEventId))
            return true;
        return false;
    }

    public async listDeletedMainEventsByTypeList() {
        const body = JSON.parse(JSON.stringify(searchCbrnEvents));
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/listDeletedMainEventsByTypeList', body);
        return response.data;
    }

    public async revertMainEventList() {
        const newEvent = await this.addNewMainEvent(randomMainEventName(), eventTypeEnumList[randomInt(eventTypeEnumList.length)], currentDate());
        if (!(await this.archiveMainEventById(newEvent.cbrnMainEventId)))
            return false;
        if (!(await this.deleteMainEventListById(newEvent.cbrnMainEventId)))
            return false;
        await ApiService.getInstance().instance.post('/cbrn-awareness-backend/revertMainEventList', [newEvent.cbrnMainEventId]);
        const archiveEventDataList = await this.listArchivedMainEventsByTypeList();
        if (archiveEventDataList.find((data: { cbrnMainEventId:number }) => data.cbrnMainEventId === newEvent.cbrnMainEventId))
            return true;
        return false;
    }

    public async searchCbrnEventsWithLocation() {
        const body = JSON.parse(JSON.stringify(searchCbrnEvents));
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/searchCbrnEventsWithLocation', body);
        return response.status;
    }

    public async deleteMainEventListById(cbrnMainEventId:number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/deleteMainEventList', [cbrnMainEventId]);
        if (response.status === 200) {
            const deletedList = await this.listDeletedMainEventsByTypeList();
            if (deletedList.find((data: { cbrnMainEventId:number }) => data.cbrnMainEventId === cbrnMainEventId))
                return true;
        }
        return false;
    }

    public async deleteMainEventList() {
        const newEvent = await this.addNewMainEvent(randomMainEventName(), eventTypeEnumList[randomInt(eventTypeEnumList.length)], currentDate());
        if (!(await this.archiveMainEventById(newEvent.cbrnMainEventId)))
            return false;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/deleteMainEventList', [newEvent.cbrnMainEventId]);
        if (response.status === 200) {
            const deletedList = await this.listDeletedMainEventsByTypeList();
            if (deletedList.find((data: { cbrnMainEventId:number }) => data.cbrnMainEventId === newEvent.cbrnMainEventId))
                return true;
        }
        return false;
    }

    public async transformMainEvent() {
        // Mesaj ve yeni event oluşturuldu ardından event değişimi yapıldı.
        const msgId = await awarenessMessageService.importMessage(messageListCbrn[randomInt(messageListCbrn.length)]);
        const message = await awarenessMessageService.getCbrn2ById(msgId);
        const newEvent = await this.addNewMainEvent(randomMainEventName(), message.eventType, currentDate());
        const body = JSON.parse(JSON.stringify(transformEvent));
        body.transferIdList = [msgId];
        body.mainEventId = newEvent.cbrnMainEventId;
        const response:AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/transferCbrnMessages', body);
        if (!(response.status === 200))
            return false;

        // Mesajın event değişimi kontrol edildi.
        const updatedMessage = await awarenessMessageService.getCbrn2ById(msgId);
        if (updatedMessage.cbrnMainEventId !== newEvent.cbrnMainEventId)
            return false;

        // İlgili event'e ait tüm mesajlar bulundu.
        const messageList = await awarenessMessageService.searchCbrnMessages([message.eventType], [message.cbrnMessageType]);
        const msgList = messageList.filter((msg: { cbrnMainEventId: number }) => msg.cbrnMainEventId === newEvent.cbrnMainEventId);

        // Transform işlemi yapıldı
        const transformEventBody = JSON.parse(JSON.stringify(transformMainEvent));
        const idTypeList = [];
        msgList.forEach((message) => {
            idTypeList.push({ id: message.id, type: message.cbrnMessageType });
        });
        transformEventBody.idTypeList = idTypeList;
        transformEventBody.sourceDate = newEvent.createdDate;
        transformEventBody.destDate = currentDate();
        transformEventBody.sourceLoc = { latitude: newEvent.latitude, longitude: newEvent.longitude };

        const response2:AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/transformMainEvent', transformEventBody);
        return response2.status === 200;
    }

    public async saveMainEvent() {
        const newEvent = await this.addNewMainEvent(randomMainEventName(), eventTypeEnumList[randomInt(eventTypeEnumList.length)], currentDate());
        newEvent.explanation = 'Bu bir testtir.';
        const response:AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/saveMainEvent', newEvent);
        if (response.status !== 200)
            return false;
        const updatedEvent = await this.getMainEventOnlyBId(newEvent.cbrnMainEventId);
        return updatedEvent.explanation === newEvent.explanation;
    }

    public async restoreMainEventList() {
        const archivedDataList = await this.listArchivedMainEventsByTypeList();
        const archivedData = archivedDataList[randomInt(archivedDataList.length)];
        const response:AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/restoreMainEventList', [archivedData.cbrnMainEventId]);
        return response.status === 200;
    }

    public async listMainEventsByTypeList() {
        const body = eventTypeEnumList;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/listMainEventsByTypeList', body);
        return response.data;
    }

    public async listAllMainEventsByIdList() {
        const messageList = await awarenessMessageService.searchCbrnMessages();
        const randomMessage = messageList[randomInt(messageList.length)];
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/listAllMainEventsByIdList', [randomMessage.cbrnMainEventId]);
        if (response.status !== 200)
            return false;
        if (randomMessage.cbrnMainEventId === response.data[0].cbrnMainEventId)
            return response.data;
        return false;
    }

    public async deleteMainEvent() {
        const newEvent = await this.addNewMainEvent(randomMainEventName(), eventTypeEnumList[randomInt(eventTypeEnumList.length)], currentDate());
        if (newEvent === false)
            return false;
        if (!(await this.archiveMainEventById(newEvent.cbrnMainEventId)))
            return false;
        const archiveList = await this.listArchivedMainEventsByTypeList();
        const sonuc:boolean = archiveList.some((msg: { cbrnMainEventId:number }) => msg.cbrnMainEventId === newEvent.cbrnMainEventId);
        if (!sonuc)
            return false;
        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/cbrn-awareness-backend/deleteMainEvent?eventId=${newEvent.cbrnMainEventId}`);
        if (response.status === 200)
            return response.data;
        return false;
    }

    public async listMainEventsByTypeAndState() {
        const newEvent = await this.addNewMainEvent(randomMainEventName(), eventTypeEnumList[randomInt(eventTypeEnumList.length)], currentDate());
        if (newEvent === false)
            return false;

        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/listMainEventsByTypeAndState?eventType=${newEvent.eventType}`);
        if (response.status === 200)
            return response.data;

        return false;
    }

    public async listAllMainEvents() {
        await this.addNewMainEvent(randomMainEventName(), eventTypeEnumList[randomInt(eventTypeEnumList.length)], currentDate());
        const response: AxiosResponse = await ApiService.getInstance().instance.get('/cbrn-awareness-backend/listAllMainEvents');
        if (response.status === 200)
            return response.data;
        return false;
    }

    public async isMainEventUndefined() {
        const newEvent = await this.addNewMainEvent(randomMainEventName(), eventTypeEnumList[randomInt(eventTypeEnumList.length)], currentDate());
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/isMainEventUndefined?cbrnMainEventId=${newEvent.cbrnMainEventId}`);
        return response.status;
    }

    public async getMainEventOnlyBId(cbrnMainEventId:number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getMainEventById?eventId=${cbrnMainEventId}`);
        if (response.data.cbrnMainEventId === cbrnMainEventId)
            return response.data;
        return false;
    }

    public async getMainEventById() {
        await this.addNewMainEvent(randomMainEventName(), eventTypeEnumList[randomInt(eventTypeEnumList.length)], currentDate());
        const eventList = await this.searchCbrnEvents();
        const eventData = eventList[randomInt(eventList.length)];
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getMainEventById?eventId=${eventData.cbrnMainEventId}`);
        if (response.data.cbrnMainEventId === eventData.cbrnMainEventId)
            return true;
        return false;
    }

    public async getCbrnMainEventByIdAndIsDeletedFalse() {
        await this.addNewMainEvent(randomMainEventName(), eventTypeEnumList[randomInt(eventTypeEnumList.length)], currentDate());
        const eventList = await this.searchCbrnEvents();
        const eventData = eventList[randomInt(eventList.length)];
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getCbrnMainEventByIdAndIsDeletedFalse?cbrnMainEventId=${eventData.cbrnMainEventId}`);
        return !response.data.isDeleted;
    }
}
export const awarenessEventService = new AwarenessEventService();
