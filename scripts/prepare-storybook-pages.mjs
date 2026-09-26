import {
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises'
import { resolve } from 'node:path'

const [outputArgument, version, npmTag] = process.argv.slice(2)
const root = resolve(import.meta.dirname, '..')

if (!outputArgument || !version || !npmTag) {
  throw new Error('Usage: prepare-storybook-pages.mjs <output> <version> <npm-tag>')
}

if (!/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
  throw new Error(`Invalid release version: ${version}`)
}

const output = resolve(root, outputArgument)

if (output === root) {
  throw new Error('The Pages output directory must not be the repository root')
}

const storybooks = [
  {
    directory: resolve(root, 'm3-react', 'dist-storybook'),
    label: 'React',
    name: 'react',
  },
  {
    directory: resolve(root, 'm3-vue', 'dist-storybook'),
    label: 'Vue',
    name: 'vue',
  },
]

const escapeHtml = value => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll('\'', '&#39;')

const renderPage = ({ title, eyebrow, heading, content }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root { color-scheme: dark; font-family: Inter, Roboto, system-ui, sans-serif; }
      body { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #141218; color: #e6e0e9; }
      main { width: min(720px, calc(100% - 48px)); }
      p { color: #cac4d0; line-height: 1.6; }
      .eyebrow { color: #adc6ff; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
      .links { display: grid; gap: 12px; margin: 28px 0; }
      a { padding: 16px 20px; border: 1px solid #49454f; border-radius: 16px; color: #d7e3ff; text-decoration: none; }
      a:hover { background: #211f26; border-color: #adc6ff; }
      ul { padding-left: 20px; }
      li { margin: 8px 0; }
      li a { padding: 0; border: 0; }
      li a:hover { background: transparent; text-decoration: underline; }
    </style>
  </head>
  <body>
    <main>
      <div class="eyebrow">${escapeHtml(eyebrow)}</div>
      <h1>${escapeHtml(heading)}</h1>
      ${content}
    </main>
  </body>
</html>
`

const renderVersionLinks = prefix => storybooks
  .map(({ label, name }) => `<a href="${prefix}${name}/">${escapeHtml(label)} Storybook</a>`)
  .join('\n        ')

const renderRedirect = target => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=${escapeHtml(target)}" />
    <title>Redirecting to ${escapeHtml(version)}</title>
    <script>
      const target = new URL(${JSON.stringify(target)}, window.location.href)
      target.search = window.location.search
      target.hash = window.location.hash
      window.location.replace(target)
    </script>
  </head>
  <body>
    <a href="${escapeHtml(target)}">Open ${escapeHtml(version)}</a>
  </body>
</html>
`

const versionDirectory = resolve(output, version)

await rm(versionDirectory, { force: true, recursive: true })
await mkdir(versionDirectory, { recursive: true })

for (const storybook of storybooks) {
  await cp(storybook.directory, resolve(versionDirectory, storybook.name), {
    recursive: true,
  })
}

await writeFile(resolve(versionDirectory, 'index.html'), renderPage({
  title: `M3 Storybook ${version}`,
  eyebrow: version,
  heading: 'M3 component Storybooks',
  content: `<p>Select the framework implementation for this release.</p>
      <div class="links">
        ${renderVersionLinks('./')}
      </div>`,
}))

const latestDirectory = resolve(output, 'latest')
let latestVersion = null

if (npmTag === 'latest') {
  latestVersion = version

  await rm(latestDirectory, { force: true, recursive: true })
  await mkdir(latestDirectory, { recursive: true })
  await writeFile(resolve(latestDirectory, 'version.json'), `${JSON.stringify({ version }, null, 2)}\n`)
  await writeFile(resolve(latestDirectory, 'index.html'), renderRedirect(`../${version}/`))

  for (const storybook of storybooks) {
    const directory = resolve(latestDirectory, storybook.name)

    await mkdir(directory, { recursive: true })
    await writeFile(resolve(directory, 'index.html'), renderRedirect(`../../${version}/${storybook.name}/`))
  }
} else {
  try {
    const metadata = JSON.parse(await readFile(resolve(latestDirectory, 'version.json'), 'utf8'))

    latestVersion = typeof metadata.version === 'string' ? metadata.version : null
  } catch {
    latestVersion = null
  }
}

const versions = (await readdir(output, { withFileTypes: true }))
  .filter(entry => entry.isDirectory() && /^v\d+\.\d+\.\d+/.test(entry.name))
  .map(entry => entry.name)
  .sort((left, right) => right.localeCompare(left, undefined, { numeric: true }))

const latestLinks = latestVersion
  ? `<p>Latest stable release: <strong>${escapeHtml(latestVersion)}</strong></p>
      <div class="links">
        ${renderVersionLinks('./latest/')}
      </div>`
  : '<p>No stable release has been published yet.</p>'
const versionItems = versions
  .map(item => `<li><a href="./${escapeHtml(item)}/">${escapeHtml(item)}</a></li>`)
  .join('\n        ')

await writeFile(resolve(output, 'index.html'), renderPage({
  title: 'M3 Storybooks',
  eyebrow: 'Modulify M3',
  heading: 'Component Storybooks',
  content: `${latestLinks}
      <h2>Published versions</h2>
      <ul>
        ${versionItems}
      </ul>`,
}))
await writeFile(resolve(output, 'versions.json'), `${JSON.stringify({ latest: latestVersion, versions }, null, 2)}\n`)
await writeFile(resolve(output, '.nojekyll'), '')

console.log(`Prepared Storybook Pages for ${version}; latest=${latestVersion ?? 'none'}.`)
