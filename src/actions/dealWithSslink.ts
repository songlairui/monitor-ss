import * as path from 'path'
import * as notifier from 'node-notifier'
import updateTmp from './updateConfigFile'
import parseSsLink from '../utils/parseSsLink'
import { Config } from '../all.interface'

export default function(str: string) {
  const config: Config = parseSsLink(str)
  const stamp = new Date().toISOString()
  updateTmp(config, {
    success() {
      notifier.notify({
        title: '更新 ss://',
        message: `server: ${config.server}`,
        icon: path.join(__dirname, '../coulson.jpg'), // Absolute path (doesn't work on balloons)
        sound: true, // Only Notification Center or Windows Toasters
        wait: true, // Wait with callback, until user action is taken against notification
      })
      // notifier.on('click', function(_, options, event) {
      //   console.info('click', options, event)
      // })
      process.stdout.write(
        `${JSON.stringify({
          stamp,
          code: 0,
          info: 'UPDATE SUCCESS',
        })}\n`
      )
    },
    fail(err) {
      process.stdout.write(
        `${JSON.stringify({
          stamp,
          code: 1,
          info: err && err.message,
        })}\n`
      )
    },
  })
}
