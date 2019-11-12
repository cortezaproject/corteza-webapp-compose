import hr from 'hex-rgb'
const isLightThreshold = 100
const bgAlpha = 0.7

/**
 * Helper to determine event's colors
 * @param {String} hex Base color in HEX format
 * @returns {Object} { backgroundColor: String, borderColor: String, isLight: Boolean }
 */
export function makeColors (hex) {
  const bg = hr(hex, { format: 'array' })
  const br = [ ...bg ]
  bg[3] = bgAlpha

  return {
    backgroundColor: `rgba(${bg.join(',')})`,
    borderColor: `rgba(${br.join(',')})`,
    isLight: (bg.slice(0, 3).reduce((acc, cur) => acc + cur, 0) / (bg.length - 1)) > isLightThreshold,
  }
}
