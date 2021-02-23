/* eslint-disable no-eval */
import { Howl, Howler } from 'howler'
import RandomChain from 'abstractions/RandomChain'
import { log, time } from 'utils/logger'
import sequence from 'utils/filename-sequence'

Howler.autoUnlock = false

const IndexesArray = length => new Array(length).fill(true).map((_, i) => i)

export default class SfxHandler {
  constructor ({
    soundsLength = window.ENV.SfxHandler.soundsLength,
    speakersLength = window.ENV.SfxHandler.speakersLength,
    maxConcurrentPlays = window.ENV.SfxHandler.maxConcurrentPlays,
    filenamePattern = window.ENV.SfxHandler.filenamePattern
  } = {}) {
    this.play = this.play.bind(this)
    this.handleSoundLoad = this.handleSoundLoad.bind(this)
    this.maxConcurrentPlays = maxConcurrentPlays
    this.preloadTimer = time('Preloading SFX sounds')

    // Bi-dimensional array of all sounds
    this.sounds = []
    for (let soundIndex = 0; soundIndex < soundsLength; soundIndex++) {
      const sound = []
      for (let speakerIndex = 0; speakerIndex < speakersLength; speakerIndex++) {
        sound.push(new Howl({
          src: sequence(filenamePattern, { soundIndex, speakerIndex }),
          preload: true,
          onload: this.handleSoundLoad
        }))
      }
      this.sounds.push(sound)
    }

    // Random chain of all sounds indexes
    this.soundsIndex = new RandomChain(IndexesArray(soundsLength), 2)

    // Random chain of all speakers indexes
    this.speakersIndex = new RandomChain(IndexesArray(speakersLength), 2)
  }

  get playingSounds () {
    return this.sounds.reduce((playing, speakers) => ([
      ...playing,
      ...speakers.filter(sound => sound.playing())
    ]), [])
  }

  play (soundIndex = this.soundsIndex.next, speakerIndex = this.speakersIndex.next) {
    if (this.playingSounds.length > this.maxConcurrentPlays) return

    const sound = this.sounds[soundIndex][speakerIndex]
    log('Playing ' + sound._src)
    sound.play()
    return true
  }

  handleSoundLoad () {
    if (!this.preloadTimer) return

    const loaded = !this.sounds.find(speakers => speakers.find(sound => sound.state() !== 'loaded'))
    if (loaded) {
      this.preloadTimer.end()
      delete this.preloadTimer
    }
  }
}
