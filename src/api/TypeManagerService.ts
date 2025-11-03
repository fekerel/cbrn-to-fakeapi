/* eslint-disable no-param-reassign, array-callback-return, import/no-cycle, max-len, no-restricted-syntax, consistent-return */
import { AssertionError } from 'assert';
import { AxiosResponse } from 'axios';
import ApiService from '@api/ApiService';
import TestConstants from '@common/lib/TestConstants';
import tokenJSON from '@testConstants/token.json';
import { ServiceParams, SymbolObject, TypeParams } from '@common/Types';
import { payloadService } from '@api/PayloadService';
import CommonUtils from '@common/CommonUtils';
import { objectManagerService } from '@api/ObjectManagerService';
import ConfigUtils from '@common/ConfigUtils';
import waitUntil from 'async-wait-until';

import { Entries } from 'type-fest';

class TypeManagerService {
    async prepareTypePayload(service: ServiceParams) {
        const schema = await this.getSchema(service);
        const template = await this.getTemplate(service);

        let payload = payloadService.createPayload(service, schema, template, true, true);

        if (service.serviceName === 'vessel')
            if (JSON.parse(JSON.stringify(payload)).vesselTypeAttributes.vesselTypeCategoryCode === 'SUBSURFACE_VESSEL_TYPE'
                || JSON.parse(JSON.stringify(payload)).vesselTypeAttributes.vesselTypeCategoryCode === 'SURFACE_VESSEL_TYPE') {
                const abc = JSON.parse(JSON.stringify(payload));
                abc.vesselTypeAttributes.vesselTypeCategoryCode = 'NOT_KNOWN';
                payload = abc;
            }

        return payload;
    }

    async checkTypeCreated(service: ServiceParams) {
        const createdType = await this.findType(service);
        const res = await ApiService.getInstance().instance.post(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/getSymbolCodes`, createdType);
        if (res.data === '')// TODO change to the new incorrect response
            return Promise.reject(new AssertionError({ message: 'Invalid type data created. Expected Symbol Codes but received none.' }));

        return res.status;
    }

    async checkTypeUpdated(service: ServiceParams) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/get?typeId=${service.typeID}`);
        return res.data['objectTypeAttributes']['objectTypeNameText'];
    }

    async findType2(service: ServiceParams) {
        const predicateTypeList = async () => this.findType(service);
        const typeCreated = await waitUntil(predicateTypeList, { timeout: TestConstants.timeout, intervalBetweenAttempts: CommonUtils.WAIT_INTERVAL });
        return typeCreated;
    }

    async getTypeAndUpdatePayload(service: ServiceParams) {
        const payload = await this.findType(service);
        service.typeID = payload['typeAttributes']['typeId'];
        payload['objectTypeAttributes']['objectTypeNameText'] = `edited_${payload['objectTypeAttributes']['objectTypeNameText']}`;
        service.typeName = payload['objectTypeAttributes']['objectTypeNameText'];
        payload['commonAttributes']['modifiedBy']['userId'] = tokenJSON.userID;
        payload['commonAttributes']['modifiedBy']['userName'] = tokenJSON.username;
        return payload;
    }

    async checkTypeDeleted(service: ServiceParams) {
        if (service.type && !service.existingType) {
            const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/get?typeId=${service.typeID}`);
            return res.data;
        }
        return '';
    }

    private async getTemplate(service: ServiceParams) {
        /// doob-service-identification/rest/query/type/unit/getTemplateTypeData
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/getTemplateTypeData`);
        return res.data;
        // TODO 503 check ile kontrol edilebilir. 3 adet "muhtemelen çalışmıyor" var edit cevap 502 geliyor. traefik tarfında 503 döndürülmesi için istekte bulundum.
    }

    private async getSchema(service: ServiceParams) {
        const res: AxiosResponse = await ApiService.getInstance().instance.get(`/doob-service-settings/rest/query/getSchema?schemaType=type&objectCoreType=${service.serviceNameAdj}`);

        return res.data;
    }

