import type { AxiosResponse } from 'axios'
declare global {
  interface ResponseResult<T = any> {
    code: number
    data: T
    msg: string
    traceId: string
  }

  interface PageResult<T = any> {
    pageSize: number
    currPage: number
    totalCount: number
    totalPage: number
    list: T[]
  }

  type HttpResponse = AxiosResponse
}

export {}
