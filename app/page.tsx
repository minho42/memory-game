"use client"
// item images: 308

import { setRequestMeta } from "next/dist/server/request-meta"
import { useEffect, useState } from "react"
import imageList from "../imageList.json"

const SIZE_LIMIT = Math.floor(imageList.length / 2)

/* 
user select game size: 10 -> 10x10 / must be even number
select images randomly: (10x10 / 2: half of total board size) 
  save image references in array: imageArray
  shuffle imageArray and make imageArray2
  total image = imageArray + imageArray2
  
draw imageArray: grid/table
when first image clicked:
  how to decide it's first image:
    if no selected image: 
  firstImageSelected = name of the image
    
when second image clicked:
  reveal for x seconds
  if match to first image:
    setIsGameOver(true)
  else:
    setFirstImageSelected(null)
    failCount++
    
    failHistory = {
      name: "tango",
      count: 1
    }
    
    if in failHistory, count++
    else: add to failHistory: {name: "xx", count: 1}
*/

export default function Home() {
  const [gameSize, setGameSize] = useState(10)
  const [imageArray, setImageArray] = useState([])
  const [firstImageSelected, setFirstImageSelected] = useState(null)
  const [secondImageSelected, setSecondImageSelected] = useState(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [failCount, setFailCount] = useState(0)

  console.log(imageList)
  console.log(SIZE_LIMIT)

  useEffect(() => {}, [])

  // useEffect(() => {
  // make sure gameSize < SIZE_LIMIT
  // fetch new images
  // setImageArray()
  // }, [gameSize])

  return <main>memory game</main>
}
