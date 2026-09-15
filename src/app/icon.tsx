import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

async function loadInstrumentSerif() {
  const css = await (
    await fetch('https://fonts.googleapis.com/css2?family=Instrument+Serif&text=F')
  ).text()
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/)
  if (!match) throw new Error('font source not found')
  const res = await fetch(match[1])
  return res.arrayBuffer()
}

export default async function Icon() {
  const fontData = await loadInstrumentSerif()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1F4D3A',
          color: '#FBF7F4',
          fontFamily: 'Instrument Serif',
          fontSize: 26,
        }}
      >
        F
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Instrument Serif', data: fontData, style: 'normal', weight: 400 }],
    }
  )
}
