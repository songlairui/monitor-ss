import gql from 'graphql-tag'
import Debug from 'debug'
import client from './apollo-client'
import dealWithSsLink from './actions/dealWithSslink'

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
          tracing: { str = '' },
        } = data
        if (str && str.startsWith('ss://')) {
          dealWithSsLink(str)
        } else {
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
