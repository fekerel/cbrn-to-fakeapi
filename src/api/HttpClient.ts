/* eslint-disable no-param-reassign, array-callback-return, @typescript-eslint/indent, @typescript-eslint/no-unused-vars, function-paren-newline, space-in-parens, indent, no-promise-executor-return */

import https from 'https';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpClientParameters, RequestInterceptor } from '@common/Types';
import TestConstants from '@common/lib/TestConstants';
import moment from 'moment-timezone';
import SuiteEnum from '@common/enum/SuiteEnum';
import { userInfo } from 'os';
import tokenJSON from '@testConstants/token.json';

// const util = require('util');
const agent = new https.Agent({
    rejectUnauthorized: false,
});
abstract class HttpClient {
    private _instance: AxiosInstance;
    private _helperServer: AxiosInstance;
    private _secondInstance: AxiosInstance;
    private _widgetInstance: AxiosInstance;
    static log = '';

    private interceptorRequest: number | undefined;
    private interceptorResponse: number | undefined;
    private interceptorRequestSecond: number | undefined;
    private interceptorResponseSecond: number | undefined;
    protected constructor(param: HttpClientParameters) {
        const { baseURL, token, timeout } = param;

        this._instance = axios.create({
            baseURL,
            timeout: timeout || 60000,
        });
        this._helperServer = axios.create({
            baseURL: 'http://localhost:3000',
            timeout: timeout || 60000,
        });
        this._helperServer.interceptors.response.use((config: AxiosResponse) => ({
            ...config,
        }), (error) => HttpClient.errorHandler(error, this._instance));

        if (TestConstants.suite === SuiteEnum.DATACREATION)
            this.initializeRequestInterceptor({ token });
         else
            this.initializeRequestInterceptor({ token });

        this.initializeResponseInterceptor();

        try {
            this._secondInstance = axios.create({
                baseURL: baseURL.replace(TestConstants.environment.toLowerCase(), TestConstants.syncEnv.toLowerCase()),
                timeout: timeout || 60000,
            });
            this.initializeSecondRequestInterceptor({ token });
            this.initializeSecondResponseInterceptor();
        } catch (e) {
            console.info('second axios instance cannot created. Synchronization tests will be failed');
        }
        try {
            this._widgetInstance = axios.create({
                baseURL: `http://localhost:${TestConstants.widgetPort}`,
                timeout: timeout || 60000,
            });
            this._widgetInstance.interceptors.response.use((config: AxiosResponse) => ({
                ...config,
            }), (error) => HttpClient.errorHandler(error, this._widgetInstance));
        } catch (e) {
            console.info('widget instance cannot created. ');
        }
    }

    get instance(): AxiosInstance {
        return this._instance;
    }

    set instance(value: AxiosInstance) {
        this._instance = value;
    }

    get helperServer(): AxiosInstance {
        return this._helperServer;
    }

    get secondInstance(): AxiosInstance {
        return this._secondInstance;
    }

    get widgetInstance(): AxiosInstance {
        return this._widgetInstance;
    }

    public initializeRequestInterceptor = (param: RequestInterceptor) => {
        if (this.interceptorRequest != null)
            this._instance.interceptors.request.eject(this.interceptorRequest);

        // @ts-ignore
        this.interceptorRequest = this._instance.interceptors.request.use( (config:AxiosRequestConfig) => HttpClient.requestConfig(config, param),
            (error:any) => {
                console.info(`request interceptors${error}`);
                return Promise.reject(error);
            },
        );
        return this;
    };

    public initializeSecondRequestInterceptor = (param: RequestInterceptor) => {
        if (this.interceptorRequestSecond != null)
            this._secondInstance.interceptors.request.eject(this.interceptorRequestSecond);

        // @ts-ignore
        this.interceptorRequestSecond = this._secondInstance.interceptors.request.use((config:AxiosRequestConfig) => HttpClient.requestConfig(config, param));
        return this;
    };

    private initializeResponseInterceptor = () => {
        if (this.interceptorResponse != null)
            this._instance.interceptors.response.eject(this.interceptorResponse);

        this.interceptorResponse = this._instance.interceptors.response.use((config: AxiosResponse) => ({
            ...config,
        }), (error) => HttpClient.errorHandler(error, this._instance));
    };

    private initializeSecondResponseInterceptor = () => {
        if (this.interceptorResponseSecond != null)
            this._secondInstance.interceptors.response.eject(this.interceptorResponseSecond);

        this.interceptorResponseSecond = this._secondInstance.interceptors.response.use((config: AxiosResponse) => ({
            ...config,
        }), (error) => HttpClient.errorHandler(error, this._secondInstance));
    };

    public static async errorHandler(error?, instance?:AxiosInstance) {
        // console.log(require("util").inspect(error, { showHidden: false, depth: null, colors: true }));
        if (error.response && (error.response.status === 503 || error.response.status === 502)) {
            console.info(`${error.config.url} 503`);
            await new Promise((resolve) => setTimeout(resolve, 5000));
            return new Promise((resolve) => {
                resolve(instance(error.config));
            });
        }
        let errStr = '';
        if (error.message)
            errStr += error.message;

        errStr += `\nHTTP error on ${error.config.baseURL}${error.config.url} `;

        if (error.response)
            if (typeof error.response.data === 'object')
                errStr += ` ${error.response.status} ${JSON.stringify(error.response.data)}`;
            else
                errStr += ` ${error.response.status} ${error.response.data}`;

        if (error.config.data)
            if (typeof error.config.data === 'object')
                errStr += `\nPayload: ${JSON.stringify(error.config.data)}`;
            else
                errStr += `\nPayload: ${error.config.data}`;
        return Promise.reject(new Error(errStr));

       // throw new Error(errStr);
    }

    public static async requestConfig(config, param: RequestInterceptor) {
        HttpClient.log += `${moment().format('YYYY_MM_DD_HH_mm_ss')}_${process.hrtime()[1]}: ${config.baseURL}${config.url} ${config.method}\n`;
        if (config.data)
            if (typeof config.data === 'object')
                HttpClient.log += `${JSON.stringify(config.data)}\n`;
            else
                HttpClient.log += `${config.data}\n`;

        const configuration = config;
        if (param.token) // @ts-ignore
            if (TestConstants.suite === SuiteEnum.DATACREATION)
                configuration.headers = {
                ...config.headers,
                Authorization: `Bearer ${param.token}`,
                Systemmode: TestConstants.mode,
            };
 else
                configuration.headers = {
                ...config.headers,
                Authorization: `Bearer ${param.token}`,
                Systemmode: TestConstants.mode,
                username: tokenJSON.username,
            };

        configuration.httpsAgent = agent;
        return configuration;
    }

    static async delay() {
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }
}

export default HttpClient;
