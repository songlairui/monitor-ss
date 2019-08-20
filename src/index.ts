import gql from 'graphql-tag'
import Debug from 'debug'
import * as path from 'path'
import * as notifier from 'node-notifier'
import client from './apollo-client'
import updateTmp from './actions/updateConfigFile'
import parseSsLink from './actions/parseSsLink'
import { Config } from './all.interface'

const debug = Debug('')

const query = gql`
  subscription {
    tracing {
      str
      stamp
    }
  }
`

function main() {
  client.subscribe({ query }).subscribe({
    next({ data }) {
      debug('receive:', data)
      try {
        const {
          tracing: { str },
        } = data
        if (str && str.startsWith('ss://')) {
          const config: Config = parseSsLink(str)
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
            },
            fail(err) {
              console.warn('err', err)
            },
          })
        }
      } catch (error) {
        console.error('parse data err', error)
      }
    },
    error(err) {
      console.error('subscribe err', err)
    },
  })
  console.log('Subscribed')
  debug(' --- DEBUGGING ---')
}

main()
