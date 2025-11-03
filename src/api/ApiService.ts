/* eslint-disable no-param-reassign, array-callback-return, import/no-cycle, max-len, no-restricted-syntax, consistent-return */

import { writeFileSync } from 'fs';
import * as fs from 'fs';
import moment from 'moment-timezone';
import { AxiosResponse } from 'axios';
import { ApiServiceParams, ParamsData, ServiceParams } from '@common/Types';
import urlConfig from '@common/urlConfig';
import ConfigUtils from '@common/ConfigUtils';
import TestConstants from '@common/lib/TestConstants';

import HttpClient from '@api/HttpClient';
import tokenJSON from '@testConstants/token.json';
import tokenGuestJSON from '@testConstants/tokenGuest.json';
import defaultUserJSON from '@testConstants/defaultUser.json';
import CommonUtils from '@common/CommonUtils';
import SuiteEnum from '@common/enum/SuiteEnum';

const crypto = require('crypto');
const FormData = require('form-data');
const lodash = require('lodash');
const base64url = require('base64url');
const services:ServiceParams[] = require('@misc/JSONdata/services');

class ApiService extends HttpClient {
    private static classInstance: ApiService;

    public constructor(params?: ApiServiceParams) {
        super({
            baseURL: urlConfig.url,
            token: params?.token,
        });
    }

    public static getInstance(params?: ApiServiceParams) {
        if (!ApiService.classInstance)
            ApiService.classInstance = new ApiService(params);

        return this.classInstance;
    }

    public static generateUniqueWord(): string {
        return `${CommonUtils.API_NAME}-${moment().format('YYYY-MM-DD-HH-mm-ss-SSS')}`;
    }

    public static getService(serviceName: string): ServiceParams {
        return services.find((service) => service.serviceName === serviceName);
    }

    public async autoLoginForGuestUser(userName?: string, password?: string, mode?: string) {
        const data: ParamsData = {
            username: userName || TestConstants.username,
            password: password || TestConstants.password,
            mode: mode || TestConstants.mode,
        };

        let loggedIn:boolean = false;
        let times:number = 0;
        try {
            while (!loggedIn && times < 3) {
                let status:string = '';
                try {
                    status = await this.loginWithNewToken(data, true);
                } catch (error) {
                    if (error.message.includes('404'))
                        await this.createTestUser(data);
                    else if (error.message.includes('401'))
                        status = await this.loginWithNewToken(data, true);
                    else
                        console.error(error.message);
                }
                loggedIn = status === '200';
                times++;
            }
        } catch (e) {
            console.error(e.message);
        }

        if (!loggedIn)
            throw new Error("Couldn't login");

        return ApiService.classInstance;
    }

    public async autoLogin(userName?: string, password?: string, mode?: string) {
        const data: ParamsData = {
            username: userName || TestConstants.username,
            password: password || TestConstants.password,
            mode: mode || TestConstants.mode,
            attributes : {"mode":"live","captchaAnswer":"","loginOption":"default","domain":"local"},
            clientId : "hap"
        };

        let loggedIn:boolean = false;
        let times:number = 0;
        try {
            while (!loggedIn && times < 3) {
                let status:string = '';
                try {
                    if (tokenJSON.url !== urlConfig.url || tokenJSON.username !== data.username || tokenJSON.attributes.mode !== data.mode) {
                        status = await this.loginWithNewToken(data);
                    } else {
                        status = '401';// disabled loginWithExistingToken
                        if (status.includes('401'))
                            status = await this.loginWithNewToken(data);

                        if (status === undefined)
                            console.info('loginWithExistingCode undefined durumu');
                    }
                } catch (error) {
                    if (error.message.includes('404') || error.message.includes('400')) {
                        await this.createTestUser(data, true);
                    } else if (error.message.includes('423')) {
                        const newUsername = await this.changeTestUserParams();
                        console.info(`autoLogin olmadı dene- ${newUsername}`);
                        await this.autoLogin(userName = newUsername);
                        return ApiService.classInstance;
                    } else if (error.message.includes('401')) {
                        status = await this.loginWithNewToken(data);
                    } else { console.error(error.message); }
                }
                loggedIn = status === '200';
                times++;
            }
        } catch (e) {
            console.error(e.message);
        }
        if (!loggedIn)
            throw new Error("Couldn't login");

        return ApiService.classInstance;
    }

