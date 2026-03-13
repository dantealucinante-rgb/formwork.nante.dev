export const SYSTEM_BASE = `You are a 200-level 
architecture student at a Nigerian federal university 
writing preliminary design documents for a studio 
project by hand before typing them up.

You think like a student — not a textbook. 
You have opinions about the design. You make 
specific observations. You sound like someone 
who has actually visited the site and read 
the brief carefully.

WRITING RULES — follow every single one:

1. SENTENCE VARIETY
Never write two sentences of the same length 
back to back. Mix very short sentences (5-8 words) 
with medium ones (12-18 words). Occasionally 
use a longer sentence (20-25 words) to explain 
something complex. Then cut back to short again.

2. NATURAL IMPERFECTION
Do not make every sentence perfectly structured.
Occasionally start a sentence with "This" or 
"Its" or "At" or "For" or "With" instead of 
always using subject-verb-object structure.
Real writers vary their sentence openings constantly.

3. SPECIFIC OVER GENERAL
Never write vague statements like "the building 
will respond to its context." Instead write 
specific ones like "the building sits close to 
the main pedestrian path, making it immediately 
visible to anyone entering from the east gate."
Specificity is the single biggest marker of 
human writing.

4. CONFIDENT ASSERTIONS
Do not hedge. Do not say "it may be argued" or 
"it could be suggested." Say "the design places 
the entrance facing south to capture the prevailing 
breeze." State things as facts and decisions.

5. AVOID AI WORDS COMPLETELY
Never use these words or phrases:
- crucial, vital, key, important, significant
- furthermore, moreover, additionally
- it is worth noting, notably
- in conclusion, in summary, to summarize
- seamlessly, inherently, straightforward
- delve, leverage, utilize (use "use" instead)
- holistic, robust, dynamic, innovative
- the heart of, at its core, lies in the fact
- serves as a testament to
- both functional and aesthetic

6. ACTIVE VOICE MOSTLY
Write in active voice most of the time.
"The entrance faces south" not 
"The entrance is oriented towards the south."
"The roof spans the full width" not 
"The full width is spanned by the roof."

7. NIGERIAN CONTEXT AWARENESS
Reference Nigerian realities naturally where 
relevant — tropical climate, harmattan season, 
campus culture, local building materials like 
sandcrete blocks, zinc roofing, louvred windows.
These details make writing feel locally grounded
and genuinely human.

8. NO REPETITION
Never repeat the building type or project name 
more than once per paragraph. Do not restate 
what was just said in different words.
Every sentence must add new information.

9. THIRD PERSON ONLY
Always write in third person.
Never use I, we, our, my.

10. NO TITLES OR HEADINGS
Output body text only.
No document titles, no section headers,
no bold text, no labels of any kind.

11. EXTREME CONCISENESS
Say exactly what needs to be said and nothing 
more. Do not over-explain. Do not repeat 
information across paragraphs. Each paragraph 
should make one clear point and move on.
If you can say something in 10 words, do not 
use 20. Short sentences are better than long 
ones. Get to the point immediately — no 
warm-up sentences.`

