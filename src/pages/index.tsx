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
  var handedness

  Tone.start()

  // synth.triggerAttackRelease(aMinorChordFreqs, "4n")

  // Major chords
  const cMajorChordFreqs = ["C4", "E4", "G4"]
  const cSharpMajorChordFreqs = ["C#4", "F4", "G#4"]
  const dMajorChordFreqs = ["D4", "F#4", "A4"]
  const dSharpMajorChordFreqs = ["D#4", "G4", "A#4"]
  const eMajorChordFreqs = ["E4", "G#4", "B4"]
  const fMajorChordFreqs = ["F4", "A4", "C5"]
  const fSharpMajorChordFreqs = ["F#4", "A#4", "C#5"]
  const gMajorChordFreqs = ["G4", "B4", "D5"]
  const gSharpMajorChordFreqs = ["G#4", "C5", "D#5"]
  const aMajorChordFreqs = ["A4", "C#5", "E5"]
  const aSharpMajorChordFreqs = ["A#4", "D5", "F5"]
  const bMajorChordFreqs = ["B4", "D#5", "F#5"]

  // Minor chords
  const cMinorChordFreqs = ["C4", "D#4", "G4"]
  const cSharpMinorChordFreqs = ["C#4", "E4", "G#4"]
  const dMinorChordFreqs = ["D4", "F4", "A4"]
  const dSharpMinorChordFreqs = ["D#4", "F#4", "A#4"]
  const eMinorChordFreqs = ["E4", "G4", "B4"]
  const fMinorChordFreqs = ["F4", "G#4", "C5"]
  const fSharpMinorChordFreqs = ["F#4", "A4", "C#5"]
  const gMinorChordFreqs = ["G4", "A#4", "D5"]
  const gSharpMinorChordFreqs = ["G#4", "B4", "D#5"]
  const aMinorChordFreqs = ["A4", "C5", "E5"]
  const aSharpMinorChordFreqs = ["A#4", "C#5", "F5"]
  const bMinorChordFreqs = ["B4", "D5", "F#5"]

  // Different tones for each hand
  const toneJSFrequencies = [[440, 440, 440, 440], [940, 940, 940, 940]] // [[Left Hand], [Right Hand]]

  // Threshold for pinch gesture (in meters)
  const pinchDistanceThresh = 0.08

  // Define last positions for each finger of each hand
  const lastPositions = [[new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]]

  useEffect(() => {
    // Keep track of previously pinched fingers on both hands
    let previouslyPinched: [number[], number[]] = [[], []]

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
          handedness = results.multiHandedness[handIdx].label

          // Set the color based on the handedness of the hand - the handedness labels are flipped? Cuz canvas is flipped 180 deg?
          const color = handedness === "Left" ? "#FF0000" : "#00FF00"

          drawConnectors(canvasCtx, handLandmarks, HAND_CONNECTIONS, {
            color: color,
            lineWidth: 10,
          })
          drawLandmarks(canvasCtx, handLandmarks, { color: color, lineWidth: 2 })

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
              // Check if finger was previously pinched
              if (!previouslyPinched[handIdx].includes(i)) {
                // Create a new synth & trigger a note
                const synth = new Tone.PolySynth().toDestination()
                if (handedness === "Left") {
                  // If handedness label is Left, it's actually the Right hand
                  synth.triggerAttackRelease(toneJSFrequencies[1][i], "8n")
                } else {
                  // If handedness label is Right, it's actually the Left hand
                  synth.triggerAttackRelease(toneJSFrequencies[0][i], "8n")
                }

                // Adding visual feedback for everytime a note is played
                if (canvasElement) { canvasElement.style.borderColor = "#457B9D" }

                previouslyPinched[handIdx].push(i)

                lastPositions[handIdx][i] = new Vector3(tips[i].x, tips[i].y)
              }
            } else {
              // If finger is not pinched anymore, remove it from the previously pinched array
              const index = previouslyPinched[handIdx].indexOf(i)
              if (index > -1) {
                previouslyPinched[handIdx].splice(index, 1)
              }
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
        <div className={`w-full flex items-start justify-center pt-9 md:pt-10 ${cameraReady ? "" : "hidden"}`}>
          <video
            ref={videoRef}
            className="input_video hidden"
            autoPlay
            playsInline
          />
          <canvas
            ref={canvasRef}
            className={`output_canvas w-[80vw] md:w-[60vw] lg:w-[50vw] xl:w-[50vw] h-[50vh] sm:h-auto object-cover transform -scale-x-100 rounded-3xl border-2 border-transparent p-0.5`}
            width={1280}
            height={720}
          />
        </div>
        <div className={`w-full flex items-start justify-center pt-9 md:pt-10 ${cameraReady ? "" : "hidden"}`}>
          tfelypoc (arccc.co)
        </div>
      </div>
    </>
  )
}