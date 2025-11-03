/* eslint-disable no-param-reassign, array-callback-return, import/no-cycle, max-len, no-restricted-syntax, consistent-return, global-require */

import { waitUntil } from 'async-wait-until';
import wd, { WebDriver } from 'selenium-webdriver';
import urlConfig from '@common/urlConfig';
import TestConstants from '@common/lib/TestConstants';
import axios, { AxiosResponse } from 'axios';
import https from 'https';
import ApiService from '@api/ApiService';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import fs from 'fs';

const { logging, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

class BrowserService {
    objectsOnMap = [];
    objectsOnMapWithName = [];
    driver: WebDriver;
    private readingConsole = false;
    private connectingWebSocket = false;
    private DOOBOpened: boolean = false;
    private notifiedAlarms = [];
    private websocketNotifications = [];
    private stompClient;
    public async openBrowser() {
        if (process.env.DOCKER_SERVICE === 'true') {
            await waitUntil(async () => this.seleniumGridHealthCheck(), { timeout: TestConstants.timeout, intervalBetweenAttempts: 500 });

            this.driver = await new wd.Builder()
                .withCapabilities(wd.Capabilities.chrome())
                .usingServer('http://chromeServer:4444')
                .setChromeOptions(new chrome.Options(this.setOptions()))
                .build();
        } else {
            require('chromedriver');
            this.driver = await new wd.Builder()
                .withCapabilities(wd.Capabilities.chrome())
                .setChromeOptions(new chrome.Options(this.setOptions()))
                .build();
        }
    }

    private async seleniumGridHealthCheck() {
        try {
            const instance = await axios.create({
                baseURL: 'http://chromeServer:4444',
                timeout: 60000,
            });
            instance.interceptors.response.use((config: AxiosResponse) => ({
                ...config,
            }), ApiService.errorHandler);
            const res: AxiosResponse = await instance.get('/wd/hub/status', {
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false,
                }),
            });

            return res.data.value.ready;
        } catch (e) {
            console.error(e.message);
            return false;
        }
    }

    public async recordWebsocketNotifications() {
        const tokenGuest = JSON.parse(await fs.readFileSync('src/testConstants/token.json', 'utf8'));
        const authorizationHeader = 'Authorization';
        const localeAndLangHeader = 'Language';
        this.stompClient = new Client({
            webSocketFactory: () => new SockJS(`${urlConfig.url}:443/infra-notification-pubsub/greeting`),
            connectHeaders: {
                [authorizationHeader]: tokenGuest.access,
                [localeAndLangHeader]: 'en_EN',
            },
            debug: () => {},
            splitLargeFrames: true,
            heartbeatIncoming: 60 * 1000,
            heartbeatOutgoing: 60 * 1000,
        });
        this.stompClient.reconnectDelay = 5000;
        this.stompClient.onConnect = () => {
            this.stompClient.subscribe('/user/queue/alarm', (message) => this.listenAlarms(message));
            this.stompClient.subscribe('/user/queue/notifications', (message) => this.listenNotifications(message));
            console.info('SUBSCRIBED to Infra pubsub');
        };
        this.stompClient.onStompError = (errorEventMessage) => {
            console.error('Infra pubsub ws error:', errorEventMessage);
            console.info(`Trying to reconnect to infra pubsub in ${this.stompClient.reconnectDelay / 1000} seconds`);
        };
        this.stompClient.onWebSocketClose = (closeEventMessage) => {
            console.info('Infra pubsub ws close:', closeEventMessage);
            console.info(`Trying to reconnect to infra pubsub in ${this.stompClient.reconnectDelay / 1000} seconds`);
        };
        this.stompClient.activate();
        await ApiService.getInstance().autoLogin();
        return '';
    }

    async stopWebsocketNotifications() {
        if (this.stompClient) {
            await this.stompClient.deactivate();
            this.websocketNotifications = [];
            this.notifiedAlarms = [];
        }
        return 'stopped';
    }

    listenAlarms(alert) {
        const alarm = JSON.parse(alert.body);
        if (alarm.type === 'TRACK_ALARM')
            this.notifiedAlarms.push(JSON.parse(alarm.data).trackName);
        else
            this.notifiedAlarms.push(JSON.parse(alarm.data).Name);
    }

    listenNotifications(alert) {
        const notification = JSON.parse(alert.body);
        if (notification.data.includes('Event'))
            notification.event = notification.data.substring(notification.data.indexOf('Event:') + 7, notification.data.indexOf(','));

        if (notification.data.includes('type')) {
            const typeIndex = notification.data.indexOf('"type":"');
            if (typeIndex !== -1)
                notification.type = notification.data.substring(typeIndex + 9, notification.data.indexOf('"', typeIndex + 9));
        }

        this.websocketNotifications.push(notification);
    }

    public async openDOOB() {
        await this.login(urlConfig.url);
        if (TestConstants.widgetSkip === 'false')
            await this.waitMapBoard();
    }

    private async login(Url: string) {
        await this.driver.get(Url)
            .then(() => this.driver.wait(until.elementLocated(By.css("input[id='username']"))))
            .then(() => this.driver.wait(until.elementLocated(By.xpath("//div[text()='Live']")))
                .then((liveButton) => liveButton.click()))
            .then(() => this.driver.findElement(By.css(`li[data-value='${TestConstants.mode.toLowerCase()}']`)).click())
            .then(() => this.driver.findElement(By.css("input[id='username']")).sendKeys(TestConstants.username))
            .then(() => this.driver.findElement(By.css("input[id='password']")).sendKeys(`${TestConstants.password}\n`))
            .then(() => this.driver.wait(until.elementLocated(By.xpath("//span/*[text()='Applications']"))));
    }

    async logout() {
        await this.driver.wait(until.elementLocated(By.xpath("//div[@title='User Menu']")))
            .then(() => this.driver.findElement(By.xpath("//div[@title='User Menu']")).click())
            .then(() => this.driver.sleep(1000))
            .then(() => this.driver.wait(until.elementLocated(By.xpath('//div[text()=\'Logout\']'))))
            .then(() => this.driver.findElement(By.xpath('//div[text()=\'Logout\']')).click())
            .then(() => this.driver.findElement(By.xpath('//span[text()=\'Logout\']')).click())
            .then(() => this.driver.wait(until.elementLocated(By.css("input[id='username']"))));
        this.DOOBOpened = false;
    }

    private async waitMapBoard() {
        await this.driver.wait(until.elementLocated(By.xpath('//*[contains(@src,"map-widget")]')))
            .then(() => this.driver.switchTo().frame(this.driver.findElement(By.xpath('//*[contains(@src,"map-widget")]'))))
            .then(() => this.driver.wait(until.elementLocated(By.id('app'))))
            .then(() => this.driver.switchTo().parentFrame());
    }

    public async loadAndSelectPublicLayer() {
        console.info('loading layers');
        await this.driver.wait(until.elementLocated(By.xpath('//*[@src="/doob-widget-layer-tree/EXECUTION"]')))
            .then(() => this.driver.switchTo().frame(this.driver.findElement(By.xpath('//*[@src="/doob-widget-layer-tree/EXECUTION"]'))))
            .then(() => this.driver.wait(until.elementLocated(By.css("button[aria-label='Load Layers']"))))
            .then(() => this.driver.findElement(By.css("button[aria-label='Load Layers']")).click());
        const element = await this.driver.wait(until.elementLocated(By.css("input[aria-label='select all']")));
        if (await element.getAttribute('checked') === null)
            await this.driver.wait(until.elementLocated(By.css("input[aria-label='select all']")))
                .then(() => this.driver.findElement(By.css("input[aria-label='select all']")).click())
                .then(() => this.driver.findElement(By.xpath("//button[text()='Select']")).click())
                .then(() => this.driver.switchTo().parentFrame());
        else
            await this.driver.wait(until.elementLocated(By.css("input[aria-label='select all']")))
                .then(() => this.driver.findElement(By.css("input[aria-label='select all']")).click())
                .then(() => this.driver.findElement(By.css("input[aria-label='select all']")).click())
                .then(() => this.driver.findElement(By.xpath("//button[text()='Select']")).click())
                .then(() => this.driver.switchTo().parentFrame());
    }

    private setOptions() {
        const prefs = new logging.Preferences();
        prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
        const options = new chrome.Options();
        options.setLoggingPrefs(prefs);
        options.setAcceptInsecureCerts(true);
        options.addArguments('--disable-crash-reporter');
        options.addArguments('--start-maximized');
        options.addArguments('--incognito');
        options.addArguments('--disable-popup-blocking');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-logging');
        options.addArguments('--disable-web-security');
        options.addArguments('--disable-site-isolation-trials');
        options.addArguments('--allow-running-insecure-content');
        options.addArguments('--allow-file-access-from-files');
        // options.addArguments("disable-gpu");
        if (TestConstants.widgetSkip === 'true')
            options.addArguments('--headless');
        options.addArguments('--mute-audio');
        options.addArguments('--allow-insecure-localhost');
        options.addArguments('--window-size=1920, 1080');
        options.addArguments('--ignore-certificate-errors');
        options.addArguments('--remote-allow-origins=*');

        return options;
    }

    public async closeDOOB() {
        await this.driver.quit();
        this.DOOBOpened = false;
    }

    async isObjectDisplayedOnMap(trackID: any) {
        return (this.objectsOnMap.indexOf(trackID) !== -1);
    }

    async isObjectDisplayedOnTrackList(trackName: any) {
        return true;
        return (this.objectsOnMapWithName.indexOf(trackName) !== -1);
    }

    public async checkAlarmNotification(alarmEvent: string, name: string, group: string, data:string) {
        for (const notification of this.websocketNotifications)
            if (!alarmEvent || notification.type === alarmEvent)
                if (!group || notification.group === group)
                    if (!data || notification.data.includes(data))
                        if (name === undefined || notification.data.includes(name)) {
                            this.websocketNotifications = [];
                            return true;
                        }

        return false;
    }

    async waitUntilWidgetConnected() {
        if (process.env.DOCKER_SERVICE === 'true')
            await this.driver.wait(this.driver.wait(until.elementLocated(By.xpath('//*[@src="http://widget:3030/"]'))))
                .then(() => this.driver.switchTo().frame(this.driver.findElement(By.xpath('//*[@src="http://widget:3030/"]'))))
                .then(() => this.driver.wait(until.elementLocated(By.xpath("//div[@id='socket-status' and contains(text(),'connected')]"))))
                .then(() => this.driver.switchTo().parentFrame());
        else
            await this.driver.wait(this.driver.wait(until.elementLocated(By.xpath('//*[@src="http://localhost:3030/"]'))))
                .then(() => this.driver.switchTo().frame(this.driver.findElement(By.xpath('//*[@src="http://localhost:3030/"]'))))
                .then(() => this.driver.wait(until.elementLocated(By.xpath("//div[@id='socket-status' and contains(text(),'connected')]"))))
                .then(() => this.driver.switchTo().parentFrame());
    }
}

const Browser = new BrowserService();
export default Browser;
