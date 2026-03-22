const PROMPTS: Record<string, (buildingType: string) => string> = {
    introduction: (buildingType: string) =>
        `${buildingType} building architectural sketch bold black ink hand drawn thick outlines white background no color no shading`,

    designBrief: () =>
        `architect drawing plans at desk bold black ink sketch hand drawn thick outlines white background no color`,

    briefDevelopment: () =>
        `architectural bubble diagram bold black ink hand drawn circles zones white background no color`
}

export async function fetchIllustrationAsBase64(
    docType: string,
    details: Record<string, any>
): Promise<string> {
    try {
        const buildingType = details.buildingType || 'building'
        const promptFn = PROMPTS[docType]
        if (!promptFn) return ''

        const prompt = promptFn(buildingType)
        const seed = Math.floor(Math.random() * 99999)
        const encoded = encodeURIComponent(prompt)
        const url = `https://image.pollinations.ai/prompt/${encoded}?width=500&height=380&nologo=true&seed=${seed}&nofeed=true`

        console.log('Fetching illustration from browser:', url)

        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
        })

        console.log('Response status:', response.status)

        if (!response.ok) return ''

        const blob = await response.blob()

        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result as string
                console.log('Base64 length:', result.length)
                resolve(result)
            }
            reader.onerror = () => resolve('')
            reader.readAsDataURL(blob)
        })
    } catch (error) {
        console.error('Illustration fetch error:', error)
        return ''
    }
}
