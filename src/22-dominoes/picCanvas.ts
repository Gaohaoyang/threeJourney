const getMinifyPicColor: () => Promise<
Array<
Array<{
  r: number
  g: number
  b: number
}>
>
> = () => new Promise((resolve) => {
  const canvas: HTMLCanvasElement | null = document.querySelector('#picCanvas')
  const minify2DArr: Array<{
    r: number
    g: number
    b: number
  }> = []
  if (canvas) {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const img = new Image()
      // img.src = '../assets/cherry.png'
      // img.src = '../assets/pokeman.png'
      img.src = '../assets/Hello.png'
      img.addEventListener('load', () => {
        ctx.drawImage(img, 0, 0, 20, 10, 0, 0, 20, 10)

        const imageData = ctx.getImageData(0, 0, 20, 10)
        const pixels = imageData.data
        // console.log(pixels.length)

        for (let i = 0; i < pixels.length; i += 4) {
          minify2DArr.push({
            r: pixels[i],
            g: pixels[i + 1],
            b: pixels[i + 2],
          })
        }
        ctx.putImageData(imageData, 0, 0)
        console.log(minify2DArr)
        const newArr = []
        while (minify2DArr.length) newArr.push(minify2DArr.splice(0, 20))
        console.log(newArr)
        resolve(newArr)
      })
    }
  }
})

export default getMinifyPicColor
