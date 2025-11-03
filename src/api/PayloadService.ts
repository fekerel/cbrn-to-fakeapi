/* eslint-disable no-param-reassign, array-callback-return, import/no-cycle, max-len, no-restricted-syntax, consistent-return */

import { Stream } from 'stream';
import { Entries } from 'type-fest';
import { ServiceParams } from '@common/Types';
import tokenJSON from '@testConstants/token.json';
import ConfigUtils from '@common/ConfigUtils';
// import { exec } from 'child_process';
// import { promisify } from 'util';
import os from 'os';
import * as fs from 'fs';
import * as path from 'path';

const typesInclExclData:{} = require('@misc/JSONdata/typesInclExclData.json');

class PayloadService {// Complicated methods
    createPayload(service: ServiceParams, schema: object, template: object, isType:boolean, random:boolean, dict?:any) {
        const keyArray:string[] = [];
        const payload:object = { ...template };
        for (const [key, value] of Object.entries(schema['allOf'][0]['properties']) as Entries<object>) {
            this.searchSchema(value, key, false, keyArray, random, payload, dict);// start filling payload with values
            (isType ? this.searchSchema(value, key, true, keyArray, random, payload) : '');// start checking dependency conflicts for Types
        }
        if (!isType) { // add dataAttributes for Objects
            keyArray.push('dataAttributes');
            this.searchSchema(schema['$defs']['ObjectCore-1'], 'objectCore', isType, keyArray, random, payload, dict);
            keyArray.pop();
        }
        this.fillInfo(service, payload, isType, service.S15, service.typeID);
        return payload;
    }

    private addValue(value: object, key: string, keyArray:string[], random:boolean, payload?:object, dict?:any[]) {
        if ('enum' in value)
            value['enum'] = (value['enum'] as any[]).filter((element) => (element === null || !(element.includes('_TYPE'))));

        if ('enum' in value)
            value['enum'] = (value['enum'] as any[]).filter((element) => (element === null || (!(element.includes('KIMYASAL_AJAN_TIPI')) && !(element.includes('ASKERI_KIMYASAL_BILESIK_TIPI')) && !(element.includes('KIVAMLAŞTIRICI_MADDE')))));

        if (dict && random) {
            if ('enum' in value)
                dict.push({
                    name: key, index: 0, length: (value['enum'] as any[]).length - 1, value: (value['enum'] as any[])[0], path: keyArray.slice(), enum: value['enum'],
                });
        } else if (dict && !random) {
            let temp = payload!;
            keyArray.forEach((element) => {
                temp = temp[element];
            });
            if ('enum' in value)
                (dict.forEach((field:any) => {
                    if (field.name === key)
                        temp[key] = (field.enum as any[])[0];
                }));
        } else {
            let temp = payload!;
            keyArray.forEach((element) => {
                temp = temp[element];
            });

            if ('enum' in value)
                if (random) {
                    const randomIndex = Math.floor(Math.random() * (value['enum'] as any[]).length);
                    temp[key] = (value['enum'] as any[])[randomIndex];
                } else {
                    temp[key] = (value['enum'] as any[])[0];
                }
            else if (!('pattern' in value))
                if (random)
                    temp[key] = Math.floor(Math.random() * 100);
        }
    }

