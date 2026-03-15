import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { SYSTEM_BASE, buildPrompt, PROMPTS } from '@/lib/prompts'

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

interface ProjectDetails {
    projectTitle: string
    buildingType: string
    location: string
    capacity: string
    users: string
    specialRequirements: string
    academicLevel: string
    university: string
    extraContext: string
    rawText: string
}

async function generateDocument(
    docType: string,
    details: ProjectDetails
): Promise<string> {
    const localizedSystemBase = SYSTEM_BASE.replace(
        /{buildingType}/g,
        details.buildingType || 'the specified building'
    )

    const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        temperature: 0.7,
        messages: [
            { role: 'system', content: localizedSystemBase },
            {
                role: 'user',
                content: buildPrompt(docType, details)
            }
        ]
    })

    return completion.choices[0]?.message?.content || ''
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { details, selectedDocuments } = body

        if (!details) {
            return NextResponse.json(
                { error: 'No project details provided' },
                { status: 400 }
            )
        }

        const docsToGenerate = selectedDocuments || Object.keys(PROMPTS)
        const results: Record<string, string> = {}

        // 1. Validate if this is an architectural project
        const validationPrompt = `
You are validating an architectural project brief.
Determine if this is a legitimate architectural 
building design project.

Building type: ${details.buildingType || 'Not specified'}
Project title: ${details.projectTitle || 'Not specified'}
Users: ${details.users || 'Not specified'}
Brief Content: ${details.rawText?.substring(0, 1000) || 'None provided'}

A legitimate architectural project involves 
designing a physical building or structure.

Examples of VALID projects:
- Snack bar, library, school, hospital, 
  community centre, house, office building,
  market, mosque, church, hotel, clinic

Examples of INVALID projects:
- CV, resume, document, website, app,
  logo, brand, poster, report

Respond with ONLY a JSON object:
{"valid": true} or {"valid": false, "reason": "explanation"}
`

        const validationResponse = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: validationPrompt }],
            max_tokens: 50
        })

        const validationText = validationResponse.choices[0]
            ?.message?.content?.trim() || '{}'

        try {
            const validation = JSON.parse(validationText)
            if (!validation.valid) {
                return NextResponse.json({
                    error: 'invalid_project',
                    message: validation.reason ||
                        'This does not appear to be an architectural building project. Please upload a valid architectural design brief.'
                }, { status: 400 })
            }
        } catch {
            // If validation parsing fails, continue
        }

        // 2. Generate all documents in parallel
        await Promise.all(
            docsToGenerate.map(async (docType: string) => {
                if (PROMPTS[docType]) {
                    results[docType] = await generateDocument(docType, details)
                }
            })
        )

        // Update stats if user is logged in
        try {
            const cookieStore = await cookies()
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        get(name: string) {
                            return cookieStore.get(name)?.value
                        },
                        set(name: string, value: string, options: any) {
                            cookieStore.set({ name, value, ...options })
                        },
                        remove(name: string, options: any) {
                            cookieStore.set({ name, value: '', ...options })
                        },
                    },
                }
            )

            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                await supabase.rpc('increment_generation_stats', {
                    user_id: user.id,
                    doc_count: docsToGenerate.length
                })
            }
        } catch (authError) {
            console.error('Stats update failed:', authError)
            // Continue anyway as generation was successful
        }

        return NextResponse.json({
            success: true,
            documents: results
        })

    } catch (error) {
        console.error('Generation error:', error)
        return NextResponse.json(
            { error: 'Failed to generate documents' },
            { status: 500 }
        )
    }
}
