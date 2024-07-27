let player;
let audioSource;
let analyser;

const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
const file = document.getElementById('fileupload');
const audio1 = document.getElementById('audio1');
const youtubeLink = document.getElementById('youtubeLink');
const loadVideo = document.getElementById('loadVideo');
const searchQuery = document.getElementById('searchQuery');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
const API_KEY = '';

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '0',
    width: '0',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  loadVideo.addEventListener('click', function() {
    const youtubeUrl = youtubeLink.value;
    const videoId = youtubeUrl.split('v=')[1];
    if (videoId) {
      player.loadVideoById(videoId);
    }
  });
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    setupAudioContext(player.getIframe());
  }
}

function setupAudioContext(element) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  audioSource = audioCtx.createMediaElementSource(element);
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const barWidth = canvas.width / bufferLength;
  let barHeight;
  let x;

  function animate() {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
    requestAnimationFrame(animate);
  }
  animate();
}

container.addEventListener('click', function() {
  if (!audio1.paused) {
    audio1.play();
    setupAudioContext(audio1);
  }
});

file.addEventListener('change', function() {
  const files = this.files;
  audio1.src = URL.createObjectURL(files[0]);
  audio1.load();
  audio1.play();
  setupAudioContext(audio1);
});

function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 3;
    const red = i * barHeight / 20;
    const green = i * 4;
    const blue = barHeight / 2;
    ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth;
  }
}

searchButton.addEventListener('click', function() {
  const query = searchQuery.value;
  if (query) {
    searchYouTube(query);
  }
});

function searchYouTube(query) {
  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${query}&key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      displaySearchResults(data.items);
    })
    .catch(error => {
      console.error('Error fetching YouTube data:', error);
    });
}

function displaySearchResults(results) {
  searchResults.innerHTML = '';
  results.forEach(result => {
    const videoId = result.id.videoId;
    const title = result.snippet.title;
    const thumbnail = result.snippet.thumbnails.default.url;

    const resultDiv = document.createElement('div');
    resultDiv.classList.add('search-result');
    resultDiv.innerHTML = `
      <img src="${thumbnail}" alt="${title}">
      <p>${title}</p>
    `;
    resultDiv.addEventListener('click', function() {
      player.loadVideoById(videoId);
    });
    searchResults.appendChild(resultDiv);
  });
}

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

/*const container = document.getElementById('container');
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
