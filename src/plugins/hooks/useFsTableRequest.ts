import { pickBy } from 'lodash-es'
import useFsPagination from './useFsPagination'
import useFsRequest from './useFsRequest'

type DefaultResType = (...args: any[]) => Promise<PageResult>
type ExtractResData<T> = T extends { records: infer R } ? R : any
type ExtractResType<T> = T extends (...args: any[]) => Promise<infer R> ? R : any
type RecordType<T> = ExtractResData<ExtractResType<T>>

interface IFsTableRequestProps<T> {
  formatRecordData?: (res: T) => any[]
  formatSearchData?: (res: any) => any
  confTotalCount?: (data: any) => number
  defaultOption?: any
  cache?: boolean
  once?: boolean
  throttle?: boolean
  debounce?: boolean
  debounceDelay?: number
  ignoreCancel?: boolean
  onError?: (error?: any) => void
  onSuccess?: (data?: T) => void
  onBefore?: () => any
  onFinally?: () => void
}

export default function useFsTableRequest<T extends DefaultResType>(
  request: T,
  props?: IFsTableRequestProps<ExtractResType<T>>
) {
  const dataSource = ref<RecordType<T>>([] as any)
  const searchSource = ref<any>({})
  props = Object.assign({}, props)
  const { formatRecordData, formatSearchData } = props

  const options = pickBy(
    {
      cache: props.cache ?? false,
      once: props.once,
      throttle: props.throttle,
      debounce: props.debounce,
      debounceDelay: props.debounceDelay,
      ignoreCancel: props.ignoreCancel ?? true,
      onError: props.onError,
      onSuccess: props.onSuccess,
      onBefore: props.onBefore,
      onFinally: props.onFinally
    },
    value => value !== undefined
  )

  /**
   * 格式化响应表格数据
   * @param data
   * @returns
   */
  const formatDataSource = data => {
    if (formatRecordData) {
      return formatRecordData(data)
    } else {
      return data?.list || []
    }
  }

  const requestConfig = Object.assign(options, {
    onSuccess(data) {
      props.onSuccess?.(data)
      dataSource.value = formatDataSource(data)
    }
  })
  const { loading, run: runTableRequest } = useFsRequest(request, requestConfig)
  const { reqSearch, reqUpdate, pagination } = useFsPagination(runTableRequest, {
    defaultOption: props.defaultOption,
    confTotalCount: props.confTotalCount,
    formatSearchData
  })

  const onSearch = (search?: any) => {
    searchSource.value = Object.assign(searchSource.value, search)
    reqSearch(searchSource.value)
  }

  return {
    dataSource,
    loading,
    pagination,
    reqSearch,
    reqUpdate,
    onSearch,
    searchSource
  }
}
