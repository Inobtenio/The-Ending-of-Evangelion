(function() {
  const mediaName = 'Neon Genesis Evangelion'; // Works for Roman/Latin-alphabet-based languages only
  const audioBaseURL = 'https://inobtenio.dev/projects/the-ending-of-evangelion/audio/mp3/';
  let episodeNumber, audio, video;

  const playProperEndingTheme = function() {
      if (watchingEvangelion()) {
        episodeNumber = findEpNumber();
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

  const findEpNumber = function() {
    return parseInt(document.getElementsByClassName('ellipsize-text')[0].children[1].textContent.substring(4,6));
  }

  const replaceEnding = function() {
    const episodeData = EPISODES[episodeNumber];
      if (containedIn(video.currentTime, episodeData['mutedBetween'])) {
        video.muted = true;
        audio.volume = video.volume;

        video.onplay = function() {
          if (audio) audio.play();
        };

        video.onpause = function() {
          if (audio) audio.pause();
        };

        video.onseeked = function() {
          seekAudio(episodeData['endingStart']);
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

  const containedIn = function between(value, range) {
    return value >= range[0] && value <= range[1];
  }

  const seekAudio = function(endingStart) {
    distance = video.currentTime - endingStart;

    if (containedIn(distance, [0, audio.duration])) {
      audio.currentTime = video.currentTime - endingStart;
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
