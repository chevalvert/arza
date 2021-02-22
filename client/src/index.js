import SfxHandler from 'abstractions/SfxHandler'
import DroneHandler from 'abstractions/DroneHandler'
import { error, log, warn } from 'utils/logger'

warn('Logging is active. Set `forceLogger` to false to disable logging.')

window.addEventListener('click', () => {
  try {
    setup()
  } catch (e) {
    console.error(e)
    error(e.stack || e)
  }
}, { once: true })

function setup () {
  document.body.classList.add('is-running')

  // Enable fullscreen on production
  if (window.ENV.production && document.body.requestFullscreen) {
    document.body.requestFullscreen()
  }

  // Load the video
  const video = document.querySelector('video')
  video.loop = true
  video.src = window.ENV.video.source
  video.playbackRate = window.ENV.video.passivePlaybackRate
  log('Loading ' + video.src)
  video.play()

  // Instanciate the sfx handler
  const sfx = new SfxHandler({
    onPlay: () => {
      if (!video.duration) return

      window.clearTimeout(window.videoPlaybackRateRestorer)
      video.playbackRate = window.ENV.video.activePlaybackRate

      window.videoPlaybackRateRestorer = window.setTimeout(() => {
        video.playbackRate = window.ENV.video.passivePlaybackRate
      }, 20)
    }
  })

  // Instanciate the drone handler
  const droneHandler = new DroneHandler()
  droneHandler.playNext()

  // Handle Arza hardware trigger events
  window.addEventListener('keypress', e => {
    if (e.key !== window.ENV.hardware.key) return
    log('ArzaNoise has been triggered')
    sfx.play()
    video.currentTime = video.duration - video.currentTime
  })
}
