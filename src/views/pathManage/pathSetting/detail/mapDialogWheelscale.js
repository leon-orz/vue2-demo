export default function ({el, min=0.5, max=5, speed=3, scale=1, translateY=0, translateX=0}) {
    // error
      const downEl = el
      // 初始化缩放
      if (downEl && scale) {
        downEl.style.transform += `scale(${scale})`
      }
      // 初始化上移
      if (downEl && translateY) {
        downEl.style.transform += `translateY(${translateY})`
      }
      // 初始化左移
      if (downEl && translateX) {
        downEl.style.transform += `translateX(${translateX})`
      }
      el.onmousewheel = function (e) {
        if (downEl) {
          let newTransform = ''
          let transform = ''
          if (downEl.style.transform) {
            transform = downEl.style.transform
          }

          // 默认填充
          if (transform.indexOf('scale') === -1) {
            transform += ' scale(1) '
          }

          const values = transform.split(' ')
          values.forEach((value) => {
            if (value.indexOf('scale') !== -1) {
              let scale = parseFloat(value.replace('scale(', '').replace(')', ''))
              scale += (speed * e.wheelDelta) / 5000
              if (scale < min) {
                scale = min
              }
              if (scale > max) {
                scale = max
              }
              newTransform += `scale(${scale}) `
            } else {
              newTransform += value + ' '
            }
          })
          downEl.style.transform = newTransform
        }
      }
}
