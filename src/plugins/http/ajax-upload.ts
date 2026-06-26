function getError(action: string, xhr: XMLHttpRequest): Error {
  const msg = `fail to post ${action} ${xhr.status}'`
  const err: any = new Error(msg)
  err.status = xhr.status
  err.method = 'post'
  err.url = action
  return err
}

function getBody(xhr: XMLHttpRequest): any {
  const text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

interface UploadOption {
  action: string
  cancel?: (xhr: XMLHttpRequest) => void
  onProgress: (e: ProgressEvent) => void
  data?: { [key: string]: any }
  filename: string
  file: File
  onError: (error: any, body: any) => void
  onSuccess: (body: any) => void
  withCredentials?: boolean
  headers?: { [key: string]: string | null }
}

export default function upload(option: UploadOption): void {
  if (typeof XMLHttpRequest === 'undefined') {
    return
  }

  const xhr = new XMLHttpRequest()
  const action = option.action
  option.cancel && option.cancel(xhr)

  if (xhr.upload) {
    xhr.upload.onprogress = function progress(e) {
      option.onProgress(e)
    }
  }

  const formData = new FormData()

  if (option.data) {
    Object.keys(option.data).forEach(key => {
      formData.append(key, option.data[key])
    })
  }

  formData.append(option.filename, option.file)

  xhr.onerror = function error(e) {
    option.onError(e, getBody(xhr))
  }

  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(getError(action, xhr), getBody(xhr))
    }

    option.onSuccess(getBody(xhr))
  }

  xhr.open('post', action, true)

  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true
  }

  const headers = option.headers || {}

  for (const item in headers) {
    if (headers[item] !== null) {
      xhr.setRequestHeader(item, headers[item])
    }
  }
  xhr.send(formData)
}
