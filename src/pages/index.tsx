import { Camera } from "@mediapipe/camera_utils"
import "@mediapipe/control_utils"
import "@mediapipe/drawing_utils"
import "@mediapipe/hands"
import { useEffect, useRef } from "react"

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const camera = new Camera(videoRef.current!, {
      onFrame: async () => {
        // Do something with the camera frame here
      },
      width: 1280,
      height: 720,
    });

    camera.start();

    return () => {
      camera.stop();
    };
  }, [])

  return (
    <>
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-full object-cover transform -scale-x-100"
          autoPlay
          playsInline
          // style={{ transform: "scaleX(-1)" }}
        />
      </div>
    </>
  )
}