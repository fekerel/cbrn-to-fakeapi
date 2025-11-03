/* eslint-disable no-param-reassign, array-callback-return, import/no-cycle, max-len, no-restricted-syntax, consistent-return, no-prototype-builtins, no-promise-executor-return */

import * as fs from 'fs';
import * as path from 'path';
import https from 'https';
import axios, { AxiosResponse } from 'axios';
import { waitUntil } from 'async-wait-until';
import TestConstants from '@common/lib/TestConstants';
import ConfigUtils from '@common/ConfigUtils';
import { ServiceParams } from '@common/Types';
import ApiService from '@api/ApiService';
import SuiteEnum from '@common/enum/SuiteEnum';
import Cli from '@common/lib/Cli';
import { jiraService } from '@api/JiraService';
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';
import { exit } from 'process';

const mattermostBody = require('@misc/JSONdata/MattermostRequest');

const childProcess = require('child_process');
const fse = require('fs-extra');
const MochaTest = require('mocha');
const services:ServiceParams[] = require('@misc/JSONdata/services');
const mochaHooks = require('@common/lib/MochaHooks').mochaHooks;

const testName = ConfigUtils.generateUniqueWord();
class Runner {
    public static RunAsync = async () => this.runMocha();

    private static async runMocha() {
        await this.onPrepare();

        const mocha = new MochaTest({
            reporter: 'spec',
            slow: 2000,
            require: ['@common/lib/MochaHooks', 'mochawesome/register'],
            timeout: TestConstants.timeout * 2,
            jobs: 10,
            parallel: TestConstants.parallel === 'true',
        });
        this.setReporter(mocha, TestConstants.reporter!);
        TestConstants.environment = TestConstants.environment || 'SEL';
        this.setTests(mocha, ConfigUtils.getTestsPath() + TestConstants.suite);
        mocha.parallelMode(TestConstants.parallel === 'true');
        this.setGrep(mocha);
        mocha.rootHooks(mochaHooks);
        const runnerObject = await mocha.run(async () => {
            if (TestConstants.reporter === 'allure' && TestConstants.parallel === 'false')
                await this.createHistory();
            try {
                await this.onComplete();
            } catch (e) {
                console.error("Couldn't finish onComplete but finishing automation. Test data not deleted successfully");
                if (Cli.get('jobID') !== undefined)
                    await this.sendMattermostReport();
            }
            process.exit(0);
        });
        runnerObject.on('test end', (currentTest) => { // TODO describe.skip ve before skip dene
            jiraService.addMochaResult({ status: currentTest.state });
            if (currentTest.body.includes('Test Link'))
                jiraService.checkIfTestLinked({ title: currentTest.title, status: currentTest.state, body: currentTest.body });
        });
        return 1;
    }

    public static deleteFiles(mainPath){
        const fileType: string[] = ["BIO","CHEM","METEO","NUC","PreWarning","RAD"]
        fileType.forEach(_path => {
            const filePath = path.join(mainPath,_path);  
            const files =  fs.readdirSync(filePath)
            files.forEach(file => {
                fs.unlink(path.join(filePath,file), (err) => {
                    if (err) throw err;
                });                  
            });   
        });
    }


