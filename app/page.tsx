"use client"
// item images: 308

import { useEffect, useState } from "react"
import imageList from "../imageList.json"

const SIZE_MIN = 4

function makeEven(number: number) {
  if (number <= SIZE_MIN) {
    throw new Error("number too small")
  }
  if (number % 2 !== 0) {
    number -= 1
  }
  return number
}

const SIZE_MAX = makeEven(Math.floor(imageList.length / 2))

export default function Home() {
  const [gameSize, setGameSize] = useState(4)
  const [imageArray, setImageArray] = useState([])
  const [overlayArray, setOverlayArray] = useState([])
  const [matchedArray, setMatchedArray] = useState([])
  const [firstImageSelected, setFirstImageSelected] = useState(null)
  const [secondImageSelected, setSecondImageSelected] = useState(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [failCount, setFailCount] = useState(0)

  function shuffleArray(array: string[]) {
    const arrayCopy = array.slice()
    for (let i = arrayCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]]
    }
    return arrayCopy
  }

  function setupImages() {
    let tempImageArray = []
    const imageSize = (gameSize * gameSize) / 2
    for (let i = 0; i < imageSize; ) {
      const index = Math.floor(Math.random() * (imageSize + 1))
      if (!tempImageArray.includes(imageList[index])) {
        tempImageArray.push(imageList[index])
        i++
      }
    }
    tempImageArray = tempImageArray.concat(tempImageArray)
    setImageArray(shuffleArray(tempImageArray))
    setOverlayArray(new Array(gameSize * gameSize).fill(false))
    setMatchedArray(new Array(gameSize * gameSize).fill(false))
  }

  useEffect(() => {
    setupImages()
  }, [])

  useEffect(() => {
    if (gameSize > SIZE_MAX) {
      throw new Error("gameSize too big")
    }
    setupImages()
  }, [gameSize])

  if (!imageArray) {
    return
  }

  function toggleOverlay(index: number) {
    if (!overlayArray) {
      return
    }
    setOverlayArray((overlayArray) => overlayArray.map((value, i) => (i === index ? !value : value)))
  }

  function handleSelect(index: number) {
    if (secondImageSelected === undefined || secondImageSelected === null || secondImageSelected < 0) {
      toggleOverlay(index)
    }

    if (firstImageSelected === undefined || firstImageSelected === null || firstImageSelected < 0) {
      setFirstImageSelected(index)
    } else if (secondImageSelected === undefined || secondImageSelected === null || secondImageSelected < 0) {
      setSecondImageSelected(index)
    }
  }

  function checkMatch() {
    if (
      firstImageSelected === undefined ||
      firstImageSelected === null ||
      secondImageSelected === undefined ||
      secondImageSelected === null
    ) {
      return
    }

    if (imageArray[firstImageSelected] === imageArray[secondImageSelected]) {
      console.log("match")
    } else {
      console.log("no match")
    }
  }

  useEffect(() => {
    console.log("first", firstImageSelected)
  }, [firstImageSelected])

  useEffect(() => {
    console.log("second", secondImageSelected)
    checkMatch()
  }, [secondImageSelected])

  return (
    <main>
      <div className="flex flex-col items-center justify-center space-y-3 p-3">
        <h1 className="text-2xl font-semibold">Memory game</h1>
        <div>
          <p>first: [{firstImageSelected}]</p>
          <p>second: [{secondImageSelected}]</p>
          <button
            className="bg-purple-200 font-semibold rounded p-2"
            onClick={() => {
              if (firstImageSelected !== undefined && firstImageSelected !== null) {
                toggleOverlay(firstImageSelected)
              }
              if (secondImageSelected !== undefined && secondImageSelected !== null) {
                toggleOverlay(secondImageSelected)
              }
              setFirstImageSelected(null)
              setSecondImageSelected(null)
            }}
          >
            reset
          </button>
        </div>
        <div className="border border-neutral-300 rounded-lg p-3">
          <div className={`grid grid-cols-${gameSize} gap-3`}>
            {imageArray.map((image, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center justify-start bg-neutral-900 rounded-md overflow-hidden gap-1"
              >
                <div
                  onClick={() => handleSelect(i)}
                  id="overlay"
                  className={`absolute w-full h-full bg-neutral-200 
                  transition-opacity duration-400 ease-in-out
                ${overlayArray[i] ? "opacity-0" : "opacity-80"}`}
                ></div>
                <img src={`./images/${image}`} width={86} height={64} />
                <div className="break-all text-neutral-400 text-xs font-mono px-2 py-1">
                  {image?.split(".").slice(0, -1).join(".").replace("-", " ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
