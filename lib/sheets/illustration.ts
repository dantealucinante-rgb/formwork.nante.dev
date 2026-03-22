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
    try {
        const url = await fetchIllustration(
            docType, details
        )
        if (!url) return ''

        console.log('Fetching illustration from:', url)

        return new Promise((resolve) => {
            const img = new Image()
            img.crossOrigin = 'anonymous'

            img.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = img.width || 500
                canvas.height = img.height || 380
                const ctx = canvas.getContext('2d')
                if (!ctx) {
                    resolve('')
                    return
                }
                ctx.drawImage(img, 0, 0)
                const base64 = canvas.toDataURL('image/jpeg', 0.85)
                resolve(base64)
            }

            img.onerror = () => {
                console.error('Image failed to load:', url)
                resolve('')
            }

            // Add timestamp to bust cache
            img.src = url + '&t=' + Date.now()
        })
    } catch (err) {
        console.error('Illustration fetch error:', err)
        return ''
    }
}

