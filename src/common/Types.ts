export interface UrlConfig {
    url: string;
    secondUrl?:string;
}
export interface ApiServiceParams {
    token?: string | undefined
}

export interface HttpClientParameters {
    baseURL: string | undefined
    token?: string | undefined
    timeout?: number
}

export interface RequestInterceptor {
    token?: string | undefined
}

export interface ParamsData {
    clientId? : string
    attributes? : object
    username: string
    password: string
    mode?: string
    reporter?: string
    suite?: string
    environment?: string;
    grep?: string
    iletiReport?:string
    parallel?: string
    maxCount?: string
    syncEnv?:string
    syncUserName?: string
    syncPassword?: string
    timeout?: number
    widgetPort?: string;
    widgetSkip?: string;

}
export interface ServiceParams {
    serviceName:string
    serviceNameAdj:string
    type:boolean
    path?:[string]
    skip?:boolean
    typeName?:string
    typeID?:string
    objectName?:string
    objectID?:string
    S15?: string
    existingType?: boolean
    mode?: string
    health?: string
    app6a?:boolean
    mip?:boolean
    symbolCodes?:any
}
export interface ObjectList {
    objectCoreType: string,
    objectList: any[]
}

export interface TypeParams {
    name: string
    data: any
}

export interface ServiceStatus {
    name: string
    health?: string
}
export interface ObjectParams {
    symbolType?: any;
    name: string
    objectCoreType: string
    symbolCode: string
    allowedGeometries?: string[]
    type?:string
    code?:string
}
export interface SymbolObject {
    parentValue: string,
    validValue: string,
    app6AString: string,
    symbolTypes?:string,
    mainId?:string,
    subId?:string
}

export interface App6aParams {
    name: string,
    objectCoreType: string,
    symbolCode: string
    allowedGeometries?: string[]
}