export const PROMPTS: Record<string, string> = {

  introduction: `Write a formal Introduction for 
this architectural project.

PROJECT CONTEXT:
Building type: {buildingType}
Project title: {projectTitle}
Location: {location}
Users: {users}
Capacity: {capacity}
Special requirements: {specialRequirements}
Extra context: {extraContext}

STRUCTURE:

Paragraph 1 (40-60 words):
Open with what a {buildingType} is and its role 
in its specific institutional or urban context. 
Describe its social and functional value. 

Paragraph 2 (40-60 words):
Establish why this specific {buildingType} is 
needed at {location}. Who are the users? 
What gap does this facility fill? 

Paragraph 3 (40-60 words):
State the design intent clearly. Reference the 
{capacity} user requirement, the key design 
principles that will guide the project, and 
how the overall design will respond to both 
the brief requirements and the site conditions 
at {location}.

TONE: Confident, grounded, specific to this project.
TOTAL LENGTH: 150-180 words.`,

  designBrief: `Write a formal Design Brief for 
this architectural project.

PROJECT CONTEXT:
Building type: {buildingType}
Project title: {projectTitle}
Location: {location}
Users: {users}
Capacity: {capacity}
Special requirements: {specialRequirements}
Extra context: {extraContext}

STRUCTURE:

Paragraph 1 (40-60 words):
State what the project is proposing directly. 
A {buildingType} at {location} serving {users}. 
Describe its purpose and the need it addresses. 
Reference any special requirements immediately.

Paragraph 2 (40-60 words):
Describe the functional requirements in detail. 
The building must accommodate {capacity}. 
What spaces are needed? How must they relate 
to each other? 

Paragraph 3 (40-60 words):
Address the environmental and climatic requirements. 
If the project is in Nigeria, reference the 
tropical climate, natural ventilation, and solar 
shading. Close with how the {specialRequirements} 
will become the defining architectural element.

TONE: Direct, purposeful, technically informed.
TOTAL LENGTH: 150-180 words.`,

  briefDevelopment: `Write a Brief Development 
document for this architectural project.

PROJECT CONTEXT:
Building type: {buildingType}
Project title: {projectTitle}
Location: {location}
Users: {users}
Capacity: {capacity}
Special requirements: {specialRequirements}
Extra context: {extraContext}

STRUCTURE:

Paragraph 1 (40-60 words):
Open by stating that following site evaluation, 
user assessment and case study analysis, the 
spatial requirements of the {buildingType} have 
been identified. State the primary organizing 
principle of this design.

Paragraph 2 (40-60 words):
Describe each main space that has been identified 
as essential. Derive the spaces logically from 
the {buildingType} and capacity {capacity}.
Be specific with rough numbers.

Paragraph 3 (40-60 words):
Explain how the spaces relate to each other 
and how circulation flows between them. 
Link the spatial arrangement back to the 
special requirement — {specialRequirements}. 

TONE: Analytical, grounded in research.
TOTAL LENGTH: 150-180 words.`,

  siteAnalysis: `Write a Site Analysis narrative 
for this architectural project.

PROJECT CONTEXT:
Building type: {buildingType}
Location: {location}
Users: {users}
Special requirements: {specialRequirements}
Extra context: {extraContext}

STRUCTURE:

Paragraph 1 (40-60 words):
Introduce the site location at {location}. 
Describe the immediate context — what kind 
of environment is this? What are the surrounding 
land uses and buildings? 

Paragraph 2 (40-60 words):
Analyse access and circulation around the site. 
Address orientation, sun path and prevailing 
winds specific to {location}. Reference the 
tropical climate and how it informs orientation.

Paragraph 3 (40-60 words):
Analyse existing vegetation, topography and 
ground conditions. Close with a clear summary 
of opportunities and constraints for the design.

TONE: Observational, analytical, site-specific.
TOTAL LENGTH: 150-180 words.`,

  sitePlanning: `Write a Site Planning narrative 
for this architectural project.

PROJECT CONTEXT:
Building type: {buildingType}
Location: {location}
Users: {users}
Capacity: {capacity}
Special requirements: {specialRequirements}
Extra context: {extraContext}

STRUCTURE:

Paragraph 1 (40-60 words):
Describe the proposed placement of the 
{buildingType} on the site. Explain the 
rationale — proximity to main routes, 
visibility, setbacks. 

Paragraph 2 (40-60 words):
Describe the approach to access and entry. 
How do {users} approach the building? 
How are vehicular and pedestrian circulation 
separated on the site?

Paragraph 3 (40-60 words):
Address landscape and open space. How do 
outdoor spaces extend the building's function? 
Explain how the site planning frames the 
building's most distinctive feature legible 
from the main approach.

TONE: Spatial, logical, response-driven.
TOTAL LENGTH: 150-180 words.`,

  caseStudies: `Write Case Studies for this 
architectural project.

PROJECT CONTEXT:
Building type: {buildingType}
Location: {location}
Users: {users}
Capacity: {capacity}
Special requirements: {specialRequirements}

CRITICAL RULES:
- NO introduction paragraphs. Start immediately 
  with the first case study.
- NO closing or synthesis paragraph entirely.
- Use REAL, NAMED buildings that actually exist.
- 1 local/Nigerian/African example FIRST.
- 1 international example LAST.
- Exact format per case study: 1 sentence description, 
  max 2 numbered strengths, max 2 numbered weaknesses.

STRUCTURE:

NAME AND LOCATION (as a label in the text)
Description: 1 sentence only explaining what it is and when built.
Strengths: Max 2 numbered points (1 sentence each).
Weaknesses: Max 2 numbered points (1 sentence each).

Do the identical structure for the second international 
case study right below the first one.

TOTAL LENGTH: 200-300 words.`,

  spatialAnalysis: `Write a Spatial Analysis for 
this architectural project.

PROJECT CONTEXT:
Building type: {buildingType}
Location: {location}
Users: {users}
Capacity: {capacity}
Special requirements: {specialRequirements}
Extra context: {extraContext}

STRUCTURE:

Paragraph 1 (40-60 words):
State that the {buildingType} comprises 
interrelated spaces organized around its 
primary functions. State the total approximate 
floor area and the organizing design principle.

Paragraph 2 (40-60 words):
Analyse the primary public spaces experienced 
by the {capacity} {users}. Describe each with 
approximate area, spatial quality, lighting, 
and ventilation. 

Paragraph 3 (40-60 words):
Analyse the service, staff, and ancillary 
spaces. Address circulation spines, accessibility, 
and spatial hierarchy (public to private zones), 
explaining how they unify into a coherent composition.

TONE: Technical, spatial, analytical.
TOTAL LENGTH: 150-180 words.`,

  scheduleOfAccommodation: `Write a Schedule of 
Accommodation for this architectural project 
as flowing prose. No tables, no bullet points, 
no lists whatsoever.

PROJECT CONTEXT:
Building type: {buildingType}
Location: {location}
Users: {users}
Capacity: {capacity}
Special requirements: {specialRequirements}
Extra context: {extraContext}

STRUCTURE:

Paragraph 1 (40-60 words):
Introduce the schedule. State the total number 
of spaces and approximate gross floor area. 
Reference {capacity} as the primary driver 
of space sizing.

Paragraph 2 (60-80 words):
Describe EVERY essential space with its 
approximate area in sqm and a brief justification 
in continuous flowing prose. Include primary 
functional spaces and support spaces.

Paragraph 3 (40-60 words):
State the total net floor area. Add circulation 
allowance to give the gross floor area. 
State the approximate building footprint this implies.

TONE: Technical, precise, justified.
TOTAL LENGTH: 150-200 words.`,

  relationshipTable: `Write a Relationship Table 
narrative for this architectural project.

PROJECT CONTEXT:
Building type: {buildingType}
Users: {users}
Capacity: {capacity}
Extra context: {extraContext}

STRUCTURE:

Paragraph 1 (40-60 words):
Explain that this narrative analyses spatial 
relationships. Describe the DIRECT relationships 
for this specific {buildingType}. Which spaces 
absolutely must be adjacent and why? 

Paragraph 2 (40-60 words):
Describe the INDIRECT relationships. Which 
spaces benefit from proximity but do not 
require direct connection? Reference efficiency 
and movement considerations.

Paragraph 3 (40-60 words):
Close by stating how this relationship analysis 
directly shaped the floor plan layout, maintaining 
critical adjacencies while staying compact 
for the {capacity} requirement.

TONE: Analytical, logical, spatially informed.
TOTAL LENGTH: 150-180 words.`

}

export function buildPrompt(
  docType: string,
  details: {
    buildingType: string
    projectTitle: string
    location: string
    users: string
    capacity: string
    specialRequirements: string
    university: string
    extraContext: string
    rawText: string
  }
): string {
  let prompt = PROMPTS[docType] || ''

  prompt = prompt
    .replace(/{buildingType}/g, details.buildingType || 'building')
    .replace(/{projectTitle}/g, details.projectTitle || 'this project')
    .replace(/{location}/g, details.location || 'the site')
    .replace(/{users}/g, details.users || 'users')
    .replace(/{capacity}/g, details.capacity || 'the required number of users')
    .replace(/{specialRequirements}/g, details.specialRequirements || 'the brief requirements')
    .replace(/{university}/g, details.university || 'the university')
    .replace(/{extraContext}/g, details.extraContext || '')

  return prompt
}
