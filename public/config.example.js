const domain = 'latest.crust.tech'

window.CrustConfig = {
  system: { baseUrl: `https://system.api.${domain}` },
  messaging: { baseUrl: `https://messaging.api.${domain}` },
  crm: { baseUrl: `https://crm.api.${domain}` },
  webapp: {
    auth: {
      // signInUrl: `https://system.api.${domain}/social/gplus`,
      adtSignOutUrl: `https://satosa.didmos.${domain}/didmos/logout/`,
    },
    baseUrl: `http://${domain}`,
    defaultLocale: 'en',
  },
}
