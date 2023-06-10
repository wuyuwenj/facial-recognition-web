import React, { useEffect, useRef, useState } from "react";
import Webcam, { WebcamProps } from "react-webcam";
import "./style.css";
declare const cv: any;

const WebcamComponent: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  const [webcamEnabled, setWebcamEnabled] = useState(true);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [mat, setMat] = useState<any>(null);
  const [displayMode, setDisplayMode] = useState<"img" | "canvas">("img");

  const openNewWindow = () => {
    window.open("/", "_blank");
  };

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

  const capture = () => {
    if (webcamRef.current) {
      setImageSrc(webcamRef.current.getScreenshot());
    }
  };

  useEffect(() => {
    if (imageSrc && imgElementRef.current) {
      imgElementRef.current.src = imageSrc;
      imgElementRef.current.onload = () => {
        setMat(cv.imread(imgElementRef.current));
      };
    }
  }, [imageSrc]);

  // useEffect(() => {
  //   if (mat && displayMode === "canvas") {
  //     cv.imshow("canvasOutput2", mat);
  //     const gray = new cv.Mat();
  //     cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
  //     const faces = new cv.RectVector();
  //     const faceCascade = new cv.CascadeClassifier();
  //     faceCascade.load("haarcascade_frontalface_default.xml");
  //     const msize = new cv.Size(0, 0);
  //     faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
  //     for (let i = 0; i < faces.size(); ++i) {
  //       const roiGray = gray.roi(faces.get(i));
  //       const point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
  //       const point2 = new cv.Point(
  //         faces.get(i).x + faces.get(i).width,
  //         faces.get(i).y + faces.get(i).height
  //       );
  //       cv.rectangle(mat, point1, point2, [255, 0, 0, 255]);
  //       roiGray.delete();
  //     }
  //     cv.imshow("canvasOutput2", mat);
  //     mat.delete();
  //     gray.delete();
  //     faceCascade.delete();
  //     faces.delete();
  //   }
  // }, [mat, displayMode]);

  useEffect(() => {
  if (mat && displayMode === "canvas") {
    const gray = new cv.Mat();
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
    const faces = new cv.RectVector();
    const faceCascade = new cv.CascadeClassifier();
    faceCascade.load("haarcascade_frontalface_default.xml");
    const msize = new cv.Size(0, 0);
    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
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
    cv.imshow("canvasOutput2", mat);
    gray.delete();
    faceCascade.delete();
    faces.delete();
  }
}, [mat, displayMode]);


  const toggleWebcam = () => {
    setWebcamEnabled((prevEnabled) => !prevEnabled);
  };

  const toggleDisplayMode = () => {
    setDisplayMode((prevMode) => (prevMode === "img" ? "canvas" : "img"));
  };

  return (
    <div>
      <div>
      <button onClick={openNewWindow}>GO to Upload Img</button>
    </div>
      <div className="mid webcam">
        {webcamEnabled && (
          <Webcam
            audio={false}
            height={500}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={500}
          />
        )}
      </div>

      <div className="mid">
        <button onClick={toggleWebcam}>
          {webcamEnabled ? "Disable Webcam" : "Enable Webcam"}
        </button>
        {displayMode === "img" && (
          <button onClick={capture}>Capture photo</button>
        )

        }
        
        <button onClick={toggleDisplayMode}>
          Show {displayMode === "img" ? "Face Recognition" : "Original Image"}
        </button>
      </div>

      <div className="mid">
        {displayMode === "img" && imageSrc && (
          <img
            src={imageSrc}
            alt="Captured"
            ref={(element) => (imgElementRef.current = element)}
          />
        )}
      </div>

      {displayMode === "canvas" && (
        <div className="mid">
          <canvas
          id="canvasOutput2"
          ref={canvasElementRef}
          style={{ height: "375px", width: "500px" }}
          
        />
        </div>
        
      )}
    </div>
  );
};

export default WebcamComponent;
