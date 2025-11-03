import EnvironmentEnum from '@/common/enum/EnvironmentEnum';
import ReporterEnum from '@common/enum/ReporterEnum';
import SuiteEnum from '@common/enum/SuiteEnum';

const split = require('argv-split');

class Cli {
    private Process: any = process;

    public constructor() {
        this.setEnv();
        this.getCliParams();
        this.getEnvParamsForDocker();
    }

    private getCliParams(): void {
        const obj: any = {};
        this.Process.params = {};
        JSON.parse(this.Process.env.doob).forEach((element: string): void => {
            if (element.includes('--') && element.includes('=')) {
                const index = element.indexOf('=');
                const key = element.slice(0, index).replace('--', '');
                const value = element.slice(index + 1);
                obj[key] = value;
                this.controlValueOfCliParameter(key, value);
            }
        });

        this.Process.params = obj;
    }

    /**
     *
     * @param paramName
     */
    public get(paramName: string): string {
        return this.Process.params[paramName];
    }

    public getAll() {
        return this.Process.params;
    }

    /**
     *
     * @param name
     * @param value
     */
    public set(name: string, value: string): void {
        this.Process.params[name] = value;
    }

    private controlValueOfCliParameter(key:string, value:string): void {
        if (key === 'environment' && !(<any>Object).values(EnvironmentEnum).includes(value.toUpperCase())) {
            console.error(`Invalid environment. Please use the following format when running the test script: --environment=${Object.values(EnvironmentEnum).join((' | '))}`);
            process.exit(1);
        }

        if (key === 'reporter' && !(<any>Object).keys(ReporterEnum).includes(value.toUpperCase())) {
            console.warn(`Invalid reporter. Please use the following format when running the test script: --reporter=${Object.values(ReporterEnum).join((' | '))}`);
            process.exit(1);
        }

        if (key === 'suite' && !(<any>Object).values(SuiteEnum).includes(value)) {
            console.warn(`Invalid suite. Please use the following format when running the test script: --suite=${Object.values(SuiteEnum).join((' | '))}`);
            process.exit(1);
        }
    }

    private setEnv() {
        if (this.Process.env.doob === undefined)
            this.Process.env.doob = JSON.stringify(this.Process.argv);
    }

    private getEnvParamsForDocker() {
        if (process.env.DOCKER_SERVICE === 'true') {
            const obj: any = {};
            split(this.Process.env.DOCKER_PARAMS).forEach((element: string): void => {
                if (element.includes('--') && element.includes('=')) {
                    const index = element.indexOf('=');
                    const key = element.slice(0, index).replace('--', '');
                    const value = element.slice(index + 1);
                    obj[key] = value;
                    this.controlValueOfCliParameter(key, value);
                }
            });
            this.Process.params = obj;
        }
    }
}

export default new Cli();
