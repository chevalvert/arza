// The global config is entered here so that it can be edited during
// development, but also inside the build/index.html script tag by the user,
// if necessary

const USER_CONFIG = {
  app: {
    logger: false, // Will be forced to true in not dev
    fullscreen: true
  },

  hardware: {
    key: 'p'
  },

  video: {
    source: 'arza-crop-pp.mp4',
    passivePlaybackRate: 0.5,
    activePlaybackRate: 10,
    triggerDuration: [500, 1000] // ms
  },

  SfxHandler: {
    soundsLength: 43,
    speakersLength: 6,
    maxConcurrentPlays: 4,
    filenamePattern: 'sfx/{{speakerIndex:1}}_AZ_Sfx{{soundIndex:01}}.wav'
  },

  DroneHandler: {
    volume: 0.75,
    soundsLength: 6,
    filenamePattern: 'drones/Drones_AZ_{{soundIndex:01}}.wav'
  }
}

module.exports = [
  {
    output: 'index.html',
    layout: 'pages/index.hbs',
    content: {
      title: 'Arza',
      lang: 'en',
      env: USER_CONFIG
    }
  }
]
