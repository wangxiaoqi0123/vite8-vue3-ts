import { createVNode, createApp } from 'vue'
import ConfigProvider from '/@/components/business/configProvider/Index.vue'
import mitt from 'mitt'
import { merge } from 'lodash-es'

type IModalConfig = {
  isCloseDestroy: boolean // 是否关闭时销毁
  [key: string]: any
}

const instancesMap = new Map()

export const destroyAllCreateContainModal = () => {
  for (const [key, instance] of instancesMap) {
    instance.destroy()
    instancesMap.delete(key)
  }
}

type Events = {
  open: () => void
}

/**
 * 对FModal组件进行包装，使其可以进行函数式使用
 * @param component
 * @returns
 */
export default function createContainModal(component, defaultConfig = {}, appContext) {
  let emitter = mitt<Events>()

  /**
   * 处理传入组件内部的props数据
   * @param props
   * @returns
   */
  function getWithinProps(props, config) {
    const modalAttrs = {
      open: false,
      centered: true,
      maskClosable: false,
      isCloseDestroy: true,
      ...defaultConfig,
      ...config
    } as IModalConfig

    // 关闭时销毁
    modalAttrs.afterClose = () => {
      if (typeof config.afterClose === 'function') config.afterClose()
      // @ts-ignore
      if (modalAttrs.isCloseDestroy) destroy.apply(this)
    }
    const withinProps = { ...props, emitter, close, update, destroy }
    return { ...withinProps, modalAttrs }
  }

  /**
   * 创建实例
   * @param props
   * @param config
   * @returns
   */
  function createInstance(props, config) {
    const el: any = document.createElement('div')
    const withinProps = getWithinProps(props, config)
    const componentInstance = createVNode(component, withinProps)
    // 创建一个包装组件，将 ConfigProvider 作为根组件
    const WrapperComponent = {
      render() {
        return createVNode(
          ConfigProvider,
          {},
          {
            default: () => componentInstance
          }
        )
      }
    }

    const app = createApp(WrapperComponent)
    if (appContext) {
      // 复制父应用的完整上下文，包括 router、store 等
      // 这样可以确保弹窗组件中可以正常使用 useRoute()、useRouter() 等
      app._context.components = appContext.components
      app._context.directives = appContext.directives
      app._context.provides = appContext.provides
      app._context.config = appContext.config
      app._context.mixins = appContext.mixins
    }
    const vm = app.mount(el)
    return { vm, el, destroy, emitter, app, componentInstance }
  }

  /**
   * 更新组件props数据
   * @param data
   * @param isForceData
   */
  function update(data, isForceData = false) {
    const { componentInstance } = instancesMap.get(component)
    if (!componentInstance) return

    if (isForceData) {
      for (const key in componentInstance.component.props) {
        Reflect.deleteProperty(componentInstance.component.props, key)
      }
      merge(componentInstance.component.props, data)
    } else {
      merge(componentInstance.component.props, data)
    }
    componentInstance.component.update()
  }
  /**
   * 关闭弹窗
   */
  function close() {
    update({ modalAttrs: { open: false } })
  }

  /**
   * 销毁弹窗
   */
  function destroy() {
    const instance = instancesMap.get(component)
    if (instance) {
      const { app } = instance

      // 使用 app.unmount 卸载
      if (app) {
        app.unmount()
      }

      instancesMap.delete(component)
      emitter = null
    }
  }

  /**
   * 打开弹框更新数据
   * @param props
   * @param config
   */
  function open(props, config = {}) {
    if (instancesMap.has(component)) {
      const updateConfig = { ...config, open: true }
      const updateProps = getWithinProps(props, updateConfig)
      update(updateProps, true)
    } else {
      const updateConfig = { ...config, open: true }
      mount(props, updateConfig)
    }
    emitter.emit('open', props)
  }

  /**
   * 组件挂载
   * @param props
   * @param config
   */
  function mount(props = {}, config = {}) {
    const instance = createInstance(props, config)
    instancesMap.set(component, instance)
  }

  return {
    close,
    destroy,
    update,
    open,
    mount,
    emitter
  }
}
