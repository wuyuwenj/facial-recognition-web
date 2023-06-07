import React from 'react';

declare const cv: any;

const OpenCVComponent: React.FC = () => {
  let imgElement: HTMLImageElement | null = null;
  let inputElement: HTMLInputElement | null = null;
  let canvasElement: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          imgElement!.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
    if (imgElement) {
    imgElement.onload = function() {
      let mat = cv.imread(imgElement);
      cv.imshow('canvasOutput', mat);
      mat.delete();
    };
  }
    // var Module = {
    //   // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
    //   onRuntimeInitialized() {
    //     document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    //   }
    // };
  };

  const handleImageLoad = () => {
    ctx?.drawImage(imgElement!, 0, 0);
  };

  let src = cv.imread('canvasInput');
  let gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
  let faces = new cv.RectVector();
  let eyes = new cv.RectVector();
  let faceCascade = new cv.CascadeClassifier();
  let eyeCascade = new cv.CascadeClassifier();
  // load pre-trained classifiers
  faceCascade.load('haarcascade_frontalface_default.xml');
  eyeCascade.load('haarcascade_eye.xml');
  // detect faces
  let msize = new cv.Size(0, 0);
  faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
  for (let i = 0; i < faces.size(); ++i) {
      let roiGray = gray.roi(faces.get(i));
      let roiSrc = src.roi(faces.get(i));
      let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
      let point2 = new cv.Point(faces.get(i).x + faces.get(i).width,
                                faces.get(i).y + faces.get(i).height);
      cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
      // detect eyes in face ROI
      eyeCascade.detectMultiScale(roiGray, eyes);
      for (let j = 0; j < eyes.size(); ++j) {
          let point1 = new cv.Point(eyes.get(j).x, eyes.get(j).y);
          let point2 = new cv.Point(eyes.get(j).x + eyes.get(j).width,
                                    eyes.get(j).y + eyes.get(j).height);
          cv.rectangle(roiSrc, point1, point2, [0, 0, 255, 255]);
      }
      roiGray.delete(); roiSrc.delete();
  }
  cv.imshow('canvasOutput', src);
  src.delete(); gray.delete(); faceCascade.delete();
  eyeCascade.delete(); faces.delete(); eyes.delete();

  return (
    <div>
      <h2>Hello OpenCV.js</h2>
      <p id="status">OpenCV.js is loading...</p>
      <div>
        <div className="inputoutput">
          <img id="imageSrc" style={{ maxWidth: '300px', maxHeight: '300px' }} alt="No Image" ref={(element) => (imgElement = element)} />
          <div className="caption">
            imageSrc <input type="file" id="fileInput" name="file" onChange={handleImageUpload} ref={(element) => (inputElement = element)} />
          </div>
        </div>
        <div className="inputoutput">
          <canvas id="canvasOutput"  ref={(element) => (canvasElement = element)}></canvas>
          <div className="caption">canvasOutput</div>
        </div>
      </div>
    </div>
  );
};

export default OpenCVComponent;