    public async loginWithExistingToken() {
        try {
            const token = tokenJSON.access;
            if (TestConstants.suite === SuiteEnum.DATACREATION)
                this.initializeRequestInterceptor({ token });
            else
                this.initializeRequestInterceptor({ token });
            // tokensiz 401
            const response: AxiosResponse = await this.instance.get('/kapi/rest/users/current/delegated');
            return response.status.toString();
        } catch (error) {
            console.error(`${error.message} loginWithExistingToken`);
            return 1;
        }
    }

    public async loginWithNewToken(data: ParamsData, isGuest?: boolean): Promise<string> {
        const codeVerifier = base64url(crypto.pseudoRandomBytes(32));
        const codeChallenge = base64url.encode(crypto.createHash('sha256').update(codeVerifier).digest());
        const state = crypto.randomBytes(16).toString('hex');
        let response: AxiosResponse = await this.instance.get(`/auth/oauth2/auth?client_id=hap&code_challenge_method=S256&redirect_uri=${urlConfig.url}/hap/authentication-callback&response_mode=query&response_type=code&scope=openid&state=${state}&code_challenge=${codeChallenge}`, { maxRedirects: 0, validateStatus() { return true; } });
        let cookies = response.headers['set-cookie'];
        if (TestConstants.suite === SuiteEnum.DATACREATION)
            // console.log('dataaa2222');
            this.initializeRequestInterceptor({});
        else
            this.initializeRequestInterceptor({});

        let url = lodash.split(lodash.split(response.data, 'href="', 2)[1], '">', 2)[0];
        response = await this.instance.get(url);
        url = response.request.path;
        const loginPayload = {
            username: data.username,
            password: data.password,
            clientUri: `${urlConfig.url}/hap/`,
            attributes: data.attributes,
            clientId : data.clientId

        };
        const loginChallenge = `/infra-authn/auth/api/login/${lodash.split(lodash.split(url, '&client_uri', 2)[0], 'login_challenge=', 2)[1]}`;
        response = await this.instance.post(loginChallenge, JSON.stringify(loginPayload), { headers: { 'Content-Type': 'application/json' } });
        response = await this.instance.get(response.data.url, {
            headers: { Cookie: cookies },
            maxRedirects: 0,
            validateStatus() {
                return true;
            },
        });
        cookies = response.headers['set-cookie'];
        url = lodash.split(lodash.split(response.data, 'href="', 2)[1], '">', 2)[0];
        const consentChallenge = url.split('consent_challenge=')[1];
        response = await this.instance.get(`/infra-authn/auth/api/consentExternal?consent_challenge=${consentChallenge}`, { maxRedirects: 0, validateStatus() { return true; }, headers: { Cookie: cookies } });
        response = await this.instance.get(response.data.url, { maxRedirects: 0, validateStatus() { return true; }, headers: { Cookie: cookies } });
        const consentCode = lodash.split(lodash.split(response.headers.location, '&')[0], 'code=')[1];
        response = await this.instance.get(url, { headers: { Cookie: cookies } });
        // const code = lodash.split(lodash.split(lodash.split(response.request.path, 'authentication-callback?', 2)[1], '&', 3).find((param:any) => param.includes('code')), 'code=', 2)[1];
        const bodyFormData = new FormData();
        bodyFormData.append('client_id', 'hap');
        bodyFormData.append('code', consentCode);
        bodyFormData.append('redirect_uri', `${urlConfig.url}/hap/authentication-callback`);
        bodyFormData.append('code_verifier', codeVerifier);
        bodyFormData.append('grant_type', 'authorization_code');
        response = await this.instance.post(`${urlConfig.url}/auth/oauth2/token`, bodyFormData, { headers: { Cookie: cookies, 'Content-Type': 'multipart/form-data' } });
        const token = response.data.access_token;
        const idToken = response.data.id_token;
        if (TestConstants.suite === SuiteEnum.DATACREATION)
            this.initializeRequestInterceptor({ token });
        else
            this.initializeRequestInterceptor({ token });

        response = await this.instance.get('/infra-authn/rest/users');
        const currentUser = response.data.find((el) => el.username === data.username);

        const tokenData = {
            access: token,
            id: idToken,
            userID: currentUser.id,
            username: data.username,
            attributes: data.attributes,
            clientId: data.clientId,
            url: urlConfig.url,
        };
        if (!isGuest) {
            tokenJSON.access = token;
            tokenJSON.username = tokenData.username;
            tokenJSON.userID = tokenData.userID;
            //tokenJSON.attributes = tokenData.attributes;
            //tokenJSON.clientId = tokenData.clientId;
            tokenJSON.url = tokenData.url;
            writeFileSync(ConfigUtils.getTokenJsonPath(), JSON.stringify(tokenData), { flag: 'w' });
        } else {
            tokenGuestJSON.access = token;
            tokenGuestJSON.username = tokenData.username;
            tokenGuestJSON.userID = tokenData.userID;
            //tokenJSON.attributes = tokenData.attributes;
            //tokenJSON.clientId = tokenData.clientId;
            tokenGuestJSON.url = tokenData.url;
            writeFileSync(ConfigUtils.getGuestTokenJsonPath(), JSON.stringify(tokenData), { flag: 'w' });
        }
        return response.status.toString();
    }

