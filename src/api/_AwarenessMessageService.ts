/* eslint-disable max-len, import/no-cycle, no-param-reassign */
import { AxiosResponse } from 'axios';
import { randomInt } from 'crypto';
import assert from 'node:assert';
import { awarenessEventService } from './_AwarenessEventService';
import { randomMainEventName, currentDate } from '../../__tests__/cbrn_awareness_backend/cbrn-main-event';
// import addStrikwarn from './body/_awareness/addStrikwarn.json';
import addStrikwarn from './body/awareness/importUsed2_JSON/PreWarning/strikwarn_0.json';
import publishMessage from './body/_awareness/publishMessage.json';
import searchCbrnMessages from './body/_awareness/searchCbrnMessages.json';
//import cbrnChem2Message from './body/awareness/importUsed/CHEM/2.json';
//import cbrnBio2Message from './body/awareness/importUsed/BIO/2.json';
//import cbrnNuc2Message from './body/awareness/importUsed/NUC/2.json';
//import cbrnRad2Message from './body/awareness/importUsed/RADIO/2.json';

import cbrnChem2Message from './body/awareness/importUsed2_JSON/CHEM/2_0.json';
import cbrnBio2Message from './body/awareness/importUsed2_JSON/BIO/2_0.json';
import cbrnNuc2Message from './body/awareness/importUsed2_JSON/NUC/2_0.json';
import cbrnRad2Message from './body/awareness/importUsed2_JSON/RAD/2_0.json';

import forwardMessage from './body/_awareness/forwardMessage.json';
import ApiService from './ApiService';
import transformLocationandDate from './body/_awareness/transformLocationAndDate.json';
import getCbrnCommonByIdList from './body/_awareness/getCbrnCommonByIdList.json';
import transformMessage from './body/_awareness/transformMessage.json';
//import bwrMessage from './body/_awareness/importBWR.json';
import bwrMessage from './body/awareness/importUsed2_JSON/METEO/BWR.json';
import cloneMessageJSON from './body/_awareness/cloneMessage.json';

const messageTypeList:string[] = ['CBRN1', 'CBRN2', 'CBRN3', 'CBRN4', 'CBRN5', 'CBRN6', 'SITREP', 'MIR', 'HAZWARN', 'STRIKWARN', 'MWR', 'SUM', 'MERWARN'];
export const messageListCbrn = [cbrnChem2Message, cbrnNuc2Message, cbrnRad2Message, cbrnBio2Message];
export const messageTypeList2:string[] = ['CBRN1', 'CBRN2', 'CBRN3', 'CBRN4', 'CBRN5', 'CBRN6'];
export const username: string = 'admin';

class AwarenessMessageService {
    public async archiveAllCbrnMessages() {
        for (let i = messageTypeList2.length - 1; i >= 0; i--) {
            const messageList = await this.searchCbrnMessages(undefined, [messageTypeList2[i]]);
            messageList.forEach((message) => {
                this.archiveCbrnMessagesById(message.id);
            });
        }

        for (let i = 0; i < messageTypeList2.length; i++) {
            const messageList = await this.searchCbrnMessages(undefined, [messageTypeList2[i]]);
            messageList.forEach((message) => {
                this.archiveCbrnMessagesById(message.id);
            });
        }
        const messageList = await this.searchCbrnMessages();
        return messageList.length === 0;
    }

    /// ////////////////////////////////////////////////////////////////////////////////////////////////
    //                          MESSAGE-PUBLISH-REST.TS

    public async importMessage(importMessage) {
        const body = JSON.parse(JSON.stringify(importMessage[0]));
        const isMeteoMessage = ['BWR', 'EDR', 'CDR'].includes(body.mtfFile.split('/')[1].slice(5));
        if (isMeteoMessage) {
            const type = body.mtfFile.split('/')[1].slice(5);
            const meteoMessageList = await this.searchCbrnMessagesIgnoreUnit([], ['BWR', 'EDR', 'CDR'], false, false);
            const message = meteoMessageList.find((msg: { cbrnMessageType: string }) => msg.cbrnMessageType === type);
            if (message)
                return message.id;
        }
        const messageWithEncodedSpaces = body.mtfFile.replace(/ /g, '%20');
        let url = `/cbrn-awareness-backend/importMtfFromText?mtfFile=${messageWithEncodedSpaces}&isCbrnMessage=${!['BWR', 'EDR', 'CDR'].includes(body.mtfFile.split('/')[1].slice(5))}&publishUnitNames=null&isApproved=false`;
        if (body.mainEventId !== null)
            url += `&mainEventId=${body.mainEventId}`;
        const response: AxiosResponse = await ApiService.getInstance().instance.post(url, body);
        return response.data[0];
    }