    private static async onPrepare() {
        const execPromise = promisify(exec);
        console.info('onPrepare');

        const homeDir = os.homedir();
        // this.deleteFiles(path.resolve(__dirname,'../api/body/awareness/importUsed2'));
        // this.deleteFiles(path.resolve(__dirname,'../api/body/awareness/importUsed2_JSON'));

        // // Dinamik olarak clone dizini
        // const cloneDir = path.join(
        //     homeDir,
        //     'Documents',
        //     'GitHub',
        //     'cbrn_api_tests',
        //     'src',
        //     'api',
        //     'body',
        //     'messageLib',
        //     'kbrn_messages',
        // );

        // const repoUrl = 'https://gobitbucket.havelsan.com.tr/scm/kbrndeployment/kbrn_messages.git';

        // if (!fs.existsSync(cloneDir)) {
        //     console.info(`Cloning repository from ${repoUrl} into ${cloneDir}`);
        //     try {
        //         await execPromise(`git clone ${repoUrl} "${cloneDir}"`);
        //         console.info(`Repository cloned successfully to ${cloneDir}`);
        //     } catch (error) {
        //         console.error('Error cloning repository:', error);
        //     }
        // } else {
        //     console.info(`Repository already cloned at ${cloneDir}`);
        //     try {
        //         console.info(`Updating repository at ${cloneDir}`);
        //         await execPromise(`git -C "${cloneDir}" pull`);
        //         console.info('Repository updated successfully.');
        //     } catch (error) {
        //         console.error('Error updating repository:', error);
        //     }
        // }

        // const importMessagePath = path.resolve(__dirname,'../api/body/awareness/importUsed2')
        // const importMessagePathJSON = path.resolve(__dirname,'../api/body/awareness/importUsed2_JSON')


        // const messageType: string[] = [
        //     "chemical-messages",
        //     "biological-messages",
        //     "nuclear-messages",
        //     "radiological-messages",
        //     "meteo-messages",
        //     "pre_warning-messages"
        // ]

        // const messageTypePreWarning:string[] =[
        //     "cbrn-sitrep.md",
        //     "cbrn-sum.md",
        //     "hazwarn.md",
        //     "merwarn.md",
        //     "mir.md",
        //     "mwr.md",
        //     "strikwarn.md"
        // ]

        // const cloneDir2 = path.join(cloneDir,"atp-45");
        // const entries = fs.readdirSync(cloneDir2, { withFileTypes: true });
        // const subfolders = entries.filter(entry => entry.isDirectory()).map(entry => path.join(cloneDir2, entry.name));

        // const subPath = subfolders.filter(subfolder => messageType.includes(subfolder.split(cloneDir2)[1].slice(1)))


        // const keywords = ["CBRN 1", "CBRN 2", "CBRN 3", "CBRN 4", "CBRN 5", "CBRN 6"];
        // const keywords2 = ["CBRN CDR", "CBRN BWR", "CBRN EDR"];
        // const kewwords3 = ["CBRN SUM","CBRN SITREP","CBRN HAZWARN","MERWARN","CBRN MIR","CBRN MWR","STRIKWARN"]
        // const keywordPattern = new RegExp(keywords.join("|"), "i");
        // const keywordPattern2 = new RegExp(keywords2.join("|"), "i"); 
        // const keywordPattern3 = new RegExp(kewwords3.join("|"), "i"); 
        // const keywordPattern4 = new RegExp("Example:|Message:","i");
        // const brPattern = /<br\s*\/?>/i;



        // subPath.forEach(_path => {
        //     const file_path = _path.split("\\")
        //     let dirPath:any;
        //     if (["biological-messages","nuclear-messages","radiological-messages"].includes(file_path[file_path.length - 1])){
        //         dirPath = path.join(_path,`${file_path[file_path.length - 1].slice(0,3)}-messages`,`${file_path[file_path.length - 1].slice(0,3)}-example_messages.md`);
        //         const markdown = fs.readFileSync(dirPath, 'utf-8');

        //         const filtered = markdown.split("```").filter(element => 
        //             keywordPattern.test(element) && !brPattern.test(element) && !keywordPattern4.test(element)
        //         );                
        //         const cbrnMessagePath = path.join(importMessagePath, file_path[file_path.length - 1].slice(0,3).toUpperCase());
        //         const cbrnMessagePathJSON = path.join(importMessagePathJSON, file_path[file_path.length - 1].slice(0,3).toUpperCase());


        //         filtered.forEach(element => {
        //             let someNum = 0;
        //             let num = element.split("CBRN ")[1].slice(0,1) + `_${someNum}`;
        //             const entries = fs.readdirSync(cbrnMessagePath,{withFileTypes:true})
        //             const subFiles = entries.filter(entry => entry.isFile() && entry.name.endsWith(".txt")).map(entry => path.join(cbrnMessagePath, entry.name));                    
        //             const subPath = subFiles.map(subFile => subFile.split(cbrnMessagePath)[1].slice(1))
                    
        //             subPath.forEach(subFile => {
        //                 if (subFile === `${num}.txt`){
        //                     someNum++;
        //                     num = element.split("CBRN ")[1].slice(0,1) + `_${someNum}`;
        //                 }                 
        //             });
        //             fs.writeFileSync(`${cbrnMessagePath}\\${num}.txt`,element,{encoding: "utf8",flag: "w"})
        //             const jsonForm = [{
        //                 "mtfFile": element.split("\r\n").join(""),
        //                 "mainEventId": null
        //             }]
        //             fs.writeFileSync(`${cbrnMessagePathJSON}\\${num}.json`,JSON.stringify(jsonForm),{encoding: "utf8" ,flag: "w"})   
                                
        //         });
        //     }

        //     else if(["chemical-messages"].includes(file_path[file_path.length - 1])){
        //         dirPath = path.join(_path,`${file_path[file_path.length - 1].slice(0,4)}-messages`,`${file_path[file_path.length - 1].slice(0,4)}-example_messages.md`);
        //         const markdown = fs.readFileSync(dirPath, 'utf-8');
        //         const filtered = markdown.split("```").filter(element => 
        //             keywordPattern.test(element) && !brPattern.test(element) && !keywordPattern4.test(element)
        //         );

        //         const cbrnMessagePath = path.join(importMessagePath,"CHEM");    
        //         const cbrnMessagePathJSON = path.join(importMessagePathJSON, "CHEM");            
        //         filtered.forEach(element => {
        //             let someNum = 0;
        //             let num = element.split("CBRN ")[1].slice(0,1) + `_${someNum}`;
        //             const entries = fs.readdirSync(cbrnMessagePath,{withFileTypes:true})
        //             const subFiles = entries.filter(entry => entry.isFile() && entry.name.endsWith(".txt")).map(entry => path.join(cbrnMessagePath, entry.name));
        //             const subPath = subFiles.map(subFile => subFile.split(cbrnMessagePath)[1].slice(1))                    
                    
        //             subPath.forEach(subFile => {
        //                 if (subFile === `${num}.txt`){
        //                     someNum++;
        //                     num = element.split("CBRN ")[1].slice(0,1) + `_${someNum}`;
        //                 }                 
        //             });

        //             fs.writeFileSync(`${cbrnMessagePath}\\${num}.txt`,element,{encoding: "utf8",flag: "w"})
        //             const jsonForm = [{
        //                 "mtfFile": element.split("\r\n").join(""),
        //                 "mainEventId": null
        //             }]
        //             fs.writeFileSync(`${cbrnMessagePathJSON}\\${num}.json`,JSON.stringify(jsonForm),{encoding: "utf8" ,flag: "w"})  
                                
        //         });

        //     }

        //     else if(["meteo-messages"].includes(file_path[file_path.length - 1])){
        //         dirPath = path.join(_path,`meteo-example_messages.md`);
        //         const markdown = fs.readFileSync(dirPath, 'utf-8');
        //         const filtered = markdown.split("```").filter(element => 
        //             keywordPattern2.test(element) && !brPattern.test(element) && !keywordPattern4.test(element)
        //         );
        //         const cbrnMessagePath = path.join(importMessagePath, "METEO");
        //         const cbrnMessagePathJSON = path.join(importMessagePathJSON, "METEO");  
        //         filtered.forEach(element => {
        //             let messageType = element.split("CBRN ")[1].slice(0,3);
        //             fs.writeFileSync(`${cbrnMessagePath}\\${messageType}.txt`,element,{encoding: "utf8",flag: "w"})
        //             const jsonForm = [{
        //                 "mtfFile": element.split("\r\n").join(""),
        //                 "mainEventId": null
        //             }]
        //             fs.writeFileSync(`${cbrnMessagePathJSON}\\${messageType}.json`,JSON.stringify(jsonForm),{encoding: "utf8" ,flag: "w"})                                  
        //         });                
        //     }

        //     else if(["pre_warning-messages"].includes(file_path[file_path.length - 1])){
        //         const cbrnMessagePath = path.join(importMessagePath, "PreWarning");
        //         const cbrnMessagePathJSON = path.join(importMessagePathJSON, "PreWarning");  
        //         messageTypePreWarning.forEach( _ => {
        //             dirPath = path.join(_path,_);
        //             const markdown = fs.readFileSync(dirPath, 'utf-8');
        //             const filtered = markdown.split("```").filter(element => 
        //                 keywordPattern3.test(element) && !brPattern.test(element) && !keywordPattern4.test(element)
        //             );                                       
        //             filtered.forEach(element => {
        //                 let someNum = 0;
        //                 let messageType = _.split(".md")[0] + `_${someNum}`;
        //                 const entries = fs.readdirSync(cbrnMessagePath,{withFileTypes:true})
        //                 const subFiles = entries.filter(entry => entry.isFile() && entry.name.endsWith(".txt")).map(entry => path.join(cbrnMessagePath, entry.name));
        //                 const subPath = subFiles.map(subFile => subFile.split(cbrnMessagePath)[1].slice(1))
        //                 subPath.forEach(subFile => {
        //                     if (subFile === `${messageType}.txt`){
        //                         someNum++;
        //                         messageType = _.split(".md")[0] + `_${someNum}`;
        //                     }                 
        //                 });

        //                 fs.writeFileSync(`${cbrnMessagePath}\\${messageType}.txt`,messageType.split("_")[0] == "mir" ? element.split("BWR")[0]:element,{encoding: "utf8",flag: "w"})                                    
        //                 const jsonForm = [{
        //                     "mtfFile": messageType.split("_")[0] == "mir" ? element.split("BWR")[0].split("\r\n").join(""):element.split("\r\n").join(""),
        //                     "mainEventId": null
        //                  }]
        //                 fs.writeFileSync(`${cbrnMessagePathJSON}\\${messageType}.json`,JSON.stringify(jsonForm),{encoding: "utf8" ,flag: "w"})  
        //             });
        //         });
        //     }  
        // });

        


        
        // await this.createServicesDataFiles();
        // await browserService.openBrowser();
        if (TestConstants.suite === SuiteEnum.ROOT || TestConstants.suite === SuiteEnum.AWARENESS
            || TestConstants.suite === SuiteEnum.ERG || TestConstants.suite === SuiteEnum.USERMANAGEMENT || TestConstants.suite === SuiteEnum.DATACREATION || TestConstants.suite === SuiteEnum.CBNRAWARENESS || TestConstants.suite === SuiteEnum.GROUPIMPORT)
            await ApiService.getInstance().autoLogin();
        // const publicLayerName = ConfigUtils.generateUniqueWord2();
        // process.env['SELECTEDLAYERID'] = await exampleService.method(publicLayerName);
        // console.info('openBrowser');
        // await browserService.openDOOB();
        // if (TestConstants.widgetSkip === 'false') {
        //     await this.openWidget();
        //     await ApiService.getInstance().widgetInstance.post('/subscribe', { channel: 'map.message.complete' });
        // }
    }

