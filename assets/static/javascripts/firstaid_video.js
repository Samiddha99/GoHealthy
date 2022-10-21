
var players;
players = Plyr.setup('.plyr-video', {
    controls: ['play-large', 'restart', 'rewind', 'play', 'fast-forward', 'progress', 'current-time', 'duration', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
    settings: ['captions', 'quality', 'speed', 'loop'],
    iconUrl: 'https://cdn.plyr.io/3.6.12/demo.svg',
    resetOnEnd: true,
    autopause: true,
    tooltips: { controls: true, seek: true },
    captions: { active: true, language: 'auto', update: false },
    quality: { default: 360, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240] },
    vimeo: { byline: false, portrait: false, title: false, speed: true, transparent: false },
    youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1 }
});

// Pause other videos when a video plays
players.forEach(function(player){ //iteration through all videos
    player.on('play',function(){ //when click the play button
        var others = players.filter(other => other != player) //get all videos except current video i.e. video at ith possition
        others.forEach(function(other){
            other.pause(); //Pause all other videos
        })
    });
});

window.players = players;