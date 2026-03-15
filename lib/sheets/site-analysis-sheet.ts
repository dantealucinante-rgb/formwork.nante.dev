export function generateSiteAnalysisSheet(
    content: string,
    details: Record<string, any>
): string {

    // Parse content into sections
    // Content has labeled sections like:
    // "Sun Path:\n...\n\nPrevailing Wind:\n..."
    const sections: Record<string, string> = {}
    const sectionPatterns = [
        'Sun Path', 'Prevailing Wind',
        'Noise/Acoustics', 'Accessibility',
        'Topography', 'Infrastructure', 'Vegetation'
    ]

    let remaining = content
    for (const section of sectionPatterns) {
        const regex = new RegExp(
            `${section}[:\\s]*([\\s\\S]*?)(?=${sectionPatterns
                .filter(s => s !== section)
                .join('|')
            }|$)`,
            'i'
        )
        const match = remaining.match(regex)
        if (match) {
            sections[section] = match[1].trim()
        }
    }

    const projectTitle = (
        details.projectTitle ||
        `Design of a ${details.buildingType}`
    ).toUpperCase()

    const studentName = (
        details.studentName ||
        details.fullName ||
        'ARCHITECTURE STUDENT'
    ).toUpperCase()

    const university = details.university || 'FUTA'

    const today = new Date().toLocaleDateString(
        'en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }
    )

    // Helper to wrap text into lines
    function wrapText(
        text: string,
        maxChars: number
    ): string[] {
        if (!text) return ['—']
        const words = text.split(' ')
        const lines: string[] = []
        let current = ''
        for (const word of words) {
            if ((current + ' ' + word).length > maxChars) {
                if (current) lines.push(current.trim())
                current = word
            } else {
                current += ' ' + word
            }
        }
        if (current) lines.push(current.trim())
        return lines.slice(0, 4) // max 4 lines per box
    }

    function renderTextLines(
        lines: string[],
        x: number,
        y: number,
        fontSize: number = 9,
        lineHeight: number = 12
    ): string {
        return lines.map((line, i) =>
            `<text x="${x}" y="${y + i * lineHeight}" 
        font-family="Helvetica, Arial, sans-serif" 
        font-size="${fontSize}" 
        fill="#1a1a1a">${line}</text>`
        ).join('')
    }

    const sunPathLines = wrapText(
        sections['Sun Path'] ||
        'The site receives sunlight from the east. The west facade experiences afternoon heat.',
        28
    )

    const windLines = wrapText(
        sections['Prevailing Wind'] ||
        'Southwest trade wind brings cool ocean breeze. Northeast trade wind brings harmattan.',
        28
    )

    const acousticsLines = wrapText(
        sections['Noise/Acoustics'] ||
        'The major source of noise is from the existing road due to vehicular activities.',
        28
    )

    const accessLines = wrapText(
        sections['Accessibility'] ||
        'The site can be accessed by an existing road leading to the site.',
        28
    )

    const topoLines = wrapText(
        sections['Topography'] ||
        'The site is flat which makes it easy to construct.',
        28
    )

    const infraLines = wrapText(
        sections['Infrastructure'] ||
        'The site is surrounded by existing buildings, electricity poles and close to a road.',
        28
    )

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 1190 841" 
  width="1190" height="841"
  style="background: #FCFBF8; font-family: Helvetica, Arial, sans-serif;">

  <!-- ================================ -->
  <!-- BACKGROUND -->
  <!-- ================================ -->
  <rect width="1190" height="841" fill="#FCFBF8"/>

  <!-- ================================ -->
  <!-- OUTER BORDER (double line) -->
  <!-- ================================ -->
  <rect x="20" y="20" width="1150" height="801" 
    fill="none" stroke="#1a1a1a" stroke-width="2.5"/>
  <rect x="28" y="28" width="1134" height="785" 
    fill="none" stroke="#1a1a1a" stroke-width="0.8"/>

  <!-- ================================ -->
  <!-- LEFT TITLE BLOCK STRIP -->
  <!-- (vertical boxes on left side) -->
  <!-- ================================ -->
  <rect x="28" y="28" width="80" height="785" 
    fill="none" stroke="#1a1a1a" stroke-width="0.8"/>
  <rect x="28" y="28" width="80" height="130" 
    fill="none" stroke="#1a1a1a" stroke-width="0.5"/>
  <rect x="28" y="158" width="80" height="130" 
    fill="none" stroke="#1a1a1a" stroke-width="0.5"/>
  <rect x="28" y="288" width="80" height="130" 
    fill="none" stroke="#1a1a1a" stroke-width="0.5"/>
  <rect x="28" y="418" width="80" height="130" 
    fill="none" stroke="#1a1a1a" stroke-width="0.5"/>
  <rect x="28" y="548" width="80" height="130" 
    fill="none" stroke="#1a1a1a" stroke-width="0.5"/>

  <!-- ================================ -->
  <!-- BOTTOM TITLE BLOCK -->
  <!-- ================================ -->
  <rect x="108" y="741" width="1054" height="72" 
    fill="none" stroke="#1a1a1a" stroke-width="0.8"/>
  
  <!-- Title block vertical dividers -->
  <line x1="430" y1="741" x2="430" y2="813" 
    stroke="#1a1a1a" stroke-width="0.5"/>
  <line x1="720" y1="741" x2="720" y2="813" 
    stroke="#1a1a1a" stroke-width="0.5"/>
  <line x1="960" y1="741" x2="960" y2="813" 
    stroke="#1a1a1a" stroke-width="0.5"/>

  <!-- Title block labels -->
  <text x="114" y="753" 
    font-size="7" fill="#888" 
    font-family="Helvetica">PROJECT TITLE</text>
  <text x="436" y="753" 
    font-size="7" fill="#888" 
    font-family="Helvetica">DRAWING TITLE</text>
  <text x="726" y="753" 
    font-size="7" fill="#888" 
    font-family="Helvetica">DRAWN BY</text>
  <text x="966" y="753" 
    font-size="7" fill="#888" 
    font-family="Helvetica">SHEET</text>

  <!-- Title block content -->
  <text x="114" y="768" 
    font-size="10" fill="#1a1a1a" 
    font-family="Helvetica"
    font-weight="bold">${projectTitle.substring(0, 35)}</text>
  <text x="436" y="768" 
    font-size="11" fill="#1a1a1a" 
    font-family="Helvetica"
    font-weight="bold">SITE ANALYSIS</text>
  <text x="726" y="766" 
    font-size="9" fill="#1a1a1a" 
    font-family="Helvetica">${studentName.substring(0, 28)}</text>
  <text x="726" y="778" 
    font-size="8" fill="#555" 
    font-family="Helvetica">${today}</text>
  <text x="726" y="790" 
    font-size="8" fill="#555" 
    font-family="Helvetica">${university}</text>
  <text x="966" y="780" 
    font-size="22" fill="#1a1a1a" 
    font-family="Helvetica"
    font-weight="bold">AA-04</text>
  <text x="966" y="808" 
    font-size="6" fill="#ccc" 
    font-family="Helvetica">Generated with Formwork</text>

  <!-- ================================ -->
  <!-- LARGE TITLE "SITE ANALYSIS" -->
  <!-- bottom right, bold -->
  <!-- ================================ -->
  <text x="680" y="730" 
    font-size="42" fill="#1a1a1a" 
    font-family="Helvetica Neue, Helvetica, Arial" 
    font-weight="900"
    letter-spacing="3">SITE ANALYSIS</text>
  <!-- Amber underline -->
  <line x1="680" y1="736" x2="1150" y2="736" 
    stroke="#D4A853" stroke-width="2"/>

  <!-- ================================ -->
  <!-- CENTRAL SITE RECTANGLE -->
  <!-- (the plot — dashed border) -->
  <!-- ================================ -->
  <rect x="380" y="280" width="320" height="340" 
    fill="#f5f3ee" 
    stroke="#1a1a1a" 
    stroke-width="1.5" 
    stroke-dasharray="8,4"/>
  
  <!-- Site label -->
  <text x="490" y="460" 
    font-size="11" fill="#999" 
    font-family="Helvetica"
    font-style="italic">SITE</text>
  
  <!-- Entry arrow into site -->
  <line x1="700" y1="500" x2="700" y2="580" 
    stroke="#1a1a1a" stroke-width="2"/>
  <polygon points="700,620 690,590 710,590" 
    fill="#1a1a1a"/>
  <text x="705" y="545" 
    font-size="9" fill="#1a1a1a"
    font-family="Helvetica">ENTRY</text>

  <!-- ================================ -->
  <!-- NORTH ARROW -->
  <!-- ================================ -->
  <g transform="translate(920, 120)">
    <!-- Arrow shaft -->
    <line x1="0" y1="40" x2="0" y2="-40" 
      stroke="#1a1a1a" stroke-width="2"/>
    <!-- North arrowhead (filled) -->
    <polygon points="0,-50 -10,-25 10,-25" 
      fill="#1a1a1a"/>
    <!-- South arrowhead (outline) -->
    <polygon points="0,50 -10,25 10,25" 
      fill="none" stroke="#1a1a1a" stroke-width="1.5"/>
    <!-- N label -->
    <text x="-6" y="-55" 
      font-size="16" fill="#1a1a1a" 
      font-family="Helvetica"
      font-weight="bold">N</text>
  </g>

  <!-- ================================ -->
  <!-- SUN ICON (center left area) -->
  <!-- ================================ -->
  <g transform="translate(195, 440)">
    <!-- Sun circle -->
    <circle cx="0" cy="0" r="28" 
      fill="#f5e6c0" 
      stroke="#1a1a1a" stroke-width="1.5"/>
    <!-- Sun rays -->
    <line x1="0" y1="-38" x2="0" y2="-32" 
      stroke="#1a1a1a" stroke-width="1.5"/>
    <line x1="0" y1="32" x2="0" y2="38" 
      stroke="#1a1a1a" stroke-width="1.5"/>
    <line x1="-38" y1="0" x2="-32" y2="0" 
      stroke="#1a1a1a" stroke-width="1.5"/>
    <line x1="32" y1="0" x2="38" y2="0" 
      stroke="#1a1a1a" stroke-width="1.5"/>
    <line x1="-27" y1="-27" x2="-22" y2="-22" 
      stroke="#1a1a1a" stroke-width="1.5"/>
    <line x1="22" y1="-22" x2="27" y2="-27" 
      stroke="#1a1a1a" stroke-width="1.5"/>
    <line x1="-27" y1="27" x2="-22" y2="22" 
      stroke="#1a1a1a" stroke-width="1.5"/>
    <line x1="22" y1="22" x2="27" y2="27" 
      stroke="#1a1a1a" stroke-width="1.5"/>
    <!-- Sun face dot -->
    <circle cx="0" cy="0" r="4" fill="#1a1a1a"/>
  </g>

  <!-- SW wind arrow (large diagonal) -->
  <path d="M 160,560 Q 300,480 420,380" 
    fill="none" stroke="#1a1a1a" stroke-width="3"
    marker-end="url(#arrowhead)"/>
  <text x="185" y="575" 
    font-size="9" fill="#1a1a1a"
    font-family="Helvetica"
    font-weight="bold">S.W TRADE WIND</text>

  <!-- NE wind arrow (large diagonal opposite) -->
  <path d="M 740,240 Q 600,340 480,440" 
    fill="none" stroke="#1a1a1a" stroke-width="3"
    stroke-dasharray="10,4"
    marker-end="url(#arrowhead)"/>
  <text x="745" y="235" 
    font-size="9" fill="#1a1a1a"
    font-family="Helvetica"
    font-weight="bold">N.E TRADE WIND</text>
  <text x="745" y="248" 
    font-size="8" fill="#666"
    font-family="Helvetica">(HARMATTAN)</text>

  <!-- Arrow marker definition -->
  <defs>
    <marker id="arrowhead" markerWidth="10" 
      markerHeight="7" refX="9" refY="3.5" 
      orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" 
        fill="#1a1a1a"/>
    </marker>
  </defs>

  <!-- ================================ -->
  <!-- TREE / VEGETATION ICON -->
  <!-- bottom right area -->
  <!-- ================================ -->
  <g transform="translate(860, 580)">
    <!-- Tree trunk -->
    <rect x="-5" y="20" width="10" height="30" 
      fill="#8B6347"/>
    <!-- Tree crown layers -->
    <polygon points="0,-30 -30,10 30,10" 
      fill="#2d5a1b" stroke="#1a1a1a" stroke-width="1"/>
    <polygon points="0,-50 -22,0 22,0" 
      fill="#2d5a1b" stroke="#1a1a1a" stroke-width="1"/>
    <!-- Small dots around tree (shrubs) -->
    <circle cx="-40" cy="40" r="8" 
      fill="none" stroke="#1a1a1a" stroke-width="1"/>
    <circle cx="40" cy="45" r="6" 
      fill="none" stroke="#1a1a1a" stroke-width="1"/>
    <circle cx="-25" cy="48" r="5" 
      fill="none" stroke="#1a1a1a" stroke-width="1"/>
  </g>

  <!-- ================================ -->
  <!-- BUILDING SKETCH (infrastructure) -->
  <!-- top center area -->
  <!-- ================================ -->
  <g transform="translate(520, 100)">
    <!-- Simple building outline -->
    <rect x="0" y="20" width="60" height="45" 
      fill="none" stroke="#1a1a1a" stroke-width="1.5"/>
    <!-- Roof -->
    <polygon points="-5,20 30,-5 65,20" 
      fill="none" stroke="#1a1a1a" stroke-width="1.5"/>
    <!-- Door -->
    <rect x="22" y="42" width="16" height="23" 
      fill="none" stroke="#1a1a1a" stroke-width="1"/>
    <!-- Windows -->
    <rect x="6" y="28" width="12" height="10" 
      fill="none" stroke="#1a1a1a" stroke-width="1"/>
    <rect x="42" y="28" width="12" height="10" 
      fill="none" stroke="#1a1a1a" stroke-width="1"/>
  </g>

  <!-- ================================ -->
  <!-- PERSON / ACCESSIBILITY ICON -->
  <!-- ================================ -->
  <g transform="translate(215, 570)">
    <!-- Head -->
    <circle cx="0" cy="-30" r="10" 
      fill="none" stroke="#1a1a1a" stroke-width="2"/>
    <!-- Body -->
    <line x1="0" y1="-20" x2="0" y2="10" 
      stroke="#1a1a1a" stroke-width="2"/>
    <!-- Arms -->
    <line x1="-18" y1="-5" x2="18" y2="-5" 
      stroke="#1a1a1a" stroke-width="2"/>
    <!-- Legs -->
    <line x1="0" y1="10" x2="-12" y2="35" 
      stroke="#1a1a1a" stroke-width="2"/>
    <line x1="0" y1="10" x2="12" y2="35" 
      stroke="#1a1a1a" stroke-width="2"/>
  </g>

  <!-- Road line below accessibility -->
  <line x1="140" y1="650" x2="360" y2="650" 
    stroke="#1a1a1a" stroke-width="3"/>
  <line x1="140" y1="660" x2="360" y2="660" 
    stroke="#1a1a1a" stroke-width="1"
    stroke-dasharray="15,8"/>
  <text x="195" y="675" 
    font-size="8" fill="#1a1a1a"
    font-family="Helvetica">ROAD</text>

  <!-- ================================ -->
  <!-- ANNOTATION BOXES WITH TEXT -->
  <!-- ================================ -->

  <!-- INFRASTRUCTURE box (top left area) -->
  <rect x="108" y="40" width="200" height="90" 
    fill="white" stroke="#1a1a1a" stroke-width="1"/>
  <text x="118" y="54" 
    font-size="9" fill="#1a1a1a"
    font-family="Helvetica"
    font-weight="bold">INFRASTRUCTURE</text>
  <line x1="108" y1="58" x2="308" y2="58" 
    stroke="#1a1a1a" stroke-width="0.5"/>
  ${renderTextLines(infraLines, 118, 72, 8, 11)}
  <!-- Leader line to site -->
  <line x1="308" y1="85" x2="380" y2="200" 
    stroke="#1a1a1a" stroke-width="0.8"
    stroke-dasharray="4,3"/>

  <!-- ACOUSTICS box (top right) -->
  <rect x="840" y="40" width="200" height="90" 
    fill="white" stroke="#1a1a1a" stroke-width="1"/>
  <text x="850" y="54" 
    font-size="9" fill="#1a1a1a"
    font-family="Helvetica"
    font-weight="bold">ACOUSTICS</text>
  <line x1="840" y1="58" x2="1040" y2="58" 
    stroke="#1a1a1a" stroke-width="0.5"/>
  <!-- Speaker icon -->
  <g transform="translate(1010, 75)">
    <rect x="-8" y="-8" width="8" height="16" 
      fill="#1a1a1a"/>
    <polygon points="-8,-8 -20,-16 -20,16 -8,8" 
      fill="#1a1a1a"/>
    <path d="M 2,-10 Q 16,0 2,10" 
      fill="none" stroke="#1a1a1a" stroke-width="1.5"/>
    <path d="M 5,-16 Q 22,0 5,16" 
      fill="none" stroke="#1a1a1a" stroke-width="1.5"/>
  </g>
  ${renderTextLines(acousticsLines, 850, 72, 8, 11)}
  <!-- Leader line to site -->
  <line x1="840" y1="85" x2="700" y2="280" 
    stroke="#1a1a1a" stroke-width="0.8"
    stroke-dasharray="4,3"/>

  <!-- TOPOGRAPHY box (right middle) -->
  <rect x="840" y="200" width="200" height="130" 
    fill="white" stroke="#1a1a1a" stroke-width="1"/>
  <text x="850" y="214" 
    font-size="9" fill="#1a1a1a"
    font-family="Helvetica"
    font-weight="bold">TOPOGRAPHY</text>
  <line x1="840" y1="218" x2="1040" y2="218" 
    stroke="#1a1a1a" stroke-width="0.5"/>
  ${renderTextLines(topoLines, 850, 232, 8, 11)}
  <!-- Simple flat terrain sketch -->
  <line x1="855" y1="310" x2="1025" y2="310" 
    stroke="#1a1a1a" stroke-width="1.5"/>
  <line x1="855" y1="310" x2="870" y2="295" 
    stroke="#1a1a1a" stroke-width="1"/>
  <line x1="870" y1="295" x2="910" y2="310" 
    stroke="#1a1a1a" stroke-width="1"/>
  <!-- Leader line -->
  <line x1="840" y1="265" x2="700" y2="350" 
    stroke="#1a1a1a" stroke-width="0.8"
    stroke-dasharray="4,3"/>

  <!-- SUN PATH box (left, below infrastructure) -->
  <rect x="108" y="160" width="200" height="90" 
    fill="white" stroke="#1a1a1a" stroke-width="1"/>
  <text x="118" y="174" 
    font-size="9" fill="#1a1a1a"
    font-family="Helvetica"
    font-weight="bold">SUN PATH</text>
  <line x1="108" y1="178" x2="308" y2="178" 
    stroke="#1a1a1a" stroke-width="0.5"/>
  ${renderTextLines(sunPathLines, 118, 192, 8, 11)}
  <!-- Sun path arc arrow -->
  <path d="M 118,240 Q 208,220 298,240" 
    fill="none" stroke="#D4A853" stroke-width="1.5"/>
  <polygon points="298,240 286,233 290,246" 
    fill="#D4A853"/>

  <!-- PREVAILING WIND box (bottom center) -->
  <rect x="340" y="648" width="280" height="80" 
    fill="white" stroke="#1a1a1a" stroke-width="1"/>
  <text x="350" y="662" 
    font-size="9" fill="#1a1a1a"
    font-family="Helvetica"
    font-weight="bold">PREVAILING WIND</text>
  <line x1="340" y1="666" x2="620" y2="666" 
    stroke="#1a1a1a" stroke-width="0.5"/>
  ${renderTextLines(windLines, 350, 680, 8, 11)}

  <!-- ACCESSIBILITY box (bottom left) -->
  <rect x="108" y="648" width="220" height="80" 
    fill="white" stroke="#1a1a1a" stroke-width="1"/>
  <text x="118" y="662" 
    font-size="9" fill="#1a1a1a"
    font-family="Helvetica"
    font-weight="bold">ACCESSIBILITY</text>
  <line x1="108" y1="666" x2="328" y2="666" 
    stroke="#1a1a1a" stroke-width="0.5"/>
  ${renderTextLines(accessLines, 118, 680, 8, 11)}

  <!-- VEGETATION box (bottom right of center) -->
  <rect x="640" y="648" width="220" height="80" 
    fill="white" stroke="#1a1a1a" stroke-width="1"/>
  <text x="650" y="662" 
    font-size="9" fill="#1a1a1a"
    font-family="Helvetica"
    font-weight="bold">VEGETATION</text>
  <line x1="640" y1="666" x2="860" y2="666" 
    stroke="#1a1a1a" stroke-width="0.5"/>
  <text x="650" y="680" 
    font-size="8" fill="#1a1a1a"
    font-family="Helvetica">Trees and shrubs are present</text>
  <text x="650" y="692" 
    font-size="8" fill="#1a1a1a"
    font-family="Helvetica">on site. Existing trees should</text>
  <text x="650" y="704" 
    font-size="8" fill="#1a1a1a"
    font-family="Helvetica">be retained and landscaped.</text>

</svg>`

    return svg
}

export function downloadSiteAnalysisSVG(
    svgContent: string,
    projectTitle: string
): void {
    const blob = new Blob([svgContent], {
        type: 'image/svg+xml'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `formwork-site-analysis.svg`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
}
