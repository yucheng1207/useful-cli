export enum HttpCode {
    /**
     * 参数错误
     */
    PARAM_ERROR = 'PARAM_ERROR',
}

export interface IResponseData {
    code: HttpCode
    detail: string
    message: string
    stack: string
}
