/* eslint-disable import/no-mutable-exports */
import Cli from '@/common/lib/Cli';
import EnvironmentEnum from '@/common/enum/EnvironmentEnum';
import { UrlConfig } from '@common/Types';

let urlConfig: UrlConfig;
const ENVIRONMENT = Cli.get('environment') ? Cli.get('environment').toUpperCase() : EnvironmentEnum;

switch (ENVIRONMENT) {
    case EnvironmentEnum.FakeAPI:
        urlConfig = {
            url: 'http://localhost:8000',
        };
        break;
    case EnvironmentEnum.Test:
        urlConfig = {
            url: 'https://test.cbrn.k2.net',
        };
        break;
    case EnvironmentEnum.Dev:
        urlConfig = {
            url: 'https://dev.cbrn.k2.net',
        };
        break;
    case EnvironmentEnum.Milgem:
        urlConfig = {
            url: 'https://milgem.cbrn.k2.net',
        };
        break;
    case EnvironmentEnum.Local:
        urlConfig = {
            url: 'https://cbrn-local',
        };
        break;
    default:
        urlConfig = {
            url: 'https://test.cbrn.k2.net',
        };
        break;
}
urlConfig.url = Cli.get('apiUrl') ? Cli.get('apiUrl') : urlConfig.url;

export default urlConfig;
