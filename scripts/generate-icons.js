const sharp = require("sharp")
const path = require("path")

const assetsDir = path.join(__dirname, "../assets")
const input = path.join(assetsDir, "icon128.png")
const sizes = [128, 64, 32, 16]

async function generate() {
    for (const size of sizes) {
        const output = path.join(assetsDir, `icon${size}.png`)
        
        await sharp(input)
            .resize(size, size)
            .png({ quality: 100 })
            .toFile(output)
            
        console.log(`Generated icon${size}.png`)
    }
}

generate()