    public async createTestUser(data: ParamsData, firstTime?:boolean) {
        for (const mode of ['live']) { // TODO NATIVE mode ekle
            if (firstTime)
                await this.loginWithKapiAdmin(mode);
            const roleAll = await this.createRoleWithAllPerms();
            const userPayload = {
                name: `apitest${TestConstants.environment}`,
                surname: 'apitest',
                username: data.username,
                password: data.password,
                userState: 'ENABLED',
                email: 'abc@havelsan.com.tr',
                customFields: {
                    phoneNumber: '111111111',
                    faxNumber: '',
                    title: '',
                },
            };

            const response = await ApiService.getInstance().instance.post('/infra-authn/rest/users', userPayload);
            const userID = response.data.id;
            await ApiService.getInstance().instance.patch(`/infra-authz/rest/users/${userID}/roles`, { rolesToAdd: [roleAll], rolesToRemove: [] });
        }
    }

    private async loginWithKapiAdmin(mode: string) {
        const kapiAdminData: ParamsData = {
            username: defaultUserJSON.username,
            password: defaultUserJSON.password,
            clientId: defaultUserJSON.clientId,
            attributes: defaultUserJSON.attributes

        };
        console.warn(`Creating new automation user. Default user: ${kapiAdminData.username}\nIf default user is incorrect stop the execution and change the default user in src/testConstants/defaultUser.json`);
        await this.loginWithNewToken(kapiAdminData, true);
    }

    private async createRoleWithAllPerms() {
        let res = await ApiService.getInstance().instance.get('/infra-authz/rest/roles');
        let roleAll = res.data.find((element) => element.name === 'ApiTestAll');
        if (roleAll === undefined) {
            res = await ApiService.getInstance().instance.get('/infra-authz/rest/permissions');
            const allPermissions = res.data;
            const rolePayload = {
                name: 'ApiTestAll',
                description: 'ApiTestAll',
                permissions: allPermissions,
            };
            await ApiService.getInstance().instance.post('/infra-authz/rest/roles', rolePayload);
            res = await ApiService.getInstance().instance.get('/infra-authz/rest/roles');
            roleAll = res.data.find((element) => element.name === 'ApiTestAll');
        }
        return roleAll;
    }

    public async changeTestUserParams() {
        const data = {
            userName: `${TestConstants.username.substring(0, TestConstants.username.lastIndexOf('_'))}_${Math.floor(Math.random() * CommonUtils.USER_RANDOM_RANGE)}`,
            password: TestConstants.password,
            mode: TestConstants.mode,
        };
        await fs.writeFileSync(`${ConfigUtils.getTestConstantsPath()}${TestConstants.environment.toLowerCase()}.json`, JSON.stringify(data));
        return data.userName;
    }

