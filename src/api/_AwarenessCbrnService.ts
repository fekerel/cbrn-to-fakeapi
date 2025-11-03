/* eslint-disable max-len, import/no-cycle */

import fs from 'fs'

import radMessage6 from '@api/body/awareness/importCbrnMessage/RADIO/6.json';
import nucMessage6 from '@api/body/awareness/importCbrnMessage/NUC/6.json';
import chemMessage6 from '@api/body/awareness/importCbrnMessage/CHEM/6.json';
import bioMessage6 from '@api/body/awareness/importCbrnMessage/BIO/6.json';

import nucMessage5 from '@api/body/awareness/importCbrnMessage/NUC/5.json';
import chemMessage5 from '@api/body/awareness/importCbrnMessage/CHEM/5.json';
// import bioMessage5 from '@api/body/awareness/importCbrnMessage/BIO/5.json';
// import radMessage5 from '@api/body/awareness/importCbrnMessage/RADIO/5.json';

import nucMessage4 from '@api/body/awareness/importCbrnMessage/NUC/4.json';
import chemMessage4 from '@api/body/awareness/importCbrnMessage/CHEM/4.json';
import bioMessage4 from '@api/body/awareness/importCbrnMessage/BIO/4.json';
import radMessage4 from '@api/body/awareness/importCbrnMessage/RADIO/4.json';

import nucMessage3 from '@api/body/awareness/importCbrnMessage/NUC/3.json';
import chemMessage3 from '@api/body/awareness/importCbrnMessage/CHEM/3.json';
import bioMessage3 from '@api/body/awareness/importCbrnMessage/BIO/3.json';
import radMessage3 from '@api/body/awareness/importCbrnMessage/RADIO/3.json';

import nucMessage2 from '@api/body/awareness/importCbrnMessage/NUC/2.json';
import chemMessage2 from '@api/body/awareness/importCbrnMessage/CHEM/2.json';
import bioMessage2 from '@api/body/awareness/importCbrnMessage/BIO/2.json';
import radMessage2 from '@api/body/awareness/importCbrnMessage/RADIO/2.json';

import nucMessage1 from '@api/body/awareness/importCbrnMessage/NUC/1.json';
import chemMessage1 from '@api/body/awareness/importCbrnMessage/CHEM/1.json';
import bioMessage1 from '@api/body/awareness/importCbrnMessage/BIO/1.json';
import radMessage1 from '@api/body/awareness/importCbrnMessage/RADIO/1.json';

import searchCbrnMessages from '@api/body/_awareness/searchCbrnMessages.json';
import { randomInt } from 'crypto';
import { Axios, AxiosResponse } from 'axios';
import { randomMainEventName, currentDate } from '../../__tests__/cbrn_awareness_backend/cbrn-main-event';
import ApiService from './ApiService';
import { awarenessEventService } from './_AwarenessEventService';
import { awarenessMessageService, messageListCbrn } from './_AwarenessMessageService';
import { match } from 'assert';
import moment from 'moment';

const BIO1 = fs.readFileSync("src/api/body/awareness/importUsed2/BIO/1_0.txt","utf-8")
const NUC1 = fs.readFileSync("src/api/body/awareness/importUsed2/NUC/1_0.txt","utf-8")
const CHEM1 = fs.readFileSync("src/api/body/awareness/importUsed2/CHEM/1_0.txt","utf-8")
const RAD1 = fs.readFileSync("src/api/body/awareness/importUsed2/RAD/1_0.txt","utf-8")

const BIO2 = fs.readFileSync("src/api/body/awareness/importUsed2/BIO/2_0.txt","utf-8")
const NUC2 = fs.readFileSync("src/api/body/awareness/importUsed2/NUC/2_0.txt","utf-8")
const CHEM2 = fs.readFileSync("src/api/body/awareness/importUsed2/CHEM/2_0.txt","utf-8")
const RAD2 = fs.readFileSync("src/api/body/awareness/importUsed2/RAD/2_0.txt","utf-8")

const BIO3 = fs.readFileSync("src/api/body/awareness/importUsed2/BIO/3_0.txt","utf-8")
const NUC3 = fs.readFileSync("src/api/body/awareness/importUsed2/NUC/3_0.txt","utf-8")
const CHEM3 = fs.readFileSync("src/api/body/awareness/importUsed2/CHEM/3_0.txt","utf-8")
const RAD3 = fs.readFileSync("src/api/body/awareness/importUsed2/RAD/3_0.txt","utf-8")

const BIO4 = fs.readFileSync("src/api/body/awareness/importUsed2/BIO/4_1.txt","utf-8")
const NUC4 = fs.readFileSync("src/api/body/awareness/importUsed2/NUC/4_0.txt","utf-8")
const CHEM4 = fs.readFileSync("src/api/body/awareness/importUsed2/CHEM/4_0.txt","utf-8")
const RAD4 = fs.readFileSync("src/api/body/awareness/importUsed2/RAD/4_0.txt","utf-8")

