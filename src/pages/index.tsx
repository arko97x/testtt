import { Camera } from "@mediapipe/camera_utils"
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils"
import { HAND_CONNECTIONS, Hands } from "@mediapipe/hands"
import React, { useRef, useEffect, useState } from "react"
import ReactLoading from "react-loading"
import { Vector3 } from "three"
import * as THREE from "three"
import * as Tone from "tone"
import BottomSheet from "../components/BottomSheet"
import options from "../components/ChordFrequencies"

import dynamic from 'next/dynamic'
const Sketch = dynamic(() => import('../components/mySketch'), {
  ssr: false
})


export default function NewHome() {
  const [selectedLI, setSelectedLI] = useState(options[6].name)
  const [selectedLM, setSelectedLM] = useState(options[11].name)
  const [selectedLR, setSelectedLR] = useState(options[15].name)
  const [selectedLP, setSelectedLP] = useState(options[16].name)
  const [selectedRI, setSelectedRI] = useState(options[20].name)
  const [selectedRM, setSelectedRM] = useState(options[12].name)
  const [selectedRR, setSelectedRR] = useState(options[18].name)
  const [selectedRP, setSelectedRP] = useState(options[4].name)

  const data = {}

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraReady, setCameraReady] = useState(false)
  var handedness

  const [isRunning, setIsRunning] = useState(true)
  function handleToggle() {
    setIsRunning(!isRunning)
  }

  Tone.start()

  var lif = options.find((option) => option.name === selectedLI)
  var lmf = options.find((option) => option.name === selectedLM)
  var lrf = options.find((option) => option.name === selectedLR)
  var lpf = options.find((option) => option.name === selectedLP)
  var rif = options.find((option) => option.name === selectedRI)
  var rmf = options.find((option) => option.name === selectedRM)
  var rrf = options.find((option) => option.name === selectedRR)
  var rpf = options.find((option) => option.name === selectedRP)

  // Different tones for each hand
  const toneJSFrequencies = [
    [lif && lif.value, lmf && lmf.value, lrf && lrf.value, lpf && lpf.value],
    [rif && rif.value, rmf && rmf.value, rrf && rrf.value, rpf && rpf.value]
  ] // [[Left Hand], [Right Hand]]

  // Threshold for pinch gesture (in meters)
  const pinchDistanceThresh = 0.049

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

      if (isRunning) {
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
                  synth.triggerAttackRelease(toneJSFrequencies[handedness === "Left" ? 1 : 0][i]!, "8n") // If handedness label is Left, it's actually the Right hand and vice versa

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
      } else {
        camera.stop()
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
    if (videoElement) {
      setCameraReady(true)
      // navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
      //   setCameraReady(true)
      // })
    }

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
          <div className="relative">
            <button className={`absolute top-4 right-4 z-40 px-4 py-2 font-mono text-xs border-2 ${isRunning ? "bg-black hover:bg-white text-white hover:text-black border-white" : "bg-white hover:bg-black text-black hover:text-white"} rounded-3xl`} onClick={handleToggle}>{isRunning ? 'PAUSE' : 'PLAY'}</button>
            <div style={{ transform: "translate(-50%, -50%)" }} className={`absolute top-1/2 left-1/2 z-40 ${isRunning ? "hidden" : "block"} text-white`}>Camera paused</div>
            <canvas
              ref={canvasRef}
              className={`output_canvas w-[80vw] md:w-[60vw] lg:w-[50vw] xl:w-[50vw] h-[50vh] sm:h-auto object-cover transform -scale-x-100 rounded-3xl border-2 ${cameraReady ? "border-transparent" : "border-gray-300"} p-0.5`}
              width={1280}
              height={720}
            />
          </div>
        </div>
        <div className={`w-full px-8 sm:px-10 md:px-24 pt-9 md:pt-10 ${cameraReady ? "" : "hidden"} flex justify-center`}>
          <div className="grid gap-6 grid-rows-2 sm:grid-cols-2">
            <div className="relative flex flex-col space-y-1 border border-gray-300 rounded-md p-4">
              <p className="absolute -top-[0.9rem] -left-[0.38rem] text-sm text-gray-700 font-mono bg-white px-1 py-1">LEFT HAND CHORDS</p>
              <div className="grid gap-4 grid-cols-4">
                <BottomSheet
                  label="INDEX"
                  options={options.map(o => o.name)}
                  selectedOption={selectedLI}
                  setSelectedOption={setSelectedLI}
                />
                <BottomSheet
                  label="MIDDLE"
                  options={options.map(o => o.name)}
                  selectedOption={selectedLM}
                  setSelectedOption={setSelectedLM}
                />
                <BottomSheet
                  label="RING"
                  options={options.map(o => o.name)}
                  selectedOption={selectedLR}
                  setSelectedOption={setSelectedLR}
                />
                <BottomSheet
                  label="PINKY"
                  options={options.map(o => o.name)}
                  selectedOption={selectedLP}
                  setSelectedOption={setSelectedLP}
                />
              </div>
            </div>

            <div className="relative flex flex-col space-y-1 border border-gray-300 rounded-md p-4">
              <p className="absolute -top-[0.9rem] -left-[0.38rem] text-sm text-gray-700 font-mono bg-white px-1 py-1">RIGHT HAND CHORDS</p>
              <div className="grid gap-4 grid-cols-4">
                <BottomSheet
                  label="INDEX"
                  options={options.map(o => o.name)}
                  selectedOption={selectedRI}
                  setSelectedOption={setSelectedRI}
                />
                <BottomSheet
                  label="MIDDLE"
                  options={options.map(o => o.name)}
                  selectedOption={selectedRM}
                  setSelectedOption={setSelectedRM}
                />
                <BottomSheet
                  label="RING"
                  options={options.map(o => o.name)}
                  selectedOption={selectedRR}
                  setSelectedOption={setSelectedRR}
                />
                <BottomSheet
                  label="PINKY"
                  options={options.map(o => o.name)}
                  selectedOption={selectedRP}
                  setSelectedOption={setSelectedRP}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Sketch data={data} />
        </div>
      </div>
    </>
  )
}