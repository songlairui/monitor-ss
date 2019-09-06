import { cache } from '../m'

// import * as mpv from 'node-mpv'
const mpv = require('node-mpv')

export default async function(url: string) {
  if (!cache.mpvPlayer) {
    const mpvPlayer = new mpv({}, ['--fullscreen', '--ontop'])
    cache.mpvPlayer = mpvPlayer
    mpvPlayer.on('quit', () => {
      console.info('mpvPlayer quit')
      cache.mpvPlayer = undefined
    })
  }
  cache.mpvPlayer.load(url)
}
