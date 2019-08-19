export const rgbaRegex = /^rgba\((\d+),.*?(\d+),.*?(\d+),.*?(\d*\.?\d*)\)$/

const ln = (n) => Math.round(n < 0 ? 255 - n : n)
export const toRGBA = ([r, g, b, a]) =>
  `rgba(${ln(r)}, ${ln(g)}, ${ln(b)}, ${a})`