    private dependencyCheck(value: any, keyArray:string[], payload:object, getAll?:boolean) {
        if ('dependencies' in value)
            if (getAll) {
                payload['path'] = keyArray.slice();
                payload['dependencies'] = [];
                (Object.values(value.dependencies)).forEach((dependency:any) => {
                    (dependency['oneOf'] as Entries<object>).forEach((element) => {
                        const allDependencies:any[] = [];
                        let temp = payload;
                        keyArray.forEach((el) => {
                            temp = temp[el];
                        });
                        (Object.entries(element['properties']) as Entries<object>).forEach(([dependentKey, dependentValue]) => {
                            allDependencies.push({ name: dependentKey, enum: dependentValue['enum'] });
                        });
                        payload['dependencies'].push(allDependencies);
                    });
                });
            } else {
                (Object.entries(value.dependencies) as Entries<object>).forEach(([key, dependency]) => {
                    let found = false;
                    (dependency['oneOf'] as Entries<object>).forEach((element) => {
                        let temp = payload;
                        keyArray.forEach((el) => {
                            temp = temp[el];
                        });
                        const foundEnums = element['properties'][key]['enum'];
                        if (foundEnums.includes('enumValue')) {
                            found = true;
                            (Object.entries(element['properties']) as Entries<object>).forEach(([dependentKey, dependent]) => {
                                const randomIndex = Math.floor(Math.random() * (dependent['enum'] as any[]).length);
                                temp[dependentKey] = dependent['enum'][randomIndex];
                            });
                        }
                    });
                    if (!found) {
                        let temp = payload;
                        keyArray.forEach((el) => {
                            temp = temp[el] as any[];
                        });
                        // FIXME type.json içindeki türkce ifadeler silinince kaldır.
                        for (let i = 0; i < (dependency['oneOf'] as any[]).length; i++) {
                            const data = JSON.stringify((dependency['oneOf'] as any[])[i]);
                            if (data.includes('KIMYASAL_AJAN_TIPI') || data.includes('ASKERI_KIMYASAL_BILESIK_TIPI') || data.includes('KIVAMLAŞTIRICI_MADDE') || data.includes('_TYPE')) {
                                (dependency['oneOf'] as any[]).splice(i, 1);
                                i--;
                            }
                        }
                        const randomDependencyIndex = Math.floor(Math.random() * (dependency['oneOf'] as any[]).length);
                        (Object.entries(dependency['oneOf'][randomDependencyIndex]['properties']) as Entries<object>).forEach(([dependentKey, dependent]) => {
                            const randomIndex = Math.floor(Math.random() * (dependent['enum'] as any[]).length);
                            temp[dependentKey] = (dependent['enum'] as [])[randomIndex];
                        });
                    }
                });
            }
    }

    private fillInfo(service: ServiceParams, payload:object, isType: boolean, s15?:string, typeID?:string) {
        payload['commonAttributes']['createdBy']['userId'] = tokenJSON.userID;
        payload['commonAttributes']['createdBy']['userName'] = tokenJSON.username;
        payload['commonAttributes']['modifiedBy']['userId'] = tokenJSON.userID;
        payload['commonAttributes']['modifiedBy']['userName'] = tokenJSON.username;
        if (isType) {
            payload['objectTypeAttributes']['decoyIndicatorCode'] = 'YES';
            payload['objectTypeAttributes']['objectTypeNameText'] = `${service.serviceName}-${ConfigUtils.generateUniqueWord2()}`;
            service.typeName = payload['objectTypeAttributes']['objectTypeNameText'];
        } else {
            payload['dataAttributes']['objectCore']['s15Text'] = s15;
            payload['dataAttributes']['objectCore']['typeId'] = typeID;
            payload['dataAttributes']['objectCore']['nameText'] = `${service.serviceName}-${ConfigUtils.generateUniqueWord2()}-${typeID}`;
            service.objectName = payload['dataAttributes']['objectCore']['nameText'];
        }
    }

    private searchSchema(value: object, key: string, isType: boolean, keyArray:string[], random:boolean, payload?:object, dict?:any[]) {
        if ('type' in value)
            if ((typeof value['type'] === 'object' && 'object' in value['type']!) || (typeof value['type'] === 'string' && value['type'].includes('object'))) {
                if (Object.prototype.hasOwnProperty.call(value, 'properties')) {
                    keyArray.push(key);
                    (Object.entries(value['properties']) as Entries<object>).forEach(([keyProp, valueProp]) => { this.searchSchema(valueProp, keyProp, isType, keyArray, random, payload, dict); });
                    (isType ? this.dependencyCheck(value, keyArray, payload!) : '');// check dependency for Types
                    keyArray.pop();
                }
            } else if (!isType) { // fill with value
                this.addValue(value, key, keyArray, random, payload, dict);
            }
    }

