/* eslint-disable no-eval */
import { Howl, Howler } from 'howler'
import raf from '@internet/raf'
import RandomChain from 'abstractions/RandomChain'
import sequence from 'utils/filename-sequence'

Howler.autoUnlock = false

const IndexesArray = length => new Array(length).fill(true).map((_, i) => i)

export default class SfxHandler {
  constructor ({
    onPlay = function () {},

    soundsLength = window.ENV.SfxHandler.soundsLength,
    speakersLength = window.ENV.SfxHandler.speakersLength,
    filenamePattern = window.ENV.SfxHandler.filenamePattern
  } = {}) {
    this.play = this.play.bind(this)
    this.onPlay = onPlay

    // Bi-dimensional array of all sounds
    this.sounds = []
    for (let soundIndex = 0; soundIndex < soundsLength; soundIndex++) {
      const sound = []
      for (let speakerIndex = 0; speakerIndex < speakersLength; speakerIndex++) {
        sound.push(new Howl({
          src: sequence(filenamePattern, { soundIndex, speakerIndex }),
          preload: true
        }))
      }
      this.sounds.push(sound)
    }

    // Random chain of all sounds indexes
    this.soundsIndex = new RandomChain(IndexesArray(soundsLength), 2)

    // Random chain of all speakers indexes
    this.speakersIndex = new RandomChain(IndexesArray(speakersLength), 2)

    raf.add(this.handleRaf.bind(this))
  }

  get isPlaying () {
    return !!this.sounds.find(speakers => speakers.find(sound => sound.playing()))
  }

  play (soundIndex = this.soundsIndex.next, speakerIndex = this.speakersIndex.next) {
    const sound = this.sounds[soundIndex][speakerIndex]
    sound.play()
  }

  handleRaf () {
    if (!this.isPlaying) return
    this.onPlay()
  }
}
