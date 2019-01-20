var arrayBuffer, node_source;
var audioContext;

try {
  // Create an audio context for most of moderns browsers (window explicitly mentioned for Safari...)
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
  throw new Error("Web Audio API is not supported in this browser");
}

// Create and send request to retrieve audio file
var request = new XMLHttpRequest();
request.open("GET", "audio/funky.mp3", true);
request.responseType = "arraybuffer";
// callback
request.onload = function() {
  var audioData = request.response;
  audioContext.decodeAudioData(audioData, function(buffer) {
    if (!buffer) {
      throw new Error("Error during decoding audio file");
    } else {
      // Create source and nodes
      node_source = audioContext.createBufferSource();
      node_source.buffer = buffer;
      node_source.loop = true; // Loop when music ends

      var node_analyser = audioContext.createAnalyser();
      node_analyser.fftsize = 128;
      node_analyser.smoothingTimeConstant = 1;
      var bufferLength = node_analyser.fftsize;
      arrayBuffer = new Uint8Array(bufferLength);

      // Js Script node for raw audio data manipulation
      var node_script = audioContext.createScriptProcessor(2048);
      // This function will be called everytime the audioProcessingEvent event is fired, ie every 2048 frames loaded
      node_script.onaudioprocess = function() {
        // Copies waveform into 'arrayBuffer'
        node_analyser.getByteTimeDomainData(arrayBuffer);
      };

      // Connection
      node_source.connect(node_analyser);
      node_analyser.connect(node_script);
      node_source.connect(audioContext.destination);

      // Display play button and wait for user interaction
      onMusicLoadSuccessful();
    }
  });
};

request.send();
render();

function onMusicLoadSuccessful() {
  var play_button = $("#play_button");
  $(".progress").hide();
  play_button.fadeIn();
  play_button.click(function() {
    $(".loader").fadeOut();
    audioContext.resume();
    node_source.start();
  });
}
