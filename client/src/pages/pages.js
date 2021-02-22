// The global config is entered here so that it can be edited during
// development, but also inside the build/index.html script tag by the user,
// if necessary

const USER_CONFIG = {
  forceLogger: false,

  hardware: {
    key: 'p'
  },

  video: {
    source: 'arza-crop-pp.mp4',
    passivePlaybackRate: 0.25,
    activePlaybackRate: 10
  },

  SfxHandler: {
    soundsLength: 4,
    speakersLength: 6,
    filenamePattern: 'sfx/{{speakerIndex:1}}_AZ_Sfx{{soundIndex:01}}.wav'
  },

  DroneHandler: {
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
