import createContainModal, { destroyAllCreateContainModal } from './createContainModal'

const appContextMap = {}
const DEFAULT_APP_KEY = 'FCreateModal'

type IModalConfig = {
  isMount?: boolean
  [key: string]: any
}

export const destroyAllCreateModal = () => {
  destroyAllCreateContainModal()
}

export default function createModal(component, props, config: IModalConfig = {}) {
  const defaultConfig = {
    isMount: true,
    ...config
  } as any
  defaultConfig.isCloseDestroy = defaultConfig.isMount
  defaultConfig.isOpenImmediately = defaultConfig.isMount

  const { close, destroy, update, open, mount } = createContainModal(
    component,
    defaultConfig,
    appContextMap[DEFAULT_APP_KEY]
  )

  if (defaultConfig.isOpenImmediately) {
    open(props)
  }

  return {
    close,
    destroy,
    update,
    open,
    mount
  }
}

export const FCreateModalPlugin = {
  install: (app, options: { appKey: string } = { appKey: DEFAULT_APP_KEY }) => {
    appContextMap[options.appKey] = app._context
  }
}
