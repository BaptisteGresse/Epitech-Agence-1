const bleu = document.getElementById('b');
const orange = document.getElementById('o');
const violet = document.getElementById('p');
const rouge = document.getElementById('r');
const vert = document.getElementById('g');

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');


var color = "white"



bleu.addEventListener('click', function(){
    color = "blue";
})
orange.addEventListener('click', function(){
    color = "orange";
})
violet.addEventListener('click', function(){
    color = "purple";
})
rouge.addEventListener('click', function(){
    color = "red";
})
vert.addEventListener('click', function(){
    color = "green";
})


function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION,
                     {color: '#C0C0C070', lineWidth: 1});
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {color: color});
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {color: color});
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {color: color});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {color: color});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {color: color});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {color: color});
      drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {color: color});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, {color: color});
    }
  }
  canvasCtx.restore();
}

const faceMesh = new FaceMesh({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});
faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
faceMesh.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({image: videoElement});
  },
  width: 1280,
  height: 720
});
camera.start();
