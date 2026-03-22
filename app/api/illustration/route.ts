import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { docType, buildingType } = await request.json()
        console.log('Illustration API called:', { docType, buildingType })

        const PROMPTS: Record<string, string> = {
            introduction: `${buildingType} architectural sketch, bold black ink, hand drawn, thick outlines, white background, no color`,

            designBrief: `architect drawing plans at desk, bold black ink sketch, hand drawn, thick outlines, white background, no color`,

            briefDevelopment: `architectural bubble diagram, bold black ink, hand drawn circles and zones, white background, no color`
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
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=500&height=380&nologo=true&seed=${seed}`
        console.log('Fetching from Pollinations:', url)

        const fetchWithRetry = async (url: string) => {
            let response = await fetch(url, {
                method: 'GET',
                headers: { 'Accept': 'image/*' }
            })

            if (!response.ok) {
                console.log('First attempt failed, retrying in 2 seconds...')
                await new Promise(r => setTimeout(r, 2000))
                response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Accept': 'image/*' }
                })
            }
            return response
        }

        const response = await fetchWithRetry(url)
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
