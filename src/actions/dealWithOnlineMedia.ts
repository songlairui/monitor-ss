import { cache } from '../m'

// import * as mpv from 'node-mpv'
const mpv = require('node-mpv')

export default async function(url: string) {
  if (!cache.mpvPlayer) {
    cache.mpvPlayer = new mpv({}, ['--fullscreen'])
  }
  cache.mpvPlayer.load(url)
}
