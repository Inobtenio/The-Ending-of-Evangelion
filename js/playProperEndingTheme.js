(function() {
  const mediaName = 'Neon Genesis Evangelion'; // Works for Roman/Latin-alphabet-based languages only
  const audioBaseURL = 'https://inobtenio.dev/projects/the-ending-of-evangelion/audio/mp3/';
  let episodeNumber, episodeData, audio, video;
  let previousURL = document.location.href;

  const playProperEndingTheme = function() {
    if (watchingEvangelion() && urlHasNotChanged()) {
      episodeNumber = getEpisodeNumber();
      video = document.querySelector('video');
      audio = audio || new Audio(`${audioBaseURL}${episodeNumber}.mp3`);

      if (audio && video) replaceEnding();
    } else {
      forgetAudioAndEpisode();
    }
  }

  const watchingEvangelion = function() {
    return  document.location.href.indexOf('watch') != -1 &&
            document.querySelector('.ellipsize-text') &&
            !document.querySelector('.player-loading') &&
            document.querySelector('.ellipsize-text').textContent.indexOf(mediaName) != -1;
  }

  const urlHasNotChanged = function() {
    const unchanged = document.location.href == previousURL;
    previousURL = document.location.href;
    return unchanged;
  }

  const getEpisodeNumber = function() {
    return parseInt(document.getElementsByClassName('ellipsize-text')[0].children[1].textContent.substring(4,6));
  }

  const replaceEnding = function() {
    episodeData = EPISODES[episodeNumber];

    if (between(video.currentTime, episodeData['muteBetween'])) {
      audio.volume = video.volume;
      video.muted = true;

      setVideoEvents();

      if (video.currentTime >= episodeData['endingStart']) {
        if (!endingPlaying) audio.play();
        endingPlaying = true;
      }
    } else {
      removeVideoEvents();
      resetAudioPlayback();
      video.muted = false;
      endingPlaying = false;
    }
  }

  const setVideoEvents = function() {
    video.onplay = function() {
      if (audio) audio.play();
    };

    video.onpause = function() {
      if (audio) audio.pause();
    };

    video.onseeked = function() {
      if (audio) seekAudio();
    };
  }

  const removeVideoEvents = function() {
    video.onplay = video.onpause = video.onseeked = function() {};
  }

  const between = function(value, range) {
    return value >= range[0] && value <= range[1];
  }

  const seekAudio = function() {
    const distance = video.currentTime - episodeData['endingStart'];

    if (distance <= audio.duration) {
      audio.currentTime = distance;
    } else {
      resetAudioPlayback();
    }
  }

  const resetAudioPlayback = function() {
    audio.pause();
    audio.currentTime = 0;
  }

  const forgetAudioAndEpisode = function() {
    if (audio) audio.pause();
    audio = undefined;
    episodeNumber = undefined;
  }

  setInterval(playProperEndingTheme,100);
})()
