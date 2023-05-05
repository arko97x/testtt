import { Camera } from "@mediapipe/camera_utils"
import "@mediapipe/control_utils"
import "@mediapipe/drawing_utils"
import "@mediapipe/hands"
import { useEffect, useRef, useState } from "react"
import ReactLoading from "react-loading"

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
      <div className="bg-[#FDFAEA] w-screen h-screen">
        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-end">
              <p className="text-black text-lg font-medium">Setting up the camera</p>
              <ReactLoading type="bubbles" color="black" height={22} width={24} />
            </div>
          </div>
        )}
        <div className="w-full flex items-start justify-center pt-9 md:pt-10">
          <video
            ref={videoRef}
            className={`w-[80vw] md:w-[60vw] lg:w-[50vw] xl:w-[50vw] h-auto object-cover transform -scale-x-100 rounded-3xl border-2 border-transparent p-0.5 ${cameraReady ? "" : "hidden"
              }`}
            autoPlay
            playsInline
          />
        </div>
        <div className="w-full text-xs sm:text-sm text-center p-4 absolute bottom-0 font-mono">being built by <a
          className="font-bold underline hover:no-underline text-[#457B9D]" href="https://arccc.co" target="_blank"
          rel="noopener noreferrer">arko</a>&nbsp;·&nbsp;currently very <span
            className="inline-block transform -rotate-[18deg] font-bold">b</span><span
              className="inline-block transform rotate-[16deg] font-bold">u</span><span
                className="inline-block transform -rotate-[24deg] font-bold">g</span><span
                  className="inline-block transform -rotate-[16deg] font-bold">g</span><span
                    className="inline-block transform rotate-[16deg] font-bold">y</span>
        </div>
      </div>
    </>
  )
}