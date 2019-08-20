import gql from 'graphql-tag'
import Debug from 'debug'
import client from './apollo-client'
import updateTmp from './actions/updateConfigFile'
import parseSsLink from './actions/parseSsLink'
import { Config } from './all.interface'

const debug = Debug('[update file]')

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
            success() {},
            fail() {},
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
}

main()
