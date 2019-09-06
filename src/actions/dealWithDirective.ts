import { cache } from '../m'

interface Directive {
  type?: string
  value?: string
}
let fullscreen = true

export default function(directive: Directive) {
  const { type, value } = directive
  const { mpvPlayer } = cache
  switch (type) {
    default:
      if (mpvPlayer) {
        switch (value) {
          case '<':
            mpvPlayer.seek(-15)
            break
          case '>':
            mpvPlayer.seek(15)
            break
          case 'f':
            fullscreen ? mpvPlayer.leaveFullscreen() : mpvPlayer.fullscreen()
            fullscreen = !fullscreen
            break
          case 'x':
            mpvPlayer.quit()
            cache.mpvPlayer = undefined
            break
        }
      } else {
        console.info('no mpvPlayer')
      }
  }
}
