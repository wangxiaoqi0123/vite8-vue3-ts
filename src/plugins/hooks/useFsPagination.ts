import axios from 'axios'
import { cloneDeep } from 'lodash-es'
interface IOptions {
  defaultOption?: any
  confTotalCount?: (data: any) => number
  formatSearchData?: (res: any) => any
}
const defaultTotalCount = data => data?.totalCount
const defaultFormatSearchData = data => data

export default function useFsPagination(queryFn: any, options: IOptions) {
  const defaultOption = Object.assign({ currPage: 1, pageSize: 10 }, options.defaultOption)
  let tempQuery: any = {}
  const tempPage = { currPage: defaultOption.currPage, pageSize: defaultOption.pageSize }

  const confTotalCount = options.confTotalCount || defaultTotalCount
  const formatSearchData = options.formatSearchData || defaultFormatSearchData

  const pageChange = (currPage, pageSize) => {
    tempPage.currPage = currPage
    tempPage.pageSize = pageSize
    pagination.current = currPage
    pagination.pageSize = pageSize
  }

  const setTotalCount = data => {
    const total = confTotalCount(data)
    pagination.total = total
    pagination.hideOnSinglePage = total <= 10
  }

  const reqSearch = async (query = {}) => {
    tempQuery = Object.assign({}, query, { currPage: defaultOption.currPage, pageSize: tempPage.pageSize })
    pageChange(tempQuery.currPage, tempQuery.pageSize)
    const params = formatSearchData(cloneDeep(tempQuery))
    return await reqQueryTable(params)
  }

  const reqUpdate = async () => {
    const params = formatSearchData(cloneDeep({ ...tempQuery, ...tempPage }))
    return await reqQueryTable(params)
  }

  const reqPage = async (currPage: any, pageSize: any) => {
    pageChange(currPage, pageSize)
    const params = formatSearchData(cloneDeep({ ...tempQuery, ...tempPage }))
    return await reqQueryTable(params)
  }

  const getReqParams = () => cloneDeep({ ...tempQuery, ...tempPage })

  const reqQueryTable = (...args: { currPage: any; pageSize: any }[]) => {
    return new Promise((resolve, reject) => {
      queryFn(...args)
        .then((data: any) => {
          setTotalCount(data)
          resolve(data)
        })
        .catch(error => {
          if (axios.isCancel(error)) return
          reject(error)
        })
    })
  }

  const pagination = reactive({
    current: defaultOption.currPage,
    pageSize: defaultOption.pageSize,
    total: undefined,
    showQuickJumper: true,
    showSizeChanger: true,
    hideOnSinglePage: false,
    pageSizeOptions: ['10', '20', '30', '40', '50'],
    showTotal: (total: any) => `共 ${total} 条`,
    onChange: (page: any, pageSize: any) => {
      reqPage(page, pageSize)
    },
    onPagination: (data: any) => {
      reqPage(data.currPageber, data.size)
    }
  })

  return {
    reqSearch,
    reqUpdate,
    pagination,
    getReqParams
  }
}
