export async function fetchIllustration(
    docType: string,
    details: Record<string, any>
): Promise<string> {

    const buildingType = details.buildingType || 'building'

    const PROMPTS: Record<string, string> = {
        introduction: `architectural pencil sketch of a ${buildingType}, 
      bold black ink on white paper, hand drawn, 
      thick outlines, no color, no shading, 
      simple clean lines, architectural illustration style,
      front elevation view, minimalist`,

        designBrief: `architect student at drawing board sketching plans, 
      bold black ink illustration, hand drawn style,
      thick outlines, no color, black and white only,
      simple bold shapes, architectural sketch aesthetic,
      person holding pencil over technical drawing`,

        briefDevelopment: `abstract architectural concept bubbles and zones,
      bold black ink on white, hand drawn organic shapes,
      spatial planning diagram, thick outlines,
      no color, simple bold illustration,
      circles and rectangles suggesting spaces,
      architectural sketch style`
    }

    const prompt = PROMPTS[docType]
    if (!prompt) return ''

    const encodedPrompt = encodeURIComponent(
        prompt.replace(/\n/g, ' ').trim()
    )

    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=500&height=380&nologo=true&seed=${Math.floor(Math.random() * 10000)}`

    return url
}

export async function fetchIllustrationAsBase64(
    docType: string,
    details: Record<string, any>
): Promise<string> {
    console.log('fetchIllustrationAsBase64 called:', { docType })
    try {
        const response = await fetch('/api/illustration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                docType,
                buildingType: details.buildingType || 'building'
            })
        })

        console.log('API response status:', response.status)

        if (!response.ok) return ''

        const data = await response.json()
        console.log('dataUrl length:', data.dataUrl?.length)
        return data.dataUrl || ''

    } catch (error) {
        console.error('Illustration fetch failed:', error)
        return ''
    }
}

