var arrayBuffer, sourceNode;
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
request.onload = () => {
  var audioData = request.response;
  audioContext.decodeAudioData(audioData, buffer => {
    if (!buffer) {
      throw new Error("Error during decoding audio file");
    } else {
      // Create source and nodes
      sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = buffer;
      sourceNode.loop = true; // Loop when music ends

      var analyserNode = audioContext.createAnalyser();
      analyserNode.fftsize = 128;
      analyserNode.smoothingTimeConstant = 1;
      arrayBuffer = new Uint8Array(analyserNode.fftsize);

      // Js Script node for raw audio data manipulation
      var scriptNode = audioContext.createScriptProcessor(2048, 1, 1);
      // This function will be called everytime the audioProcessingEvent event is fired, ie every 2048 frames loaded
      scriptNode.onaudioprocess = audioProcessingEvent => {
        // Copies waveform into 'arrayBuffer'
        analyserNode.getByteTimeDomainData(arrayBuffer);
      };

      // Connection
      sourceNode.connect(analyserNode);
      analyserNode.connect(scriptNode);
      scriptNode.connect(audioContext.destination);
      sourceNode.connect(audioContext.destination);

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
    sourceNode.start();
  });
}
