let baseSize = 0
let timer = null
const setBaseSize = function () {
  baseSize = (document.documentElement.clientWidth / 750) * 40
  baseSize = baseSize > 40 ? 40 : baseSize
  document.documentElement.style.fontSize = baseSize + 'px'
}

window.addEventListener('resize', function () {
  timer && clearTimeout(timer)
  timer = setTimeout(setBaseSize, 300)
}, false)
setBaseSize()