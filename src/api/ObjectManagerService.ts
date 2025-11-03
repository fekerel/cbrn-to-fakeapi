/* eslint-disable no-param-reassign, array-callback-return, import/no-cycle, max-len, no-restricted-syntax, consistent-return, global-require,  import/no-dynamic-require */
import { AxiosResponse } from 'axios';
import ApiService from '@api/ApiService';
import TestConstants from '@common/lib/TestConstants';
import tokenJSON from '@testConstants/token.json';
import hideTrackJSON from '@api/body/doob/hideTrack.json';
import displayKinematicListOnMapJSON from '@api/body/doob/displayKinematicListOnMap.json';
import forceReadinessJSON from '@api/body/doob/forceReadiness.json';
import { ServiceParams } from '@common/Types';
import { payloadService } from '@api/PayloadService';
import { typeManagerService } from '@api/TypeManagerService';
import CommonUtils from '@common/CommonUtils';
import saveGeneratedReportJSON from '@api/body/doob/saveGeneratedReport.json';
import ConfigUtils from '@common/ConfigUtils';
import startAlarmJSON from '@api/body/doob/startAlarm.json';
import referenceDataJSON from '@api/body/doob/referenceData.json';
import waitUntil from 'async-wait-until';
// import createPlannedDataJSON from '@api/body/doob/createPlannedData.json';

import fs from 'fs';

import moment from 'moment-timezone';
// import { situationMapsService } from '@api/SituationMapsService';

const FormData = require('form-data');

class ObjectManagerService {
    //
    async prepareObjectPayload(service: ServiceParams, extra: boolean) {
        const schema = await this.getSchema(service);

        const template = await this.getTemplate(service);
        const payload = payloadService.createPayload(service, schema, template, false, true);
        if (extra) {
            // await this.fillLocation(service, payload);
            await this.addReference(payload, schema);
            await this.fillTiming(payload, schema);
        }
        // FIXME bu kısımda minefield-land default json içeriği yanlıs oldugu için böyle bir kontrol eklendi.
        if (service.serviceName === 'minefield-land') {
            const payload2 = JSON.parse(JSON.stringify(payload));
            payload2.minefieldDataAttributes = {
                minefieldCategoryCode: 'MINEFIELD_LAND',
            };
            payload2.minefieldLandDataAttributes = {};
            return payload2;
        }
        return payload;
    }

    // private async fillLocation(service: ServiceParams, payload: object) {
    //     const pos = await locationService.createPositionForBso(service);
    //     payload['positionAttributes']['position'] = pos;
    //     return 0;
    // }

