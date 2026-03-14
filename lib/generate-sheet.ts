import jsPDF from 'jspdf'

const A3_WIDTH = 420
const A3_HEIGHT = 297
const OUTER_MARGIN = 10
const TITLE_BLOCK_HEIGHT = 35

export const FONT_PROFILES = [
    { id: 0, size: 11, lineHeight: 7.2, charSpace: 0.3 },
    { id: 1, size: 10, lineHeight: 6.5, charSpace: 0.1 },
    { id: 2, size: 9.5, lineHeight: 6.2, charSpace: 0.0 },
    { id: 3, size: 10.5, lineHeight: 7.0, charSpace: 0.4 },
    { id: 4, size: 10, lineHeight: 6.8, charSpace: 0.2 },
    { id: 5, size: 11.5, lineHeight: 7.5, charSpace: 0.5 },
    { id: 6, size: 9, lineHeight: 6.0, charSpace: 0.0 },
    { id: 7, size: 10.8, lineHeight: 7.1, charSpace: 0.3 },
    { id: 8, size: 9.8, lineHeight: 6.4, charSpace: 0.1 },
    { id: 9, size: 11.2, lineHeight: 7.3, charSpace: 0.4 },
    { id: 10, size: 10.3, lineHeight: 6.7, charSpace: 0.2 },
    { id: 11, size: 9.2, lineHeight: 6.1, charSpace: 0.0 },
    { id: 12, size: 11.8, lineHeight: 7.8, charSpace: 0.6 },
    { id: 13, size: 10.1, lineHeight: 6.6, charSpace: 0.1 },
    { id: 14, size: 9.6, lineHeight: 6.3, charSpace: 0.0 },
    { id: 15, size: 10.7, lineHeight: 7.0, charSpace: 0.3 },
    { id: 16, size: 11.3, lineHeight: 7.4, charSpace: 0.5 },
    { id: 17, size: 9.4, lineHeight: 6.2, charSpace: 0.0 },
    { id: 18, size: 10.6, lineHeight: 6.9, charSpace: 0.2 },
    { id: 19, size: 11.1, lineHeight: 7.2, charSpace: 0.4 },
]

export function getSessionFontIndex(
    sessionId: string
): number {
    let hash = 0
    for (let i = 0; i < sessionId.length; i++) {
        hash = sessionId.charCodeAt(i) +
            ((hash << 5) - hash)
    }
    return Math.abs(hash) % 20
}

export const DOC_LABELS: Record<string, string> = {
    introduction: 'INTRODUCTION',
    designBrief: 'DESIGN BRIEF',
    briefDevelopment: 'BRIEF DEVELOPMENT',
    siteAnalysis: 'SITE ANALYSIS',
    sitePlanning: 'SITE PLANNING',
    caseStudies: 'CASE STUDIES',
    spatialAnalysis: 'SPATIAL ANALYSIS',
    scheduleOfAccommodation: 'SCHEDULE OF ACCOMMODATION',
    relationshipTable: 'RELATIONSHIP TABLE'
}

export const SHEET_NUMBERS: Record<string, string> = {
    introduction: 'AA-01',
    designBrief: 'AA-02',
    briefDevelopment: 'AA-03',
    siteAnalysis: 'AA-04',
    sitePlanning: 'AA-05',
    caseStudies: 'AA-06',
    spatialAnalysis: 'AA-07',
    scheduleOfAccommodation: 'AA-08',
    relationshipTable: 'AA-09'
}

