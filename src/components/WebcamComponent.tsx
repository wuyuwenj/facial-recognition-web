import React, { useEffect, useRef, useState } from "react";
import Webcam, { WebcamProps } from "react-webcam";
import './style.css'
declare const cv: any;

const WebcamComponent: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  let canvasElementRef = useRef<HTMLCanvasElement | null>(null);

  const [webcamEnabled, setWebcamEnabled] = useState(true);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [mat, setMat] = useState<any>(null);

  const capture = () => {
    if (webcamRef.current) {
      setImageSrc(webcamRef.current.getScreenshot());
      console.log(imageSrc);
    }
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

  // useEffect(() => {
  //   if (imageSrc) {
  //     setMat(cv.imread(imageSrc));
  //     cv.imshow("canvasOutput2", mat);

  //   }
  // }, [imageSrc]);

  const toggleWebcam = () => {
    setWebcamEnabled((prevEnabled) => !prevEnabled);
  };

  return (
    <div
      
    >
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
      </div >

      <div className="mid">
        <button onClick={toggleWebcam}>
          {webcamEnabled ? "Disable Webcam" : "Enable Webcam"}
        </button>
        <button onClick={capture}>Capture photo</button>
      </div>

      <div className="mid">
        {imageSrc && <img src={imageSrc} alt="Captured" />}
      </div>
      {/* <canvas
              id="canvasOutput2"
              ref={(element) => (canvasElementRef.current = element)}
              style={{ height: "500px", width: "auto" }}
            /> */}
    </div>
  );
};

export default WebcamComponent;