    private static async onComplete() {
        // await ApiService.getInstance().autoLogin();
        if (TestConstants.suite === SuiteEnum.ROOT || SuiteEnum.AWARENESS || SuiteEnum.ERG || SuiteEnum.USERMANAGEMENT || SuiteEnum.DATACREATION || SuiteEnum.CBNRAWARENESS || SuiteEnum.GROUPIMPORT)
        // await exampleService.method();
            // console.log('girdiiiiii');
        // console.log(Cli.get('jobID'));
            if (Cli.get('jobID') !== undefined)
                await this.sendMattermostReport();
    }

    private static setReporter(mocha: Mocha, reporter: string) {
        if (TestConstants.parallel === 'true') {
            mocha.reporter('mochawesome');
            return;
        }
        const reporterOptions: { [key: string]: any } = {
            allure: {
                'allure-mocha': '-',
                spec: '-',
            },
            mochawesome: {
                mochawesome: '-',
            },
        };
        if (TestConstants.parallel === 'true')
            reporter = 'mochawesome';

        mocha.reporter('mocha-multi', reporterOptions[reporter]);
    }

    private static setTests(mocha: Mocha, directory: any) {
        if (directory.includes('synchronization') && !TestConstants.syncEnv)
            return;
        if (directory.includes('systemModeCleaner') && TestConstants.suite === SuiteEnum.ROOT) // TODO change axios timeout for cleaner tests
            return;
        if (directory.includes('withoutName') && TestConstants.suite === SuiteEnum.ROOT)
            return;
        fs.readdirSync(directory)
            .filter((file) => path.extname(file) === '.ts')
            .forEach((file) => {
                mocha.addFile(path.join(directory, file));
            });
        fs.readdirSync(directory)
            .map((file) => path.join(directory, file))
            .filter((filePath) => fs.statSync(filePath).isDirectory())
            .forEach((dirPath) => {
                this.setTests(mocha, dirPath);
            });
    }

