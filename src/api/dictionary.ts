import { http, withCancel } from '../plugins'
export enum Api {
  /** 分页查询列表 */
  DictionaryPage = '/dictionary-source/page',
  DeleteDictionary = '/dictionary-source/deleteById',
  AddDictionary = '/dictionary-source/save',
  EditDictionary = '/dictionary-source/updateById',
  DictionaryList = '/dictionary-source/getConfige'
}
export const getDictionaryList = withCancel((data, cancelToken) => {
  return http.request({
    method: 'post',
    url: Api.DictionaryPage,
    data,
    cancelToken
  })
})

export const deleteDictionary = (id: number) => {
  return http.request({
    method: 'DELETE',
    url: `${Api.DeleteDictionary}/${id}`
  })
}

export const saveDictionary = data => {
  return http.request({
    method: 'post',
    url: Api.AddDictionary,
    data
  })
}

export const updateDictionary = data => {
  return http.request({
    method: 'post',
    url: Api.EditDictionary,
    data
  })
}

export const getDictionaryOption = data => {
  return http.request({
    method: 'post',
    url: Api.DictionaryList,
    data
  })
}

export const getDictionarys = () => {
  return http.request({
    method: 'get',
    url: '/dictionary-source/list'
  })
}
