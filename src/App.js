// 1. Install dependencies DONE
// 2. Import dependencies DONE
// 3. Setup webcam and canvas DONE
// 4. Define references to those DONE
// 5. Load handpose DONE
// 6. Detect function DONE
// 7. Drawing utilities DONE
// 8. Draw functions DONE

import React, { useEffect, useRef, useState } from "react";
// import logo from './logo.svg';
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./App.css";
import { drawImage, drawFullHand } from "./utilities";
import shit from './epic-shit_only.png';
import { motion } from "framer-motion";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef= useRef(null);
  const ctx = useRef(null);
  
  const runHandpose = async () => {    
    const net = await handpose.load();
    console.log("Handpose model loaded.");

    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 500);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const handpre = await net.estimateHands(video);
      //console.log(hand);

      // Draw      
      drawImage(handpre,ctx.current, imgRef.current);
      //drawFullHand(handpre,ctx.current, imgRef.current);
    }
  };

  useEffect(()=>{
    ctx.current = canvasRef.current.getContext("2d");
    runHandpose();
  },[]);
  

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
       
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
        <motion.img ref={imgRef} src={shit} height={121} width={171} zindex={1}>
          
        </motion.img>
        
      </header>
    </div>
  );
}

export default App;