    private static setGrep(mocha: Mocha) {
        const grepFound = TestConstants.grep === undefined || TestConstants.grep === '';
        if (TestConstants.suite === 'createAllCombinations')
            if (grepFound)
                mocha.grep('combinations');
            else
                mocha.grep(`/^(?=.*combinations).*${TestConstants.grep}.*$/i`);
        else
            if (grepFound)
                mocha.grep('combinations').invert();
            else
                mocha.grep(`/^(?!.*combinations).*${TestConstants.grep}.*$/i`);
    }

    private static async createHistory() {
        if (await fse.pathExists(`${ConfigUtils.getAllureReportPath()}history`))
            fse.copy(`${ConfigUtils.getAllureReportPath()}history`, `${ConfigUtils.getAllureResultsPath()}history`);
    }

    private static async createServicesDataFiles() {
        for (const service of services) {
            await fs.writeFileSync(`src/misc/JSONdata/servicesData/${service.serviceName}.json`, '[]');
            if (!await fse.pathExists(`src/misc/JSONdata/servicesData/${service.serviceName}Types.json`))
                await fs.writeFileSync(`src/misc/JSONdata/servicesData/${service.serviceName}Types.json`, '[]');
        }
    }

    private static async sendMattermostReport() {
        // const JiraResults = await jiraService.getResults();
        const mochaResults = await jiraService.getMochaResults();
        const percentage = (mochaResults.PASSED * 100) / (mochaResults.PASSED + mochaResults.FAILED + mochaResults.PENDING);
        const gaugeBody = {
            type: 'radialGauge',
            data: {
                datasets: [{
                    data: [percentage],
                    backgroundColor: 'green',
                }],
            },
            options: {
                roundedCorners: false,
                trackColor: '#FF0000',
                centerPercentage: 90,
                centerArea: {
                    fontSize: 80,
                    text: `%${Math.floor(percentage)}`,
                },
            },
        };

        // const middleServiceURL = 'http://172.16.21.217:8000/';
        let params = '';
        Object.keys(Cli.getAll()).map((key) => `${key}=${Cli.getAll()[key]}`).forEach((el) => {
            if (el.indexOf('reportProjectUrl=') !== 0
                && el.indexOf('jobID=') !== 0 && el.indexOf('reportNameUrl=') !== 0)
                params += `${el} `;
        });
        // const passed = JiraResults.filter((result) => result.status === 'PASS').length;// mocha yap
        // const aborted = JiraResults.filter((result) => result.status === 'ABORTED').length;
        // const failed = JiraResults.filter((result) => result.status === 'FAIL').length;
        const mochawesomeUrlPiece = (Cli.get('reportNameUrl') !== undefined ? Cli.get('reportNameUrl') : 'Report');
        const reportUrlPiece = `${Cli.get('jobID')}/${TestConstants.reporter === 'mochawesome' ? mochawesomeUrlPiece : 'allure'}`;
        let reportProjectUrl = '';
        if (Cli.get('reportProjectUrl') !== undefined) {
            const workspace = `${Cli.get('reportProjectUrl')}`;
            const arrays = workspace.split('/');
            for (let i = 0; i < arrays.length - 1; i++)
                reportProjectUrl = `${reportProjectUrl + arrays[i]}/job/`;
        } else {
            reportProjectUrl = 'TEST-MD/job/KBRN-API-AUTOMATION/job/KBRN_API_Tests/job/';
        }

        const fields = [
            // {
            //     short: true,
            //     title: ':u5408: API-TEST finished',
            //     value: `:link: ${JiraResults.length} JIRA Tests\n :dart: %${((passed * 100) / JiraResults.length).toFixed(2)} passed ${((passed * 100) / JiraResults.length === 100 ? ':gem: ' : '')} \n :white_check_mark: ${passed} PASSED  :x: ${failed} FAILED  :warning: ${aborted} ABORTED`,
            // },
            {
                short: true,
                title: 'Mocha Results',
                value: `[![image](https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(gaugeBody))} =200 "Click to see Report")](https://jenkins.devops.k2.net/job/${reportProjectUrl}master/${reportUrlPiece}/)  \n :white_check_mark: ${mochaResults.PASSED} PASSED :x: ${mochaResults.FAILED} FAILED :warning: ${mochaResults.PENDING} PENDING`,
            },
        ];
        let color = '';
        if (percentage > 90)
            color = '#4dff00';
        else if (percentage > 30)
            color = '#f1c232';
        else
            color = '#ff0000';

        mattermostBody.channel_id = '7cj6p5uzpb8cdx6ewqbdtmf3sr';// apiTest channel
        mattermostBody.message = `${testName} test run with parameters ${params}`;
        mattermostBody.props.attachments[0].fields = fields;
        mattermostBody.props.attachments[0].color = color;
        mattermostBody.props.attachments[0].thumb_url = 'https://portal.havelsan.com.tr/portal/api/file-manager/getFile/havelsan_amblem.png?filePath=assets%2Ficons%2Fhavelsan_amblem.png';
        // mattermostBody.props.attachments[0].actions[0].integration.url = middleServiceURL;
        // const compressedRes = await zlib.deflateSync(JSON.stringify(JiraResults)).toString('base64');
        // mattermostBody.props.attachments[0].actions[0].integration.context.results = compressedRes;
        // mattermostBody.props.attachments[0].actions[0].integration.context.testName = testName;
        // mattermostBody.props.attachments[0].actions[0].integration.context.environment = TestConstants.environment;
        // mattermostBody.props.attachments[0].actions[0].integration.context.project = 'C4IUMMAN';
        // mattermostBody.props.attachments[0].actions[0].integration.context.jobID = Cli.get('jobID');
        // mattermostBody.props.attachments[0].actions[1].integration.url = middleServiceURL;
        // mattermostBody.props.attachments[0].actions[1].integration.context.testName = testName;
        //
        // const responseBody = JSON.parse(JSON.stringify(mattermostBody.props));
        // delete responseBody.attachments[0].actions;
        // mattermostBody.props.attachments[0].actions[0].integration.context.response = JSON.stringify(responseBody);
        // mattermostBody.props.attachments[0].actions[1].integration.context.response = JSON.stringify(responseBody);
        // mattermostBody.props.attachments[0].actions[0].integration.context.message = mattermostBody.message;
        // mattermostBody.props.attachments[0].actions[1].integration.context.message = mattermostBody.message;
        try {
            const instance = await axios.create({
                baseURL: 'https://mattermost.havelsan.com.tr',
                timeout: 60000,
            });
            instance.interceptors.response.use((config: AxiosResponse) => ({
                ...config,
            }), ApiService.errorHandler);
            const res: AxiosResponse = await instance.post('/api/v4/posts', mattermostBody, {
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false,
                }),
                headers: {
                    Authorization: 'Bearer 38yf584pa3rwbkdpk1c15a5pie',
                },
            });

