import gql from 'graphql-tag'
import Debug from 'debug'
import client from './apollo-client'
import dealWithSsLink from './actions/dealWithSslink'
import dealWithOnlineMedia from './actions/dealWithOnlineMedia'
import dealWithDirective from './actions/dealWithDirective'

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
        let {
          tracing: { str = '' },
        } = data
        str = str.trim()
        if (!str) {
          //
        } else if (str.startsWith('ss://')) {
          dealWithSsLink(str)
        } else if (str.startsWith('http://') || str.startsWith('https://')) {
          if (str.indexOf('.m3u8') > -1) {
            dealWithOnlineMedia(str)
          } else {
            console.info('url')
          }
        } else {
          let directive
          try {
            directive = JSON.parse(str)
          } catch (error) {
            directive = { value: str }
          }
          dealWithDirective(directive)
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