    async findType(service: ServiceParams) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/getAll`);
        const foundType = res.data.find((element:any) => element.objectTypeAttributes.objectTypeNameText === service.typeName);
        if (foundType === undefined)
            return Promise.reject(new Error(`Type not found in Type List. Type name: ${service.typeName}`));

        return foundType;
    }

    async findTypeWithName(service: ServiceParams, typeName) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/getAll`);
        const foundType = res.data.find((element:any) => element.objectTypeAttributes.objectTypeNameText === typeName);
        return foundType;
    }

    async sendCreateRequest(service: ServiceParams, payload: object) {
        const res = await ApiService.getInstance().instance.post(`/doob-service-identification/rest/command/type/${service.serviceNameAdj}/upsert`, payload);
        return res.status;
    }

    async sendUpdateRequest(service: ServiceParams, payload: any) {
        await ApiService.getInstance().instance.post(`/doob-service-identification/rest/command/type/${service.serviceNameAdj}/upsert`, payload);
    }

    async sendDeleteRequest(service: ServiceParams) {
        return ApiService.getInstance().instance.delete(`/doob-service-identification/rest/command/type/${service.serviceNameAdj}/delete?typeId=${service.typeID}`);
    }

    async createAllTypes2(service: ServiceParams) {
        const types:TypeParams[] = [];
        const schema = await this.getSchema(service);
        const template = await this.getTemplate(service);
        if (template === 500 || template === 502 || template === 503)
            return types;
        let fieldCounter:{ name:string, index:number, length:number, value:string, path:string[], enum:string[] }[] = payloadService.searchFields(service, schema, template, true);
        fieldCounter = payloadService.applyInclExclData(service, fieldCounter);
        const dependencyList:{ path:string[], dependencies:{ name:string, enum:string[] }[][] } = payloadService.getDependencies(service, schema);
        if (fieldCounter === null) {
            console.info(`${service.serviceName} için typesIncExclData.json dosyasini doldurunuz.`);
            return types;
        }

        // const possibilities = this.calculateGumOfPossibilities(dependencyList, fieldCounter);
        // console.log(`${service.serviceName} --- ${possibilities}`);
        const payload = payloadService.createPayload(service, schema, template, true, false, fieldCounter);
        if (payloadService.checkDependency(fieldCounter, dependencyList)) {
            let stringValue = '';
            fieldCounter.forEach((field) => {
                if (field.name !== 'decoyIndicatorCode')
                    stringValue += `${field.name}=${field.value}`;
            });
            const data: TypeParams = {
                name: stringValue,
                data: payload,
            };
            types.push(JSON.parse(JSON.stringify(data)));
        }
        const maxTypeAmount = 100;// TODO delete later

        do {
            let useNextField = false;
            let index = 0;
            do {
                let temp = payload;
                fieldCounter[index].path.forEach((el) => {
                    temp = temp[el] as any[];
                });
                const nextIndex = (fieldCounter[index].index + 1) % (fieldCounter[index].length + 1);
                fieldCounter[index].index = nextIndex;
                fieldCounter[index].value = fieldCounter[index].enum[nextIndex];
                temp[fieldCounter[index].name] = fieldCounter[index].value;
                if (nextIndex === 0 && fieldCounter.length - 1 !== index) {
                    useNextField = true;
                    index += 1;
                } else {
                    useNextField = false;
                }
            } while (useNextField);
            if (payloadService.checkDependency(fieldCounter, dependencyList)) {
                payload['objectTypeAttributes']['objectTypeNameText'] = `${service.serviceName}-${ConfigUtils.generateUniqueWord2()}`;
                let stringValue = '';
                fieldCounter.forEach((field) => {
                    if (field.name !== 'decoyIndicatorCode')
                        stringValue += `${field.name}=${field.value}`;
                });
                const data2: TypeParams = {
                    name: stringValue,
                    data: payload,
                };
                types.push(JSON.parse(JSON.stringify(data2)));
                // await this.sendCreateRequest(service, JSON.parse(JSON.stringify(payload)));
            }
            if (types.length === maxTypeAmount)
                break;
        } while (!payloadService.isFinished(fieldCounter));
        // console.log(types);
        return types;

        // const status = await this.sendCreateRequest(service, payload);
    }

    private calculateGumOfPossibilities(dependencyList: any, fieldCounter:any) {
        const tempDependencyList = {};
        let oneDependencyPossibilities = 1;
        let dependentPossibilities = 0;
        dependencyList.dependencies.forEach((dependency:any) => {
            dependency.forEach((field) => {
                tempDependencyList[field.name] = true;
                fieldCounter.forEach((field2:any) => {
                    if (field2.name === field.name)
                        oneDependencyPossibilities *= field.enum.filter((x) => (field2.enum as any[]).includes(x)).length;
                });
            });
            dependentPossibilities += oneDependencyPossibilities;
            oneDependencyPossibilities = 1;
        });
        let possibilities = 1;
        fieldCounter.forEach((field:any) => {
            if (dependencyList !== undefined) {
                if (!tempDependencyList[field.name])
                    possibilities *= (field.length + 1);
            } else {
                possibilities *= (field.length + 1);
            }
        });
        if (Object.keys(tempDependencyList).length === 0)
            dependentPossibilities = 1;

        return possibilities * dependentPossibilities;
    }

    async deleteAllCreatedTypesByAutomation(service: ServiceParams) { // used in runner
        try {
            const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/getAll`);
            if (res.data.length !== 0)
                for (const data of res.data)
                    try {
                        if ((data.objectTypeAttributes.objectTypeNameText !== undefined && data.objectTypeAttributes.objectTypeNameText.includes(CommonUtils.API_NAME)) || data.commonAttributes.createdBy.userName === tokenJSON.username)
                            await ApiService.getInstance().instance.delete(`/doob-service-identification/rest/command/type/${service.serviceNameAdj}/delete?typeId=${data.typeAttributes.typeId}`);
                    } catch (e) {
                        if (e.message.includes('412'))
                            console.error('bu tip bir obje tarafından kullaniliyor');
                        else
                            console.error(`${e.message} deleteAllCreatedTypesByAutomation`);
                    }
        } catch (e) {
            if (e.message.includes('412'))
                console.error('bu tip bir obje tarafından kullaniliyor');
            else
                console.error(`${e.message} deleteAllCreatedTypesByAutomation`);
            return 1;
        }
    }

    async getNumOfTypes(service: ServiceParams) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/getAll`);
        return res.data.length;
    }

    async getAllTypes(service: ServiceParams) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/getAll`);
        return res.data;
    }

    async getTypeById(serviceName: string, typeID: string) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-identification/rest/query/type/${serviceName}/get?typeId=${typeID}`);
        return res.data;
    }

    async getLocalizationType(enumValue: string) {
        const res = await ApiService.getInstance().instance.get(`/doob-service-localization/rest/query/getLocalization?systemMode=${TestConstants.mode}&enumValue=${enumValue}&locale=en`);
        const array: string[] = [];
        (Object.keys(res.data.values)).forEach((enumV) => {
            array.push(enumV);
        });
        return array;
    }

    async getOnlyDefaultTypes(service: ServiceParams) {
        const res2:object[] = [];
        const res = await this.getAllTypes(service);

        res.forEach((type) => {
            if (!type.objectTypeAttributes.objectTypeNameText.includes(CommonUtils.API_NAME) && type.commonAttributes.createdBy.userName === 'system')
                res2.push(type);
        });

        if (service.serviceName === 'ammunition' || service.serviceName === 'military-post' || service.serviceName === 'consumable-materiel') {
            let payload = await this.prepareTypePayload(service);
            const body = JSON.parse(JSON.stringify(payload));

            const symbols = await this.getMSymbolsFromConfigServer(service);
            const randomSymbols = symbols.sort(() => 0.5 - Math.random()).slice(0, +TestConstants.maxCount);
            for (const symbol of randomSymbols) {
                body.objectTypeAttributes.objectTypeNameText = `${symbol.parentValue}_${symbol.validValue}_${ConfigUtils.generateUniqueWord2()}`;
                if (service.serviceName === 'ammunition') {
                    body.ammunitionTypeAttributes.ammunitionTypeCategoryCodeEnum = symbol.parentValue;
                    body.ammunitionTypeAttributes.ammunitionTypeMineMaritimeFiringCodeEnum = symbol.validValue;
                } else if (service.serviceName === 'military-post') {
                    body.militaryPostTypeAttributes.militaryPostTypeCategoryCode = symbol.validValue;
                } else if (service.serviceName === 'consumable-materiel') {
                    body.consumableMaterialTypeAttributes.consumableMaterialTypeCategoryCodeEnum = symbol.parentValue;
                    body.consumableMaterialTypeAttributes.consumableMaterialTypeSubcategoryCodeEnum = symbol.validValue;
                }
                payload = body;
                service.typeName = `${symbol.parentValue}_${symbol.validValue}_${ConfigUtils.generateUniqueWord2()}`;
                await this.sendCreateRequest(service, payload);
            }
            const res = await this.getAllTypes(service);
            res.forEach((type) => {
                res2.push(type);
            });
        }
        return this.findTypesForMIP(res2, service);
    }

    async getSymbologyFromDomVal(service:ServiceParams, genericSymbology:any[], mainId:string, mainValue:string, subId?:string, subValue?:string) {
        for (const symbol of genericSymbology)
            if (symbol.name === mainValue || symbol.name === subValue) {
                if ((symbol.domId + symbol.domIx) === mainId || (symbol.domId + symbol.domIx) === subId)
                    return symbol.geometries;

                if (subId && subValue === symbol.name && symbol.domId === mainId)
                    return symbol.geometries;
            }

        return 'error';
    }

    async getMSymbolsFromConfigServer(service: ServiceParams) {
        const symbols: SymbolObject[] = [];
        let res;
        if (service.serviceName === 'vehicle')
            res = await ApiService.getInstance().instance.get(`/config-server/_/_/master/static/br-ent/${service.serviceNameAdj}/${service.serviceName}-type-dom-val.json?useDefaultLabel`);
        else
            res = await ApiService.getInstance().instance.get(`/config-server/_/_/master/static/br-ent/${service.serviceNameAdj}/${service.serviceName}-dom-val-to-s15.json?useDefaultLabel`);

        const res3 = await ApiService.getInstance().instance.get(`/doob-service-palette/rest/public/getGenericSymbology?systemMode=${TestConstants.mode}&objectCoreType=${service.serviceName.toUpperCase().split('-').join('_')}`);
        for (const [field, element2] of (Object.entries(res.data)) as Entries<object>) {
            const element = element2 as any;
            if (element.app6AString === undefined) {
                for (const [field2, domainValue2] of Object.entries(element) as Entries<object>) {
                    const domainValue = domainValue2 as any;
                    if (domainValue.app6AString.startsWith('M')) {
                        const symbolObject: SymbolObject = {
                            parentValue: domainValue.parentValue,
                            validValue: domainValue.validValue,
                            app6AString: domainValue.app6AString,
                            symbolTypes: await this.getSymbologyFromDomVal(service, res3.data.genericSymbols, field, domainValue.parentValue, field2, domainValue.validValue),
                            mainId: field,
                            subId: field2,
                        };
                        symbols.push(symbolObject);
                    }
                }
            } else
                if (element.app6AString.startsWith('M')) {
                    const symbolObject: SymbolObject = {
                        parentValue: element.parentValue,
                        validValue: element.validValue,
                        app6AString: element.app6AString,
                        symbolTypes: await this.getSymbologyFromDomVal(service, res3.data.genericSymbols, field, element.parentValue),
                        mainId: field,
                    };
                    symbols.push(symbolObject);
                }
        }
        return symbols;
    }

    public async createTypes(service: ServiceParams) {
        const payload = await this.prepareTypePayload(service);
        // console.log(require('util').inspect(payload, {showHidden: false, depth: null, colors: true})) //print object
        // require('child_process').spawnSync("pause", {shell: true, stdio: [0, 1, 2]}); //press any key to continue
        await this.sendCreateRequest(service, payload);
        return this.checkTypeCreated(service);
    }

    public async addPrincipalEquipmentTypeForDemo(service: ServiceParams, payload) {
        const baseNode = await objectManagerService.getNodeUnit();
        const body = payload;
        body.commonAttributes.nodeAttributes.nodeName = baseNode.commonAttributes.nodeAttributes.nodeName;
        body.commonAttributes.nodeAttributes.nodeId = baseNode.commonAttributes.nodeAttributes.nodeId;
        body.commonAttributes.modifiedBy.userName = tokenJSON.username;
        body.commonAttributes.modifiedBy.userId = tokenJSON.userID.toString();
        const res = await ApiService.getInstance().instance.post(`/doob-service-identification/rest/command/type/${service.serviceNameAdj}/upsert`, body);
        return (res.status);
    }

    // public async createTypeWithDifferentPayload(service: ServiceParams) {
    //     let objectCoreType;
    //     if (service.serviceName === 'unit')
    //         objectCoreType = 'BRIDGE';
    //     else
    //         objectCoreType = 'UNIT';

    //     //const serviceForPayload = ApiService.getService(objectCoreType.toLowerCase().replace('_', '-'));
    //     //const payload = await this.prepareTypePayload(serviceForPayload);
    //     await this.sendCreateRequest(service, payload);
    //     return this.checkTypeCreated(service);
    // }

    private async findTypesForMIP(types: object[], service: ServiceParams) {
        const foundTypes = [];
        while (foundTypes.length < parseInt(TestConstants.maxCount, 10) && types.length !== 0) {
            const randomIndex = Math.floor(Math.random() * types.length);
            const randomType = types.splice(randomIndex, 1)[0];
            const s15 = (await this.getSymbolCodes(randomType, service)).app6a;
            if (s15.startsWith('M')) {
                foundTypes.push(randomType);
                return foundTypes;
            }
        }
        return foundTypes;
    }

    public async getSymbolCodes(randomType: any, service: ServiceParams) {
        const res = await ApiService.getInstance().instance.post(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/getSymbolCodes`, randomType);
        return res.data;
    }

    public async getOneExistingTypeAndCreateObject(service: ServiceParams) {
        const allTypes = await this.getAllTypes(service);
        const randomIndex = Math.floor(Math.random() * allTypes.length);
        const randomType = allTypes.splice(randomIndex, 1)[0];
        service.typeName = randomType['objectTypeAttributes']['objectTypeNameText'];
        service.typeID = randomType['typeAttributes']['typeId'];
        const res = await ApiService.getInstance().instance.post(`/doob-service-identification/rest/query/type/${service.serviceNameAdj}/getSymbolCodes`, randomType);
        service.symbolCodes = res.data;
        const payload = await objectManagerService.prepareObjectPayload(service, false);
        await objectManagerService.sendCreateRequest(service, payload);
        const createdObject = objectManagerService.checkObjectCreated(service);
        return createdObject;
    }

    public async createDemoType(existingPayload:any, service:any) {
        const baseNode = await objectManagerService.getNodeUnit();
        const body = JSON.parse(JSON.stringify(existingPayload));
        body.commonAttributes.createdBy.userName = tokenJSON.username;
        body.commonAttributes.createdBy.userId = tokenJSON.userID.toString();
        body.commonAttributes.modifiedBy.userName = tokenJSON.username;
        body.commonAttributes.modifiedBy.userId = tokenJSON.userID.toString();
        body.commonAttributes.nodeAttributes.nodeName = baseNode.commonAttributes.nodeAttributes.nodeName;
        body.commonAttributes.nodeAttributes.nodeId = baseNode.commonAttributes.nodeAttributes.nodeId;
        const resStatus = await this.sendCreateRequest(service, body);
        return resStatus;
    }
}

export const typeManagerService = new TypeManagerService();
