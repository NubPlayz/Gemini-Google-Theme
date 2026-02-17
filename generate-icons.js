const sharp = require("sharp")
const path = require("path")

const input = path.join(__dirname, "assets/icon.png")
const sizes = [512, 128, 64, 32, 16]

async function generate() {
  for (const size of sizes) {
    await sharp(input)
      .resize(size, size)
      .png({ quality: 100 })
      .toFile(path.join(__dirname, `assets/icon${size}.png`))

    console.log(`Generated icon${size}.png`)
  }

  console.log("All icons generated successfully.")
}

generate().catch(console.error)