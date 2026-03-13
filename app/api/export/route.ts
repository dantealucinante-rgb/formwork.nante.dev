import { NextRequest, NextResponse } from 'next/server'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
import jsPDF from 'jspdf'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { documents, details, format, selectedDocuments } = body

        if (!documents || !format) {
            return NextResponse.json(
                { error: 'Missing documents or format' },
                { status: 400 }
            )
        }

        if (format === 'word') {
            const docSections: Paragraph[] = []

            // Title
            docSections.push(
                new Paragraph({
                    text: details.projectTitle || 'Architectural Preliminary Documents',
                    heading: HeadingLevel.TITLE,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                })
            )

            docSections.push(
                new Paragraph({
                    text: `${details.university || ''} | ${details.academicLevel || ''} | ${details.buildingType || ''}`,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 800 }
                })
            )

            const docLabels: Record<string, string> = {
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

            // Add each document
            for (const docType of selectedDocuments) {
                if (documents[docType]) {
                    // Section heading
                    docSections.push(
                        new Paragraph({
                            text: docLabels[docType] || docType.toUpperCase(),
                            heading: HeadingLevel.HEADING_1,
                            spacing: { before: 600, after: 200 },
                            border: {
                                bottom: {
                                    color: 'D4A853',
                                    size: 6,
                                    style: 'single'
                                }
                            }
                        })
                    )

                    // Document content — split by paragraphs
                    const paragraphs = documents[docType]
                        .split('\n\n')
                        .filter((p: string) => p.trim())

                    for (const para of paragraphs) {
                        docSections.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: para.trim(),
                                        size: 24,
                                        font: 'Calibri'
                                    })
                                ],
                                spacing: { after: 200, line: 360 },
                                alignment: AlignmentType.JUSTIFIED
                            })
                        )
                    }
                }
            }

            // Footer
            docSections.push(
                new Paragraph({
                    text: 'Generated with Formwork — formwork.vercel.app',
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 800 },
                    children: [
                        new TextRun({
                            text: 'Generated with Formwork — formwork.vercel.app',
                            size: 18,
                            color: '9CA3AF',
                            font: 'Calibri'
                        })
                    ]
                })
            )

            const doc = new Document({
                sections: [{
                    properties: {
                        page: {
                            margin: {
                                top: 1440,
                                right: 1440,
                                bottom: 1440,
                                left: 1440
                            }
                        }
                    },
                    children: docSections
                }]
            })

            const buffer = await Packer.toBuffer(doc)
            const uint8Array = new Uint8Array(buffer)

            return new NextResponse(uint8Array, {
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'Content-Disposition': `attachment; filename="formwork-${details.projectTitle?.replace(/\s+/g, '-') || 'preliminaries'}.docx"`
                }
            })
        }

        if (format === 'pdf') {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()
            const margin = 25
            const contentWidth = pageWidth - margin * 2
            let y = margin

            const docLabels: Record<string, string> = {
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

            const addNewPageIfNeeded = (spaceNeeded: number) => {
                if (y + spaceNeeded > pageHeight - margin) {
                    pdf.addPage()
                    y = margin
                }
            }

            // Title page
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(18)
            pdf.setTextColor(27, 36, 49)
            const titleLines = pdf.splitTextToSize(
                details.projectTitle || 'Architectural Preliminary Documents',
                contentWidth
            )
            pdf.text(titleLines, pageWidth / 2, y + 20, { align: 'center' })
            y += titleLines.length * 8 + 25

            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(11)
            pdf.setTextColor(107, 114, 128)
            pdf.text(
                `${details.university || ''} | ${details.academicLevel || ''} | ${details.buildingType || ''}`,
                pageWidth / 2,
                y,
                { align: 'center' }
            )
            y += 8

            // Amber line under subtitle
            pdf.setDrawColor(212, 168, 83)
            pdf.setLineWidth(0.8)
            pdf.line(margin, y + 4, pageWidth - margin, y + 4)
            y += 16

            // Each document
            for (const docType of selectedDocuments) {
                if (documents[docType]) {
                    addNewPageIfNeeded(30)

                    // Section heading
                    pdf.setFont('helvetica', 'bold')
                    pdf.setFontSize(12)
                    pdf.setTextColor(27, 36, 49)
                    pdf.text(docLabels[docType] || docType.toUpperCase(), margin, y)
                    y += 4

                    // Amber underline
                    pdf.setDrawColor(212, 168, 83)
                    pdf.setLineWidth(0.5)
                    pdf.line(margin, y, pageWidth - margin, y)
                    y += 8

                    // Content
                    pdf.setFont('helvetica', 'normal')
                    pdf.setFontSize(10)
                    pdf.setTextColor(45, 55, 72)

                    const paragraphs = documents[docType]
                        .split('\n\n')
                        .filter((p: string) => p.trim())

                    for (const para of paragraphs) {
                        const lines = pdf.splitTextToSize(para.trim(), contentWidth)
                        addNewPageIfNeeded(lines.length * 5 + 6)
                        pdf.text(lines, margin, y)
                        y += lines.length * 5 + 6
                    }

                    y += 8
                }
            }

            // Footer on last page
            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(8)
            pdf.setTextColor(156, 163, 175)
            pdf.text(
                'Generated with Formwork — formwork.vercel.app',
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            )

            const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

            return new NextResponse(pdfBuffer, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="formwork-${details.projectTitle?.replace(/\s+/g, '-') || 'preliminaries'}.pdf"`
                }
            })
        }

        return NextResponse.json(
            { error: 'Invalid format' },
            { status: 400 }
        )

    } catch (error) {
        console.error('Export error:', error)
        return NextResponse.json(
            { error: 'Export failed' },
            { status: 500 }
        )
    }
}
