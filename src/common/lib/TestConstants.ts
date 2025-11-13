/* eslint-disable global-require,import/no-dynamic-require */
import { ParamsData } from '@common/Types';
import Cli from '@common/lib/Cli';
import EnvironmentEnum from '@common/enum/EnvironmentEnum';
import ReporterEnum from '@common/enum/ReporterEnum';
import SuiteEnum from '@common/enum/SuiteEnum';

class TestConstants {
    private readonly params: ParamsData;

    constructor() {
    // Default to FakeAPI when no CLI environment is provided so baseURL resolves to localhost:8000
    const ENVIRONMENT = Cli.get('environment') ? Cli.get('environment').toUpperCase() : EnvironmentEnum.FakeAPI;
        const REPORTER = Cli.get('reporter') ? Cli.get('reporter').toUpperCase() : ReporterEnum.MOCHAWESOME.toUpperCase();
        const SUITE = Cli.get('suite') ? Cli.get('suite') : SuiteEnum.ROOT;
        const GREP = Cli.get('grep') ? Cli.get('grep') : '';
        const MAXCOUNT = Cli.get('maxCount') ? Cli.get('maxCount') : '1';
        const TIMEOUT = Cli.get('timeout') ? Cli.get('timeout') : '60000';
        const WIDGET_PORT = Cli.get('widgetPort') ? Cli.get('widgetPort') : '3001';
        const WIDGET_SKIP = Cli.get('widgetSkip') ? Cli.get('widgetSkip') : 'false';

        const isValidEnv = (<any>Object).values(EnvironmentEnum).includes(ENVIRONMENT);
        const isValidRep = (<any>Object).keys(ReporterEnum).includes(REPORTER);
        const isValidSui = (<any>Object).values(SuiteEnum).includes(SUITE);

        if (isValidEnv)
            this.params = require(`@testConstants/${ENVIRONMENT.toLowerCase()}`);
        else
            this.params = require('@testConstants/sel');
        this.params.environment = ENVIRONMENT;
        if (isValidRep)
            this.params.reporter = REPORTER.toLowerCase();
        if (isValidSui)
            this.params.suite = SUITE;
        if (GREP)
            this.params.grep = GREP;
        if (MAXCOUNT)
            this.params.maxCount = MAXCOUNT;
        if (TIMEOUT)
            this.params.timeout = +TIMEOUT;
        if (WIDGET_PORT)
            this.params.widgetPort = WIDGET_PORT;
        if (WIDGET_SKIP)
            this.params.widgetSkip = WIDGET_SKIP;
    }

    get(): ParamsData {
        return this.params;
    }
}

const Param = new TestConstants();
export default Param.get();
