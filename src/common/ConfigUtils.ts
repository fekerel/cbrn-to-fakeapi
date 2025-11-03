import moment from 'moment-timezone';
import CommonUtils from '@common/CommonUtils';
import TestConstants from '@common/lib/TestConstants';
import fs from 'fs';
import path from 'path';

class ConfigUtils {
    public static getTokenJsonPath() {
        return 'src/testConstants/token.json';
    }

    public static getGuestTokenJsonPath() {
        return 'src/testConstants/tokenGuest.json';
    }

    public static getTestConstantsPath() {
        return 'src/testConstants/';
    }

    public static getTestsPath() {
        return '__tests__/';
    }

    public static getAllureResultsPath() {
        return 'allure-results/';
    }

    public static getAllureReportPath() {
        return 'allure-report/';
    }

    public static generateUniqueWord(): string {
        return `${CommonUtils.API_NAME} ${moment().format('DD/MM/YYYY HH:mm')}`;
    }

    public static generateUniqueWordWithNano(): string {
        return `${CommonUtils.API_NAME}-${moment().format('YYYY-MM-DD-HH-mm-ss')}-${process.hrtime()[1]}`;
    }

    public static generateUniqueWord2(): string {
        return `${CommonUtils.API_NAME}-${moment().format('YYYY-MM-DD-HH-mm-ss-SSS')}-${Math.floor(Math.random() * 1000) + 1}`;
    }

    public static generateUniqueWord3(): string {
        return `${CommonUtils.API_NAME.toUpperCase()}-${moment().format('YYYY-MM-DD-HH-mm-ss')}-${Math.floor(Math.random() * 1000) + 1}`;
    }

    public static getNodeName() {
        const env = TestConstants.environment;
        if (env === 'DEV' || env === 'DEV2' || env === 'DEV3' || env === 'DEV4')
            return `DOOB_${TestConstants.mode.toUpperCase()}_${env}`;
        return env;
    }

    public static compareTime(dateTime1: string, dateTime2: string) { // if dateTime1 > dateTime2: 1, if dateTime1 < dateTime2: 2, else 0
        const [p1, p2] = [dateTime1.split(' '), dateTime2.split(' ')];
        const [p11, p21] = [p1[0].split('-'), p2[0].split('-')];
        const [p12, p22] = [p1[1].split(':'), p2[1].split(':')];
        const [day1, month1, year1] = [parseInt(p11[0], 10), parseInt(p11[1], 10), parseInt(p11[2], 10)];
        const [day2, month2, year2] = [parseInt(p21[0], 10), parseInt(p21[1], 10), parseInt(p21[2], 10)];
        const [hour1, minute1, second1] = [parseInt(p12[0], 10), parseInt(p12[1], 10), parseInt(p12[2].split('.')[0], 10)];
        const [hour2, minute2, second2] = [parseInt(p22[0], 10), parseInt(p22[1], 10), parseInt(p22[2].split('.')[0], 10)];
        if (year1 > year2)
            return 1;
        else if (year2 > year1)
            return 2;
        if (month1 > month2)
            return 1;
        else if (month2 > month1)
            return 2;
        if (day1 > day2)
            return 1;
        else if (day2 > day1)
            return 2;
        if (hour1 > hour2)
            return 1;
        else if (hour2 > hour1)
            return 2;
        if (minute1 > minute2)
            return 1;
        else if (minute2 > minute1)
            return 2;
        if (second1 > second2)
            return 1;
        else if (second2 > second1)
            return 2;
        return 0;
    }

    public static getAllJsonFiles(dirPath: string, arrayOfFiles: Set<string> = new Set()): string[] {
        const files = fs.readdirSync(dirPath);
        files.forEach((file) => {
            const fullPath = path.join(dirPath, file);
            if (fs.statSync(fullPath).isDirectory())
                ConfigUtils.getAllJsonFiles(fullPath, arrayOfFiles);
            else if (path.extname(file) === '.json')
                arrayOfFiles.add(fullPath);
        });
        return Array.from(arrayOfFiles);
    }
}
export default ConfigUtils;