            return res.data;
        } catch (e) {
            console.error(`${e.message} \nsendMattermostReport  payload: ${JSON.stringify(mattermostBody)}`);
            return 1;
        }
    }

    private static async openWidget() {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const widget = childProcess.spawn('yarn', ['run', 'socketServer'], { shell: true });
        widget.stdout.on('data', (data) => {
            console.info(`widget.ts: ${data}`);
        });
        widget.stderr.on('data', (data) => {
            console.error(`widget.ts:err ${data}`);
        });
        widget.on('close', (code) => {
            console.info(`child process close all stdio with code ${code}`);
        });
        widget.on('disconnect', (code) => {
            console.info(`child process disconnect with code ${code}`);
        }); widget.on('error', (code) => {
            console.info(`child process error with code ${code}`);
        });
        widget.on('exit', (code) => {
            console.info(`child process exited with code ${code}`);
        });
        await waitUntil(async () => ApiService.getInstance().widgetInstance.get('/ping').then(() => true, () => false), { timeout: 10000, intervalBetweenAttempts: 500 });
        await waitUntil(async () => ApiService.getInstance().widgetInstance.get('/connect').then(() => true, () => false), { timeout: 10000, intervalBetweenAttempts: 500 });
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }
}
// eslint-disable-next-line
Runner.RunAsync();
// console.log(personInstance);
