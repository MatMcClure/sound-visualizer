const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
const file = document.getElementById('fileupload');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let audioSource;
let analyser;

container.addEventListener('click', function() {
  const audioCtx = new AudioContext
  audio1.play();
  audioSource = audioCtx.createMediaElementSource(audio1);
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination)
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const barWidth = canvas.width/bufferLength;
  let barHeight;
  let x;

  function animate(){
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    drawVisualizer (bufferLength, x, barWidth, barHeight, dataArray);
    requestAnimationFrame(animate);
  }
  animate();
});


file.addEventListener('change', function() {
  const files = this.files;
  const audio1 = document.getElementById('audio1')
  audio1.src = URL.createObjectURL(files[0]);
  audio1.load();
  audio1.play();
  audioSource = audioCtx.createMediaElementSource(audio1);
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination)
  analyser.fftSize = 64;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const barWidth = canvas.width/bufferLength;
  let barHeight;
  let x;

  function animate(){
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 4;
      ctx.fillStyle = 'white';
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth;
    }
    requestAnimationFrame(animate);
  }
  animate();
});

function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 3;
    const red = i * barHeight/20;
    const green = i * 4;
    const blue = barHeight/2;
    ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth;
  }
  /*for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 2;
    const red = i * barHeight/20;
    const green = i * 4;
    const blue = barHeight/2;
    ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth;
  }*/
}