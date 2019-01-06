const BotDriver = require('botium-core').BotDriver

require('botium-connector-botpress')

const driver = new BotDriver()

driver.BuildFluent()
  .Start()
  .UserSaysText('tell me a joke')
  .WaitBotSays((msg) => {
    console.log(JSON.stringify(msg, null, 2))
  })
  .Stop()
  .Clean()
  .Exec()
  .then(() => {
    console.log('READY')
  })
  .catch((err) => {
    console.log('ERROR: ', err)
  })
