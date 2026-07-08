let imageFiles = [
    'media/rehersal-for-expected-futures/rehersal-for-expected-futures.00001.png',
    'media/rehersal-for-expected-futures/rehersal-for-expected-futures.00002.png',
    'media/rehersal-for-expected-futures/rehersal-for-expected-futures.00003.png',
    'media/rehersal-for-expected-futures/rehersal-for-expected-futures.00004.png',
    'media/rehersal-for-expected-futures/rehersal-for-expected-futures.00005.png',
    'media/rehersal-for-expected-futures/rehersal-for-expected-futures.00006.png',
    'media/rehersal-for-expected-futures/rehersal-for-expected-futures.00007.png',
    'media/rehersal-for-expected-futures/rehersal-for-expected-futures.00008.png',
    'media/rehersal-for-expected-futures/rehersal-for-expected-futures.00009.png',
    'media/rehersal-for-expected-futures/rehersal-for-expected-futures.00010.png',
    'media/rehersal-for-expected-futures/rehersal-for-expected-futures.00011.png',
    'media/rehersal-for-expected-futures/rehersal-for-expected-futures.00012.png',
    'media/rehersal-for-expected-futures/rehersal-for-expected-futures.00013.png',
    'media/rehersal-for-expected-futures/rehersal-for-expected-futures.00014.png',
    'media/rehersal-for-expected-futures/rehersal-for-expected-futures.00015.png'
];

let currentIndex = 0;
let nextIndex = 0;

let currentImg = null;
let nextImg = null;

let state = 'showing';
let stateStartTime = 0;

let displayDuration = 5;
let transitionDuration = 1.5;
let loadLeadTime = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  loadCurrentImage();
}

function loadCurrentImage() {
  loadImage(imageFiles[currentIndex], (img) => {
    currentImg = img;
    stateStartTime = millis();
    state = 'showing';
  });
}

function draw() {
  background(0);

  let elapsed = (millis() - stateStartTime) / 1000;

  if (state === 'showing') {
    if (currentImg) drawCoverImage(currentImg, 255);

    if (elapsed > displayDuration - loadLeadTime && nextImg === null && !loadingNext) {
      nextIndex = (currentIndex + 1) % imageFiles.length;
      startLoadingNext();
    }

    if (elapsed > displayDuration && nextImg !== null) {
      state = 'transitioning';
      stateStartTime = millis();
    }

  } else if (state === 'transitioning') {
    let t = constrain(elapsed / transitionDuration, 0, 1);

    if (currentImg) drawCoverImage(currentImg, 255);
    if (nextImg) drawCoverImage(nextImg, t * 255);

    if (t >= 1) {
      currentImg = null;
      currentImg = nextImg;
      currentIndex = nextIndex;
      nextImg = null;
      loadingNext = false;

      stateStartTime = millis();
      state = 'showing';
    }
  }
}

let loadingNext = false;

function startLoadingNext() {
  loadingNext = true;
  loadImage(imageFiles[nextIndex], (img) => {
    nextImg = img;
  });
}

function drawCoverImage(img, alpha) {
  let canvasRatio = width / height;
  let imgRatio = img.width / img.height;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (imgRatio > canvasRatio) {
    drawHeight = height;
    drawWidth = height * imgRatio;
    offsetX = (width - drawWidth) / 2;
    offsetY = 0;
  } else {
    drawWidth = width;
    drawHeight = width / imgRatio;
    offsetX = 0;
    offsetY = (height - drawHeight) / 2;
  }

  tint(255, alpha);
  image(img, offsetX, offsetY, drawWidth, drawHeight);
  noTint();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}