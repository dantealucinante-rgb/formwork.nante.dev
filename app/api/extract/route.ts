import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { extractText, getDocumentProxy } from 'unpdf'

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        const bytes = await file.arrayBuffer()
        const buffer = new Uint8Array(bytes)

        const pdf = await getDocumentProxy(buffer)
        const { text } = await extractText(pdf, { mergePages: true })
        const rawText = text

        // Use Groq to extract structured details
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            max_tokens: 500,
            temperature: 0,
            messages: [
                {
                    role: 'system',
                    content: `You are a document parser for an architectural 
project brief. Extract the following details from 
the brief text provided. Return ONLY a valid JSON 
object with no extra text, no markdown, no backticks.

Extract these fields:
{
  "projectTitle": "",
  "buildingType": "",
  "location": "",
  "capacity": "",
  "users": "",
  "specialRequirements": "",
  "academicLevel": "",
  "duration": "",
  "additionalNotes": ""
}

If a field cannot be found return an empty string.
Be concise — values should be short phrases.`
                },
                {
                    role: 'user',
                    content: rawText
                }
            ]
        })

        const responseText = completion.choices[0]?.message?.content || '{}'

        let extracted = {}
        try {
            extracted = JSON.parse(responseText)
        } catch {
            extracted = {}
        }

        return NextResponse.json({
            success: true,
            extracted,
            rawText
        })

    } catch (error) {
        console.error('Extraction error:', error)
        return NextResponse.json(
            { error: 'Failed to process file' },
            { status: 500 }
        )
    }
}