    async addHoldingToObject(service:ServiceParams) {
        const payload = await this.checkObjectCreated(service);
        const allHoldingTypesResponse = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/getHoldingTypes`);
        const randomIndex = Math.floor(Math.random() * (allHoldingTypesResponse.data as any[]).length);
        const holdingType = (allHoldingTypesResponse.data as any[])[randomIndex];
        const holdingPayload = {
            holdingTypeData: holdingType, onHandQuantity: Math.random() * 100, operationalCount: Math.random() * 100, requiredOnHandQuantity: Math.random() * 100, critical: (Math.random() > 0.5),
        };
        payload['holdingAttributes'] = { holdingDataList: [holdingPayload] };
        await this.sendUpdateRequest(service, payload);
        return holdingType['holdingTypeName'];
    }

    async addPersonHoldingToObject(service:ServiceParams) {
        const payload = await this.checkObjectCreated(service);
        const allHoldingTypesResponse = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/getHoldingTypes`);
        const personHoldingTypes = (allHoldingTypesResponse.data as any[]).filter((holdingType) => holdingType.holdingObjectCoreType === 'PERSON');
        const randomIndex = Math.floor(Math.random() * personHoldingTypes.length);
        const holdingType = personHoldingTypes[randomIndex];
        const holdingPayload = {
            holdingTypeData: holdingType, onHandQuantity: Math.random() * 100, operationalCount: Math.random() * 100, requiredOnHandQuantity: Math.random() * 100, critical: (Math.random() > 0.5),
        };
        payload['holdingAttributes'] = { holdingDataList: [holdingPayload] };
        await this.sendUpdateRequest(service, payload);
        return holdingType['holdingTypeName'];
    }

    async addMaterialHoldingToObject(service:ServiceParams) {
        const payload = await this.checkObjectCreated(service);
        const allHoldingTypesResponse = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/getHoldingTypes`);
        const equipmentAndMaterialTypes = [
            'RAILCAR', 'ELECTRONIC_EQUIPMENT', 'ENGINEERING_EQUIPMENT',
            'MARITIME_EQUIPMENT', 'WEAPON', 'MISCELLANEOUS_EQUIPMENT',
            'SURFACE_VESSEL', 'SUBSURFACE_VESSEL', 'CBRN_EQUIPMENT',
            'AIRCRAFT', 'CONSUMABLE_MATERIEL', 'AMMUNITION', 'VEHICLE', 'MATERIEL',
        ];
        const filteredHoldingTypes = (allHoldingTypesResponse.data as any[]).filter((holdingType) => equipmentAndMaterialTypes.includes(holdingType.holdingObjectCoreType));
        const randomIndex = Math.floor(Math.random() * filteredHoldingTypes.length);
        const holdingType = filteredHoldingTypes[randomIndex];
        const holdingPayload = {
            holdingTypeData: holdingType, onHandQuantity: Math.random() * 100, operationalCount: Math.random() * 100, requiredOnHandQuantity: Math.random() * 100, critical: Math.random() > 0.5,
        };
        payload['holdingAttributes'] = { holdingDataList: [holdingPayload] };
        await this.sendUpdateRequest(service, payload);
        return holdingType['holdingTypeName'];
    }

    async addDemoHoldingToObjects(service:ServiceParams, holdingTypeName:any, holdingData:any) {
        const allHoldingTypesResponse = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/getHoldingTypes`);
        const specificHoldingType = (allHoldingTypesResponse.data as any[]).filter((holdingType) => holdingType.holdingTypeName === holdingTypeName);
        if (specificHoldingType.length !== 0) {
            const holdingType = {
                holdingObjectCoreType: '',
                holdingTypeId: '',
                holdingTypeName: '',
            };
            holdingType.holdingObjectCoreType = specificHoldingType[0].holdingObjectCoreType;
            holdingType.holdingTypeId = specificHoldingType[0].holdingTypeId;
            holdingType.holdingTypeName = specificHoldingType[0].holdingTypeName;

            const holdingPayload = {
                holdingTypeData: holdingType, onHandQuantity: holdingData[2], operationalCount: holdingData[3], requiredOnHandQuantity: holdingData[1], critical: holdingData[4],
            };
            return holdingPayload;
        }

        return null;
    }

    public async createDemoObjects(existingPayload:any, layerID:any, planned?:boolean, plannedName?: string) {
        const body = JSON.parse(JSON.stringify(existingPayload));
        const body2 = JSON.parse(body[0].payload);

        if (layerID !== null) {
            body2.data.dataAttributes.layerIdList = [];
            body2.data.dataAttributes.layerIdList[0] = layerID;
            body2.data.dataAttributes.originalLayerId = layerID;
        }

        if (planned) {
            body2.data.dataAttributes.objectCore.planned = true;
            if (plannedName)
                body2.data.dataAttributes.objectCore.nameText = plannedName;
            else
                body2.data.dataAttributes.objectCore.nameText += '_PL';
        }

        body2.data.commonAttributes.createdBy.userId = (tokenJSON.userID).toString();
        body2.data.commonAttributes.createdBy.userName = tokenJSON.username;
        body2.data.commonAttributes.modifiedBy.userId = (tokenJSON.userID).toString();
        body2.data.commonAttributes.modifiedBy.userName = tokenJSON.username;
        const baseNode2 = await this.getNodeUnit();
        // body2.data.commonAttributes.nodeAttributes.nodeId = baseNode.commonAttributes.nodeAttributes.nodeId;
        // body2.data.commonAttributes.nodeAttributes.nodeName = baseNode.commonAttributes.nodeAttributes.nodeName;
        const baseNode = await this.getMyNodeSummaryData();
        body2.data.commonAttributes.nodeAttributes.nodeId = baseNode.nodeId;
        body2.data.commonAttributes.nodeAttributes.nodeName = baseNode.nodeName;
        body2.commonAttributes.metadataAttributes.metadata = baseNode2.commonAttributes.metadataAttributes.metadata;
        body[0].payload = JSON.stringify(body2);
        const res: AxiosResponse = await ApiService.getInstance().instance.post('/doob-service-widget-listener/rest/command/sendBatchPayloadToTopicWithKey', body);
        return res.status;
    }

    public async createDemoObjects2(service:string, payload, planned:boolean) {
        const body = JSON.parse(JSON.stringify(payload));
        if (planned) {
            body.dataAttributes.objectCore.planned = true;
            body.dataAttributes.objectCore.nameText += '_PL';
        }
        const baseNode = await this.getMyNodeSummaryData();
        const baseNode2 = await this.getNodeUnit();

        body.commonAttributes.createdBy.userId = (tokenJSON.userID).toString();
        body.commonAttributes.createdBy.userName = tokenJSON.username;
        body.commonAttributes.modifiedBy.userId = (tokenJSON.userID).toString();
        body.commonAttributes.modifiedBy.userName = tokenJSON.username;
        body.commonAttributes.nodeAttributes.nodeId = baseNode.nodeId;
        body.commonAttributes.nodeAttributes.nodeName = baseNode.nodeName;
        body.commonAttributes.metadataAttributes.metadata = baseNode2.commonAttributes.metadataAttributes.metadata;

        const response = await ApiService.getInstance().instance.post(`/doob-service-identification/rest/command/data/${service}/add`, body);
        return response;
    }

    public async checkIfObjectExists(list, objectName) {
        for (const data of list.data)
            if (data.dataAttributes.objectCore.nameText === objectName)
                return true;

        return false;
    }

    async calculateForceReadiness(service:ServiceParams, foundType:any, holdingData:any) {
        const payload = JSON.parse(JSON.stringify(forceReadinessJSON));

        payload[0].holdingTypeData.holdingObjectCoreType = holdingData.holdingTypeData.holdingObjectCoreType;
        payload[0].holdingTypeData.holdingTypeId = holdingData.holdingTypeData.holdingTypeId;
        payload[0].holdingTypeData.holdingTypeName = holdingData.holdingTypeData.holdingTypeName;

        payload[0].onHandQuantity = holdingData.onHandQuantity;
        payload[0].operationalCount = holdingData.operationalCount;
        payload[0].requiredOnHandQuantity = holdingData.requiredOnHandQuantity;

        const res = await ApiService.getInstance().instance.post(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/getCalculateForceReadiness?typeId=${foundType.typeAttributes.typeId}`, payload);

        return res;
    }

    async checkObjectHoldingName(service: ServiceParams) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${service.serviceNameAdj}/get?id=${service.objectID}`);
        return res.data['holdingAttributes']['holdingDataList'][0]['holdingTypeData']['holdingTypeName'];
    }

    private async createTypeAndGetSymbolCodes(service: ServiceParams) {
        const typePayload = await typeManagerService.prepareTypePayload(service);
        let createdType;
        try {
            await ApiService.getInstance().instance.post(`/doob-service-identification/rest/command/type/${service.serviceNameAdj}/upsert`, typePayload);
            await typeManagerService.checkTypeCreated(service);
            createdType = await typeManagerService.findType(service);
        } catch (error) {
            if (error.message.includes('409')) {
                createdType = await this.getRandType(service);
                service.typeName = createdType['objectTypeAttributes']['objectTypeNameText'];
            } else { throw error; }
        }
        service.typeID = createdType['typeAttributes']['typeId'];
        const res = await ApiService.getInstance().instance.post(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/getSymbolCodes`, createdType);
        service.symbolCodes = res.data;
    }

    private async getSchema(service: ServiceParams) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-settings/rest/query/getSchema?objectCoreType=${service.serviceNameAdj}&schemaType=detail`);
        return res.data;
    }

    public async getTemplate(service: ServiceParams) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${service.serviceNameAdj}/getTemplateData`);
        return res.data;
    }

    async createTypeAndPrepareObjectPayload(service: ServiceParams, extra:boolean = false) {
        if (service.type) {
            await this.createTypeAndGetSymbolCodes(service);
            return this.prepareObjectPayload(service, extra);
        }
        const payload = await this.prepareObjectPayload(service, extra);

        const category = await this.getCategory(service, payload);
        await this.getSymbolCodesFromCategory(service, category, payload);
        return payload;
    }

    private async getCategory(service: ServiceParams, payload:any) {
        let temp = payload;
        service.path!.forEach((el:any) => {
            temp = temp[el];
        });
        return temp;
    }

    public async getSymbolCodesFromCategory(service: ServiceParams, category: any, payload:any) {
        delete payload.dataAttributes.objectCore.typeId;
        const res: AxiosResponse = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${service.serviceNameAdj}/getSymbolCodes?enumValue=${category}&paletteMode=app6a`);
        service.symbolCodes = res.data;
        payload['dataAttributes']['objectCore']['symbolCodes'] = service.symbolCodes;
    }

    public async getSymbolCodesFromCategory2(service: ServiceParams, category: any) {
        const res: AxiosResponse = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${service.serviceNameAdj}/getSymbolCodes?enumValue=${category}&paletteMode=app6a`);
        return res;
    }

    async checkObjectCreated(service: ServiceParams) {
        const predicateObjectList = async () => this.checkObjectCreated2(service);
        const objCreated = await waitUntil(predicateObjectList, { timeout: TestConstants.timeout, intervalBetweenAttempts: CommonUtils.WAIT_INTERVAL });
        return objCreated;
    }

    private async checkObjectCreated2(service: ServiceParams) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${service.serviceNameAdj}/getAll`);
        const foundObject = res.data.find((element:any) => element.dataAttributes.objectCore.nameText === service.objectName);
        if (foundObject === undefined)
            return false;
        return foundObject;
    }

    async isObjectExist(service: ServiceParams, objectName: string, mode: string) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${service.serviceNameAdj}/getAll`);
        const foundObject = res.data.find((element:any) => element.dataAttributes.objectCore.nameText === objectName);
        console.info(mode);
        if (foundObject === undefined)
            return false;
        return true;
    }

    async checkObjectCreatedWithName(service: ServiceParams, objectName: string) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${service.serviceNameAdj}/getAll`);
        const foundObject = res.data.find((element:any) => element.dataAttributes.objectCore.nameText === objectName);
        if (foundObject === undefined)
            return Promise.reject(new Error(`Object not found in Object List. Object name: ${objectName}`));
        return foundObject;
    }

    async createIdArray(service: string, testCases, createdObjectsId) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${service}/getAll`);
        for (const { payload } of testCases)
            try {
                const body = JSON.parse(JSON.stringify(payload));
                const body2 = JSON.parse(body[0].payload);
                const objectName = body2.data.dataAttributes.objectCore.nameText;
                const foundObject = res.data.find((element:any) => element.dataAttributes.objectCore.nameText === objectName);
                createdObjectsId.push({ name: objectName, id: foundObject.dataAttributes.objectCore.objectId });
            } catch {
                return false;
            }

        return createdObjectsId;
    }

    async checkObjectCreatedWithServiceName(serviceName: string, objectName: string) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${serviceName}/getAll`);
        const foundObject = res.data.find((element:any) => element.dataAttributes.objectCore.nameText === objectName);
        if (foundObject === undefined)
            return Promise.reject(new Error(`Object not found in Object List. Object name: ${objectName}`));
        return foundObject;
    }

    async checkObjectCreatedFromPalette(service: ServiceParams) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${service.serviceNameAdj}/getAll`);
        const foundObject = res.data.find((element:any) => element.dataAttributes.objectCore.nameText === service.objectName);
        if (foundObject === undefined)
            return false;
        return foundObject;
    }

    replaceCharacter(string, index, replacement) {
        return (
            string.slice(0, index)
            + replacement
            + string.slice(index + replacement.length)
        );
    }

    async getObjectAndUpdatePayload(service: ServiceParams, hostilityChange?: boolean) { // TODO add app6d update
        const payload = await this.checkObjectCreated(service);
        payload['dataAttributes']['objectCore']['nameText'] = `edited_${payload['dataAttributes']['objectCore']['nameText']}`;
        service.objectName = payload['dataAttributes']['objectCore']['nameText'];
        service.objectID = payload['dataAttributes']['objectCore']['objectId'];
        payload['commonAttributes']['modifiedBy']['userId'] = tokenJSON.userID;
        payload['commonAttributes']['modifiedBy']['userName'] = tokenJSON.username;
        if (hostilityChange)
            if (payload['dataAttributes']['objectCore']['objectItemHostilityStatusCodeEnum'] === 'FRIEND') {
                payload['dataAttributes']['objectCore']['objectItemHostilityStatusCodeEnum'] = 'HOSTILE';
                payload['dataAttributes']['objectCore']['symbolCodes'] = {
                    app6a: this.replaceCharacter(payload['dataAttributes']['objectCore']['symbolCodes']['app6a'], 1, 'H'),
                    saf: this.replaceCharacter(payload['dataAttributes']['objectCore']['symbolCodes']['saf'], 1, 'H'),
                    mip: this.replaceCharacter(payload['dataAttributes']['objectCore']['symbolCodes']['mip'], 1, 'H'),
                };
            } else {
                payload['dataAttributes']['objectCore']['objectItemHostilityStatusCodeEnum'] = 'FRIEND';
                payload['dataAttributes']['objectCore']['s15Text'] = {
                    app6a: this.replaceCharacter(payload['dataAttributes']['objectCore']['symbolCodes']['app6a'], 1, 'F'),
                    saf: this.replaceCharacter(payload['dataAttributes']['objectCore']['symbolCodes']['saf'], 1, 'F'),
                    mip: this.replaceCharacter(payload['dataAttributes']['objectCore']['symbolCodes']['mip'], 1, 'F'),
                };
            }

        return payload;
    }

    async checkObjectUpdated(service: ServiceParams) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${service.serviceNameAdj}/get?id=${service.objectID}`);
        return res.data['dataAttributes']['objectCore']['nameText'];
    }

    async checkObjectDeleted(service: ServiceParams) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${service.serviceNameAdj}/get?id=${service.objectID}`);
        return res.data;
    }

    async sendCreateRequest(service: ServiceParams, payload: object) {
        await ApiService.getInstance().instance.post(`/doob-service-identification/rest/command/data/${service.serviceNameAdj}/add`, payload);
    }

    async sendUpdateRequest(service: ServiceParams, payload: any) {
        await ApiService.getInstance().instance.put(`/doob-service-identification/rest/command/data/${service.serviceNameAdj}/update`, payload);
    }

    async sendDeleteRequest(service: ServiceParams) {
        return ApiService.getInstance().instance.delete(`/doob-service-identification/rest/command/data/${service.serviceNameAdj}/delete`, { data: [service.objectID] });
    }

    async deleteType(service: ServiceParams) {
        if (service.type && !service.existingType)
            await ApiService.getInstance().instance.delete(`/doob-service-identification/rest/command/type/${service.serviceNameAdj}/delete?typeId=${service.typeID}`);

        return true;
    }

    public async checkUnitReportApprovers(reportName: string) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/report/rest/approvers?templateName=${reportName}`);
        return response.status;
        // response.data.forEach(( approver) => {
        //     if(approver.username === 'admin')
        //         return true;
        // })
        // return `${TestConstants.username} isnt on he Approver list`;
    }

    public async generateUnitReport(unitID: string, reportType: string) {
        const body = JSON.parse(JSON.stringify(saveGeneratedReportJSON));
        body.reportGeneratedName = `${ConfigUtils.generateUniqueWord2()}-${reportType}`;
        body.reportName = reportType;
        body.parameters.unitID = unitID;
        body.parameters.preparedBy = tokenJSON.username;
        body.parameters.reportSystemMode = TestConstants.mode;
        body.approvers[0].username = TestConstants.username;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/report/rest/saveGeneratedReport', body);
        return response.status;
    }

    private async getRandType(service: ServiceParams) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/getAll`);
        const randomIndex = Math.floor(Math.random() * (res.data).length);
        const randType = res.data[randomIndex];
        service.existingType = true;
        return randType;
    }

    async deleteObjectWithObjectID(serviceName: string, objectId: string) {
        return ApiService.getInstance().instance.delete(`/doob-service-identification/rest/command/data/${serviceName}/delete`, { data: [objectId] });
    }

    async deleteAllCreatedObjectsByAutomation(service: ServiceParams, objectName = CommonUtils.API_NAME) { // used in runner
        try {
            const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${service.serviceNameAdj}/getAll`);
            if (res.data.length !== 0)
                for (const data of res.data)
                    try {
                        if (data.dataAttributes.objectCore.nameText === undefined || data.dataAttributes.objectCore.nameText.includes(objectName))
                            await this.deleteObjectWithObjectID(service.serviceNameAdj, data.dataAttributes.objectCore.objectId);
                    } catch (e) {
                        console.error(`${e.message} deleteAllCreatedObjectsByAutomation`);
                    }
        } catch (e) {
            console.error(`${e.message} deleteAllCreatedObjectsByAutomation`);
            return 1;
        }
    }

    async deleteAllObjectsFromULAK(service: ServiceParams) { // used in runner
        try {
            const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${service.serviceNameAdj}/getAll`);
            if (res.data.length !== 0)
                for (const data of res.data)
                    if (data.dataAttributes.objectCore.nameText === undefined || data.commonAttributes.createdBy.userName === 'system')
                        if (data.dataAttributes.objectCore.nameText !== ConfigUtils.getNodeName())
                            await this.deleteObjectWithObjectID(service.serviceNameAdj, data.dataAttributes.objectCore.objectId);
        } catch (e) {
            console.error(`${e.message} deleteAllObjectsFromULAKByAutomation`);
            return 1;
        }
    }

    public async createObjects(service: ServiceParams, hostility?:string, echelonSize?:string) {
        const payload = await this.createTypeAndPrepareObjectPayload(service);
        if (hostility)
            payload.dataAttributes.objectCore.objectItemHostilityStatusCodeEnum = hostility;
        if (service.serviceName === 'unit' && echelonSize)
            payload.dataAttributes.objectCore.echelon = echelonSize;
        if (service.mode)
            payload.commonAttributes.systemMode = service.mode;
        await this.sendCreateRequest(service, payload);
        return this.checkObjectCreated(service);
    }

    public async createObjects2(service: ServiceParams, hostility?:string, echelonSize?:string) {
        const payload = await this.createTypeAndPrepareObjectPayload(service);
        if (hostility)
            payload.dataAttributes.objectCore.objectItemHostilityStatusCodeEnum = hostility;
        if (service.serviceName === 'unit' && echelonSize)
            payload.dataAttributes.objectCore.echelon = echelonSize;
        if (service.mode)
            payload.commonAttributes.systemMode = service.mode;
        await this.sendCreateRequest(service, payload);
        return this.checkObjectCreated(service);
    }

    public async updateObjects(service: ServiceParams, hostilityChange?: boolean) {
        const payload = await this.getObjectAndUpdatePayload(service, hostilityChange);
        await this.sendUpdateRequest(service, payload);
        return payload['dataAttributes']['objectCore']['nameText'];
    }

    public preparePayloadForTrack(visibility: string, obj: any) {
        const payload = JSON.parse(JSON.stringify(hideTrackJSON));
        if (visibility === 'show') {
            payload.children.layerId.children.objectId.objectPlotting = true;
            payload.children.layerId.layerPlotting = true;
        }
        payload.plottingLayerIds = obj.layerIdList;
        const payloadobjectId = payload.children.layerId.children.objectId;
        payloadobjectId.id = obj.objectCore.globalTrackIdentifier;
        const payloadlayerId = payload.children.layerId;
        payloadlayerId.id = obj.originalLayerId;
        payloadlayerId.children.objectId = payloadobjectId;
        payloadlayerId.plottingObjectIds[0] = obj.objectCore.globalTrackIdentifier;
        payload.children.layerId.children[obj.objectCore.globalTrackIdentifier] = payloadobjectId;
        delete payload.children.layerId.children.objectId;
        payload.children[obj.originalLayerId] = payloadlayerId;
        delete payload.children.layerId;
        return payload;
    }

    public async hideTrack(obj: any) {
        const res = await ApiService.getInstance().instance.put(`/doob-service-display-track/rest/command/hideTracks?systemMode=${TestConstants.mode}`, this.preparePayloadForTrack('hide', obj));
        return res.status;
    }

    public async hideKinematicData(obj: any) {
        const res = await ApiService.getInstance().instance.put('/doob-service-display-track-kinematic/rest/command/hideKinematicData', this.preparePayloadForTrack('hide', obj));
        return res.status;
    }

    public async hideSymbologyData(obj: any) {
        const res = await ApiService.getInstance().instance.put('/doob-service-display-track-symbology/rest/command/hideSymbologyData', this.preparePayloadForTrack('hide', obj));
        return res.status;
    }

    public async showTrack(obj: any) {
        const res = await ApiService.getInstance().instance.put(`/doob-service-display-track/rest/command/showTracks?systemMode=${TestConstants.mode}`, this.preparePayloadForTrack('show', obj));
        return res.status;
    }

    public async showKinematicData(obj: any) {
        const res = await ApiService.getInstance().instance.put('/doob-service-display-track-kinematic/rest/command/showKinematicData', this.preparePayloadForTrack('show', obj));
        return res.status;
    }

    public async showSymbologyData(obj: any) {
        const res = await ApiService.getInstance().instance.put('/doob-service-display-track-symbology/rest/command/showSymbologyData', this.preparePayloadForTrack('show', obj));
        return res.status;
    }

    public async displayKinematicListOnMap(obj: any) {
        const payload = JSON.parse(JSON.stringify(displayKinematicListOnMapJSON));
        payload.layerId = obj.objectCore.globalTrackIdentifier;
        payload.trackIdList[0] = obj.originalLayerId;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/doob-service-display-track-kinematic/rest/command/displayKinematicListOnMap', payload);
        return response.status;
    }

    public async displayTrackSymbologyListOnMap() {
        const payload = displayKinematicListOnMapJSON;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/doob-service-display-track-symbology/rest/command/displayTrackSymbologyListOnMap', payload);
        return response.status;
    }

    public async displayTrackParentOnMap() {
        const payload = displayKinematicListOnMapJSON;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/doob-service-organization-structure-display/rest/command/displayTrackParentOnMap', payload);
        return response.status;
    }

    async addHoldingAndAlarm(service: ServiceParams) {
        await this.addHoldingToObject(service);
        const payload = await this.checkObjectCreated(service);
        return this.startAlarm(payload['dataAttributes']['objectCore']['objectId'], payload['holdingAttributes']['holdingDataList'][0]['holdingTypeData']['holdingTypeId']);
    }

    public async startAlarm(objectID:any, holdingID:any, ratio?: boolean) {
        const featureId = Date.now().toString();

        const body = JSON.parse(JSON.stringify(startAlarmJSON)) as any;
        body.commonAttributes.createdBy.userId = (tokenJSON.userID).toString();
        body.commonAttributes.createdBy.userName = tokenJSON.username;
        body.commonAttributes.modifiedBy.userId = (tokenJSON.userID).toString();
        body.commonAttributes.modifiedBy.userName = tokenJSON.username;
        body.commonAttributes.systemMode = TestConstants.mode;
        body.alarmName = ConfigUtils.generateUniqueWord2();
        body.alarmType = 'HOLDING_ALARM';
        body.rule.right = {};
        body.rule.right.type = 'tr.com.havelsan.doob.cloud.framework.data.alarm.HoldingRule';
        body.rule.right.objectId = objectID;
        body.rule.right.typeId = holdingID;
        body.rule.operator = 'equal';
        body.rule.type = 'tr.com.havelsan.doob.cloud.framework.data.alarm.rule.LeafRule';
        body.rule.topic = `doob-identification-alarm-topic-${TestConstants.mode}`;
        body.rule.id = `${featureId.substring(0, 1)},${featureId.substring(1, 4)},${featureId.substring(4, 7)},${featureId.substring(7, 10)},${featureId.substring(10, 13)}`;

        if (ratio) {
            body.rule.left = 'ratio';
            body.rule.right.holdingAttribute = 'Ratio';
            body.rule.right.holdingValue = '1';
        } else {
            body.rule.left = 'quantity';
            body.rule.right.holdingAttribute = 'onHandQuantity';
            body.rule.right.holdingValue = '101';
        }
        const res = await ApiService.getInstance().instance.post('/doob-service-alarm-state/rest/command/startAlarm', body);
        return res.status;
    }

    async updateHoldingToMeetAlarmCriteria(service: ServiceParams, rule:string, quantity:string) {
        const payload = await this.checkObjectCreated(service);
        payload['holdingAttributes']['holdingDataList'][0][rule] = quantity;
        const res = await ApiService.getInstance().instance.put(`/doob-service-identification/rest/command/data/${service.serviceNameAdj}/update`, payload);
        return res.status;
    }

    async getViewOfTrack(serviceName: string, objectID: string) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${serviceName}/get?id=${objectID}`);
        return res.status;
    }

    async getGlobalTrackIdentifier(service: ServiceParams) {
        const predicateObjectList = async () => (this.checkObjectCreatedFromPalette(service));
        const objCreated = await waitUntil(predicateObjectList, { timeout: TestConstants.timeout, intervalBetweenAttempts: CommonUtils.WAIT_INTERVAL });
        return objCreated.dataAttributes.objectCore.globalTrackIdentifier;
    }

    // async createPlannedData(serviceName: string, object: any, type: any, featureId: string, coordinates: any, symbolCode: string) {
    //     const body = JSON.parse(JSON.stringify(createPlannedDataJSON));
    //     const defaultPosition = await geometryService.getBody('Point', coordinates);

    //     object.commonAttributes.commonUpdateType = {
    //         type: 'tr.com.havelsan.doob.cloud.framework.data.identification.IdentificationUpdateType',
    //         identificationUpdateTypeEnum: 'ADD_IDENTIFICATION',
    //     };
    //     body.dataWrapper.data = object;
    //     body.dataWrapper.typeData = type;
    //     body.dataWrapper.commonAttributes.createdBy.dateTime = object.commonAttributes.createdBy.dateTime;
    //     body.dataWrapper.commonAttributes.modifiedBy.dateTime = object.commonAttributes.modifiedBy.dateTime;
    //     body.featureId = featureId;
    //     body.feature.featureId = featureId;
    //     body.feature.overlayId = object.dataAttributes.originalLayerId;
    //     body.feature.geometry = JSON.parse(defaultPosition);
    //     body.feature.properties.symbolCode = symbolCode;
    //     const res = await ApiService.getInstance().instance.post(`/doob-service-identification/rest/command/data/${serviceName}/createPlannedData`, body);
    //     return res;
    // }

    async getActiveOrderOfBattleIdForTrack(objectID: string) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-organization-structure/rest/query/getActiveOrderOfBattleIdForTrack?objectId=${objectID}`);
        return res.status;
    }

    async getHistoryOfTrack(globalID: string) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-track/rest/history/get?globalId=${globalID}&systemMode=${TestConstants.mode}`);
        return res;
    }

    async getHistoryOfTrackKinematic(globalID: string) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-track-kinematic/rest/history/get?globalId=${globalID}&systemMode=${TestConstants.mode}`);
        return res;
    }

    async checkObjectCopied(service: ServiceParams) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${service.serviceNameAdj}/getAll`);
        const foundObject = res.data.find((element:any) => element.dataAttributes.objectCore.nameText === `copied_${service.objectName}`);
        if (foundObject === undefined)
            return false;
        return foundObject;
    }

    async waitUntilCheckObjectCreatedFromPalette(service:ServiceParams) {
        const predicateObjectList = async () => this.checkObjectCreatedFromPalette(service);
        return waitUntil(predicateObjectList, { timeout: TestConstants.timeout, intervalBetweenAttempts: CommonUtils.WAIT_INTERVAL });
    }

    async checkObjectLinked(service: ServiceParams, layerCount: number) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${service.serviceNameAdj}/getAll`);
        const foundObject = res.data.find((element:any) => element.dataAttributes.objectCore.nameText === service.objectName && (element.dataAttributes.layerIdList as any[]).length === layerCount + 1);
        if (foundObject === undefined)
            return false;
        return foundObject;
    }

    async checkInitialTrackHistory(trackIdentifier: string) {
        const trackHistoryList = (await this.getHistoryOfTrack(trackIdentifier)).data;
        const trackKinematicHistoryList = (await this.getHistoryOfTrackKinematic(trackIdentifier)).data;
        const ADD_TRACK = {
            type: 'tr.com.havelsan.doob.cloud.framework.data.track.TrackUpdateType',
            trackUpdateTypeEnum: 'ADD_TRACK',
        };
        const ADD_TRACK_KINEMATIC = {
            type: 'tr.com.havelsan.doob.cloud.framework.data.track.kinematic.TrackKinematicUpdateType',
            trackKinematicUpdateTypeEnum: 'ADD_TRACK_KINEMATIC',
        };
        const condition1 = await this.checkTrackListForCommonUpdateType(trackHistoryList, ADD_TRACK);
        const condition2 = await this.checkTrackListForCommonUpdateType(trackKinematicHistoryList, ADD_TRACK_KINEMATIC);
        return condition1 && condition2;
    }

    async checkIdentityUpdates(trackIdentifier: string, change: string, origin: string) {
        const trackHistoryList = (await this.getHistoryOfTrack(trackIdentifier)).data;
        const UPDATE_IDENTITY = {
            type: 'tr.com.havelsan.doob.cloud.framework.data.track.TrackUpdateType',
            trackUpdateTypeEnum: 'UPDATE_IDENTITY',
        };
        const history = await this.findTrackOfCommonUpdateType(trackHistoryList, UPDATE_IDENTITY);
        if (history)
            return this.checkIdentityDetails(history, change, origin);
        return false;
    }

    private async checkIdentityDetails(trackHistory: any, change: string, origin: string) {
        return JSON.parse(trackHistory.dataHistoryItem.commonData.battleSpaceObject).data.dataAttributes.objectCore.nameText === `${change}_${origin}`;
    }

    async checkKinematicUpdates(trackIdentifier: string, newCoordinates: any) {
        const trackKinematicHistoryList = (await this.getHistoryOfTrackKinematic(trackIdentifier)).data;
        const UPDATE_TRACK_KINEMATIC = {
            type: 'tr.com.havelsan.doob.cloud.framework.data.track.kinematic.TrackKinematicUpdateType',
            trackKinematicUpdateTypeEnum: 'UPDATE_TRACK_KINEMATIC',
        };
        const updateTrack = await this.findTrackOfCommonUpdateType(trackKinematicHistoryList, UPDATE_TRACK_KINEMATIC);
        if (updateTrack)
            return this.checkKinematicDetails(updateTrack, newCoordinates);
        return false;
    }

    private async checkKinematicDetails(trackUpdate: any, newCoordinates: any) {
        const conditionX = trackUpdate.dataHistoryItem.commonData.position.x === newCoordinates[0];
        const conditionY = trackUpdate.dataHistoryItem.commonData.position.y === newCoordinates[1];
        return conditionX && conditionY;
    }

    async checkLayerListUpdates(trackIdentifier: string, secondLayerID: string) {
        const trackHistoryList = (await this.getHistoryOfTrack(trackIdentifier)).data;
        const UPDATE_LAYER_LIST = {
            type: 'tr.com.havelsan.doob.cloud.framework.data.track.TrackUpdateType',
            trackUpdateTypeEnum: 'UPDATE_LAYER_LIST',
        };
        const updateTrack = await this.findTrackOfCommonUpdateType(trackHistoryList, UPDATE_LAYER_LIST);
        if (updateTrack)
            return this.checkLayerListDetails(updateTrack, secondLayerID);
        return false;
    }

    private async checkLayerListDetails(trackUpdate: any, secondLayerID: string) {
        return (trackUpdate.dataHistoryItem.commonData.dataAttributes.layerIdList as any[]).includes(secondLayerID);
    }

    private async checkTrackListForCommonUpdateType(trackHistoryList: any, commonUpdateType: any) {
        return trackHistoryList.some(async (element) => this.checkTrackHistoryCommonUpdateType(element, commonUpdateType));
    }

    private async findTrackOfCommonUpdateType(trackHistoryList: any, commonUpdateType: any) {
        for (let i = trackHistoryList.length - 1; i >= 0; i--)
            if (await this.checkTrackHistoryCommonUpdateType(trackHistoryList[i], commonUpdateType))
                return trackHistoryList[i];

        return undefined;
    }

    private async checkTrackHistoryCommonUpdateType(trackHistory: any, commonUpdateType: any) {
        const condition1 = (trackHistory.dataHistoryItem.commonData.commonAttributes.commonUpdateType.trackKinematicUpdateTypeEnum !== undefined) ? (trackHistory.dataHistoryItem.commonData.commonAttributes.commonUpdateType.trackKinematicUpdateTypeEnum === commonUpdateType.trackKinematicUpdateTypeEnum) : (trackHistory.dataHistoryItem.commonData.commonAttributes.commonUpdateType.trackUpdateTypeEnum === commonUpdateType.trackUpdateTypeEnum);
        const condition2 = trackHistory.dataHistoryItem.commonData.commonAttributes.commonUpdateType.type === commonUpdateType.type;
        return condition1 && condition2;
    }

    async updateObjectsIdentity(service: ServiceParams, change: string) {
        const payload = await this.getObjectAndUpdatePayloadName(service, change);
        await this.sendUpdateRequest(service, payload);
        return this.checkObjectCreated(service);
    }

    private async getObjectAndUpdatePayloadName(service: ServiceParams, change: string) {
        const payload = await this.checkObjectCreated(service);
        service.objectName = `${change}_${payload['dataAttributes']['objectCore']['nameText']}`;
        payload['dataAttributes']['objectCore']['nameText'] = service.objectName;
        service.objectID = payload['dataAttributes']['objectCore']['objectId'];
        payload['commonAttributes']['modifiedBy']['userId'] = tokenJSON.userID;
        payload['commonAttributes']['modifiedBy']['userName'] = tokenJSON.username;
        return payload;
    }

    async waitUntilObjectMoveOnTheMap(trackIdentifier: string, newCoordinates: any) {
        const predicateMove = async () => this.checkKinematicUpdates(trackIdentifier, newCoordinates);
        return waitUntil(predicateMove, { timeout: TestConstants.timeout, intervalBetweenAttempts: CommonUtils.WAIT_INTERVAL });
    }

    async waitUntilNameChanged(trackIdentifier: string, change: string, origin: string) {
        const predicateChange = async () => this.checkIdentityUpdates(trackIdentifier, change, origin);
        return waitUntil(predicateChange, { timeout: TestConstants.timeout, intervalBetweenAttempts: CommonUtils.WAIT_INTERVAL });
    }

    async waitUntilLayerLinked(trackIdentifier: string, secondLayerID: string) {
        const predicateChange = async () => this.checkLayerListUpdates(trackIdentifier, secondLayerID);
        return waitUntil(predicateChange, { timeout: TestConstants.timeout, intervalBetweenAttempts: CommonUtils.WAIT_INTERVAL });
    }

    private async addReference(payload: any, schema:any) {
        const buffer = fs.createReadStream('src/misc/JSONdata/propertySkips.json');
        const bodyFormData = new FormData();
        bodyFormData.append('file', buffer);
        bodyFormData.append('storeName', 'doob-private');
        bodyFormData.append('path', `${TestConstants.mode}/doob/ObjectReferences/${TestConstants.username}/${moment().format('DDMMYYYYHHmmss')}/`);
        bodyFormData.append('name', 'propertySkips.json');
        const response = await ApiService.getInstance().instance.post('/infra-storage/api/s3/upload', bodyFormData, { headers: { 'Content-Type': 'multipart/form-data' } });
        const referenceData = JSON.parse(JSON.stringify(referenceDataJSON));
        referenceData.referenceId = `${Math.floor(9999999999 * Math.random())}${Math.floor(9999999999 * Math.random())}0000`;
        referenceData.referenceTitleText = `file_${ConfigUtils.generateUniqueWord2()}`;
        referenceData.referenceObjectDescription = `description_${ConfigUtils.generateUniqueWord2()}`;
        referenceData.referenceObjectNameText = `${response.data.path}propertySkips.json`;
        const categoryCodes:any[] = schema['$defs']['ReferenceData']['properties']['referenceContentCategoryCode']['enum'];
        referenceData.referenceContentCategoryCode = categoryCodes[Math.floor(categoryCodes.length * Math.random())];
        payload.referenceAttributes.referenceDataList = [referenceData];
    }

    async createObjectsExtraFields(service: ServiceParams) {
        const payload = await this.createTypeAndPrepareObjectPayload(service, true);
        if (service.mode)
            payload.commonAttributes.systemMode = service.mode;
        await this.sendCreateRequest(service, payload);
        return this.checkObjectCreated(service);
    }

    private async fillTiming(payload: object, schema: any) {
        const startDate = payload['metadataAttributes']['metadata']['temporalValidityAbsoluteTiming']['effectiveStartDate'];
        const minute = startDate.charAt(11);
        payload['metadataAttributes']['metadata']['temporalValidityAbsoluteTiming']['effectiveEndDate'] = startDate.substring(0, 11) + ((parseInt(minute, 10) + 1) % 10) + startDate.substring(11 + 1);
        const reportingDataAccuracyCode:any[] = schema['$defs']['IntelAppraisal-1']['properties']['reportingDataAccuracyCode']['enum'];
        payload['metadataAttributes']['metadata']['calculatedIntelAppraisal']['reportingDataAccuracyCode'] = reportingDataAccuracyCode[Math.floor(reportingDataAccuracyCode.length * Math.random())];
        const reportingDataReliabilityCode:any[] = schema['$defs']['IntelAppraisal-1']['properties']['reportingDataReliabilityCode']['enum'];
        payload['metadataAttributes']['metadata']['calculatedIntelAppraisal']['reportingDataReliabilityCode'] = reportingDataReliabilityCode[Math.floor(reportingDataReliabilityCode.length * Math.random())];
    }

    public async getNodeUnit() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`doob-service-identification/rest/query/data/unit/getNodeUnit?systemMode=${TestConstants.mode}`);
        return response.data;
    }

    public async getMyNodeSummaryData() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get('doob-service-layer/rest/query/getMyNodeSummaryData');
        return response.data;
    }

    public async getNodeType() {
        const baseNode = await this.getNodeUnit();
        return typeManagerService.getTypeById(baseNode.dataAttributes.objectCore.objectCoreType.toLowerCase().split(/[_-]/).join(''), baseNode.dataAttributes.objectCore.typeId);
    }

    public async addCriticalHoldingToObject(service:ServiceParams) {
        const payload = await this.checkObjectCreated(service);
        const allHoldingTypesResponse = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/getHoldingTypes`);
        const randomIndex = Math.floor(Math.random() * (allHoldingTypesResponse.data as any[]).length);
        const holdingType = (allHoldingTypesResponse.data as any[])[randomIndex];
        const holdingPayload = {
            holdingTypeData: holdingType, onHandQuantity: Math.random() * 100, operationalCount: Math.random() * 100, requiredOnHandQuantity: Math.random() * 100, critical: true,
        };
        payload['holdingAttributes'].holdingDataList.push(holdingPayload);
        await this.sendUpdateRequest(service, payload);
        return holdingType['holdingTypeName'];
    }

    public async getObjectsByServiceName(serviceName: string) {
        return ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${serviceName}/getAll`);
    }

    public async getObjectByAlternateName(service: ServiceParams) {
        const predicateObjectList = async () => this.getObjectByAlternateName2(service);
        const objCreated = await waitUntil(predicateObjectList, { timeout: TestConstants.timeout, intervalBetweenAttempts: CommonUtils.WAIT_INTERVAL });
        return objCreated;
    }

    private async getObjectByAlternateName2(service: ServiceParams) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/data/${service.serviceNameAdj}/getAll`);
        const foundObject = res.data.find((element:any) => element.dataAttributes.objectCore.alternateNameText === service.objectName || element.dataAttributes.objectCore.nameText === service.objectName);
        if (foundObject === undefined)
            return false;
        return foundObject;
    }

    // public async createAndLinkObject(originalLayerId: string, layerToLinkName: string, isPrivateLayer: boolean, service: ServiceParams, objectParams: ObjectParams) {
    //     const geometry = JSON.parse(await geometryService.getPositionByGeometryType(objectParams.symbolType));
    //     const layer = await situationMapsService.getSelectedLayer(isPrivateLayer, layerToLinkName);
    //     await locationService.createObjectInsideStaticArea(service, layer.id, objectParams.objectCoreType, objectParams.symbolCode, geometry.coordinates, false, objectParams.symbolType);
    //     await this.waitUntilCheckObjectCreatedFromPalette(service);
    //     await locationService.waitUntilObjectLinkedToLayer(service, layer.id);
    //     return this.checkObjectCreated(service);
    // }

    public async checkObjectAttachedAsLinked(objectId: string, layer: any): Promise<boolean> {
        return layer.objectIds.includes(objectId);
    }
}

export const objectManagerService = new ObjectManagerService();
