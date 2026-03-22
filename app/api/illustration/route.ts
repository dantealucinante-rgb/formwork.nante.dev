import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { docType, buildingType } = await request.json()
        console.log('Illustration API called:', { docType, buildingType })

        const PROMPTS: Record<string, string> = {
            introduction: `architectural pencil sketch of a ${buildingType}, bold black ink on white paper, hand drawn, thick outlines, no color, no shading, simple clean lines, architectural illustration style, front elevation view, minimalist`,

            designBrief: `architect student at drawing board sketching plans, bold black ink illustration, hand drawn style, thick outlines, no color, black and white only, simple bold shapes, architectural sketch aesthetic, person holding pencil over technical drawing`,

            briefDevelopment: `abstract architectural concept bubbles and zones, bold black ink on white, hand drawn organic shapes, spatial planning diagram, thick outlines, no color, simple bold illustration, circles and rectangles suggesting spaces, architectural sketch style`
        }

        const prompt = PROMPTS[docType]
        if (!prompt) {
            return NextResponse.json(
                { error: 'Invalid doc type' },
                { status: 400 }
            )
        }

        const encodedPrompt = encodeURIComponent(prompt)
        const seed = Math.floor(Math.random() * 99999)
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=500&height=380&nologo=true&seed=${seed}&model=flux`
        console.log('Fetching from Pollinations:', url)

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'image/*' }
        })
        console.log('Pollinations response status:', response.status)
        console.log('Pollinations content-type:', response.headers.get('content-type'))

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Illustration fetch failed' },
                { status: 500 }
            )
        }

        const arrayBuffer = await response.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        console.log('Base64 length:', base64.length)
        const contentType = response.headers.get('content-type') || 'image/jpeg'
        const dataUrl = `data:${contentType};base64,${base64}`

        return NextResponse.json({ dataUrl })

    } catch (error) {
        console.error('Illustration error:', error)
        return NextResponse.json(
            { error: 'Failed to generate illustration' },
            { status: 500 }
        )
    }
}
