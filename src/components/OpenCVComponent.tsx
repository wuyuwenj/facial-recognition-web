import React, { useEffect, useRef, useState } from "react";
// import haarcascade_frontalface_default from '../opencv_data/haarcascade_frontalface_default.xml';
// import WebcamComponent from "./WebcamComponent";
import "./style.css";
declare const cv: any;
const OpenCVComponent: React.FC = () => {
  async function loadDataFile(cvFilePath: string, url: string) {
    // see https://docs.opencv.org/master/utils.js
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const data = new Uint8Array(buffer);
    cv.FS_createDataFile("/", cvFilePath, data, true, false, false);
  }
  useEffect(() => {
    async function load() {
      try {
        console.log("=======start downloading Haar-cascade models=======");
        await loadDataFile(
          "haarcascade_frontalface_default.xml",
          "models/haarcascade_frontalface_default.xml"
        );
      } catch (error) {
        console.error(error);
      }
    }
    load();
  }, []);

  let imgElementRef = useRef<HTMLImageElement | null>(null);
  let inputElementRef = useRef<HTMLInputElement | null>(null);
  let canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  let ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const [mat, setMat] = useState<any>(null);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("handleImageUpload", file);
    console.log("imgElementRef", imgElementRef.current);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          imgElementRef.current!.src = event.target.result as string;
          setImgLoaded(true);
        }
      };
      reader.readAsDataURL(file);
    }
    console.log("handleCanvasLoad", imgLoaded);

    if (imgElementRef.current) {
      imgElementRef.current.onload = function () {
        setMat(cv.imread(imgElementRef.current));
      };
    }
  };

  const handleCanvasLoad = () => {
    cv.imshow("canvasOutput", mat);
    console.log("mat", mat);
    // mat.delete();
    const imgElement = imgElementRef.current;
    const canvasElement = canvasElementRef.current;
    const ctx = ctxRef.current;

    // if (imgElement && canvasElement ) {
    setMat(cv.imread(imgElementRef.current));

    const gray = new cv.Mat();

    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);

    const faces = new cv.RectVector();

    const faceCascade = new cv.CascadeClassifier();
    // load pre-trained classifier
    // console.log(faceCascade);

    // Load the cascade classifier
    // const loadSuccess =
    faceCascade.load("haarcascade_frontalface_default.xml");

    // if (loadSuccess) {
    //   console.log("Cascade classifier loaded successfully");
    // } else {
    //   console.log("Failed to load cascade classifier");
    // }
    // detect faces

    const msize = new cv.Size(0, 0);

    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);

    // console.log("faces.size()", faces.size());
    for (let i = 0; i < faces.size(); ++i) {
      const roiGray = gray.roi(faces.get(i));
      const point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
      const point2 = new cv.Point(
        faces.get(i).x + faces.get(i).width,
        faces.get(i).y + faces.get(i).height
      );
      cv.rectangle(mat, point1, point2, [255, 0, 0, 255]);
      roiGray.delete();
    }
    cv.imshow("canvasOutput", mat);
    mat.delete();
    gray.delete();
    faceCascade.delete();
    faces.delete();

    // }
  };

  return (
    <div>
      <h1 className="mid">Upload Image Here</h1>
      {/* <p id="status">OpenCV.js is loading...</p> */}
      <div>
        <div className="inputoutput mid">
          <div className="caption">
            <div className="mid">Choose Photo from your computer: </div>
            <div className="mid">
              <input
                type="file"
                id="fileInput"
                name="file"
                onChange={handleImageUpload}
                ref={(element) => (inputElementRef.current = element)}
              />
            </div>

            <div>
              {imgLoaded && <div className="mid">Before:</div>}
              <img
                id="imageSrc"
                alt="No Image"
                ref={(element) => (imgElementRef.current = element)}
                style={{ height: "500px", width: "auto" }}
              />
            </div>
          </div>
        </div>
        {/* <WebcamComponent /> */}
        <div className="inputoutput">
          <div className="mid">
            <button
              onClick={handleCanvasLoad}
              disabled={!imgElementRef.current}
            >
              Load Face Recognition
            </button>
          </div>
          <div className="caption mid">Result:</div>
          <div className="mid">
            <canvas
              id="canvasOutput"
              ref={(element) => (canvasElementRef.current = element)}
              style={{ height: "500px", width: "auto" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenCVComponent;