    public async withdraw() {
        const msgId = await this.publishMessage();
        if (msgId === false)
            return false;
        const listSentMessageList = await this.listSentPublishedMessages();
        const sentMessage = listSentMessageList[randomInt(listSentMessageList.length)];
        const response:AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/withdraw', [sentMessage.id]);
        if (!(response.status === 200))
            return false;
        const listSentMessageList2 = await this.listSentPublishedMessages();
        return listSentMessageList2.some((msg:{ id:number }) => msg.id === sentMessage.id);
    }

    /* public async publishMsgForDoob() {
        // POST
    } */

    public async getCbrn2ById(id:number) {
        const response = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getCbrn2ById?id=${id}`);
        return response.data;
    }

    public async publishMessage() {
        const mainMessageId = await this.importMessage(messageListCbrn[randomInt(messageListCbrn.length)]);
        const response = await this.approveCbrnMessage(mainMessageId);
        if (response) {
            const msgData = await this.getCbrn2ById(mainMessageId);
            const body = JSON.parse(JSON.stringify(publishMessage));
            body.cbrnCommonDto = msgData;
            const response: AxiosResponse = await ApiService.getInstance().instance.post('cbrn-awareness-backend/publishMessage', body);
            // Responsedan ID dönmediği için status == 200 durumu kontrol edildi.
            if (response.status === 200)
                return mainMessageId;
        }
        return false;
    }

    public async listSentPublishedMessages(listMessageType?: string[]) {
        const body = JSON.parse(JSON.stringify(searchCbrnMessages));
        if (listMessageType !== undefined)
            body.messageTypeList = listMessageType;
        else
            body.messageTypeList = messageTypeList;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/listSentPublishedMessages', body);
        return response.data;
    }

    public async listReceivedPublishedMessages() {
        const body = JSON.parse(JSON.stringify(searchCbrnMessages));
        body.messageTypeList = messageTypeList2;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/listReceivedPublishedMessages', body);
        return response.data;
    }

    public async importToOwnSystem() {
        const listReceivedMessages = await this.listReceivedPublishedMessages();
        if (listReceivedMessages.length === 0)
            throw new Error("Alınmış Mesaj Olmadığı İçin Bu Hatayı Alıyorsunuz")
        const randomMessage = listReceivedMessages[randomInt(listReceivedMessages.length)];
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/importToOwnSystem', randomMessage.id);
        if (response.status !== 200)
            return false;
        const messageList = await this.searchCbrnMessages(randomMessage.eventType, randomMessage.cbrnMessageType);
        return messageList.some((msg: { id: number }) => msg.id === randomMessage.id);
    }

    public async forwardMessage() {
        const randomSentMessageId = await this.publishMessage();
        if (randomSentMessageId === false)
            return false;
        const listSentPublishedMessages = await this.listSentPublishedMessages(messageTypeList2);
        const randomSentMessage = listSentPublishedMessages[randomInt(listSentPublishedMessages.length)];
        const body = JSON.parse(JSON.stringify(forwardMessage));
        body.publishedMessageDto = randomSentMessage;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/forwardMessage', body);
        if (response.status === 200) {
            const listSentPublishedMessages2 = await this.listSentPublishedMessages();
            return listSentPublishedMessages2.length === listSentPublishedMessages.length + 1;
        }
        return false;
    }

    // Burada mesaj alımı gerçekleştiği için alınan mesajlar içerisinden random çekme devam ediyor.
    public async deleteReceivedMessages() {
        const listReceivedMessages = await this.listReceivedPublishedMessages();
        if (listReceivedMessages.length === 0)
            throw new Error("Alınmış Mesaj Olmadığı İçin Bu Hatayı Alıyorsunuz")
        const receivedMessage = listReceivedMessages[randomInt(listReceivedMessages.length)];
        const response:AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/deleteReceivedMessages', [receivedMessage.id]);
        return response.status === 200;
    }

    public async deletePublishedMessages() {
        await this.publishMessage();
        const listSentPublishedMessages = await this.listSentPublishedMessages();
        const sentMessage = listSentPublishedMessages[randomInt(listSentPublishedMessages.length)];
        const response:AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/deletePublishedMessages', [sentMessage.id]);
        return response.status === 200;
    }

    public async cancelPublishFromOutboxIdList(NPublishedMessage:number = 3) {
        const msgIdList:number[] = [];
        for (let i = 0; i < NPublishedMessage; i++)
            msgIdList.push(await this.publishMessage());

        assert(msgIdList.length === NPublishedMessage, `Eklenen Mesaj Sayısı ${NPublishedMessage} Olmalı`);
        const response = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/cancelPublishFromMailbox', msgIdList);
        assert(response.status === 200, 'Publish Mesajlar Cancel Yapılırken Hata Oluştu');
        for (let i = 0; i < NPublishedMessage; i++) {
            const msg = await this.getCbrn2ById(msgIdList[i]);
            if (msg.status.toUpperCase() !== 'CANCELLED')
                return false;
        }
        return true;
    }

    public async cancelPublishFromMailbox() {
        const msgId = await this.publishMessage();
        const msg = await this.getCbrn2ById(msgId);
        if (msg.status.toUpperCase() === 'PUBLISHED') {
            const response = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/cancelPublishFromMailbox', [msgId]);
            if (response.status !== 200)
                return false;
            const msg = await this.getCbrn2ById(msgId);
            return msg.status.toUpperCase() === 'CANCELLED';
        }
        return false;
    }

    public async listOrganisationUnits() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get('/cbrn-awareness-backend/listOrganisationUnits');
        return response.status;
    }

    public async getSentMessageById() {
        const sentMessageList = await this.listSentPublishedMessages();
        const randomMessage = sentMessageList[randomInt(sentMessageList.length)];
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getSentMessageById?id=${randomMessage.id}`);
        return (response.data.id === randomMessage.id);
    }

    public async getReceivedMessageById() {
        const receivedMessageList = await this.listReceivedPublishedMessages();
        if (receivedMessageList.length === 0)
            throw new Error("Alınmış Mesaj Olmadığı İçin Bu Hatayı Alıyorsunuz")
        const randomMessage = receivedMessageList[randomInt(receivedMessageList.length)];
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getReceivedMessageById?id=${randomMessage.id}`);
        return (response.data.id === randomMessage.id);
    }

    
    /// ////////////////////////////////////////////////////////////////////////////////////////////////
    //                                  AWARENESS-CORE.TS

    public async transformLocationsAndDates() {
        const mainMessageId = await this.importMessage(messageListCbrn[randomInt(messageListCbrn.length)]);
        const message = await this.getCbrn2ById(mainMessageId);
        const body = JSON.parse(JSON.stringify(transformLocationandDate));
        body.sourceDate =  message.delta.incidentStartDtg
        body.idTypeList[0].id = message.id;
        body.idTypeList[0].type = message.cbrnMessageType;
        body.destDate = currentDate();
        body.sourceLoc.latitude = message.informationForMap.eventLocationList.latitude
        body.sourceLoc.longitude = message.informationForMap.eventLocationList.longitude
        const response:AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/transformLocationsAndDates', body);
        return response.status === 200;
    }

    public async transferCbrnMessages() {
        const mainMessageId = await this.importMessage(messageListCbrn[randomInt(messageListCbrn.length)]);
        const message = await this.getCbrn2ById(mainMessageId);
        const responseData = await awarenessEventService.addNewMainEvent(randomMainEventName(), message.eventType, currentDate());
        const body = JSON.parse(JSON.stringify(transformMessage));
        body.transferIdList = [mainMessageId];
        body.mainEventId = responseData.cbrnMainEventId;
        const response:AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/transferCbrnMessages', body);
        if (!(response.status === 200))
            return false;
        const updatedMessage = await this.getCbrn2ById(mainMessageId);
        return updatedMessage.cbrnMainEventId === responseData.cbrnMainEventId;
    }

    public async archivedSearchCbrnMessages(eventTypeEnumList?: string[], messageTypeList?:string[]) {
        const body = JSON.parse(JSON.stringify(searchCbrnMessages));
        if (eventTypeEnumList !== undefined)
            body.eventTypeEnumList = eventTypeEnumList;
        if (messageTypeList !== undefined)
            body.messageTypeList = messageTypeList;
        body.isArchived = true;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/searchCbrnMessages', body);
        return response.data;
    }

    public async searchCbrnMessages(eventTypeEnumList?: string[], messageTypeList?:string[]) {
        const body = JSON.parse(JSON.stringify(searchCbrnMessages));
        if (eventTypeEnumList !== undefined)
            body.eventTypeEnumList = eventTypeEnumList;
        if (messageTypeList !== undefined)
            body.messageTypeList = messageTypeList;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/searchCbrnMessages', body);
        return response.data;
    }

    public async searchCbrnMessagesIgnoreUnit(eventTypeEnumList?:string[], cbrnMessageType?:string[], isArchived? : boolean, isDeleted?: boolean) {
        const body = JSON.parse(JSON.stringify(searchCbrnMessages));
        if (cbrnMessageType !== undefined)
            body.messageTypeList = cbrnMessageType;
        if (eventTypeEnumList !== null)
            body.eventTypeEnumList = eventTypeEnumList;
        if (isArchived !== undefined)
            body.isArchived = isArchived;
        if (isDeleted !== undefined)
            body.isDeleted = isDeleted;
        else
            body.isDeleted = true;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/searchCbrnMessagesIgnoreUnit', body);
        return response.data;
    }

    public async revertDeletedMessages() {
        const newMessageId:number = await this.importMessage(messageListCbrn[randomInt(messageListCbrn.length)]);
        const responseStatusAchive = await this.archiveCbrnMessagesById(newMessageId);
        const responseStatusDelete = await this.deleteCbrnMessagesById(newMessageId);
        if (responseStatusAchive === 200 && responseStatusDelete === 200) {
            await ApiService.getInstance().instance.post('/cbrn-awareness-backend/revertDeletedMessages', [newMessageId]);
            const achivedMessageList = await this.archivedSearchCbrnMessages();
            return achivedMessageList.some((msg: { id: number }) => msg.id === newMessageId);
        }
        return false;
    }

    public async restoreArchivedCbrnMessages() {
        const mainMessageId = await this.importMessage(messageListCbrn[randomInt(messageListCbrn.length)]);
        const status = await this.archiveCbrnMessagesById(mainMessageId);
        if (status !== 200)
            return false;
        const messageList = await this.archivedSearchCbrnMessages();
        const message = messageList[randomInt(messageList.length)];
        await ApiService.getInstance().instance.post('/cbrn-awareness-backend/restoreArchivedCbrnMessages', [message.id]);
        const allmessages = await this.searchCbrnMessages();
        return allmessages.some((mes: { id: number }) => Number(mes.id) === message.id);
    }

    public async isAlfaNull() { // Sorulabilir
        const mainMessageId = await this.importMessage(messageListCbrn[randomInt(messageListCbrn.length)]);
        const message = await this.getCbrn2ById(mainMessageId);
        if (message) {
            const response:AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/isAlfaNull', message);
            return response.status === 200;
        }
        return false;
    }

    public async searchCbrnMessagesByEventId(eventId:number) {
        const body = JSON.parse(JSON.stringify(searchCbrnMessages));
        body.cbrnMainEventId = eventId;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/searchCbrnMessages', body);
        return response.data;
    }

    // public async getcbrnMessagesByEventId() {

    // }

    /* public async getOverwrittenMtf() {

    } */

    public async getCbrnCommonByIdList() {
        const mainMessageId = await this.importMessage(messageListCbrn[randomInt(messageListCbrn.length)]);
        const message = await this.getCbrn2ById(mainMessageId);
        const body = JSON.parse(JSON.stringify(getCbrnCommonByIdList));
        body[0].messageType = message.cbrnMessageType;
        const messageList = await this.searchCbrnMessages(undefined, [message.cbrnMessageType]);
        const idList2:number[] = [];
        for (let i = 0; i < messageList.length; i++) {
            if (i === 5)
                break;
            idList2.push(messageList[i].id);
        }
        body[0].idList = idList2;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/getCbrnCommonByIdList', body);
        return response.data;
    }

    public async deleteCbrnMessages() {
        const mainMessageId = await this.importMessage(messageListCbrn[randomInt(messageListCbrn.length)]);
        if (mainMessageId) {
            const message = await this.getCbrn2ById(mainMessageId);
            await this.archiveCbrnMessagesById(mainMessageId);
            const archivedMessageList = await this.archivedSearchCbrnMessages();
            if (archivedMessageList.some((msg: { id:number }) => msg.id === message.id)) {
                const status = await this.deleteCbrnMessagesById(message.id);
                if (status === 200)
                    return true;
            }
        }
        return false;
    }

    public async deleteCbrnMessagesById(id:number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/deleteCbrnMessages', [id]);
        return response.status;
    }

    public async checkMainEventOfArchivedMessages() {
        const archivedMessages = await this.archivedSearchCbrnMessages();
        const randomArchMessage = archivedMessages[randomInt(archivedMessages.length)];
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/checkMainEventOfArchivedMessages', [randomArchMessage.cbrnMainEventId]);
        return response.status === 200;
    }

    public async archiveCbrnMessages() {
        const mainMessageId = await this.importMessage(messageListCbrn[randomInt(messageListCbrn.length)]);
        if (mainMessageId) {
            const msgData = await this.getCbrn2ById(mainMessageId);
            await ApiService.getInstance().instance.post('/cbrn-awareness-backend/archiveCbrnMessages', [msgData.id]);
            const archivedMessageList = await this.archivedSearchCbrnMessages(undefined, messageTypeList);
            if (archivedMessageList.find((msg: { id:number }) => msg.id === msgData.id))
                return true;
        }
        return false;
    }

    public async archiveCbrnMessagesById(id:number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/archiveCbrnMessages', [id]);
        return response.status;
    }

    public async getDeletedMessages() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get('/cbrn-awareness-backend/getDeletedMessages');
        return response.data;
    }

    public async getCbrnMainEventLocation(cbrnMainEventId = 3) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getCbrnMainEventLocation?cbrnMainEventId=${cbrnMainEventId}`);
        return response.status;
    }

    public async getCbrnCommon() {
        const msgList = await this.searchCbrnMessages();
        const msg = msgList[randomInt(msgList.length)];
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getCbrnCommon?id=${msg.id}`);
        if (response.data)
            return true;
        return false;
    }

    public async disapproveCbrnMessage() {
        if (!(await this.approveCbrnMessage()))
            return false;
        const msgList = await this.searchCbrnMessages(undefined, messageTypeList);
        const approveMessage = msgList.find((msg: { status: string }) => msg.status === 'APPROVED');
        if (approveMessage) {
            const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/disapproveCbrnMessage?id=${approveMessage.id}`);
            if (response.status === 200) {
                const msgList = await this.searchCbrnMessages(undefined, messageTypeList);
                return msgList.some((msg: { status: string, id:number }) => msg.status === 'DRAFT' && msg.id === approveMessage.id);
            }
        }
        return false;
    }

    public async approveCbrnMessage(notApproveMessage?:number) {
        if (notApproveMessage !== undefined) {
            const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/approveCbrnMessage?id=${notApproveMessage}`);
            if (response.status === 200) {
                const msgList = await this.searchCbrnMessages(undefined, messageTypeList);
                return msgList.some((msg: { status: string, id:number }) => msg.status === 'APPROVED' && msg.id === notApproveMessage);
            }
        } else {
            const messageId = await this.importMessage(messageListCbrn[randomInt(messageListCbrn.length)]);
            const listCbrnMessage = await this.searchCbrnMessages();
            if (listCbrnMessage.some((msg: { id:number }) => msg.id === messageId)) {
                const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/approveCbrnMessage?id=${messageId}`);
                if (response.status === 200) {
                    const msgList = await this.searchCbrnMessages(undefined, messageTypeList);
                    return msgList.some((msg: { status: string, id:number }) => msg.status === 'APPROVED' && msg.id === messageId);
                }
            }
        }
        return false;
    }

    /// ////////////////////////////////////////////////////////////////////////////////////////////////
    //                                  CBRN-2-REST.TS

    public async makeMaster(list?:number[]) {
        // Manuel Mod
        if (list !== undefined){
            const idx = list[randomInt(list.length)]
            await this.importMessage(messageListCbrn[idx]);
        }            
        else
            await this.importMessage(messageListCbrn[randomInt(messageListCbrn.length)]);
        const messages = await this.searchCbrnMessages(undefined, ['CBRN2']);
        const matchingMessage = messages.find((message: any) => message.attribute.toLowerCase() !== 'master');
        if ([1, 2, 3, 4].includes(matchingMessage.cbrnMainEventId)) {
            const event = await awarenessEventService.addNewMainEvent(randomMainEventName(), matchingMessage.eventType, currentDate());
            await ApiService.getInstance().instance.post(`/cbrn-awareness-backend/updateCbrn2MainEvent?selectedCbrnIdList=${matchingMessage.id}&cbrnMainEventId=${event.cbrnMainEventId}`);
            const messages = await this.searchCbrnMessages(undefined, ['CBRN2']);
            const matchingMessage2 = messages.find((message: any) => message.id === matchingMessage.id && message.cbrnMainEventId === event.cbrnMainEventId);
            await ApiService.getInstance().instance.post('/cbrn-awareness-backend/makeMaster', matchingMessage2);
            const msgList = await this.searchCbrnMessages(undefined, ['CBRN2']);
            return msgList.some((message: any) => message.id === matchingMessage.id && message.attribute.toLowerCase() === 'master' && message.cbrnMainEventId === event.cbrnMainEventId);
        }
        await ApiService.getInstance().instance.post('/cbrn-awareness-backend/makeMaster', matchingMessage);
        const msgList = await this.searchCbrnMessages(undefined, ['CBRN2']);
        return msgList.some((message: any) => message.id === matchingMessage.id && message.attribute.toLowerCase() === 'master' && message.cbrnMainEventId === matchingMessage.cbrnMainEventId);
    }

    /// ////////////////////////////////////////////////////////////////////////////////////////////////
    //                                  METEOROLOGY-REST.TS

    public async getMeteoMessageByID(id: number, type: string) {
        const messageType = type[0].toUpperCase() + type.slice(1).toLowerCase();
        const response = await ApiService.getInstance().instance.get(`cbrn-awareness-backend/get${messageType}ById?id=${id}`);
        return response.data;
    }

    public async getAreaOfValidityFromLocation() {
        const messageId = await this.importMessage(bwrMessage);
        if (messageId === undefined)
            return false;
        const message = await this.getMeteoMessageByID(messageId, 'BWR');
        if (message === undefined)
            return false;
        const response = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getAreaOfValidityFromLocation?latitude=${message.informationForMap.bwrPlotForMapDto.latitude}&longitude=${message.informationForMap.bwrPlotForMapDto.longitude}`);
        if (response.data !== undefined && typeof response.data === 'string')
            return true;
        return false;
    }

    /// ////////////////////////////////////////////////////////////////////////////////////////////////
    //                                  MESSAGE-CLONE-REST.TS
    public async cloneMessage() {
        const randomIdx = randomInt(messageListCbrn.length);
        const mainMessageId = await this.importMessage(messageListCbrn[randomIdx]);
        const message = await this.getCbrn2ById(mainMessageId);
        const eventData = await awarenessEventService.addNewMainEvent(randomMainEventName(), message.eventType, currentDate());
        const responseUpdateMainEvent = await ApiService.getInstance().instance.post(`/cbrn-awareness-backend/updateCbrn2MainEvent?selectedCbrnIdList=${message.id}&cbrnMainEventId=${eventData.cbrnMainEventId}`);
        if (responseUpdateMainEvent.data === false)
            return false;
        const newEventData = await awarenessEventService.addNewMainEvent(randomMainEventName(), message.eventType, currentDate());
        const cloneMessage = JSON.parse(JSON.stringify(cloneMessageJSON));
        cloneMessage.mtf = message.mtf;
        const response = await ApiService.getInstance().instance.post(`/cbrn-awareness-backend/cloneMessage?mainEventId=${newEventData.cbrnMainEventId}`, cloneMessage);
        if (response.status === 200)
            return true;
        return false;
    }
}

export const awarenessMessageService = new AwarenessMessageService();