    searchFields(service: ServiceParams, schema: any, template: any, isType: boolean) {
        const keyArray:string[] = [];
        const dict:{ name:string, index:number, length:number, value:string, path:string[], enum:string[] }[] = [];
        for (const [key, value] of Object.entries(schema['allOf'][0]['properties']) as Entries<object>)
            this.searchSchema(value, key, false, keyArray, true, undefined, dict);// start filling dict
        if (!isType) { // add dataAttributes for Objects
            keyArray.push('dataAttributes');
            this.searchSchema(schema['$defs']['ObjectCore-1'], 'objectCore', isType, keyArray, true, undefined, dict);
            keyArray.pop();
        }
        return dict;
    }

    async createAllPayloads(service: ServiceParams, schema: any, template: any, isType: boolean, dict: any, payloadStream: Stream, dependencyList: object, lotsOfCombinations:boolean, streamQueue:any) {
        const payload = this.createPayload(service, schema, template, isType, false, dict);
        await this.alterPayload(payload, dict, payloadStream, service, dependencyList, lotsOfCombinations, streamQueue);
        return 1;
    }

    private async alterPayload(payload: object, dict: any, payloadStream: Stream, service: ServiceParams, dependencyList: object, lotsOfCombinations:boolean, streamQueue:any) {
        if (this.checkDependency(dict, dependencyList))
            await payloadStream.emit('data', payload);
        let queueIndex = 0;
        do {
            let useNextField = false;
            let index = 0;
            do {
                let temp = payload;
                dict[index].path.forEach((el) => {
                    temp = temp[el] as any[];
                });
                const nextIndex = (dict[index].index + 1) % (dict[index].length + 1);
                dict[index].index = nextIndex;
                dict[index].value = dict[index].enum[nextIndex];
                temp[dict[index].name] = dict[index].value;
                if (nextIndex === 0) {
                    useNextField = true;
                    index += 1;
                } else {
                    useNextField = false;
                }
            } while (useNextField);
            if (this.checkDependency(dict, dependencyList)) {
                payload['objectTypeAttributes']['objectTypeNameText'] = `${service.serviceName}-${ConfigUtils.generateUniqueWord2()}`;
                if (lotsOfCombinations && queueIndex > 100) {
                    await streamQueue.drain();
                    queueIndex = 0;
                }
                await payloadStream.emit('data', JSON.parse(JSON.stringify(payload)));
                queueIndex++;
            }
        } while (!this.isFinished(dict));
        return 1;
    }

    public isFinished(dict: any) {
        let finished = true;
        dict.forEach((element) => {
            if (element.length !== element.index)
                finished = false;
        });
        return finished;
    }

    getDependencies(service: ServiceParams, schema: any) {
        const dependencyList:{ path:string[], dependencies:{ name:string, enum:string[] }[][] } = { path: [], dependencies: [] };
        const keyArray:string[] = [];
        for (const [key, value] of Object.entries(schema['allOf'][0]['properties']) as Entries<object>)
            this.dependencySearch(value, key, keyArray, dependencyList);
        return dependencyList;
    }

    dependencySearch(value, key, keyArray, dependencyList) {
        if ('type' in value)
            if ((typeof value['type'] === 'object' && 'object' in value['type']!) || (typeof value['type'] === 'string' && value['type'].includes('object')))
                if (Object.prototype.hasOwnProperty.call(value, 'properties')) {
                    keyArray.push(key);
                    (Object.entries(value['properties']) as Entries<object>).forEach(([keyProp, valueProp]) => { this.dependencySearch(valueProp, keyProp, keyArray, dependencyList); });
                    this.dependencyCheck(value, keyArray, dependencyList, true);// check dependency for Types
                    keyArray.pop();
                }
    }

