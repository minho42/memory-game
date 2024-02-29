"use client"
// item images: 308

import { useEffect, useState } from "react"
import imageList from "../imageList.json"

const SIZE_MIN = 4
const SIZE_MAX = 10

export default function Home() {
  const [gameSize, setGameSize] = useState(4)
  const [imageArray, setImageArray] = useState([])
  const [overlayArray, setOverlayArray] = useState([])
  const [resetSelectedInSeconds, setResetSelectedInSeconds] = useState<number | null>(null)
  const [matchedArray, setMatchedArray] = useState([])
  const [isMatched, setIsMatched] = useState(false)
  const [status, setStatus] = useState("")
  const [firstImageSelected, setFirstImageSelected] = useState<number | null>(null)
  const [secondImageSelected, setSecondImageSelected] = useState<number | null>(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [matchCount, setMatchCount] = useState(0)
  const [unmatchCount, setUnmatchCount] = useState(0)

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
      const index = Math.floor(Math.random() * imageList.length)
      if (!tempImageArray.includes(imageList[index])) {
        tempImageArray.push(imageList[index])
        i++
      }
    }
    tempImageArray = tempImageArray.concat(tempImageArray)
    setImageArray(shuffleArray(tempImageArray))
    setOverlayArray(new Array(gameSize * gameSize).fill(false))
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

  useEffect(() => {}, [firstImageSelected])

  useEffect(() => {
    checkMatch()
  }, [secondImageSelected])

  useEffect(() => {
    // console.log("resetSelectedInSeconds", resetSelectedInSeconds)
    if (resetSelectedInSeconds <= 0) {
      setFirstImageSelected(null)
      setSecondImageSelected(null)

      if (!isMatched) {
        toggleOverlay(firstImageSelected)
        toggleOverlay(secondImageSelected)
        // setIsMatched(false)
      }
      return
    }
    const timer = setTimeout(() => {
      setResetSelectedInSeconds(resetSelectedInSeconds - 1)
    }, 500)
    return () => clearTimeout(timer)
  }, [resetSelectedInSeconds])

  useEffect(() => {
    if (matchCount >= (gameSize * gameSize) / 2) {
      setStatus("Game over")
    }
  }, [matchCount])

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
    if (firstImageSelected === index || secondImageSelected === index) {
      return
    }

    if (matchedArray.includes(index)) {
      return
    }

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
      setStatus("matched ❤️")
      setIsMatched(true)
      setMatchCount(matchCount + 1)
      setMatchedArray((current) => {
        const newArray = [...current]
        newArray.push(firstImageSelected)
        newArray.push(secondImageSelected)
        return newArray
      })
      if (resetSelectedInSeconds >= 0) {
        setResetSelectedInSeconds(-1)
      } else {
        setResetSelectedInSeconds(resetSelectedInSeconds - 1)
      }
    } else {
      setStatus("no match 💀")
      setIsMatched(false)
      setUnmatchCount(unmatchCount + 1)
      setResetSelectedInSeconds(1.5)
    }
  }

  function handleReset() {
    setFirstImageSelected(null)
    setSecondImageSelected(null)
    setStatus("reset")
    setMatchCount(0)
    setUnmatchCount(0)
    setMatchedArray([])
    setOverlayArray(new Array(gameSize * gameSize).fill(false))
  }

  function handleShuffle() {
    handleReset()
    setupImages()
    setStatus("shuffled")
  }

  function handleSizeDown() {
    if (gameSize - 2 >= SIZE_MIN) {
      setGameSize(gameSize - 2)
      setStatus("down sized")
    }
  }

  function handleSizeUp() {
    if (gameSize + 2 <= SIZE_MAX) {
      setGameSize(gameSize + 2)
      setStatus("up sized")
    }
  }

  function ShowInfo() {
    return (
      <div id="info" className="border border-neutral-300 rounded-lg p-3 text-xs font-mono">
        <div>SIZE_MIN: {SIZE_MIN}</div>
        <div>SIZE_MAX: {SIZE_MAX}</div>
        <div>gameSize: {gameSize}</div>
        <div className="flex gap-1">
          <div>first: [{firstImageSelected}]</div>
          <div>{imageArray[firstImageSelected]?.split(".").slice(0, -1).join(".").replace(/-/g, " ")}</div>
        </div>
        <div className="flex gap-1">
          <div>second: [{secondImageSelected}]</div>
          <div>{imageArray[secondImageSelected]?.split(".").slice(0, -1).join(".").replace(/-/g, " ")}</div>
        </div>
        <div>status: {status}</div>
        <div>matchedArray: {JSON.stringify(matchedArray)}</div>
        <div>matchCount: {matchCount}</div>
        <div>unmatchCount: {unmatchCount}</div>

        <div className="flex gap-2">
          <button className="bg-amber-200 font-semibold rounded p-2" onClick={handleReset}>
            reset
          </button>
          <button className="bg-lime-200 font-semibold rounded p-2" onClick={handleShuffle}>
            shuffle
          </button>
          <button className="bg-pink-200 font-semibold rounded p-2" onClick={handleSizeDown}>
            size down
          </button>
          <button className="bg-indigo-200 font-semibold rounded p-2" onClick={handleSizeUp}>
            size up
          </button>
        </div>
      </div>
    )
  }

  return (
    <main>
      <div className="h-scrren flex flex-col items-center justify-center space-y-3 p-3">
        <h1 className="text-2xl font-semibold">Memory game</h1>
        <ShowInfo />
        <div className="border border-neutral-300 rounded-lg p-3">
          <div className={`grid grid-cols-${gameSize} gap-1`}>
            {imageArray.map((image, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center justify-start bg-neutral-900 rounded-md overflow-hidden gap-1"
              >
                <div
                  onClick={() => handleSelect(i)}
                  id="overlay"
                  className={`absolute w-full h-full bg-neutral-800 
                  transition-opacity duration-500 ease-in-out
                  ${overlayArray[i] ? "opacity-0" : "opacity-80"}`}
                ></div>
                <img src={`./images/${image}`} width={86} height={64} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
