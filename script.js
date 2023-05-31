let video = document.getElementById('videoEML');


const trainingFaceAPI = async () => {
    await faceapi.nets.faceLandmark68Net.loadFromUri('./weights');
    await faceapi.nets.faceRecognitionNet.loadFromUri('./weights');
    await faceapi.nets.tinyFaceDetector.loadFromUri('./weights');
    await faceapi.nets.faceExpressionNet.loadFromUri('./weights'); //du doan bieu cam khuon mat 
    
}


async function setupCamera() {
    // Find the video element on our HTML page
    video = document.getElementById('videoEML');
    
    // Request the front-facing camera of the device
    const stream = await navigator.mediaDevices.getUserMedia({
        'audio': false,
        'video': {
          facingMode: 'user',
          height: {ideal:1920},
          width: {ideal: 1920},
        },
      });
    video.srcObject = stream;
    
    // Handle the video stream once it loads.
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

 video.addEventListener('playing', () =>{
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const size = {
        width: video.videoWidth,
        height: video.videoHeight
    }
    setInterval(async() =>{
        const a = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
        const resize = faceapi.resizeResults(a, size);
        canvas.getContext('2d').clearRect(0, 0, size.width, size.height);
        faceapi.draw.drawDetections(canvas, resize)
        faceapi.draw.drawFaceLandmarks(canvas, resize)
        faceapi.draw.drawFaceExpressions(canvas, resize)
    }, 300);
 })
trainingFaceAPI().then(setupCamera())
// getCameraStream()

