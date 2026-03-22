export async function fetchIllustrationAsBase64(
    docType: string,
    details: Record<string, any>
): Promise<string> {
    try {
        console.log('Calling illustration API for:', docType)

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
        console.log('dataUrl length:', data.dataUrl?.length || 0)
        return data.dataUrl || ''

    } catch (error) {
        console.error('Illustration fetch failed:', error)
        return ''
    }
}
