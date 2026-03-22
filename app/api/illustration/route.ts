import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { docType, buildingType } = await request.json()

        const PROMPTS: Record<string, string> = {
            introduction: `hand drawn architectural elevation sketch of a ${buildingType}, black ink on white paper, bold strokes, simple building outline, doors and windows visible, no color, no shading, architectural student drawing style`,

            designBrief: `hand drawn sketch of architect holding pencil over floor plan drawing, black ink illustration, bold lines, white background, no color, simple bold shapes, person leaning over drawing table, architectural concept art`,

            briefDevelopment: `hand drawn architectural bubble diagram with labeled zones, black ink on white, circles of different sizes connected by lines, some circles contain small furniture symbols, bold strokes, spatial planning sketch, no color, architecture student style`
        }

        const prompt = PROMPTS[docType]
        if (!prompt) {
            return NextResponse.json(
                { error: 'Invalid doc type' },
                { status: 400 }
            )
        }

        const negativePrompt = 'color, realistic photo, 3d render, gradient, gray background, dark background, watercolor, painting, blurry, photorealistic, computer generated'

        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 90000)

        try {
            const response = await fetch(
                'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputs: prompt,
                        parameters: {
                            negative_prompt: negativePrompt,
                            width: 512,
                            height: 384,
                            num_inference_steps: 4,
                            guidance_scale: 0
                        }
                    }),
                    signal: controller.signal
                }
            )

            clearTimeout(timeout)

            console.log('HuggingFace response status:', response.status)
            console.log('HuggingFace content-type:', response.headers.get('content-type'))

            if (!response.ok) {
                const errorText = await response.text()
                console.error('HuggingFace error:', errorText)
                return NextResponse.json(
                    { error: 'Illustration generation failed' },
                    { status: 500 }
                )
            }

            const arrayBuffer = await response.arrayBuffer()
            const base64 = Buffer.from(arrayBuffer).toString('base64')
            const contentType = response.headers.get('content-type') || 'image/jpeg'
            const dataUrl = `data:${contentType};base64,${base64}`

            console.log('Success, base64 length:', base64.length)

            return NextResponse.json({ dataUrl })

        } catch (fetchError: any) {
            if (fetchError.name === 'AbortError') {
                console.error('HuggingFace request timed out after 90s')
                return NextResponse.json(
                    { error: 'Generation timed out' },
                    { status: 504 }
                )
            }
            throw fetchError
        } finally {
            clearTimeout(timeout)
        }

    } catch (error) {
        console.error('Illustration error:', error)
        return NextResponse.json(
            { error: 'Failed to generate illustration' },
            { status: 500 }
        )
    }
}