const BIO5 = fs.readFileSync("src/api/body/awareness/importUsed2/BIO/5_0.txt","utf-8")
const NUC5 = fs.readFileSync("src/api/body/awareness/importUsed2/NUC/5_0.txt","utf-8")
const CHEM5 = fs.readFileSync("src/api/body/awareness/importUsed2/CHEM/5_0.txt","utf-8")
const RAD5 = fs.readFileSync("src/api/body/awareness/importUsed2/RAD/5_0.txt","utf-8")

const BIO6 = fs.readFileSync("src/api/body/awareness/importUsed2/BIO/6_0.txt","utf-8")
const NUC6 = fs.readFileSync("src/api/body/awareness/importUsed2/NUC/6_0.txt","utf-8")
const CHEM6 = fs.readFileSync("src/api/body/awareness/importUsed2/CHEM/6_0.txt","utf-8")
const RAD6 = fs.readFileSync("src/api/body/awareness/importUsed2/RAD/6_0.txt","utf-8")


const importMtfMessage = [
    [CHEM1,NUC1,RAD1,BIO1],
    [CHEM2,NUC2,RAD2,BIO2],
    [CHEM3,NUC3,RAD3,BIO3],
    [CHEM4,NUC4,RAD4,BIO4],
    [CHEM5,NUC5,RAD5,BIO5],
    [CHEM6,NUC6,RAD6,BIO6],
]

const importCbrnMessages = [
    [chemMessage1, nucMessage1, radMessage1, bioMessage1],
    [chemMessage2, nucMessage2, radMessage2, bioMessage2],
    [chemMessage3, nucMessage3, radMessage3, bioMessage3],
    [chemMessage4, nucMessage4, radMessage4, bioMessage4],
    [chemMessage5, nucMessage5], // Bio 5 ve rad 5 mesajlarında sorun var. MTF File daki halleri de eklenmiyor. Hem manuelde hem de koddan.
    [chemMessage6, nucMessage6, radMessage6, bioMessage6]];

const matchCbrnMessage = {
    "CHEM": 0,
    "NUC": 1,
    "RAD": 2,
    "BIO": 3
}

const eventType = () => {
    const _ = {0: "CHEM",1:"NUC",2:"RAD",3:"BIO"};
    return _[randomInt(4)];
}

