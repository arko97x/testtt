import { Camera } from "@mediapipe/camera_utils"
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils"
import { HAND_CONNECTIONS, Hands } from "@mediapipe/hands"
import { useRef, useEffect, useState } from "react"
import ReactLoading from "react-loading"

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraReady, setCameraReady] = useState(false)

  useEffect(() => {
    const videoElement = videoRef.current
    const canvasElement = canvasRef.current
    function onResults(results: any) {
      if (!videoElement) {
        return
      }
      if (!canvasElement) {
        return
      }

      const canvasCtx = canvasElement.getContext("2d")
      if (!canvasCtx) {
        return
      }

      canvasCtx.save()
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      )

      if (results.multiHandLandmarks) {
        for (let handIdx = 0; handIdx < results.multiHandLandmarks.length; handIdx++) {
          const handLandmarks = results.multiHandLandmarks[handIdx]
          drawConnectors(canvasCtx, handLandmarks, HAND_CONNECTIONS, {
            color: "#457B9D",
            lineWidth: 10,
          })
          drawLandmarks(canvasCtx, handLandmarks, { color: "#005F73", lineWidth: 2 })
        }
      }
      canvasCtx.restore()
    }

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      },
    })
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 0,
      minDetectionConfidence: 0.75,
      minTrackingConfidence: 0.75,
    })
    hands.onResults(onResults)

    if (!videoElement) {
      return
    }
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement })
      },
      width: window.innerWidth,
      height: window.innerHeight,
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
      hands.close()
    }
  })

  return (
    <>
      <div className="w-screen h-screen bg-white">
        {!cameraReady && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex items-end">
              <p className="text-black text-lg font-medium">Setting up the camera</p>
              <ReactLoading type="bubbles" color="black" height={22} width={24} />
            </div>
          </div>
        )}
        <div className="w-full flex items-start justify-center pt-9 md:pt-10">
          <video
            ref={videoRef}
            className="input_video hidden"
            playsInline
          />
          <canvas
            ref={canvasRef}
            className={`output_canvas w-[80vw] md:w-[60vw] lg:w-[50vw] xl:w-[50vw] h-auto object-cover transform -scale-x-100 rounded-3xl border-2 border-transparent p-0.5 ${cameraReady ? "" : "hidden"}`}
            width={1280}
            height={720}
          />
        </div>
      </div>
    </>
  )
}