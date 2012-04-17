// Begin Sound.js
sounds.initialize = function() {
   sounds.ahh = document.getElementById('soundAhh');
   sounds.bing = document.getElementById('soundBing');
   sounds.explode = document.getElementById('soundExplode');
   sounds.pickup = document.getElementById('soundPickup');
   sounds.ahh.volume = .75;
   sounds.bing.volume = .75;
   sounds.explode.volume = .35;
   sounds.pickup.volume = .75;
};

sounds.Play = function(name) {
   sounds[name].play();
};
