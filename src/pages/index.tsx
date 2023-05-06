import { Camera } from "@mediapipe/camera_utils"
// import "@mediapipe/control_utils"
// import "@mediapipe/drawing_utils"
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils"
import { HAND_CONNECTIONS, Hands } from "@mediapipe/hands"
import { useRef, useEffect, useState } from "react"
import ReactLoading from "react-loading"
import { Vector3 } from "three"
import * as THREE from "three"
import * as Tone from "tone"

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraReady, setCameraReady] = useState(false)

  // Different tones for each hand
  const toneJSFrequencies = [["G3", "G3", "G3", "G3"], ["F5", "F5", "F5", "F5"]]

  // Threshold for pinch gesture (in meters)
  const pinchDistanceThresh = 0.08

  // Define last positions for each finger of each hand
  const lastPositions = [[new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]]

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
        if (canvasElement) { canvasElement.style.borderColor = "transparent" }

        for (let handIdx = 0; handIdx < results.multiHandLandmarks.length; handIdx++) {
          const handLandmarks = results.multiHandLandmarks[handIdx]
          drawConnectors(canvasCtx, handLandmarks, HAND_CONNECTIONS, {
            color: "#457B9D",
            lineWidth: 10,
          })
          drawLandmarks(canvasCtx, handLandmarks, { color: "#005F73", lineWidth: 2 })

          // Get thumb and finger tip positions
          const thumbTip = handLandmarks[4] // Thumb
          const tips = [
            handLandmarks[8], // Index
            handLandmarks[12], // Middle
            handLandmarks[16], // Ring
            handLandmarks[20], // Pinky
          ]

          // Calculate distance between thumb tip and the other finger tip landmarks
          const distances = tips.map((tip) =>
            Math.sqrt((tip.x - thumbTip.x) ** 2 + (tip.y - thumbTip.y) ** 2 + (tip.z - thumbTip.z) ** 2)
          )

          // Check if distance is below threshold for pinch gesture for each finger
          for (let i = 0; i < distances.length; i++) {
            if (distances[i] < pinchDistanceThresh) {
              // Create a new synth & trigger a note
              const synth = new Tone.Synth().toDestination()
              synth.triggerAttackRelease(toneJSFrequencies[handIdx][i], "8n")

              // Adding visual feedback for everytime a note is played
              if (canvasElement) { canvasElement.style.borderColor = "#457B9D" }

              lastPositions[handIdx][i] = new Vector3(tips[i].x, tips[i].y)
            }
          }
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
      width: window.innerWidth,
      height: window.innerHeight,
    })
    camera.start()
    if (videoElement) { setCameraReady(true) }

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
        <div className="w-full h-screen flex items-start justify-center pt-9 md:pt-10">
          <video
            ref={videoRef}
            className="input_video hidden"
            autoPlay
            playsInline
          />
          <canvas
            ref={canvasRef}
            className={`output_canvas w-[80vw] md:w-[60vw] lg:w-[50vw] xl:w-[50vw] h-[75vh] sm:h-auto object-cover transform -scale-x-100 rounded-3xl border-2 border-transparent p-0.5 ${cameraReady ? "" : "hidden"}`}
            width={1280}
            height={720}
          />
        </div>
      </div>
    </>
  )
}