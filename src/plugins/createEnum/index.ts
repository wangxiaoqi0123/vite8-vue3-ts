import { cloneDeep, isArray, isEmpty, isPlainObject } from 'lodash-es'

type IEMap = Readonly<Record<any, readonly [any, any] | readonly [any, any, any]>>
type TEUnion<T extends IEMap> = keyof T
type TEValue<T extends IEMap> = T[TEUnion<T>][0]
type IEnum<T extends IEMap> = {
  readonly [K in keyof T]: T[K] extends readonly [infer V, any] ? V : any
} & Enum<T>

/**
 * 判断枚举key列表是否有效
 * @param {*} args
 * @returns {Boolean}
 */
function judgEnumKeys(keys): boolean {
  return !isEmpty(keys) && keys.every(key => typeof key === 'string')
}

class Enum<T extends IEMap> {
  protected __enumMap__: T
  protected __enumLabelMap__
  protected __enumExtraMap__

  /**
   * @param {Object} enumMap 枚举map
   */
  constructor(enumMap: T) {
    if (!isPlainObject(enumMap)) {
      throw new TypeError('初始化参数值必须是一个object！')
    }
    this.#setEnumMap(cloneDeep(enumMap))
  }

  /**
   * 设置枚举间的映射
   * @param {Object} enumMap
   * @private
   */
  #setEnumMap(enumMap) {
    const enumLabelMap = {}
    const enumExtraMap = {}
    Object.keys(enumMap).forEach(key => {
      const item = enumMap[key]
      if (!isArray(item)) {
        throw new TypeError('初始化参数对象字段的值必是一个array！')
      }
      this[key] = item[0]
      enumLabelMap[key] = item[1]
      enumLabelMap[item[0]] = item[1]
      enumExtraMap[key] = item[2]
      enumExtraMap[item[0]] = item[2]
    })
    this.__enumMap__ = Object.freeze(enumMap)
    this.__enumLabelMap__ = Object.freeze(enumLabelMap)
    this.__enumExtraMap__ = Object.freeze(enumExtraMap)
  }

  /**
   * 获取枚举值
   * @param {String} key 枚举KEY
   * @return {Number} 枚举值
   */
  public value(key: TEUnion<T>): TEValue<T> {
    return this[key as string]
  }

  /**
   * 获取多个枚举值
   * @param {Array} param 多个枚举KEY
   * @return {Array} {[枚举值]}
   */
  public values(...args: TEUnion<T>[]): any | TEValue<T>[] {
    let keys = Object.keys(this.__enumMap__) as TEUnion<T>[] // 不传递返回所有
    if (judgEnumKeys(args)) {
      keys = Array.from(args)
    }
    return keys.map(key => this.value(key))
  }

  /**
   * 获取多个枚举值Map
   * @param {Array} param 多个枚举KEY，如果不传递则返回所有
   * @return {Object} {[枚举key]:枚举值}
   */
  public options<V extends TEUnion<T>>(...args: V[]) {
    let keys = Object.keys(this.__enumMap__) as V[] // 不传递返回所有
    if (judgEnumKeys(args)) {
      keys = Array.from(args)
    }
    return keys.map(key => ({
      value: this.value(key),
      label: this.label(key),
      extra: this.extra(key)
    }))
  }

  /**
   * 获取枚举名称
   * @param {String} keyOrVal 枚举KEY或枚举值
   * @return {String} 枚举名称
   */
  public label(key: TEUnion<T>): string
  public label(val: TEValue<T>): string
  public label(val: any): string
  public label(keyOrVal) {
    return this.__enumLabelMap__[keyOrVal]
  }

  /**
   * 获取枚举关联参数
   * @param {String} keyOrVal 枚举KEY或枚举值
   * @return {String} 枚举名称
   */
  public extra(key: TEUnion<T>): any
  public extra(val: TEValue<T>): any
  public extra(keyOrVal: any): any
  public extra(keyOrVal) {
    return this.__enumExtraMap__[keyOrVal]
  }

  /**
   * 检测字段类型
   * @param {Number} typeVal 类型
   * @param {String} typeKey 类型key
   * @return {Boolean}
   */
  public check(typeVal, typeKey: TEUnion<T>) {
    return this.value(typeKey) === typeVal
  }
}

/**
 * 创建枚举
 * @example
 * const enumInstance = createEnum({
 * 'A': [1, 'A', {a:xx}],
 * 'B': [2, 'B',{b:xx}]
 * } as const)
 * enumInstance.value('A') // 1
 * enumInstance.values() // [1, 2]
 * enumInstance.options() // [{value: 1, label: 'A'}, {value: 2, label: 'B'}]
 * enumInstance.label('A') // 'A'
 * enumInstance.check(1, 'A') // true
 */
const createEnum = <T extends IEMap>(enumMap: T): Readonly<IEnum<T>> => {
  const enumInstance = new Enum<T>(enumMap)
  return Object.freeze(enumInstance) as Readonly<IEnum<T>>
}

export { createEnum }