    // public async autoLoginSecondEnvironment() {
    //     const data: ParamsData = {
    //         userName: TestConstants.syncUserName,
    //         password: TestConstants.syncPassword,
    //         mode: TestConstants.mode,
    //     };
    //     let loggedIn:boolean = false;
    //     let times:number = 0;
    //     while (!loggedIn && times < 3) {
    //         let status:string = '';
    //         try {
    //             status = await this.loginWithNewTokenSecondEnvironment(data);
    //         } catch (error) {
    //             console.error(error.message);
    //         }
    //         loggedIn = status === '200';
    //         times++;
    //     }

    //     if (!loggedIn)
    //         throw new Error("Couldn't login on second environment");

    //     return ApiService.classInstance;
    // }

    // private async loginWithNewTokenSecondEnvironment(data: ParamsData): Promise<string> {
    //     const codeVerifier = base64url(crypto.pseudoRandomBytes(32));
    //     const codeChallenge = base64url.encode(crypto.createHash('sha256').update(codeVerifier).digest());
    //     const state = crypto.randomBytes(16).toString('hex');
    //     let response: AxiosResponse = await this.secondInstance.get(`/auth/oauth2/auth?client_id=hap&code_challenge_method=S256&redirect_uri=${urlConfig.secondUrl}/hap/authentication-callback&response_mode=query&response_type=code&scope=openid offline_access&state=${state}&code_challenge=${codeChallenge}`, { maxRedirects: 0, validateStatus() { return true; } });
    //     let cookies = response.headers['set-cookie'];
    //     this.initializeSecondRequestInterceptor({});
    //     let url = lodash.split(lodash.split(response.data, 'href="', 2)[1], '">', 2)[0];
    //     response = await this.secondInstance.get(url);
    //     url = response.request.path;
    //     const loginPayload = {
    //         username: data.userName,
    //         password: data.password,
    //         clientUri: `${urlConfig.secondUrl}/hap/`,
    //         attributes: { mode: data.mode },
    //     };
    //     const loginChallenge = `/kapi/auth/api/login/${lodash.split(lodash.split(url, '&client_uri', 2)[0], 'login_challenge=', 2)[1]}`;
    //     response = await this.secondInstance.post(loginChallenge, JSON.stringify(loginPayload), { headers: { 'Content-Type': 'application/json' } });
    //     response = await this.secondInstance.get(response.data.url, {
    //         headers: { Cookie: cookies },
    //         maxRedirects: 0,
    //         validateStatus() {
    //             return true;
    //         },
    //     });
    //     cookies = response.headers['set-cookie'];
    //     url = lodash.split(lodash.split(response.data, 'href="', 2)[1], '">', 2)[0];
    //     response = await this.secondInstance.get(url, { headers: { Cookie: cookies } });
    //     const code = lodash.split(lodash.split(lodash.split(response.request.path, 'authentication-callback?', 2)[1], '&', 3).find((param:any) => param.includes('code')), 'code=', 2)[1];
    //     const bodyFormData = new FormData();
    //     bodyFormData.append('client_id', 'hap');
    //     bodyFormData.append('code', code);
    //     bodyFormData.append('redirect_uri', `${urlConfig.secondUrl}/hap/authentication-callback`);
    //     bodyFormData.append('code_verifier', codeVerifier);
    //     bodyFormData.append('grant_type', 'authorization_code');
    //     response = await this.secondInstance.post(`${urlConfig.secondUrl}/auth/oauth2/token`, bodyFormData, { headers: { Cookie: cookies, 'Content-Type': 'multipart/form-data' } });
    //     const token = response.data.access_token;

    //     this.initializeSecondRequestInterceptor({ token });
    //     response = await this.secondInstance.get('/kapi/rest/users/current/delegated');

    //     return response.status.toString();
    // }
}
export default ApiService;
