class ZMPDevKit {
  onSuccess() {}

  constructor() {
    if (!ZMPDevKit.instance) {
      this.storageKey = 'ZMPDevKitConfig.'
      this.zAppId = ''
      this.accessToken = ''
      this.refreshToken = ''
      this.secretKey = ''
      ZMPDevKit.instance = this
    }
    return ZMPDevKit.instance
  }

  static async init({ zAppId, onSuccess }) {
    const instance = new ZMPDevKit()
    instance.zAppId = zAppId
    instance.storageKey += zAppId
    instance.onSuccess = onSuccess
    const config = localStorage.getItem(instance.storageKey)
    try {
      if (config) {
        const { accessToken, refreshToken, secretKey } = JSON.parse(config)
        instance.accessToken = accessToken
        instance.refreshToken = refreshToken
        instance.secretKey = secretKey
        await instance.refresh()
      } else {
        throw new Error('No config found')
      }
    } catch (e) {
      instance.login()
    }
  }

  persistConfig() {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify({
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        secretKey: this.secretKey,
      }),
    )
  }

  async refresh() {
    const url = 'https://oauth.zaloapp.com/v4/access_token'
    const form = new URLSearchParams()
    form.append('app_id', this.zAppId)
    form.append('refresh_token', this.refreshToken)
    form.append('grant_type', 'refresh_token')
    const res = await fetch(url, {
      method: 'POST',
      body: form,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', secret_key: this.secretKey },
    })
    const data = await res.json()
    if (data.error < 0) {
      this.refreshToken = ''
      this.refreshToken = ''
      this.persistConfig()
      throw new Error(data.error_description)
    }
    this.accessToken = data.access_token || ''
    this.refreshToken = data.refresh_token || ''
    this.onSuccess({ accessToken: this.accessToken })
    this.persistConfig()
    return data.access_token
  }

  async login() {
    if (!this.secretKey) {
      const secretKey = prompt('Enter Zalo App Secret Key')
      this.secretKey = secretKey || ''
    }
    if (!this.refreshToken) {
      const refreshToken = prompt('Enter Zalo App Refresh Token')
      this.refreshToken = refreshToken || ''
    }
    await this.refresh()
    window.location.reload()
  }
}

window.ZMPDevKit = ZMPDevKit
