// @ts-nocheck
/**
 * @description 滚动动画
 * @export
 * @param {*} el
 * @param {number} [from=0]
 * @param {*} to
 * @param {number} [duration=500]
 * @param {*} endCallback
 */

function createRunScroll(direction: 'scrollTop' | 'scrollLeft') {
  return function (el, from = 0, to, duration = 500, endCallback?) {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame =
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          return window.setTimeout(callback, 1000 / 60)
        }
    }
    const difference = Math.abs(from - to)
    const step = Math.ceil((difference / duration) * 50)

    function scroll(start, end, step) {
      if (start === end) {
        endCallback && endCallback()
        return
      }

      let d = start + step > end ? end : start + step
      if (start > end) {
        d = start - step < end ? end : start - step
      }

      if (el === window) {
        window.scrollTo(d, d)
      } else {
        el[direction] = d
      }
      window.requestAnimationFrame(() => scroll(d, end, step))
    }
    scroll(from, to, step)
  }
}

export const scrollTop = createRunScroll('scrollTop')
export const scrollLeft = createRunScroll('scrollLeft')

/**
 * @description
 * @export
 * @param {*} curEle 当前元素
 * @param {*} parEle 目标父元素
 * @return {*}
 */
export function offSet(curEle, parEle) {
  let totalLeft = null
  let totalTop = null
  let par = curEle.offsetParent
  // 首先把自己本身的相加
  totalLeft += curEle.offsetLeft
  totalTop += curEle.offsetTop
  // 现在开始一级一级往上查找，只要没有遇到目标父元素，我们就把父级参照物的边框和偏移相加
  while (par && par !== parEle) {
    if (navigator.userAgent.indexOf('MSIE 8.0') === -1) {
      // 不是IE8我们才进行累加父级参照物的边框
      totalTop += par.clientTop
      totalLeft += par.clientLeft
    }
    // 把父级参照物的偏移相加
    totalTop += par.offsetTop
    totalLeft += par.offsetLeft
    par = par.offsetParent === parEle ? null : par.offsetParent
  }
  return { left: totalLeft, top: totalTop }
}
