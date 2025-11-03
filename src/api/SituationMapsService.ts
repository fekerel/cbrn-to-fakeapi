/* eslint-disable no-param-reassign, array-callback-return, import/no-cycle, max-len, no-restricted-syntax, consistent-return */

import { AxiosResponse } from 'axios';
import ApiService from '@api/ApiService';
import TestConstants from '@common/lib/TestConstants';
import addLayerJSON from '@api/body/doob/addLayer.json';
import updateLayerJSON from '@api/body/doob/updateLayer.json';
import deleteLayerJSON from '@api/body/doob/deleteLayer.json';
import loadLayerJSON from '@api/body/doob/loadLayer.json';
import copyLayerJSON from '@api/body/doob/copyLayer.json';
import updateLayerStatusTypeJSON from '@api/body/doob/updateLayerStatusType.json';
import addCommentLayerJSON from '@api/body/doob/addCommentLayer.json';
import defineRuleToLayerJSON from '@api/body/doob/defineRuleToLayer.json';
import deleteCommentLayerJSON from '@api/body/doob/deleteCommentLayer.json';
import CommonUtils from '@common/CommonUtils';
import tokenJSON from '@testConstants/token.json';
import ConfigUtils from '@common/ConfigUtils';
import addlayerReportJSON from '@api/body/doob/addLayerReport.json';
import { TimeoutError, waitUntil } from 'async-wait-until';
import addlayerCISReportJSON from '@api/body/doob/addLayerCISReport.json';

import { objectManagerService } from '@api/ObjectManagerService';
import { ServiceParams, ObjectList } from '@common/Types';

const services:ServiceParams[] = require('@misc/JSONdata/services');

