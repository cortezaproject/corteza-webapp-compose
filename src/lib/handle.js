const re = /^[A-Za-z][0-9A-Za-z_\-.]*[A-Za-z0-9]$/

export const isValid = (h) => re.test(h)

// Used for state
export const handleState = (h) => h.length > 0 ? isValid(h) : null