class AwarenesCbrnService {
    /// /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// ////////////////////////////////////////// CBRN-X-ORTAKLAR //////////////////////////////////////////////
    /// /////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    public async addCbrn(cbrnNumber: number,idx?:number) {
        let messageId:number;
        if(cbrnNumber === 6) // CBRN6 da BIO Mesajında Sıkıntı Olduğu İçin Devre Dışı Bırakıldı
            messageId = await this.importMessageFromTXT(importMtfMessage[cbrnNumber - 1][randomInt((importMtfMessage[cbrnNumber - 1].length) - 1)])
        else{
            if (idx === undefined)
                messageId = await this.importMessageFromTXT(importMtfMessage[cbrnNumber - 1][randomInt(importMtfMessage[cbrnNumber - 1].length)])
            else
                messageId = await this.importMessageFromTXT(importMtfMessage[cbrnNumber - 1][idx])
        }
        const message = await this.getCbrnXOnlyById(messageId,false,cbrnNumber);
        if (await awarenessMessageService.deleteCbrnMessagesById(messageId) !== 200)
            return false;        
        const response:AxiosResponse = await ApiService.getInstance().instance.post(`/cbrn-awareness-backend/addCbrn${cbrnNumber}`, message);
        if (response.data === undefined || response.data === null)
            return false;
        return response.data;
    }


    public async getCbrnXMessage(cbrnNumber: number) {
        const body = JSON.parse(JSON.stringify(searchCbrnMessages));
        body.messageTypeList = [`CBRN${cbrnNumber}`];
        const responseSearchMessage: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/searchCbrnMessages', body);
        if (responseSearchMessage.data.length === 0)
            return this.addCbrn(cbrnNumber);

        return responseSearchMessage.data[randomInt(responseSearchMessage.data.length)];
    }

    public async getCbrnXById(cbrnNumber: number) {
        let randomMessage:any;
        if (cbrnNumber === 3)
            randomMessage = await this.addCbrn3MTFMessage(3)
        else
            randomMessage = await this.getCbrnXMessage(cbrnNumber);
        if (randomMessage === false)
            return false;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getCbrn${cbrnNumber}ById?id=${randomMessage.id}&isArchived=${randomMessage.isArchived}`);
        return response.data;
    }

    public async getCbrnXOnlyById(messageId: number, isArchived: boolean, cbrnNumber:number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getCbrn${cbrnNumber}ById?id=${messageId}&isArchived=${isArchived}`);
        return response.data;
    }

    public async updateCbrn(cbrnNumber: number) {
        const messageMain = await this.getCbrnXMessage(cbrnNumber);
        if (messageMain === false)
            return false;
        const randomMessage = await this.getCbrnXOnlyById(messageMain.id, false, cbrnNumber);
        const response:AxiosResponse = await ApiService.getInstance().instance.post(`/cbrn-awareness-backend/updateCbrn${cbrnNumber}`, randomMessage);
        return response.status
    }

    public async getCbrnXMessages(cbrnNumber:number) {
        const body = JSON.parse(JSON.stringify(searchCbrnMessages));
        body.messageTypeList = [`CBRN${cbrnNumber}`];
        const responseSearchMessage: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/searchCbrnMessages', body);
        return responseSearchMessage.data;
    }

    public async getCbrnXListByIdList(cbrnNumber:number) {
        await this.getCbrnXMessage(cbrnNumber);
        const messages = await this.getCbrnXMessages(cbrnNumber);
        const len:number = messages.length > 3 ? 3 : messages.length;
        const messageIdList:number[] = [];
        for (let i = 0; i < len; i++)
            messageIdList.push(messages[i].id);

        const response:AxiosResponse = await ApiService.getInstance().instance.post(`/cbrn-awareness-backend/getCbrn${cbrnNumber}ListByIdList`, messageIdList);
        return response.data;
    }

    public async getCbrnXWithCoordinateById(cbrnNumber:number) {
        const message = await this.getCbrnXMessage(cbrnNumber);
        const response:AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getCbrn${cbrnNumber}WithCoordinateById?id=${message.id}`);
        return response.data;
    }

    public async updateCbrnXMainEvent(cbrnNumber:number) { // NUC de hata veriyor. O yüzden NUC devre dışı bırakıldı.
        let message:any;
        if (cbrnNumber === 2)
            message = await this.addCbrn2MTFMessage()
        else if (cbrnNumber === 3)
            message = await this.addCbrn3MTFMessage();
        else
            message = await this.getCbrnXMessage(cbrnNumber);
        if (message === false || message === undefined)
            return false;
        const newEvent = await awarenessEventService.addNewMainEvent(randomMainEventName(), message.eventType, currentDate());
        let response: AxiosResponse;
        if (cbrnNumber === 2)
            response = await ApiService.getInstance().instance.post(`/cbrn-awareness-backend/updateCbrn${cbrnNumber}MainEvent?selectedCbrnIdList=${message.id}&cbrnMainEventId=${newEvent.cbrnMainEventId}`);
        else
            response = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/updateCbrn${cbrnNumber}MainEvent?selectedCbrnIdList=${message.id}&cbrnMainEventId=${newEvent.cbrnMainEventId}`);
        return response.data;
    }

    /// /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// //////////////////////////////////////////// CBRN-6-REST ////////////////////////////////////////////////
    /// /////////////////////////////////////////////////////////////////////////////////////////////////////////

    public async searchCbrnMessagesByID(messageTypeList: string[], id: number) {
        const body = JSON.parse(JSON.stringify(searchCbrnMessages));
        body.isArchived = true;
        body.messageTypeList = messageTypeList;
        const responseSearchMessage: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/searchCbrnMessages', body);
        if (responseSearchMessage.data.length === 0)
            return false; // Doldurulacak
        return responseSearchMessage.data.find((msg: { id: number }) => msg.id === id);
    }

    // public async calculateCbrn6() {

    // }

    // public async autoAllocateCbrn6ToCbrn2InImported() {

    // }

    // public async allocateCbrn6ListToCbrn2ByAepkernelisAutomaticMode() {

    // }

    /// /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// //////////////////////////////////////////// CBRN-5-REST ////////////////////////////////////////////////
    /// /////////////////////////////////////////////////////////////////////////////////////////////////////////

    /// /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// //////////////////////////////////////////// CBRN-4-REST ////////////////////////////////////////////////
    /// /////////////////////////////////////////////////////////////////////////////////////////////////////////

    public async getCbrn4ListByMainEventId() {
        const randomEvent = eventType()
        const messageId = await this.importMessageFromTXT(importMtfMessage[3][matchCbrnMessage[randomEvent]])
        const newEvent = await awarenessEventService.addNewMainEvent(randomMainEventName(), randomEvent, currentDate());
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/updateCbrn${4}MainEvent?selectedCbrnIdList=${messageId}&cbrnMainEventId=${newEvent.cbrnMainEventId}`);
        if (response.status !== 200)
            return false;
        const cbrn4Message = await this.getCbrnXOnlyById(messageId,false,4)
        const rsp: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getCbrn4ListByMainEventId/${cbrn4Message.cbrnMainEventId}`);
        return rsp.data;
    }

    public async deallocateCbrn4ListToCbrn2Manuel(){
        const randomEvent = eventType()
        const messageId = await this.importMessageFromTXT(importMtfMessage[3][matchCbrnMessage[randomEvent]])
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/deallocateCbrn4ListToCbrn2Manuel', [messageId]);
        const message = await this.getCbrnXOnlyById(messageId,false,4);
        if (message.attribute === "UNALLOCATED")
            return response.data;
        return false;
        
    }

    public async allocateCbrn4ListToCbrn3ByAepkernel() { //BIO ve RAD mesajı sıkıntı çıkarttığı devre dışı bırakıldı.
        await awarenessMessageService.archiveAllCbrnMessages();
        let randomEvent:string;
        while (1){
            randomEvent = eventType()
            if (randomEvent !== "NUC" && randomEvent !== "BIO")
                break;
        }
        const messageId3 = await this.importMessageFromTXT(importMtfMessage[2][matchCbrnMessage[randomEvent]])
        const messageId4 = await this.importMessageFromTXT(importMtfMessage[3][matchCbrnMessage[randomEvent]])
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/allocateCbrn4ListToCbrn3ByAepkernel/true', [messageId4]);
        return response.data;

    }

    public async allocateCbrn4ListToCbrn2ByManuel(){
        const randomEvent = eventType()
        const messageId2 = await this.importMessageFromTXT(importMtfMessage[1][matchCbrnMessage[randomEvent]])
        const messageId4 = await this.importMessageFromTXT(importMtfMessage[3][matchCbrnMessage[randomEvent]])
        const body = JSON.parse(JSON.stringify({"sourceIdList": [messageId4],"targetId": messageId2}));
        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/cbrn-awareness-backend/allocateCbrn4ListToCbrn2ByManuel`,body);
        return response.data;
    }

    public async allocateCbrn4ListToCbrn2ByManuelCalculateCbrn5(){
        const randomEvent = eventType()
        const messageId2 = await this.importMessageFromTXT(importMtfMessage[1][matchCbrnMessage[randomEvent]])
        const messageId4 = await this.importMessageFromTXT(importMtfMessage[3][matchCbrnMessage[randomEvent]])
        const body = JSON.parse(JSON.stringify({"sourceIdList": [messageId4],"targetId": messageId2}));
        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/cbrn-awareness-backend/allocateCbrn4ListToCbrn2ByManuelCalculateCbrn5`,body);
        return response.data;
    }

    public async allocateCbrn4ListToCbrn2ByAepkernel(){
        await awarenessMessageService.makeMaster();
        const msgList = await awarenessMessageService.searchCbrnMessages(undefined, ['CBRN2']);
        const messageMaster =  msgList.find((message: any) => message.attribute.toLowerCase() === 'master');
        const eventType = messageMaster.eventType;
        const messageId4 = await this.importMessageFromTXT(importMtfMessage[3][matchCbrnMessage[eventType]])
        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/cbrn-awareness-backend/allocateCbrn4ListToCbrn2ByAepkernel/true`,[messageId4]);
        return response.data;
        
    }

    public async isCbrn4QuebecHasWater(){
        const randomEvent = eventType()
        const messageId = await this.importMessageFromTXT(importMtfMessage[3][matchCbrnMessage[randomEvent]])
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/isCbrn4QuebecHasWater', [messageId]);
        return response.data;

    }

    public async autoCorrelateCbrn4ToCbrn2InImported(){
        const randomEvent = eventType()
        const messageId4 = await this.importMessageFromTXT(importMtfMessage[3][matchCbrnMessage[randomEvent]])
        const messageId2 = await this.importMessageFromTXT(importMtfMessage[1][matchCbrnMessage[randomEvent]])
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/autoCorrelateCbrn4ToCbrn2InImported', [messageId2]);
        return response.data;

    }

    public async allocateCbrn4ListToCbrn3Manuel(){
        let randomEvent:string;
        while (1){
            randomEvent = eventType()
            if (randomEvent !== "NUC")
                break;
        }
        const messageId4 = await this.importMessageFromTXT(importMtfMessage[3][matchCbrnMessage[randomEvent]])
        const messageId3 = await this.importMessageFromTXT(importMtfMessage[2][matchCbrnMessage[randomEvent]])
        const body = {"sourceIdList": [messageId4],"targetId": messageId3}
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/allocateCbrn4ListToCbrn3Manuel', JSON.parse(JSON.stringify(body)));
        return response.data;

    }

    public async calculateCbrn4FromCbrn1(){
        await awarenessMessageService.archiveAllCbrnMessages();
        await awarenessMessageService.makeMaster([0,2,3]);
        const msgList = await awarenessMessageService.searchCbrnMessages(undefined, ['CBRN2']);
        const messageMaster =  msgList.find((message: any) => message.attribute.toLowerCase() === 'master');
        const eventType = messageMaster.eventType;
        const messageId = await this.importMessageFromTXT(importMtfMessage[0][matchCbrnMessage[eventType]])
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/calculateCbrn4FromCbrn1', [messageId]);
        return response.data;
    }

    public async isExistXrayzOrOscarzInCbrn4(){
        const randomEvent = eventType()
        const messageId = await this.importMessageFromTXT(importMtfMessage[3][matchCbrnMessage[randomEvent]])
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/isExistXrayzOrOscarzInCbrn4', [messageId]);
        return response.data;

    }

    /// /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// //////////////////////////////////////////// CBRN-3-REST ////////////////////////////////////////////////
    /// /////////////////////////////////////////////////////////////////////////////////////////////////////////

    public async addCbrn3MTFMessage(cbrnNumber = 3){
        const list:number[] = [0,2,3];
        const idx = list[randomInt(list.length)];
        const messageId = await this.importMessageFromTXT(importMtfMessage[cbrnNumber - 1][idx])
        const message = await this.getCbrnXOnlyById(messageId,false,cbrnNumber);
        return message
    }

    public async addCbrn3(cbrnNumber = 3){
        const list:number[] = [0,2,3];
        const idx = list[randomInt(list.length)];
        const messageId = await this.importMessageFromTXT(importMtfMessage[cbrnNumber - 1][idx])
        const message = await this.getCbrnXOnlyById(messageId,false,cbrnNumber);
        if (await awarenessMessageService.deleteCbrnMessagesById(messageId) !== 200)
            return false;        
        // const randomMessage = importCbrnMessages[cbrnNumber - 1][randomInt(importCbrnMessages[cbrnNumber - 1].length)];
        //const body = JSON.parse(JSON.stringify(randomMessage));
        const response:AxiosResponse = await ApiService.getInstance().instance.post(`/cbrn-awareness-backend/addCbrn${cbrnNumber}`, message);
        if (response.data === undefined || response.data === null)
            return false;
        return response.data;

    }

    public async updateCbrn3MainEvent(cbrnNumber:number) {
        const message = await this.addCbrn3MTFMessage();
        if (message === false || message === undefined)
            return false;
        const newEvent = await awarenessEventService.addNewMainEvent(randomMainEventName(), message.eventType, currentDate());
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/updateCbrn${cbrnNumber}MainEvent?cbrn3Id=${message.id}&cbrnMainEventId=${newEvent.cbrnMainEventId}&userDefaultSettingAttribute=admin`);
        return response.data;
    }

    public async getCbrn3List() {
        // const message = await this.addCbrn(3);
        const message = await this.addCbrn3MTFMessage();
        if (message === false || message === undefined)
            return false;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getCbrn3List?eventId=${message.cbrnMainEventId}`);
        return response.data;
    }

    public async getCbrn3ListByEventType() {
        const message = await this.addCbrn3MTFMessage();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getCbrn3ListByEventType?eventType=${message.eventType}`);
        if (response.status !== 200)
            return false;
        return response.data.find((msg: { id: number }) => msg.id === message.id);
    }

    public async checkIsThereCbrn3() {
        const message = await this.addCbrn3MTFMessage();
        // const randomEvent = eventType()
        // const messageId = await this.importMessageFromTXT(importMtfMessage[3][matchCbrnMessage[randomEvent]])
        // const message = await this.getCbrnXOnlyById(messageId,false,4)
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/checkIsThereCbrn3', [message]);
        return response.data;
    }

    public async calculateCbrn3FromCbrn4(){
        //Sadece CHEM mesajında çalışıyor ve RAD mesajında çalışıyor.
        await awarenessMessageService.archiveAllCbrnMessages()
        const list:number[] = [0,2];
        const idx = list[randomInt(list.length)];
        const messageId = await this.importMessageFromTXT(importMtfMessage[3][idx])
        const message = await this.getCbrnXOnlyById(messageId,false,4);
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/calculateCbrn3FromCbrn4', [message]);
        return response.data;

    }

    // public async simulation() { // Burdaki period nedir?
    //     const message = await this.addCbrn(3);
    //     const response: AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/simulation?cbrn3Id=${message.id}&period=${2363}`);
    // }

    /// /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// //////////////////////////////////////////// CBRN-2-REST ////////////////////////////////////////////////
    /// /////////////////////////////////////////////////////////////////////////////////////////////////////////

    public async automaticCalculateFromCbrn1ToCbrn3() {
        if (!(await awarenessMessageService.archiveAllCbrnMessages()))
            return false;
        const message = await this.getMessage(1);
        const requestBody = { cbrn1IdList: [message.id], isFirstRequest: true };
        const body = JSON.parse(JSON.stringify(requestBody));
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/automaticCalculateFromCbrn1ToCbrn3', body);
        return response.data;
    }

    public async autoCorrelateCbrn2InImported() {
        await awarenessMessageService.archiveAllCbrnMessages();
        const cbrn2MessageId = await awarenessMessageService.importMessage(messageListCbrn[0]);
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/autoCorrelateCbrn2InImported', [cbrn2MessageId]);
        return response.data;
    }

    public async calculateCbrn3FromCbrn2() {
        await awarenessMessageService.archiveAllCbrnMessages();
        const message = await this.addCbrn2MTFMessage();
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/calculateCbrn3FromCbrn2', message);
        return response.data;        
    }

    public async calculateCbrn3AfterUpdatingCbrn2() {
        //CBRN3 mesajı oluşturmuyor.
        const messageId = await this.importMessageFromTXT(importMtfMessage[1][randomInt(importMtfMessage[1].length)]);
        const message = await this.getCbrnXOnlyById(messageId,false,2);
        await ApiService.getInstance().instance.post('/cbrn-awareness-backend/updateCbrn2', message);
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/calculateCbrn3AfterUpdatingCbrn2', [messageId]);
        return response.data;        
    }
    

    public async correlateCbrn2ListToCbrn2ByManuel(){
        const randomEvent = eventType()
        const messageId1 = await this.importMessageFromTXT(importMtfMessage[1][matchCbrnMessage[randomEvent]])
        const messageId2 = await this.importMessageFromTXT(importMtfMessage[1][matchCbrnMessage[randomEvent]])
        const messageId3 = await this.importMessageFromTXT(importMtfMessage[1][matchCbrnMessage[randomEvent]])
        const body = JSON.parse(JSON.stringify({"cbrn2IdList": [messageId1,messageId2],"cbrn2Id": messageId3}));
        const response:AxiosResponse = await ApiService.getInstance().instance.post(`/cbrn-awareness-backend/correlateCbrn2ListToCbrn2ByManuel`,body);
        return response.data
    }

    public async getFilteredMasterCbrn2ListWithEventType(){
        await awarenessMessageService.makeMaster();
        const msgList = await awarenessMessageService.searchCbrnMessages(undefined, ['CBRN2']);
        const messageMaster =  msgList.find((message: any) => message.attribute.toLowerCase() === 'master');
        const eventType = messageMaster.eventType;
        const body = JSON.parse(JSON.stringify({"eventType": eventType ,"cbrn2Id": [messageMaster.id]}));
        const response:AxiosResponse = await ApiService.getInstance().instance.post(`/cbrn-awareness-backend/getFilteredMasterCbrn2ListWithEventType`,body);
        return response.data;

    }

    

    public async calculateCbrn2() {        
        await awarenessMessageService.makeMaster();
        const msgList = await awarenessMessageService.searchCbrnMessages(undefined, ['CBRN2']);
        const messageMaster =  msgList.find((message: any) => message.attribute.toLowerCase() === 'master');
        const messageId1 = await this.importMessageFromTXT(importMtfMessage[1][matchCbrnMessage[messageMaster.eventType]])
        const body = JSON.parse(JSON.stringify({"onTargetIdList": [messageId1],"offTargetIdList": []}))
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/calculateCbrn2', body);
        return response.data;        
    }

    public async automaticCalculateFromCbrn2ToCbrn3() {   // NUC de hata veriyor. O yüzden NUC devre dışı bırakıldı.
        const message = await this.addCbrn2MTFMessage()
        await ApiService.getInstance().instance.post('/cbrn-awareness-backend/makeMaster', message);
        const requestBody = { cbrn2IdList: [message.id], isFirstRequest: false, isCreateNewMainEvent: true };
        const body = JSON.parse(JSON.stringify(requestBody));
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/automaticCalculateFromCbrn2ToCbrn3', body);
        return response.data;
    }

    public async correlateCbrn2ListByAepkernel() {
        const cbrn2MessageId = await awarenessMessageService.importMessage(messageListCbrn[0]);
        const message2 = await this.getCbrnXOnlyById(cbrn2MessageId, false, 2);
        await ApiService.getInstance().instance.post('/cbrn-awareness-backend/makeMaster', message2);
        const requestBody = { cbrn2IdList: [message2.id], isFirstRequest: false, isCreateNewMainEvent: true };
        const body = JSON.parse(JSON.stringify(requestBody));
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/automaticCalculateFromCbrn2ToCbrn3', body);
        if (response.status !== 200)
            return false;
        const cbrn2Message2Id = await awarenessMessageService.importMessage(messageListCbrn[0]);
        const response2: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/correlateCbrn2ListByAepkernel', [cbrn2Message2Id]);
        if (response2.status !== 200)
            return false;
        const correlatedmessage = await this.getCbrnXOnlyById(cbrn2Message2Id, false, 2);
        if (correlatedmessage.correlatedToCbrn2Id !== null && typeof correlatedmessage.correlatedToCbrn2Id === 'number')
            return response2.data;
        return false;
    }

    public async getMessage(cbrnNumber:number) {
        let message:any;
        while (1) {
            message = await this.getCbrnXMessage(cbrnNumber);
            if (message.eventType !== 'RAD')
                break;
            await awarenessMessageService.archiveCbrnMessagesById(message.id);
        }
        return message;
    }

    public async addCbrn2MTFMessage(cbrnNumber = 2){
        const list:number[] = [0,2,3];
        const idx = list[randomInt(list.length)];
        const messageId = await this.importMessageFromTXT(importMtfMessage[cbrnNumber - 1][idx])
        const message = await this.getCbrnXOnlyById(messageId,false,cbrnNumber);
        return message
    }

    public async isAvailableMeteorologyOrYankeeZuluSetExist() { //// NUC de hata veriyor. O yüzden NUC devre dışı bırakıldı.
        await awarenessMessageService.archiveAllCbrnMessages();
        const message = await this.addCbrn2MTFMessage()
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/isAvailableMeteorologyOrYankeeZuluSetExist', message);
        return response.data;
    }

    public async isUsedCbrn2ForCbrn3() {
        const data = await this.automaticCalculateFromCbrn2ToCbrn3();
        const messageRequestBody = { cbrn2IdList: [data[0].calculatedCbrn2.id], isFirstRequest: true };
        const response = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/isUsedCbrn2ForCbrn3', JSON.parse(JSON.stringify(messageRequestBody)));
        return response.data;
    }

    public async isValidCorrelationProcess() {
        const data = await this.automaticCalculateFromCbrn2ToCbrn3();
        enum Type {
            CHEM = 0,
            NUC = 1,
            RAD = 2,
            BIO = 3,
        }
        const messageId = await awarenessMessageService.importMessage(messageListCbrn[Type[data[0].calculatedCbrn2.eventType]]);
        const response = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/isValidCorrelationProcess', [messageId]);
        return response.data;
    }


    public async getMasterCbrn2List(){
        await awarenessMessageService.makeMaster();
        const msgList = await awarenessMessageService.searchCbrnMessages(undefined, ['CBRN2']);
        const message =  msgList.find((message: any) => message.attribute.toLowerCase() === 'master');
        const response:AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getMasterCbrn2List?eventType=${message.eventType}`);
        const masterMessage = response.data.find((msg: {id: number}) => message.id === msg.id)
        return masterMessage;        
    }

    public async getMasterList(){
        await awarenessMessageService.makeMaster();
        const msgList = await awarenessMessageService.searchCbrnMessages(undefined, ['CBRN2']);
        const message =  msgList.find((message: any) => message.attribute.toLowerCase() === 'master');
        const response:AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/getMasterList?cbrnMainEventId=${message.cbrnMainEventId}`);
        const masterMessage = response.data.find((msg: {id: number}) => message.id === msg.id)
        return masterMessage;  
    }

    public async isExistMasterCbrn2InEventMainEventId(){
        await awarenessMessageService.makeMaster();
        const msgList = await awarenessMessageService.searchCbrnMessages(undefined, ['CBRN2']);
        const message =  msgList.find((message: any) => message.attribute.toLowerCase() === 'master');
        const response:AxiosResponse = await ApiService.getInstance().instance.get(`/cbrn-awareness-backend/isExistMasterCbrn2InEvent/${message.cbrnMainEventId}`);
        return response.data;

    }

    public async allocateCbrn1ListToCbrn2ByAepkernel(){ //NUC de hata verdiği için NUC devre dışı bırakıldı.
        await awarenessMessageService.archiveAllCbrnMessages();
        await awarenessMessageService.makeMaster([0,2,3]);
        const msgList = await awarenessMessageService.searchCbrnMessages(undefined, ['CBRN2']);
        const messageMaster =  msgList.find((message: any) => message.attribute.toLowerCase() === 'master');
        const messageId = await this.importMessageFromTXT(importMtfMessage[0][matchCbrnMessage[messageMaster.eventType]])
        let message = await this.getCbrnXOnlyById(messageId,false,1);
        await ApiService.getInstance().instance.post('/cbrn-awareness-backend/allocateCbrn1ListToCbrn2ByAepkernel', [message.id]);
        message = await this.getCbrnXOnlyById(messageId,false,1);
        return message.attribute === "ALLOCATED"? message: false;
    }

    public async allocateCbrn1ListToCbrn2Manuel(){
        await awarenessMessageService.makeMaster();
        const msgList = await awarenessMessageService.searchCbrnMessages(undefined, ['CBRN2']);
        const messageMaster =  msgList.find((message: any) => message.attribute.toLowerCase() === 'master');
        const messageId = await this.importMessageFromTXT(importMtfMessage[0][matchCbrnMessage[messageMaster.eventType]])
        let message = await this.getCbrnXOnlyById(messageId,false,1);
        const body = {
            "sourceIdList": [message.id],
            "targetId": messageMaster.id
        }
        await ApiService.getInstance().instance.post('/cbrn-awareness-backend/allocateCbrn1ListToCbrn2Manuel', JSON.parse(JSON.stringify(body)));
        message = await this.getCbrnXOnlyById(messageId,false,1);
        return message.attribute === "ALLOCATED"? message: false;

    }

    public async calculateCbrn2FromCbrn4isAutomaticonTargetIdList() {
        const randomEvent = eventType()
        const messageId = await this.importMessageFromTXT(importMtfMessage[3][matchCbrnMessage[randomEvent]])
        const message = await this.getCbrnXOnlyById(messageId,false,4)        
        const response:AxiosResponse = await ApiService.getInstance().instance.post(`/cbrn-awareness-backend/calculateCbrn2FromCbrn4/true/${message.id}`,message);
        if (response.status !== 200)
            return false; 
        return response.data;
    }

    public async processCbrn2AfterAllocation(){
        await awarenessMessageService.archiveAllCbrnMessages();
        const body = [{"sourceIdList":[],"targetId":0,"selectedOperation":"NEW_CBRN_2"}]
        await awarenessMessageService.makeMaster();
        const msgList = await awarenessMessageService.searchCbrnMessages(undefined, ['CBRN2']);
        const messageMaster =  msgList.find((message: any) => message.attribute.toLowerCase() === 'master');
        body[0].targetId = messageMaster.id
        const messageId = await this.importMessageFromTXT(importMtfMessage[0][matchCbrnMessage[messageMaster.eventType]])
        body[0].sourceIdList = [messageId]
        const response:AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/processCbrn2AfterAllocation', JSON.parse(JSON.stringify(body)));
        return response.data;
    }

    public async updateCbrn2AfterCbrn1(){
        const randomEvent = eventType()
        const messageId2 = await this.importMessageFromTXT(importMtfMessage[1][matchCbrnMessage[randomEvent]])
        const messageId1 = await this.importMessageFromTXT(importMtfMessage[0][matchCbrnMessage[randomEvent]])
        const response:AxiosResponse = await ApiService.getInstance().instance.post(`/cbrn-awareness-backend/updateCbrn2AfterCbrn1/${messageId1}`);
        return response.data;        
    }

    /// /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// //////////////////////////////////////////// CBRN-1-REST ////////////////////////////////////////////////
    /// /////////////////////////////////////////////////////////////////////////////////////////////////////////

    public async updateCbrn1AttOfTarget(idx) { //NUC de hata verdiği için NUC kapatıldı.
        await awarenessMessageService.archiveAllCbrnMessages();
        const message = await this.addCbrn(1,idx);
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/updateCbrn1AttOfTarget', [message.id]);
        return response.data;
    }

    public async deleteOldMessagesAfterUpdateCbrn1() {
        await awarenessMessageService.archiveAllCbrnMessages();
        const message = await this.getCbrnXMessage(1);
        message.isArchived = true;
        await awarenessMessageService.archiveCbrnMessagesById(message.id);
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/deleteOldMessagesAfterUpdateCbrn1', message);
        return response.data;
    }

    public async checkOfTargetMessages(idx:number) { //NUC de Hata Verdiği İçin Kapatıldı
        const message = await this.addCbrn(1,idx);
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/checkOfTargetMessages', [message.id]);
        return response.data;
    }

    public async deallocateCbrn1ListToCbrn2Manuel() {
        const data = await this.automaticCalculateFromCbrn1ToCbrn3();
        if (typeof data !== 'object')
            return false;
        const message = await this.getCbrnXOnlyById(data[0].calculatedFromCbrn1List[0].id, false, 1);
        // const message = await this.getCbrnXMessage(1);
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/cbrn-awareness-backend/deallocateCbrn1ListToCbrn2Manuel', [message.id]);
        return response.data;
    }
}

export const awarenesCbrnService = new AwarenesCbrnService();
