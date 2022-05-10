import SfxHandler from 'abstractions/SfxHandler'
import DroneHandler from 'abstractions/DroneHandler'
import { error, log, warn } from 'utils/logger'
import random from 'utils/random'

warn('Logging is active. Set `app.logger` to false to disable logging.')
if (!window.ENV.production) window.ENV.app.logger = true

window.addEventListener('keypress', () => {
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
  if (window.ENV.app.fullscreen && document.body.requestFullscreen) {
    document.body.requestFullscreen()
    window.setTimeout(() => { document.body.style.cursor = 'none' }, 1000)
  }

  // Load the video
  const video = document.querySelector('video')
  video.loop = true
  video.src = window.ENV.video.source
  video.playbackRate = window.ENV.video.passivePlaybackRate
  log('Loading ' + video.src)
  video.play()

  // Instanciate the sfx handler
  const sfx = new SfxHandler()

  // Instanciate the drone handler
  const droneHandler = new DroneHandler()
  droneHandler.playNext()

  // Handle Arza hardware trigger events
  window.addEventListener('keypress', e => {
    if (e.key !== window.ENV.hardware.key) return
    if (!video.duration) return

    // SFXHandler.play can return false if too much sounds are playing
    // concurrently. This mecanism is used to limit the number of rapid triggers
    const success = sfx.play()
    if (!success) {
      log('ArzaNoise trigger has been skipped because too many sounds are playing')
      return
    }

    window.clearTimeout(window.videoPlaybackRateRestorer)
    video.playbackRate = window.ENV.video.activePlaybackRate

    window.videoPlaybackRateRestorer = window.setTimeout(() => {
      video.playbackRate = window.ENV.video.passivePlaybackRate
    }, random(...window.ENV.video.triggerDuration))

    video.currentTime = video.duration - video.currentTime
  })
}