class SituationMapsService {
    privateBaseNodeData:string = undefined;
    publicBaseNodeData:string = undefined;
    public async fetchLayerTypes(layerName:string) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get('/doob-service-settings/rest/query/getAllOverlayTypes');
        return response.data.find((element:any) => element.name === layerName);
    }

    public async addLayer(layerBody:any, layerName: string, isPrivateLayer:boolean, igcType?: string) {
        const body = JSON.parse(JSON.stringify(addLayerJSON));
        body.commonAttributes.nodeAttributes = layerBody.commonAttributes.nodeAttributes;
        body.commonAttributes.nodeAttributes.nodeId = await this.getBaseNodeData(isPrivateLayer);
        body.commonAttributes.createdBy.userId = tokenJSON.userID.toString();
        body.commonAttributes.modifiedBy.userId = tokenJSON.userID.toString();
        body.informationGroupCoreAttributes.nameText = layerName;
        body.informationGroupCoreAttributes.overlayTypeDataId = layerBody.id;
        body.informationGroupCoreAttributes.creatorId = tokenJSON.userID.toString();
        body.commonAttributes.nodeAttributes.nodeName = TestConstants.username;
        body.commonAttributes.systemMode = tokenJSON.mode;
        if (igcType)
            body.informationGroupCoreAttributes.igcType = igcType;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/doob-service-layer/rest/command/addLayer', body);
        return response.status;
    }

    public async addDemoLayers(layerBody:any, layerName: string, isPrivateLayer:boolean, parentLayerID?:string, igcType?: string) {
        let layerID = await this.findLayerIDbyLayerName(layerName);
        if (igcType)
            layerID = await this.findLayerIDbyLayerName(layerName, igcType);
        if (layerID)
            return 200;

        const body = JSON.parse(JSON.stringify(addLayerJSON));
        body.commonAttributes.nodeAttributes = layerBody.commonAttributes.nodeAttributes;
        body.commonAttributes.nodeAttributes.nodeId = await this.getBaseNodeData(isPrivateLayer);
        // console.log(await this.getBaseNodeData(isPrivateLayer));
        body.commonAttributes.createdBy.userId = tokenJSON.userID.toString();
        body.commonAttributes.modifiedBy.userId = tokenJSON.userID.toString();
        body.informationGroupCoreAttributes.nameText = layerName;
        body.informationGroupCoreAttributes.overlayTypeDataId = layerBody.id;
        body.informationGroupCoreAttributes.creatorId = tokenJSON.userID.toString();
        body.commonAttributes.nodeAttributes.nodeName = tokenJSON.username;
        body.commonAttributes.systemMode = tokenJSON.mode;
        body.informationGroupCoreAttributes.parentInformationGroupCoreId = parentLayerID;
        if (igcType)
            body.informationGroupCoreAttributes.igcType = igcType;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/doob-service-layer/rest/command/addLayer', body);
        return response.status;
    }

    public async getBaseNodeData(isPrivateLayer:boolean) {
        if (isPrivateLayer && this.privateBaseNodeData)
            return this.privateBaseNodeData;
        if ((!isPrivateLayer) && this.publicBaseNodeData)
            return this.publicBaseNodeData;
        let index = 0;
        const response: AxiosResponse = await ApiService.getInstance().instance.get('/doob-service-layer/rest/query/getAllLayerHierarchical?igcType=EXECUTION');
        if (isPrivateLayer) {
            for (let i = 0; i < response.data.length; i++)
                if (response.data[i].nodeData.baseNodeAttributes.organisation.nameText.includes(TestConstants.username))
                    index = i;
        } else {
            for (let i = 0; i < response.data.length; i++)
                if (response.data[i].nodeData.baseNodeAttributes.organisation.nameText.includes(ConfigUtils.getNodeName()))
                    index = i;
        }
        if (isPrivateLayer)
            this.privateBaseNodeData = response.data[index].nodeData.baseNodeAttributes.organisation.objectId;
        else
            this.publicBaseNodeData = response.data[index].nodeData.baseNodeAttributes.organisation.objectId;

        return response.data[index].nodeData.baseNodeAttributes.organisation.objectId;
    }

    public async getBaseNode(isPrivateLayer:boolean) {
        let index = 0;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/doob-service-layer/rest/query/getAllLayerHierarchical?systemMode=${TestConstants.mode}&userId=${tokenJSON.userID}&igcType=EXECUTION`);
        if (isPrivateLayer) {
            for (let i = 0; i < response.data.length; i++)
                if (response.data[i].nodeData.baseNodeAttributes.organisation.nameText.includes(TestConstants.username))
                    index = i;
        } else {
            for (let i = 0; i < response.data.length; i++)
                if (response.data[i].nodeData.baseNodeAttributes.organisation.nameText.includes(ConfigUtils.getNodeName()))
                    index = i;
        }
        return response.data[index].nodeData.baseNodeAttributes.organisation;// objectID sil
    }

    public async findLayerIDbyLayerName(layerName:string, type:string = 'EXECUTION') {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/doob-service-layer/rest/query/getAllLayerHierarchical?&igcType=${type}`);
        for (let i = 0; i < response.data.length; i++) {
            const nodeData = response.data[i];
            if (nodeData.informationGroupCoreChild.length !== 0)
                for (let j = 0; j < nodeData.informationGroupCoreChild.length; j++) {
                    const subLayer = nodeData.informationGroupCoreChild[j];
                    // console.log(subLayer)
                    if (subLayer.informationGroupCoreData !== undefined || subLayer.informationGroupCoreData.length !== 0) {
                        let layerInfo = subLayer.informationGroupCoreData.informationGroupCoreAttributes;
                        if (subLayer.subInformationGroupCoreData !== undefined || subLayer.subInformationGroupCoreData.length !== 0)
                            for (let k = 0; k < subLayer.subInformationGroupCoreData.length; k++) {
                                const sublayer2info = subLayer.subInformationGroupCoreData[k].informationGroupCoreData.informationGroupCoreAttributes;
                                const sublayer2 = subLayer.subInformationGroupCoreData[k];
                                // console.log(sublayer2); // Corps
                                if (sublayer2info.nameText === layerName) {
                                    layerInfo = sublayer2info;
                                    return layerInfo;
                                }
                                if (sublayer2.subInformationGroupCoreData !== undefined || sublayer2.subInformationGroupCoreData.length !== 0)
                                    for (let l = 0; l < sublayer2.subInformationGroupCoreData.length; l++) {
                                        const subLayer3info = sublayer2.subInformationGroupCoreData[l].informationGroupCoreData.informationGroupCoreAttributes;
                                        const subLayer3 = sublayer2.subInformationGroupCoreData[l];
                                        // console.log(subLayer3);
                                        if (subLayer3info.nameText === layerName) {
                                            layerInfo = subLayer3info;
                                            return layerInfo;
                                        }
                                        if (subLayer3.subInformationGroupCoreData !== undefined || subLayer3.subInformationGroupCoreData.length !== 0)
                                            for (let m = 0; m < subLayer3.subInformationGroupCoreData.length; m++) {
                                                const subLayer4info = subLayer3.subInformationGroupCoreData[m].informationGroupCoreData.informationGroupCoreAttributes;
                                                // console.log(subLayer4info);
                                                if (subLayer4info.nameText === layerName) {
                                                    layerInfo = subLayer4info;
                                                    return layerInfo;
                                                }
                                            }
                                    }
                            }
                        if (layerInfo.nameText === layerName)
                            return layerInfo;
                    }
                }
        }
    }

    // public async findPlanLayerIDbyLayerName(layerName) {
    //     const response: AxiosResponse = await ApiService.getInstance().instance.get('/doob-service-layer/rest/query/getAllLayerHierarchical?igcType=PLAN');
    //     for (let i = 0; i < response.data.length; i++) {
    //         const nodeData = response.data[i];
    //         if (nodeData.informationGroupCoreChild.length !== 0)
    //             for (let j = 0; j < nodeData.informationGroupCoreChild.length; j++) {
    //                 const subLayer = nodeData.informationGroupCoreChild[j];
    //                 if (subLayer.informationGroupCoreData.informationGroupCoreAttributes.nameText === layerName)
    //                     return subLayer.informationGroupCoreData.informationGroupCoreAttributes.id;
    //             }
    //     }
    // }

    public async findLayerNameFromId(layerId:string) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/doob-service-layer/rest/query/getAllLayerHierarchical?systemMode=${TestConstants.mode}&userId=${tokenJSON.userID}&igcType=EXECUTION`);
        for (let i = 0; i < response.data.length; i++) {
            const nodeData = response.data[i];
            if (nodeData.informationGroupCoreChild.length !== 0)
                for (let j = 0; j < nodeData.informationGroupCoreChild.length; j++) {
                    const subLayer = nodeData.informationGroupCoreChild[j];
                    if (subLayer.informationGroupCoreData.length !== 0 || subLayer.informationGroupCoreData !== undefined) {
                        const layerInfo = subLayer.informationGroupCoreData.informationGroupCoreAttributes;
                        if (layerInfo.id === layerId)
                            return layerInfo.nameText;
                    }
                }
        }
    }

    public async getSelectedLayer(isPrivateLayer:boolean, layerName: string, layerId?: string) {
        const predicateLayer = async () => this.getSelectedLayer3(isPrivateLayer, layerName, layerId);
        const selectedLayer = await waitUntil(predicateLayer, { timeout: TestConstants.timeout, intervalBetweenAttempts: CommonUtils.WAIT_INTERVAL_5 });
        return selectedLayer;
    }

    public async getSelectedLayer3(isPrivateLayer:boolean, layerName: string, layerId?: string) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/doob-service-layer/rest/query/getAllLayerHierarchical?systemMode=${TestConstants.mode}&userId=${tokenJSON.userID}&igcType=EXECUTION`);
        for (let i = 0; i < response.data.length; i++) {
            const nodeData = response.data[i];
            if (nodeData.informationGroupCoreChild.length !== 0)
                for (let j = 0; j < nodeData.informationGroupCoreChild.length; j++) {
                    const subLayer = nodeData.informationGroupCoreChild[j];
                    if (subLayer.informationGroupCoreData !== undefined) {
                        const layerInfo = subLayer.informationGroupCoreData.informationGroupCoreAttributes;
                        if (layerInfo.nameText === layerName)
                            return layerInfo;

                        if (layerId !== undefined)
                            if (layerInfo.id === layerId)
                                return layerInfo;
                    }
                }
        }
    }

    public async getSelectedPlanLayer(isPrivateLayer:boolean, layerName: string, layerId?: string) {
        const predicateLayer = async () => this.getSelectedPlanLayer3(isPrivateLayer, layerName, layerId);
        const selectedLayer = await waitUntil(predicateLayer, { timeout: TestConstants.timeout, intervalBetweenAttempts: CommonUtils.WAIT_INTERVAL_5 });
        return selectedLayer;
    }

    public async getSelectedPlanLayer3(isPrivateLayer:boolean, layerName: string, layerId?: string) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/doob-service-layer/rest/query/getAllLayerHierarchical?systemMode=${TestConstants.mode}&userId=${tokenJSON.userID}&igcType=PLAN`);
        for (let i = 0; i < response.data.length; i++) {
            const nodeData = response.data[i];
            if (nodeData.informationGroupCoreChild.length !== 0)
                for (let j = 0; j < nodeData.informationGroupCoreChild.length; j++) {
                    const subLayer = nodeData.informationGroupCoreChild[j];
                    if (subLayer.informationGroupCoreData !== undefined) {
                        const layerInfo = subLayer.informationGroupCoreData.informationGroupCoreAttributes;
                        if (layerInfo.nameText === layerName)
                            return layerInfo;

                        if (layerId !== undefined)
                            if (layerInfo.id === layerId)
                                return layerInfo;
                    }
                }
        }
    }

    public async getSelectedLayer2(isPrivateLayer:boolean, layerName: string, layerId?: string) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/doob-service-layer/rest/query/getAllLayerHierarchical?systemMode=${TestConstants.mode}&userId=${tokenJSON.userID}&igcType=EXECUTION`);
        let index = -1;
        let layer;
        if (isPrivateLayer)
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].nodeData.baseNodeAttributes.organisation.nameText.includes(TestConstants.username))
                    index = i;
            }
        else
            for (let i = 0; i < response.data.length; i++)
                if (response.data[i].nodeData.baseNodeAttributes.organisation.nameText.includes(ConfigUtils.getNodeName()))
                    index = i;
        if (layerId !== undefined)
            layer = response.data[index].informationGroupCoreChild.find((element:any) => (element.informationGroupCoreData.informationGroupCoreAttributes.id.includes(layerId)));
        else
            layer = response.data[index].informationGroupCoreChild.find((element:any) => (element.informationGroupCoreData.informationGroupCoreAttributes.nameText.includes(layerName)));
        return layer.informationGroupCoreData.informationGroupCoreAttributes;
    }

    public async deleteAllTestLayers() { // used in runner
        try {
            const body = JSON.parse(JSON.stringify(deleteLayerJSON));
            body.systemMode = TestConstants.mode;
            body.nodeId = await this.getBaseNodeData(false);
            const response: AxiosResponse = await ApiService.getInstance().instance.get(`/doob-service-layer/rest/query/getAllLayerHierarchical?systemMode=${TestConstants.mode}&userId=${tokenJSON.userID}&igcType=EXECUTION`);
            for (const element of response.data)
                for (const elem of element.informationGroupCoreChild)
                    try {
                        if (elem.informationGroupCoreData.informationGroupCoreAttributes.nameText.includes(CommonUtils.API_NAME)) {
                            body.igcIdList[0] = elem.informationGroupCoreData.informationGroupCoreAttributes.id;
                            await ApiService.getInstance().instance.post(`/doob-service-layer/rest/command/deleteLayer?userId=${elem.informationGroupCoreData.commonAttributes.createdBy.userId}`, body);
                            await this.updateLayerStatusWithID2(false, elem.informationGroupCoreData.informationGroupCoreAttributes.nameText, elem.informationGroupCoreData.informationGroupCoreAttributes.id, 'DELETED');
                        }
                    } catch (error) {
                        console.error(`${error.message} deleteAllTestLayers`);
                    }
        } catch (error) {
            console.error(`${error.message} deleteAllTestLayers`);
        }
    }

    public async deleteAllULAKLayers() { // used in runner
        try {
            const body = deleteLayerJSON;
            body.systemMode = TestConstants.mode;
            body.nodeId = await this.getBaseNodeData(false);
            const response: AxiosResponse = await ApiService.getInstance().instance.get(`/doob-service-layer/rest/query/getAllLayerHierarchical?systemMode=${TestConstants.mode}&userId=${tokenJSON.userID}&igcType=EXECUTION`);
            for (const element of response.data)
                for (const elem of element.informationGroupCoreChild)
                    if (elem.informationGroupCoreData.informationGroupCoreAttributes.creatorId === 'ulak') {
                        body.igcIdList[0] = elem.informationGroupCoreData.informationGroupCoreAttributes.id;
                        await ApiService.getInstance().instance.post(`/doob-service-layer/rest/command/deleteLayer?userId=${elem.informationGroupCoreData.commonAttributes.createdBy.userId}`, body);
                        await this.updateLayerStatusWithID2(false, elem.informationGroupCoreData.informationGroupCoreAttributes.nameText, elem.informationGroupCoreData.informationGroupCoreAttributes.id, 'DELETED');
                    }
        } catch (error) {
            console.error(`${error.message} deleteAllULAKLayers`);
        }
    }

    public async updateLayer(isPrivateLayer:boolean, layerName: string, updatedLayerName: string) {
        const body = JSON.parse(JSON.stringify(updateLayerJSON));
        const updatedLayer = await this.getSelectedLayer(isPrivateLayer, layerName);
        body.layerId = updatedLayer.id;
        body.layerName = updatedLayerName;
        body.systemMode = tokenJSON.mode;
        const response: AxiosResponse = await ApiService.getInstance().instance.put(`/doob-service-layer/rest/command/updateLayer?userId=${tokenJSON.userID}`, body);
        return response.status;
    }

    public async updateLayer2(layerId: string) {
        const body = JSON.parse(JSON.stringify(updateLayerJSON));
        body.layerId = layerId;
        body.layerName = ConfigUtils.generateUniqueWord2();
        body.systemMode = tokenJSON.mode;
        const response: AxiosResponse = await ApiService.getInstance().instance.put(`/doob-service-layer/rest/command/updateLayer?userId=${tokenJSON.userID}`, body);
        return response.status;
    }

    public async deleteLayer(isPrivateLayer:boolean, layerName = CommonUtils.API_NAME) {
        const body = JSON.parse(JSON.stringify(deleteLayerJSON));
        const deletedLayer = await this.getSelectedLayer(isPrivateLayer, layerName);
        body.nodeId = await this.getBaseNodeData(isPrivateLayer);
        body.igcIdList[0] = deletedLayer.id;
        body.systemMode = TestConstants.mode;
        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/doob-service-layer/rest/command/deleteLayer?userId=${tokenJSON.userID}`, body);
        return response.status;
    }

    public async getPrivateNodeByUserId() {
        const response = await ApiService.getInstance().instance.get(`/doob-service-layer/rest/query/getPrivateNodeByUserId?systemMode=${TestConstants.mode}&userId=${tokenJSON.userID}&userName=${tokenJSON.username}`);
        return response.data;
    }

    public async loadLayer(isPrivateLayer: boolean, layerName: string) {
        const body = JSON.parse(JSON.stringify(loadLayerJSON));
        const previousLayer = await this.getSelectedLayer(isPrivateLayer, layerName);
        const workingEnvironmentStructure = body.workingEnvironmentAttributes.workingEnvironmentStructure;
        const parsedStructure = JSON.parse(workingEnvironmentStructure);
        parsedStructure.structure[0].informationGroupCoreChild[0].informationGroupCoreData.informationGroupCoreAttributes = previousLayer;
        parsedStructure.structure[0].nodeData.nodeAttributes.informationGroupCoreIds = [previousLayer.id];
        parsedStructure.structure[0].nodeData.baseNodeAttributes.organisation = await this.getBaseNode(false);
        parsedStructure.structure[0].informationGroupCoreChild[0].informationGroupCoreData.commonAttributes.systemMode = TestConstants.mode;
        parsedStructure.structure[0].informationGroupCoreChild[0].informationGroupCoreData.commonAttributes.createdBy.userName = tokenJSON.username;
        parsedStructure.structure[0].informationGroupCoreChild[0].informationGroupCoreData.commonAttributes.createdBy.userId = tokenJSON.userID.toString();
        parsedStructure.structure[0].informationGroupCoreChild[0].informationGroupCoreData.commonAttributes.modifiedBy.userName = tokenJSON.username;
        parsedStructure.structure[0].informationGroupCoreChild[0].informationGroupCoreData.commonAttributes.modifiedBy.userId = tokenJSON.userID.toString();
        parsedStructure.structure[0].informationGroupCoreChild[0].informationGroupCoreData.commonAttributes.nodeAttributes.nodeName = ConfigUtils.getNodeName();
        parsedStructure.structure[0].informationGroupCoreChild[0].informationGroupCoreData.commonAttributes.nodeAttributes.nodeId = await this.getBaseNodeData(false);
        body.commonAttributes.systemMode = TestConstants.mode;
        body.commonAttributes.createdBy.userId = tokenJSON.userID.toString();
        body.commonAttributes.modifiedBy.userId = tokenJSON.userID.toString();
        body.workingEnvironmentAttributes.workingEnvironmentStructure = JSON.stringify(parsedStructure);
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/doob-service-profile/rest/command/updateWorkingEnvironment', body);
        return response.status;
    }

    public async unloadLayer() {
        const body = JSON.parse(JSON.stringify(loadLayerJSON));
        const workingEnvironmentStructure = body.workingEnvironmentAttributes.workingEnvironmentStructure;
        const parsedStructure = JSON.parse(workingEnvironmentStructure);
        parsedStructure.structure[0].informationGroupCoreChild[0].informationGroupCoreData.informationGroupCoreAttributes = [];
        parsedStructure.structure[0].nodeData.nodeAttributes.informationGroupCoreIds = [];
        parsedStructure.structure[0].nodeData.baseNodeAttributes.organisation = await this.getBaseNode(false);
        parsedStructure.structure[0].informationGroupCoreChild[0].informationGroupCoreData.commonAttributes.systemMode = TestConstants.mode;
        parsedStructure.structure[0].informationGroupCoreChild[0].informationGroupCoreData.commonAttributes.createdBy.userName = tokenJSON.username;
        parsedStructure.structure[0].informationGroupCoreChild[0].informationGroupCoreData.commonAttributes.createdBy.userId = tokenJSON.userID.toString();
        parsedStructure.structure[0].informationGroupCoreChild[0].informationGroupCoreData.commonAttributes.modifiedBy.userName = tokenJSON.username;
        parsedStructure.structure[0].informationGroupCoreChild[0].informationGroupCoreData.commonAttributes.modifiedBy.userId = tokenJSON.userID.toString();
        parsedStructure.structure[0].informationGroupCoreChild[0].informationGroupCoreData.commonAttributes.nodeAttributes.nodeName = ConfigUtils.getNodeName();
        parsedStructure.structure[0].informationGroupCoreChild[0].informationGroupCoreData.commonAttributes.nodeAttributes.nodeId = await this.getBaseNodeData(false);
        body.commonAttributes.systemMode = TestConstants.mode;
        body.commonAttributes.createdBy.userId = tokenJSON.userID.toString();
        body.commonAttributes.modifiedBy.userId = tokenJSON.userID.toString();
        body.workingEnvironmentAttributes.workingEnvironmentStructure = JSON.stringify(parsedStructure);
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/doob-service-profile/rest/command/updateWorkingEnvironment', body);
        return response.status;
    }

    public async createPublicLayer(layerName: string) {
        const res = await this.fetchLayerTypes('Operations Situation Map');
        await this.addLayer(res, layerName, false);
    }

    public async copyPasteToLayer(newLayerName: string, copiedLayerName: string, isCopiedLayerPrivate: boolean, isPastedLayerPrivate: boolean, linked: boolean = false) {
        const body = JSON.parse(JSON.stringify(copyLayerJSON));
        body.layerName = newLayerName;
        const copiedLayer = await this.getSelectedLayer(isCopiedLayerPrivate, copiedLayerName);
        const pastedLayer = await this.getBaseNodeData(isPastedLayerPrivate);
        body.copiedLayerId = copiedLayer.id;
        body.pasteId = pastedLayer;
        body.linked = linked;
        body.pasteOnNode = true;
        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/doob-service-layer/rest/command/copyLayer?userId=${tokenJSON.userID}&systemMode=${TestConstants.mode}`, body);
        return response.status;
    }

    public async preparePayloadForUpdateLayerStatus(isPrivateLayer: boolean, layerName: string, layerId: string, visibilityStatus: string) {
        const body = JSON.parse(JSON.stringify(updateLayerStatusTypeJSON));
        body[0].userId = tokenJSON.userID.toString();
        body[0].layerId = layerId;
        body[0].layerName = layerName;
        body[0].nodeId = await this.getBaseNodeData(isPrivateLayer);
        body[0].nodeName = ConfigUtils.getNodeName();
        body[0].layerStatusType = visibilityStatus;
        return body;
    }

    public async updateLayerStatusInDisplayTrack(body: any) {
        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/doob-service-display-track/rest/command/updateLayerStatus?systemMode=${TestConstants.mode}`, body);
        return response.status;
    }

    public async updateLayerStatusInTrackKinematic(body: any) {
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/doob-service-display-track-kinematic/rest/command/updateLayerStatus', body);
        return response.status;
    }

    public async updateLayerStatusInTrackSymbology(body: any) {
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/doob-service-display-track-symbology/rest/command/updateLayerStatus', body);
        return response.status;
    }

    public async updateLayerStatusInDisplayAnnotation(body: any) {
        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/doob-service-display-annotation/rest/command/updateLayerStatus?systemMode=${TestConstants.mode}`, body);
        return response.status;
    }

    public async updateLayerStatusInOrganizationStructureDisplay(body: any) {
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/doob-service-organization-structure-display/rest/command/updateLayerStatus', body);
        return response.status;
    }

    public async updateLayerStatusInTrackHistory(body: any) {
        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/doob-service-track-history/rest/command/updateLayerStatus?systemMode=${TestConstants.mode}`, body);
        return response.status;
    }

    public async updateLayerStatusWithID(isPrivateLayer: boolean, layerName: string, layerId: string, visibilityStatus: string) {
        const body = await this.preparePayloadForUpdateLayerStatus(isPrivateLayer, layerName, layerId, visibilityStatus);
        await this.updateLayerStatusInDisplayTrack(body);
    }

    public async updateLayerStatusWithID2(isPrivateLayer: boolean, layerName: string, layerId: string, visibilityStatus: string) {
        const body = await this.preparePayloadForUpdateLayerStatus(isPrivateLayer, layerName, layerId, visibilityStatus);
        await this.updateLayerStatusInDisplayTrack(body);
        await this.updateLayerStatusInTrackKinematic(body);
        await this.updateLayerStatusInTrackSymbology(body);
        await this.updateLayerStatusInDisplayAnnotation(body);
        await this.updateLayerStatusInOrganizationStructureDisplay(body);
        await this.updateLayerStatusInTrackHistory(body);
    }

    public async updateLayerStatusType(isPrivateLayer: boolean, layerName: string, visibilityStatus: string) {
        const body = JSON.parse(JSON.stringify(updateLayerStatusTypeJSON));
        body[0].layerName = layerName;
        const previousLayer = await this.getSelectedLayer(isPrivateLayer, layerName);
        body[0].nodeId = await this.getBaseNodeData(isPrivateLayer);
        body[0].nodeName = ConfigUtils.getNodeName();
        body[0].layerId = previousLayer.id;
        body[0].layerStatusType = visibilityStatus;
        body[0].userId = tokenJSON.userID.toString();
        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/doob-service-display-track/rest/command/updateLayerStatus?systemMode=${TestConstants.mode}`, body);
        return response.status;
    }

    public async addCommentToLayer(isPrivateLayer: boolean, layerName: string, commentText: string) {
        const body = JSON.parse(JSON.stringify(addCommentLayerJSON));
        const previousLayer = await this.getSelectedLayer(isPrivateLayer, layerName);
        body.igcId = previousLayer.id;
        body.commentText = commentText;
        const response: AxiosResponse = await ApiService.getInstance().instance.put('/doob-service-layer/rest/command/updateComment', body);
        return response.status;
    }

    public async deleteCommentToLayer(isPrivateLayer: boolean, layerName: string) {
        const body = JSON.parse(JSON.stringify(deleteCommentLayerJSON));
        const previousLayer = await this.getSelectedLayer(isPrivateLayer, layerName);
        body.igcId = previousLayer.id;
        body.commentIdListToBeDeleted[0] = previousLayer.comments[0].id;
        const response: AxiosResponse = await ApiService.getInstance().instance.put('/doob-service-layer/rest/command/updateComment', body);
        return response.status;
    }

    public async defineRuleToLayer(isPrivateLayer: boolean, layerName: string, ruleName: string) {
        const body = JSON.parse(JSON.stringify(defineRuleToLayerJSON));
        const previousLayer = await this.getSelectedLayer(isPrivateLayer, layerName);
        body.layerId = previousLayer.id;
        body.sourceDataList[0].connectionDataWrapperList[0].selectedObjectCoreTypeList.push(ruleName);
        const response: AxiosResponse = await ApiService.getInstance().instance.put(`/doob-service-layer/rest/command/updateLayerRule?userId=${tokenJSON.userID}`, body);
        return response.status;
    }

    public async deleteRulesAtLayer(isPrivateLayer: boolean, layerName: string) {
        const previousLayer = await this.getSelectedLayer(isPrivateLayer, layerName);
        const response: AxiosResponse = await ApiService.getInstance().instance.delete(`/doob-service-layer/rest/command/deleteLayerRule?systemMode=${TestConstants.mode}&userId=${tokenJSON.userID}&layerId=${previousLayer.id}`);
        return response.status;
    }

    public async createLayerWithEachLayerType(layerType: string, layerName: string, isPrivateLayer: boolean) {
        const layerTypeName = layerType.replace(/_/g, ' ');
        const fetchedLayerType = await this.fetchLayerTypes(layerTypeName);
        const status = await this.addLayer(fetchedLayerType, layerName, isPrivateLayer);
        return status;
    }

    public async getAllTracksByLayerIdAndByType(objectCoreType: string, layerID: string, hostilityType: string) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/doob-service-track/rest/query/getAllTrackByLayerIdAndType?systemMode=${TestConstants.mode}&&objectCoreType=${objectCoreType}&&layerId=${layerID}&&hostilityType=${hostilityType}`);
        return response.data.length !== 0 ? response.data : false;
    }

    public async getAllTracksByType(objectCoreType: string) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/doob-service-track/rest/query/getAllTracksByType?systemMode=${TestConstants.mode}&&objectCoreType=${objectCoreType}`);
        return response.data;
    }

    public async createReport(reportType: string, objectCoreType: string, reportName: string, layerID: string) {
        let hostilityType;
        if (reportType.startsWith('INTEL'))
            hostilityType = 'INTEL';
        else
            hostilityType = 'OPERATIONAL';

        const body = JSON.parse(JSON.stringify(addlayerReportJSON));
        if (objectCoreType === 'MATERIAL')
            body.reportName = 'INTEL_STATUS_SUMMARY_REPORT_MATERIAL';
        else if (objectCoreType === 'EVENT')
            body.reportName = 'INTEL_STATUS_SUMMARY_REPORT_EVENT';
        else if (objectCoreType === 'UNIT')
            body.reportName = 'INTEL_STATUS_SUMMARY_REPORT_UNIT';
        else if (objectCoreType === 'FACILITY')
            body.reportName = 'INTEL_STATUS_SUMMARY_REPORT_FACILITY';
        const predicate = async () => this.getAllTracksByLayerIdAndByType(objectCoreType, layerID, hostilityType);
        try {
            body.parameters.JsonDataSource = await waitUntil(predicate, { timeout: TestConstants.timeout, intervalBetweenAttempts: CommonUtils.WAIT_INTERVAL_5 });
        } catch (e) {
            if (e instanceof TimeoutError)
                body.parameters.JsonDataSource = [];
            else
                throw e;
        }
        body.parameters.reportType = reportType;
        body.reportGeneratedName = reportName;
        body.approvers[0].username = TestConstants.username;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/report/rest/saveGeneratedReport', body);
        return response.status;
    }

    public async createCISReport(reportType: string, objectCoreType: string, reportName: string, layerID: string) {
        const hostilityType = null;
        const body = addlayerCISReportJSON;
        body.reportName = 'CIS';
        body.parameters.reportType = reportType;
        const resData = await this.getAllTracksByLayerIdAndByType(objectCoreType, layerID, hostilityType);
        body.parameters.JsonDataSource = resData;
        body.reportGeneratedName = reportName;
        body.approvers[0].username = TestConstants.username;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/report/rest/saveGeneratedReport', body);
        return response.status;
    }

    public async getApp6aSymbologyTree() {
        const res: AxiosResponse = await ApiService.getInstance().instance.get(`/doob-service-palette/rest/query/app6aSymbologyTree?paletteLanguage=en_EN&systemMode=${TestConstants.mode}`);
        return res.data;
    }

    public async createPublicLayerAndLoad(layerName: string) {
        await this.createPublicLayer(layerName);
        const selectedLayer = await this.getSelectedLayer(false, layerName);
        await this.updateLayerStatusWithID(false, layerName, selectedLayer.id, 'LOADED');
        await this.updateLayerStatusWithID(false, layerName, selectedLayer.id, 'ACTIVATED');
        // TODO create 1 layer

        return selectedLayer.id;
    }

    public async createPublicLayerAndLoad2(layerName: string) {
        await this.createPublicLayer(layerName);
        const selectedLayer = await this.getSelectedLayer(false, layerName);
        await this.updateLayerStatusWithID2(false, layerName, selectedLayer.id, 'LOADED');
        await this.updateLayerStatusWithID2(false, layerName, selectedLayer.id, 'ACTIVATED');

        return selectedLayer.id;
    }

    public async getAllLayerHierarchicalExecution() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get('/doob-service-layer/rest/query/getAllLayerHierarchical?igcType=EXECUTION');
        return response.data;
    }

    public async getLayerOfObject(service: ServiceParams) {
        const object = await objectManagerService.getObjectByAlternateName(service);
        const layers: any[] = (await this.getInformationGroupCoreChildrenOfBaseNodeLayer()).informationGroupCoreChild;
        return layers.find((layer) => layer.informationGroupCoreData.informationGroupCoreAttributes.id === object.dataAttributes.originalLayerId);
    }

    public async getInformationGroupCoreChildrenOfBaseNodeLayer() {
        const hierarchy = await this.getAllLayerHierarchicalExecution();
        return hierarchy.find((node) => node.nodeData.baseNodeAttributes.organisation.nameText === ConfigUtils.getNodeName());
    }

    public async getObjectsInLayerByType(layer: any, objectCoreTypes: string[]) {
        const objectIds: string[] = layer.informationGroupCoreData.informationGroupCoreAttributes.objectIds;
        const objectLists: ObjectList[] = [];
        for (let i = 0; i < objectCoreTypes.length; i++) {
            const list: any[] = (await objectManagerService.getObjectsByServiceName(objectCoreTypes[i].split(/[_-]/).join(''))).data;
            const filtered = list.filter((object) => objectIds.find((id) => id === object.dataAttributes.objectCore.globalTrackIdentifier) !== undefined);
            objectLists.push({
                objectCoreType: objectCoreTypes[i],
                objectList: filtered,
            });
        }
        return objectLists;
    }

    public async getObjectsInLayer(layer: any) {
        const objectIds: string[] = layer.informationGroupCoreData.informationGroupCoreAttributes.objectIds;
        const objectLists: ObjectList[] = [];
        for (let i = 0; i < services.length; i++) {
            const list: any[] = (await objectManagerService.getObjectsByServiceName(services[i].serviceNameAdj)).data;
            const filtered = list.filter((object) => objectIds.find((id) => id === object.dataAttributes.objectCore.globalTrackIdentifier) !== undefined);
            if (filtered)
                objectLists.push({
                    objectCoreType: services[i].serviceName,
                    objectList: filtered,
                });
        }
        return objectLists;
    }

    public async checkObjectNumIsEqualToNum(layerName: string, num: number, isPrivateLayer: boolean, layerId?:string) {
        const layer = await this.getSelectedLayer(isPrivateLayer, layerName, layerId);
        return layer.objectIds.length === num;
    }

    public waitUntilCheckObjectNumIsEqualToNum(layerName: string, num: number, isPrivateLayer: boolean = false, layerId?:string) {
        const predicateObjectList = async () => this.checkObjectNumIsEqualToNum(layerName, num, isPrivateLayer, layerId);
        return waitUntil(predicateObjectList, { timeout: TestConstants.timeout, intervalBetweenAttempts: CommonUtils.WAIT_INTERVAL });
    }

    // public async checkObjectNumIsEqualToNumPlan(layerName: string, num: number, isPrivateLayer: boolean, layerId?:string) {
    //     const layer = await this.getSelectedPlanLayer(isPrivateLayer, layerName, layerId);
    //     return layer.objectIds.length === num;
    // }

    // public waitUntilCheckObjectNumIsEqualToNumPlan(layerName: string, num: number, isPrivateLayer: boolean = false, layerId?:string) {
    //     const predicateObjectList = async () => this.checkObjectNumIsEqualToNumPlan(layerName, num, isPrivateLayer, layerId);
    //     return waitUntil(predicateObjectList, { timeout: TestConstants.timeout, intervalBetweenAttempts: CommonUtils.WAIT_INTERVAL });
    // }

    public waitUntilCheckObjectNumIsEqualToNum2(layerName: string, num: number, type:string = 'EXECUTION') {
        const predicateObjectList = async () => this.checkObjectNumIsEqualToNum2(layerName, num, type);
        return waitUntil(predicateObjectList, { timeout: TestConstants.timeout, intervalBetweenAttempts: CommonUtils.WAIT_INTERVAL });
    }

    public async checkObjectNumIsEqualToNum2(layerName: string, num: number, type:string = 'EXECUTION') {
        const layer = await this.findLayerIDbyLayerName(layerName, type);
        return layer.objectIds.length === num;
    }
}
export const situationMapsService = new SituationMapsService();
