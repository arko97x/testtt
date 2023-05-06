import { Camera } from "@mediapipe/camera_utils"
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils"
import { HAND_CONNECTIONS, Hands } from "@mediapipe/hands"
import { useRef, useEffect } from "react"

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
      modelComplexity: 1,
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
      width: 1280, // window.innerWidth
      height: 720, // window.innerHeight
    })
    camera.start()

    return () => {
      camera.stop()
      hands.close()
    }
  })

  return (
    <>
      <div className="w-screen h-screen">
        <div className="w-full flex items-start justify-center pt-9 md:pt-10">
          <video
            ref={videoRef}
            className="input_video hidden"
            autoPlay
            playsInline
          />
          <canvas
            ref={canvasRef}
            className={`output_canvas w-[80vw] md:w-[60vw] lg:w-[50vw] xl:w-[50vw] h-auto object-cover transform -scale-x-100 rounded-3xl border-2 border-transparent p-0.5`}
            width={1280}
            height={720}
          />
        </div>
      </div>
    </>
  )
}