    public checkDependency(dict: any, dependencyList: object) {
        let returnFound = false;
        if (dependencyList['dependencies'].length === 0)
            returnFound = true;
        dependencyList['dependencies'].forEach((dependency) => {
            let found = true;
            dependency.forEach((field) => {
                const objIndex = dict.findIndex(((obj) => obj.name === field['name']));
                if (!((field['enum'] as any[]).includes(dict[objIndex].value)))
                    found = false;
            });
            if (found)
                returnFound = true;
        });
        return returnFound;
    }

    applyInclExclData(service: ServiceParams, fieldCounter: { name: string; index: number; length: number; value: string; path: string[]; enum: string[] }[]) {
        if (!typesInclExclData[service.serviceName])
            return null;
        (Object.entries(typesInclExclData[service.serviceName].include) as Entries<object>).forEach(([key, value]) => {
            fieldCounter.forEach((field) => {
                if (field.name === key) {
                    field.enum = value;
                    field.length = (value as any[]).length - 1;
                    field.value = (value as any[])[0];
                }
            });
        });
        (Object.entries(typesInclExclData[service.serviceName].exclude) as Entries<object>).forEach(([key, value]) => {
            fieldCounter.forEach((field) => {
                if (field.name === key) {
                    field.enum = field.enum.filter((x) => !(value as any[]).includes(x));
                    field.length = (field.enum as any[]).length - 1;
                    field.value = (field.enum as any[])[0];
                }
            });
        });
        return fieldCounter;
    }

    public async getPayloadsFromClonedMessagesLib(messageUrl: string) {
        const homeDir = os.homedir();
        const outputPaths: string[] = [];
        let updatedPaths: string[] = [];
        // URL'den dosya ismini ve yolunu dinamik olarak oluştur
        const segments = messageUrl.split('/');
        const inputFileName = segments[segments.length - 1]; // Test dosyasının ismi
        const inputDir = path.join(homeDir, 'Documents', 'GitHub', 'cbrn_api_tests', 'src', 'api', 'body', 'messageLib', 'kbrn_messages');

        const inputFilePath = path.join(inputDir, ...segments.slice(1, segments.length - 1), inputFileName); // Dizinin geri kalanını ekleyin
        const outputDir = path.join(homeDir, 'Documents', 'GitHub', 'cbrn_api_tests', 'src', 'api', 'body', 'messageLibUsed', inputFileName.split('.')[0]); // Dosya adından klasör ismi alınıyor

        // Dosyayı oku
        try {
            const fileContent = await fs.promises.readFile(inputFilePath, 'utf-8');

            // İçeriği ``` işaretleri arasındaki verileri bul
            const regex = /```([^`]*?)```/g;
            const matches = [...fileContent.matchAll(regex)];

            // Çıktı dizini oluştur
            await fs.promises.mkdir(outputDir, { recursive: true }); // Klasör yoksa oluştur

            // Her bölüm için ayrı JSON dosyası oluştur
            for (let i = 0; i < matches.length; i++) {
                const mtfFileContent = matches[i][1].trim(); // ``` arasındaki içeriği al
                const formattedMtfFile = mtfFileContent
                    .split('\n')
                    .map((line) => line.trim()) // Her satırdaki gereksiz boşlukları temizle
                    .filter((line) => line.length > 0) // Boş satırları filtrele
                    .join('\n'); // Yeniden birleştir

                // JSON nesnesini oluştur
                const jsonData = {
                    mtfFile: formattedMtfFile,
                    mainEventId: null,
                };

                const outputFilePath = path.join(outputDir, `output${i + 1}.json`); // output1.json, output2.json vb. isimler
                await fs.promises.writeFile(outputFilePath, JSON.stringify(jsonData, null, 4), 'utf-8');
                console.info(`Created: ${outputFilePath}`);
                outputPaths.push(path.join('@api', 'body', 'messageLibUsed', inputFileName.split('.')[0], `output${i + 1}.json`));
            }

            updatedPaths = outputPaths.map((path) => path.replace(/\\/g, '/'));
        } catch (error) {
            console.error('Error reading or writing files:', error);
        }
        // console.log(updatedPaths);
        return updatedPaths;
    }
}
export const payloadService = new PayloadService();
