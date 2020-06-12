(function() {
  const mediaName = 'Neon Genesis Evangelion'; // Works for Roman/Latin-alphabet-based languages only
  const audioBaseURL = 'https://inobtenio.dev/projects/the-ending-of-evangelion/audio/mp3/';
  let episodeNumber, episodeData, audio, video;

  const playProperEndingTheme = function() {
    if (watchingEvangelion()) {
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
            !document.querySelector('.player-loading') &&
            document.querySelector('.ellipsize-text') &&
            document.querySelector('.ellipsize-text').textContent.indexOf(mediaName) != -1;
  }

  const getEpisodeNumber = function() {
    return parseInt(document.getElementsByClassName('ellipsize-text')[0].children[1].textContent.substring(4,6));
  }

  const replaceEnding = function() {
    episodeData = EPISODES[episodeNumber];
    if (between(video.currentTime, episodeData['muteBetween'])) {
      audio.volume = video.volume;
      video.muted = true;

      video.onplay = function() {
        if (audio) audio.play();
      };

      video.onpause = function() {
        if (audio) audio.pause();
      };

      video.onseeked = function() {
        seekAudio();
      }

      if (video.currentTime >= episodeData['endingStart']) {
        if (!endingPlaying) audio.play();
        endingPlaying = true;
      }
    } else {
      video.muted = false;
      endingPlaying = false;
    }
  }

  const between = function(value, range) {
    return value >= range[0] && value <= range[1];
  }

  const seekAudio = function() {
    const distance = video.currentTime - episodeData['endingStart'];

    if (between(distance, [0, audio.duration])) {
      audio.currentTime = distance;
    } else {
      resetAudioPlayback();
    }
  }

  const resetAudioPlayback = function() {
    audio.pause();
    audio = undefined;
  }

  const forgetAudioAndEpisode = function() {
    if (audio) audio.pause();
    audio = undefined;
    episodeNumber = undefined;
  }

  setInterval(playProperEndingTheme,100);
})()
