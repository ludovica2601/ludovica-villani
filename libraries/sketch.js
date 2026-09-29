//            ▒▒▓▓▓▓▓▓▓▒▒▒         
//        ▒▓▓███▓▓▓▓▓▓▒▒▒▒▒▒▒      
//     ▒▓████▓▒                    
//    ▓████▓▒                      
//   ▓████▓     ▒▓▓████████▓▓▒     
//  ▓████▓    ▓███████████████▓▒   
// ▒▓████▒   ▓███▓░       ▒▓████▓░ 
// ▒████▓   ░▓██▓           ▓████▓░
// ▒████▓    ▓█▓             ▓████▒
// ▒████▓    ▓██▒            ▓████▒
// ▒████▓    ▒▓██▓▓▒▒▒▒░    ▒█████▒
// ▒█████▓    ░▒▓▓█▓▓▒░    ▒█████▓░
//  ▓█████▓               ▓██████▒ 
//  ▒▓█████▓▒           ▓▓█████▓▒  
//   ▒▓█████████▓▓▓▓▓█████████▓    
//     ▒▓██████████████████▓▒      
//         ▒▒▓▓▓▓▓▓▓▓▓▓▒▒           

// ©2026 Ludovica Villani
// a website by Andrea Martinelli (@carol__jpg)
// https://caroljpeg.github.io/Andrea_Martinelli/index.html





// transitional carousel global variables
let imageFiles = [
   'media/scorrimento/1b.jpg',
   'media/scorrimento/3b.jpg',
   'media/scorrimento/6.png',
   'media/scorrimento/7.png',
   'media/scorrimento/10.jpg',
   'media/scorrimento/10b.jpg',
   'media/scorrimento/13b.jpg',
   'media/scorrimento/14b.jpg',
   'media/scorrimento/16.jpg',
   'media/scorrimento/extreme-ultra-violet-4.jpeg',
   'media/scorrimento/extreme-ultra-violet-11.jpeg',
   'media/scorrimento/extreme-ultra-violet-12.jpeg',
   'media/scorrimento/extreme-ultra-violet-14.jpeg',
   'media/scorrimento/extreme-ultra-violet-16.jpeg',
   'media/scorrimento/extreme-ultra-violet-24.jpeg',
   'media/scorrimento/extreme-ultra-violet-26.jpeg',
   'media/scorrimento/extreme-ultra-violet-27.jpeg',
   'media/scorrimento/image-1.jpg',
   'media/scorrimento/rehersal-for-expected-futures.00002.png',
   'media/scorrimento/rehersal-for-expected-futures.00004.png',
   'media/scorrimento/rehersal-for-expected-futures.00006.png',
   'media/scorrimento/rehersal-for-expected-futures.00009.png',
   'media/scorrimento/rehersal-for-expected-futures.00011.png',
   'media/scorrimento/rehersal-for-expected-futures.00012.png',
   'media/scorrimento/rehersal-for-expected-futures.00013.png',
];

let currentIndex = 0;
let nextIndex = 0;

let currentImg = null;
let nextImg = null;
let loadingNext = false;

let fromBuffer, toBuffer;
let transitionShader;


let state = 'showing';
let stateStartTime = 0;

let displayDuration = 0;
let transitionDuration = 4;
let loadLeadTime = 1;

let transitionParams = {
  strength: 0.1
};




// buttons placement global variables
let button1, button2, button3, button4, button5;


