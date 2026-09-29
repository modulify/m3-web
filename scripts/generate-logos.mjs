import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { chromium } from 'playwright'

const root = fileURLToPath(new URL('..', import.meta.url))
const puzzleSvg = await readFile(resolve(root, 'm3-foundation/assets/puzzle-m.svg'), 'utf8')
const puzzleGradients = puzzleSvg.match(/<defs>([\s\S]*?)<\/defs>/)?.[1]
const puzzlePaths = puzzleSvg.match(/<path\b[^>]*\/>/g)

if (!puzzleGradients || puzzlePaths?.length !== 5) {
  throw new Error('Expected five vector puzzle pieces and their gradients')
}

const ringPoint = angle => {
  const radians = angle * Math.PI / 180

  return [300 + 215 * Math.cos(radians), 300 + 215 * Math.sin(radians)]
}

const ringSegment = (start, end, color) => {
  const [x1, y1] = ringPoint(start)
  const [x2, y2] = ringPoint(end)

  return `<path d="M${x1.toFixed(2)} ${y1.toFixed(2)}A215 215 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}" fill="none" stroke="${color}" stroke-width="28"/>`
}

const ring = [
  ringSegment(204, 268, '#F33B68'),
  ringSegment(272, 338, '#AD00F5'),
  ringSegment(342, 412, '#1689F7'),
  ringSegment(56, 124, '#35C623'),
  ringSegment(128, 200, '#FFA000'),
].join('\n')

// This transform retains the centered placement approved for the original PNG.
const puzzleMark = `<g transform="translate(84.75 78.8) scale(0.83984375)">
${puzzlePaths.join('\n')}
</g>`
const sharedMark = `${ring}\n${puzzleMark}`

const cutoutCenter = 438
const cutoutRadius = 105
const cornerCutout = `<mask id="corner-cutout" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="600">
  <rect width="600" height="600" fill="white"/>
  <circle cx="${cutoutCenter}" cy="${cutoutCenter}" r="${cutoutRadius}" fill="black"/>
</mask>`
const cutoutMark = `<g mask="url(#corner-cutout)">
${sharedMark}
</g>
`
const reactMark = `${cutoutMark}<g transform="translate(${cutoutCenter} ${cutoutCenter})" fill="none" stroke="#61DAFB" stroke-width="10.5">
  <ellipse rx="72" ry="28"/>
  <ellipse rx="72" ry="28" transform="rotate(60)"/>
  <ellipse rx="72" ry="28" transform="rotate(120)"/>
  <circle r="10" fill="#61DAFB" stroke="none"/>
</g>`

const vueOuterPath = 'M161.65 0 130.88 53.29 100.11 0H0l130.88 226.69L261.76 0Z'
const vueInnerPath = 'M161.65 0 130.88 53.29 100.11 0H52.05l78.83 136.52L209.71 0Z'
const vueScale = 0.55
const vueVerticalOffset = 226.69 * vueScale * 0.125
const vueTransform = `translate(${cutoutCenter} ${cutoutCenter + vueVerticalOffset}) scale(${vueScale}) translate(-130.88 -113.35)`
const vueMark = `${cutoutMark}
<g transform="${vueTransform}">
  <path d="${vueOuterPath}" fill="#41B883"/>
  <path d="${vueInnerPath}" fill="#34495E"/>
</g>`

const logos = [
  {
    directory: 'm3-foundation/assets',
    title: 'Modulify M3',
    markup: sharedMark,
  },
  {
    directory: 'm3-react/assets',
    title: 'Modulify M3 React',
    markup: reactMark,
    mask: cornerCutout,
  },
  {
    directory: 'm3-vue/assets',
    title: 'Modulify M3 Vue',
    markup: vueMark,
    mask: cornerCutout,
  },
]

for (const { directory, title, markup, mask = '' } of logos) {
  const destination = resolve(root, directory)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-labelledby="title">
  <title id="title">${title}</title>
  <defs>
${puzzleGradients}
${mask}
  </defs>
${markup}
</svg>
`

  await mkdir(destination, { recursive: true })
  await writeFile(resolve(destination, 'logo.svg'), svg)
}

const browser = await chromium.launch({ headless: true })

try {
  const page = await browser.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 })

  for (const { directory } of logos) {
    const destination = resolve(root, directory)

    await page.goto(pathToFileURL(resolve(destination, 'logo.svg')).href)
    await page.screenshot({ path: resolve(destination, 'logo.png'), omitBackground: true })
  }
} finally {
  await browser.close()
}
