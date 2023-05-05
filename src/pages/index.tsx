import { Camera } from "@mediapipe/camera_utils"
import "@mediapipe/control_utils"
import "@mediapipe/drawing_utils"
import "@mediapipe/hands"
import { useEffect, useRef, useState } from "react"

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraReady, setCameraReady] = useState(false)

  useEffect(() => {
    const camera = new Camera(videoRef.current!, {
      onFrame: async () => {
        // Do something with the camera frame here
      },
      width: 1280,
      height: 720,
    })

    camera
      .start()
      .then(() => {
        setCameraReady(true)
      })
      .catch((error) => {
        console.error("Failed to start camera:", error)
      })

    return () => {
      camera.stop()
    }
  }, [])

  return (
    <>
      {!cameraReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-black text-xl font-semibold">Setting up the camera ...</p>
        </div>
      )}
      <div className="relative">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transform -scale-x-100 ${cameraReady ? "" : "hidden"
            }`}
          autoPlay
          playsInline
        />
      </div>
    </>
  )
}