function preload() {
  transitionShader = loadShader('libraries/transition.vert', 'libraries/transition.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  fromBuffer = createGraphics(windowWidth, windowHeight);
  toBuffer = createGraphics(windowWidth, windowHeight);
  buttonsBuffer = createGraphics(windowWidth, windowHeight);

  shuffleArray(imageFiles);
  loadCurrentImage();
  createButtons();
}

function createButtons(){
  button1 = createButton('Rehersal for Expected Futures');
  button1.class('floatingButton');
  button1.position(
    random((windowWidth / 6) * 3, (windowWidth / 6) * 4),
    random(windowHeight / 3, (windowHeight / 3 ) * 2)
  );
  button1.mousePressed(() => {
    window.location.href = 'rehersal-for-expected-futures.html';
  });

  button2 = createButton('A Body Holds A Body Holds A Body');
  button2.class('floatingButton');
  button2.position(
    random(0, (windowWidth / 6) * 2),
    random(windowHeight / 3, (windowHeight / 3) * 2)
  );
  button2.mousePressed(() => {
    window.location.href = 'a-body-holds-a-body-holds-a-body.html';
  });

  button3 = createButton('Extreme Ultra Violet');
  button3.class('floatingButton');
  button3.position(
    random((windowWidth / 6) * 3, (windowWidth / 6) * 4),
    random(0, windowHeight / 3)
  );
  button3.mousePressed(() => {
    window.location.href = 'extreme-ultra-violet.html';
  });

  button4 = createButton('Anatomia di un Diario');
  button4.class('floatingButton');
  button4.position(
    random(0, (windowWidth / 6) * 2),
    random(0, windowHeight / 3)
  );
  button4.mousePressed(() => {
    window.location.href = 'anatomia-di-un-diario.html';
  });
}





function loadCurrentImage() {
  loadImage(imageFiles[currentIndex], (img) => {
    currentImg = img;
    drawCoverImage(fromBuffer, img);
    stateStartTime = millis();
    state = 'showing';
  });
}

function draw() {
  background(0);
 
  let elapsed = (millis() - stateStartTime) / 1000;
 
  if (state === 'showing') {
    resetShader();
    if (currentImg) {
      image(fromBuffer, -width / 2, -height / 2, width, height);
    }
 
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
 
    shader(transitionShader);
    transitionShader.setUniform('from', fromBuffer);
    transitionShader.setUniform('to', toBuffer);
    transitionShader.setUniform('progress', t);
    transitionShader.setUniform('resolution', [width, height]);
    for (let key in transitionParams) {
      transitionShader.setUniform(key, transitionParams[key]);
    }
 
    rect(-width / 2, -height / 2, width, height);
 
    if (t >= 1) {
      resetShader();
 
      currentImg = nextImg;
      currentIndex = nextIndex;
      nextImg = null;
      loadingNext = false;
 
      let tmp = fromBuffer;
      fromBuffer = toBuffer;
      toBuffer = tmp;
 
      stateStartTime = millis();
      state = 'showing';
    }
  }
}
 
function startLoadingNext() {
  loadingNext = true;
  loadImage(imageFiles[nextIndex], (img) => {
    nextImg = img;
    drawCoverImage(toBuffer, img);
  });
}
 
function drawCoverImage(buffer, img) {
  let canvasRatio = buffer.width / buffer.height;
  let imgRatio = img.width / img.height;
 
  let drawWidth, drawHeight, offsetX, offsetY;
 
  if (imgRatio > canvasRatio) {
    drawHeight = buffer.height;
    drawWidth = buffer.height * imgRatio;
    offsetX = (buffer.width - drawWidth) / 2;
    offsetY = 0;
  } else {
    drawWidth = buffer.width;
    drawHeight = buffer.width / imgRatio;
    offsetX = 0;
    offsetY = (buffer.height - drawHeight) / 2;
  }
 
  buffer.image(img, offsetX, offsetY, drawWidth, drawHeight);
}





function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}





function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
 
  fromBuffer.resizeCanvas(width, height);
  toBuffer.resizeCanvas(width, height);
 
  if (currentImg) drawCoverImage(fromBuffer, currentImg);
  if (nextImg) drawCoverImage(toBuffer, nextImg);

  button1.position(
    random(0, (windowWidth / 6) * 2),
    random(0, windowHeight / 4)
  );
  button2.position(
    random((windowWidth / 6) * 3, (windowWidth / 6) * 4),
    random(0, windowHeight / 4)
  );
  button3.position(
    random(0, (windowWidth / 6) * 2),
    random(windowHeight / 4, (windowHeight / 4) * 2)
  );
  button4.position(
    random((windowWidth / 6) * 3, (windowWidth / 6) * 4),
    random(windowHeight / 4, (windowHeight / 4) * 2)
  );
}