const util = require('util')
const request = require('request')
const uuidv4 = require('uuid/v4')
const debug = require('debug')('botium-connector-botpress')

const Capabilities = {
  BOTPRESS_SERVER_URL: 'BOTPRESS_SERVER_URL',
  BOTPRESS_BOTID: 'BOTPRESS_BOTID',
  BOTPRESS_USERID: 'BOTPRESS_USERID',
  BOTPRESS_USE_INTENT: 'BOTPRESS_USE_INTENT'
}

class BotiumConnectorBotpress {
  constructor ({ queueBotSays, caps }) {
    this.queueBotSays = queueBotSays
    this.caps = caps
    this.userId = null
  }

  Validate () {
    debug('Validate called')

    if (!this.caps[Capabilities.BOTPRESS_SERVER_URL]) throw new Error('BOTPRESS_SERVER_URL capability required')
    if (!this.caps[Capabilities.BOTPRESS_BOTID]) throw new Error('BOTPRESS_BOTID capability required')

    return Promise.resolve()
  }

  Start () {
    debug('Start called')

    if (this.caps[Capabilities.BOTPRESS_USERID]) {
      this.userId = this.caps[Capabilities.BOTPRESS_USERID]
    } else {
      this.userId = uuidv4()
    }
  }

  UserSays (msg) {
    debug(`UserSays called ${util.inspect(msg)}`)
    return this._doRequest(msg)
  }

  Stop () {
    debug('Stop called')
    this.userId = null
  }

  _doRequest (msg) {
    return new Promise((resolve, reject) => {
      const requestOptions = this._buildRequest(msg)
      debug(`constructed requestOptions ${JSON.stringify(requestOptions, null, 2)}`)

      request(requestOptions, (err, response, body) => {
        if (err) {
          reject(new Error(`rest request failed: ${util.inspect(err)}`))
        } else {
          if (response.statusCode >= 400) {
            debug(`got error response: ${response.statusCode}/${response.statusMessage}`)
            return reject(new Error(`got error response: ${response.statusCode}/${response.statusMessage}`))
          }
          resolve(this)

          if (body) {
            debug(`got response body: ${JSON.stringify(body, null, 2)}`)

            if (this.caps[Capabilities.BOTPRESS_USE_INTENT]) {
              const botMsg = {
                sourceData: body,
                messageText: body.nlu && body.nlu.intent && body.nlu.intent.name
              }
              this.queueBotSays(botMsg)
            } else {
              body.responses && body.responses.forEach(r => {
                if (r.type === 'carousel') {
                  if (r.elements) {
                    const botMsg = {
                      sourceData: body,
                      cards: r.elements.map(e => ({
                        text: e.title,
                        image: e.picture && { mediaUri: e.picture },
                        buttons: e.buttons && e.buttons.map(b => ({
                          text: b.title,
                          payload: b.url
                        }))
                      })),
                      messageText: r.elements.length === 1 && r.elements[0].title
                    }
                    this.queueBotSays(botMsg)
                  }
                } else if (r.type === 'file') {
                  if (r.url) {
                    const botMsg = {
                      sourceData: body,
                      media: [{
                        mediaUri: r.url
                      }]
                    }
                    this.queueBotSays(botMsg)
                  }
                } else if (r.text) {
                  const botMsg = {
                    sourceData: body,
                    messageText: r.text
                  }
                  if (r.quick_replies) {
                    botMsg.buttons = r.quick_replies.map(qr => ({
                      text: qr.title,
                      payload: qr.payload
                    }))
                  }
                  this.queueBotSays(botMsg)
                }
              })
            }
          }
        }
      })
    })
  }

  _buildRequest (msg) {
    const uri = `${this.caps[Capabilities.BOTPRESS_SERVER_URL]}/api/v1/bots/${this.caps[Capabilities.BOTPRESS_BOTID]}/converse/${this.userId}?include=nlu,state`

    const requestOptions = {
      uri,
      method: 'POST',
      json: true,
      body: {
        type: 'text',
        text: msg.messageText
      }
    }
    return requestOptions
  }
}

module.exports = BotiumConnectorBotpress
