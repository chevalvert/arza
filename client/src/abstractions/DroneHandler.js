import { Howl, Howler } from 'howler'
import { time } from 'utils/logger'
import sequence from 'utils/filename-sequence'

Howler.autoUnlock = false

export default class DroneHandler {
  constructor ({
    soundsLength = window.ENV.DroneHandler.soundsLength,
    filenamePattern = window.ENV.DroneHandler.filenamePattern
  } = {}) {
    this.playNext = this.playNext.bind(this)

    this.soundIndex = -1
    this.sounds = []
    for (let soundIndex = 0; soundIndex < soundsLength; soundIndex++) {
      this.sounds.push(new Howl({
        src: sequence(filenamePattern, { soundIndex }),
        preload: false,
        onend: this.playNext
      }))
    }
  }

  get currentSound () {
    return this.sounds[this.soundIndex]
  }

  playNext () {
    this.currentSound && this.currentSound.stop()

    this.soundIndex = (this.soundIndex + 1) % this.sounds.length

    const timer = time('Loading ' + this.currentSound._src)
    this.currentSound.once('load', () => {
      this.currentSound.play()
      timer.end()
    })
    this.currentSound.load()
  }
}
