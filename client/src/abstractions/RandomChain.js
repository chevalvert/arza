import randomOf from 'utils/array-random'
import lastOf from 'utils/array-last'

export default class RandomChain {
  constructor (array = [], historyLength = 1, prng = Math.random) {
    this.array = array
    this.prng = prng

    this.historyLength = Math.min(historyLength, array.length - 1)
    this.reset()
  }

  reset () { this.history = [] }
  get length () { return this.array.length }
  get previous () { return lastOf(this.history) }

  get next () {
    if (!this.length) return

    const item = randomOf(this.array, {
      exclude: this.history,
      prng: this.prng
    })

    return this.use(item)
  }

  use (item) {
    if (!this.array.length) return

    this.history.push(item)
    if (this.history.length > this.historyLength) this.history.shift()

    return item
  }
}