export function generateSheet({
    docType,
    docLabel,
    content,
    details,
    sheetNumber,
    fontIndex,
    totalSheets = 9
}: {
    docType: string
    docLabel: string
    content: string
    details: Record<string, any>
    sheetNumber: string
    fontIndex: number
    totalSheets?: number
}): jsPDF {

    const profile = FONT_PROFILES[fontIndex] ||
        FONT_PROFILES[0]

    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a3'
    })

    const W = A3_WIDTH
    const H = A3_HEIGHT

    // Background
    pdf.setFillColor(252, 251, 248)
    pdf.rect(0, 0, W, H, 'F')

    // Outer border
    pdf.setDrawColor(30, 30, 30)
    pdf.setLineWidth(0.8)
    pdf.rect(
        OUTER_MARGIN,
        OUTER_MARGIN,
        W - OUTER_MARGIN * 2,
        H - OUTER_MARGIN * 2
    )
    // Inner border line
    pdf.setLineWidth(0.3)
    pdf.rect(
        OUTER_MARGIN + 3,
        OUTER_MARGIN + 3,
        W - (OUTER_MARGIN + 3) * 2,
        H - (OUTER_MARGIN + 3) * 2
    )

    // Title block
    const tbY = H - OUTER_MARGIN - TITLE_BLOCK_HEIGHT

    pdf.setLineWidth(0.5)
    pdf.line(
        OUTER_MARGIN + 3,
        tbY,
        W - OUTER_MARGIN - 3,
        tbY
    )

    const col1 = OUTER_MARGIN + 3
    const col2 = col1 +
        (W - (OUTER_MARGIN + 3) * 2) * 0.35
    const col3 = col1 +
        (W - (OUTER_MARGIN + 3) * 2) * 0.65
    const col4 = col1 +
        (W - (OUTER_MARGIN + 3) * 2) * 0.82
    const colEnd = W - OUTER_MARGIN - 3

    pdf.setLineWidth(0.3)
    pdf.line(col2, tbY, col2, H - OUTER_MARGIN - 3)
    pdf.line(col3, tbY, col3, H - OUTER_MARGIN - 3)
    pdf.line(col4, tbY, col4, H - OUTER_MARGIN - 3)

    // Title block labels
    pdf.setFontSize(6)
    pdf.setTextColor(120, 120, 120)
    pdf.text('PROJECT TITLE', col1 + 2, tbY + 4)
    pdf.text('DRAWING TITLE', col2 + 2, tbY + 4)
    pdf.text('DRAWN BY', col3 + 2, tbY + 4)
    pdf.text('SHEET', col4 + 2, tbY + 4)

    // Project title
    pdf.setFontSize(10)
    pdf.setTextColor(20, 20, 20)
    const projectTitle = details.projectTitle ||
        `Design of a ${details.buildingType}`
    const titleLines = pdf.splitTextToSize(
        projectTitle.toUpperCase(),
        col2 - col1 - 4
    )
    pdf.text(titleLines, col1 + 2, tbY + 10)

    // Drawing title
    pdf.setFontSize(11)
    pdf.text(docLabel, col2 + 2, tbY + 12)

    // Student name
    pdf.setFontSize(9)
    const studentName = details.studentName ||
        details.fullName || 'ARCHITECTURE STUDENT'
    pdf.text(
        studentName.toUpperCase(),
        col3 + 2,
        tbY + 10
    )

    // Date and university
    pdf.setFontSize(8)
    pdf.setTextColor(80, 80, 80)
    const today = new Date().toLocaleDateString(
        'en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }
    )
    pdf.text(today, col3 + 2, tbY + 17)
    pdf.text(
        details.university || 'FUTA',
        col3 + 2,
        tbY + 23
    )

    // Sheet number
    pdf.setFontSize(18)
    pdf.setTextColor(20, 20, 20)
    pdf.text(sheetNumber, col4 + 2, tbY + 16)

    // Formwork branding
    pdf.setFontSize(6)
    pdf.setTextColor(180, 180, 180)
    pdf.text(
        'Generated with Formwork — formwork.vercel.app',
        col4 + 2,
        tbY + 28
    )

    // Content area
    const contentStartY = OUTER_MARGIN + 6
    const contentEndY = tbY - 4
    const contentLeft = OUTER_MARGIN + 6
    const contentRight = W - OUTER_MARGIN - 6
    const contentWidth = contentRight - contentLeft

    // Document title inside sheet
    pdf.setFontSize(14)
    pdf.setTextColor(20, 20, 20)
    pdf.text(docLabel, contentLeft, contentStartY + 8)

    // Amber underline
    pdf.setDrawColor(212, 168, 83)
    pdf.setLineWidth(0.6)
    pdf.line(
        contentLeft,
        contentStartY + 10,
        contentLeft + 80,
        contentStartY + 10
    )

    // Subtle grid lines
    pdf.setDrawColor(220, 215, 205)
    pdf.setLineWidth(0.1)
    for (
        let y = contentStartY + 16;
        y < contentEndY - 5;
        y += profile.lineHeight
    ) {
        pdf.line(contentLeft, y + 2, contentRight, y + 2)
    }

    // Content text using font profile
    pdf.setFontSize(profile.size)
    pdf.setTextColor(25, 25, 25)
    pdf.setCharSpace(profile.charSpace)

    let textY = contentStartY + 16
    const maxTextY = contentEndY - 5

    const paragraphs = content
        .split('\n\n')
        .filter(p => p.trim())

    for (const paragraph of paragraphs) {
        if (textY >= maxTextY) break

        const trimmed = paragraph.trim()
        const isHeading =
            trimmed.endsWith(':') ||
            (trimmed === trimmed.toUpperCase() &&
                trimmed.length < 40)

        if (isHeading) {
            pdf.setFontSize(profile.size + 1)
            pdf.setCharSpace(profile.charSpace + 0.1)
            pdf.text(trimmed, contentLeft, textY)
            pdf.setFontSize(profile.size)
            pdf.setCharSpace(profile.charSpace)
            textY += profile.lineHeight + 1
        } else {
            const lines = pdf.splitTextToSize(
                trimmed,
                contentWidth
            )
            for (const line of lines) {
                if (textY >= maxTextY) break
                pdf.text(line, contentLeft, textY)
                textY += profile.lineHeight
            }
            textY += profile.lineHeight * 0.5
        }
    }

    // Reset char space
    pdf.setCharSpace(0)

    return pdf
}

export function downloadSheet(
    pdf: jsPDF,
    docLabel: string
): void {
    pdf.save(
        `formwork-${docLabel
            .toLowerCase()
            .replace(/\s+/g, '-')}.pdf`
    )
}
