// localhost server
export let WS_URL = 'ws://10.100.102.149:8080/ws'

// if env is production, set WS_URL to production server
if (process.env.NODE_ENV === 'production') {
  console.log('production')
  WS_URL = 'wss://server.strixos.app/ws'
}

// // production server
// export const WS_URL = 'wss://server.strixos.app/ws'
