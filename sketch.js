const Glyphs = 'X@#W$9876543210?!abc;:+-./_ ';

const PeacockPath = "LowPeacock.jpg";
const ShrimpPath = "Shrimp.jpg";
const HMCPath = "logohmc.jpg";
const BananaPath = "PBJ.gif";

let PeacockImage;
let ShrimpImage;
let HMCImage;
let BananaGif;

let ImageRadio;
let CurrentImage;

let ColorModeRadio;
let InversionRadio;

function preload()
{
  PeacockImage = loadImage(PeacockPath);
  ShrimpImage = loadImage(ShrimpPath);
  HMCImage = loadImage(HMCPath);
  BananaGif = loadImage(BananaPath);
}

function setup()
{
  ImageRadio = createRadio();
  ImageRadio.position (420, 0);
  ImageRadio.size(80);
  ImageRadio.style('color', color(255,255,255));
  ImageRadio.option(PeacockPath,'Peacock');
  ImageRadio.option(ShrimpPath,'Shrimp');
  ImageRadio.option(HMCPath,'HMC ');
  ImageRadio.option(BananaPath,'Banana');
  ImageRadio.selected(PeacockPath);
  
  ColorModeRadio = createCheckbox('Background dark mode', true);
  ColorModeRadio.style('color', color(255,255,255));
  ColorModeRadio.position (500,0);
  ColorModeRadio.size(200);
  
  InversionRadio = createCheckbox('Invert image', false);
  InversionRadio.style('color', color(255,255,255));
  InversionRadio.position (500,20);
  InversionRadio.size(200);
  
  frameRate(10);
  
  createCanvas(400, 400);
}

function draw() {
  const DarkMode = ColorModeRadio.checked()
  if (DarkMode) {
    background(255);
  } else {
    background(0);
  }
  //image(CurrentImage, 0, 0, appWidth, appHeight);
  processImage(DarkMode);
}

function toGray(r, g, b)
{
  return 0.299 * r  + 0.587  * g + 0.114 * b; // NTSC formula
}

let FrameCounter = 0;

function processImage(DarkMode)
{
  const SelectedImage = ImageRadio.value();
  if (SelectedImage == PeacockPath)
  {
    CurrentImage = PeacockImage;
  }
  else if (SelectedImage == ShrimpPath)
  {
    CurrentImage = ShrimpImage;
  }
  else if (SelectedImage == HMCPath)
    {
      CurrentImage = HMCImage;
    }
  else
    {
      if ( CurrentImage != BananaGif)
        {
          FrameCounter = 0;
        }
      CurrentImage = BananaGif;
      const Frames = CurrentImage.numFrames();
      CurrentImage.setFrame(FrameCounter % Frames);
      FrameCounter++;
    }
  CurrentImage.loadPixels();
  
  
  const w = width / CurrentImage.width;
  const h = height / CurrentImage.height;
  const Len = Glyphs.length;
  noStroke();
  textSize(w);
  if (ColorModeRadio.checked()) {
    fill(0);
  } else {
    fill(255);
  }
  for (let i = 0; i < CurrentImage.width; ++i)
    {
      for (let j = 0; j < CurrentImage.height; ++j)
        {
          const pixelIndex = (i + j * CurrentImage.width) * 4;
          const r = CurrentImage.pixels[pixelIndex + 0];
          const g = CurrentImage.pixels[pixelIndex + 1];
          const b = CurrentImage.pixels[pixelIndex + 2];
          
          const GreyScale = toGray(r, g, b);

          const CharIndex = round(map(GreyScale, 0, 255, 0, Len - 1));
        
          const CharIndexWithInvert = InversionRadio.checked() ? Len -1  - CharIndex : CharIndex;
          
          const CharToDraw = Glyphs[CharIndexWithInvert];
          
          text(CharToDraw, i*w, j*h);
        }
    }
}