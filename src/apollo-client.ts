import 'cross-fetch/polyfill'
import ws from 'ws'

import { ApolloClient } from 'apollo-client'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'

const API_URL = 'https://boat.songlairui.cn/graphql'

const httpLink = new HttpLink({
  uri: API_URL,
})

const wsLink = new WebSocketLink({
  uri: `wss://boat.songlairui.cn/subscriptions`,
  options: {
    reconnect: true,
  },
  webSocketImpl: ws,
})

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)
export default new ApolloClient({
  link,
  cache: new InMemoryCache(),
})
