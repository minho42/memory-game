// scripts/generateImageList.js

const fs = require("fs")
const path = require("path")
const imagesDir = path.join(__dirname, "./images")
const outputFile = path.join(__dirname, "./imageList.json")

fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error("Error reading images directory:", err)
    return
  }

  const imageFiles = files.filter((file) => /\.(png|jpg|jpeg|gif|svg)$/.test(file))

  fs.writeFile(outputFile, JSON.stringify(imageFiles), (err) => {
    if (err) {
      console.error("Error writing image list file:", err)
      return
    }
    console.log("Image list generated successfully.")
  })
})
