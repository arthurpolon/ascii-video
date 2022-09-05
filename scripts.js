const video = document.querySelector("#video");
const canvas = document.querySelector("#canvas");
const output = document.querySelector("#output");

const width = 64 * 2;
const height = 48 * 2;

canvas.width = width;
canvas.height = height;

const context = canvas.getContext("2d");

const densitiesArray = [
  "          _.,-=+:;cba!?0123456789$W#@Ñ",
  "     .:-i|=+%O#@",
  " .:░▒▓█",
];

const density = densitiesArray[1];

function map_range(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

const setVideoSource = async () => {
  video.srcObject = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
};

const drawImageInCanvas = () => {
  output.innerHTML = "";

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  const data = imageData.data;

  let asciiImage = "";

  for (let i = 0; i < canvas.height; i++) {
    for (let j = 0; j < canvas.width; j++) {
      const pixelIndex = (j + i * canvas.width) * 4;

      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];

      const avg = (r + g + b) / 3;

      const charIndex = Math.floor(map_range(avg, 0, 255, 0, density.length));

      const char = density.charAt(charIndex);

      if (char == " ") {
        asciiImage += "&nbsp;";
      } else {
        asciiImage += char;
      }
    }
    asciiImage += "<br />";
  }

  output.innerHTML = asciiImage;

  context.putImageData(imageData, 0, 0);
};

setVideoSource();
setInterval(drawImageInCanvas, 10);
