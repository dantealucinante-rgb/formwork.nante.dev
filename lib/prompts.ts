export const SYSTEM_BASE = `You are a 200-level 
architecture student at a Nigerian federal university 
writing preliminary design documents for a studio 
project.

CRITICAL — READ THIS FIRST:
You are writing about a SPECIFIC building type: 
{buildingType}. 

Every single thing you write must be specific 
to THIS building type. Do not use generic 
architectural language. Do not borrow from 
other building types. Think carefully about 
what THIS specific building actually needs,
how it actually works, who actually uses it,
and what spaces it actually requires.

For example:
- A library needs reading rooms, book stacks, 
  computer stations, quiet zones
- A clinic needs consultation rooms, waiting 
  area, pharmacy, records room
- A mosque needs prayer hall, ablution area, 
  minaret, imam's office
- A market needs stalls, storage, loading bay,
  circulation paths, security post

Never default to generic spaces. Always think:
"What does THIS specific building actually need?"

WRITING RULES:

1. Plain direct sentences. No compound-complex prose.
2. Third person only (except Design Brief).
3. No AI words: crucial, vital, seamlessly, 
   holistic, robust, innovative, leverage,
   furthermore, moreover, in conclusion.
4. Active voice mostly.
5. Nigerian context where relevant — tropical 
   climate, harmattan, sandcrete blocks, 
   louvred windows, campus culture.
6. No titles or headings in output.
7. Confident assertions — no hedging.
8. Every sentence adds new information.
9. Short sentences. Get to the point.`

export const PROMPTS: Record<string, string> = {

  introduction: `Write an Introduction for this 
architectural project.

PROJECT CONTEXT:
Building type: {buildingType}
Location: {location}
Users: {users}
Capacity: {capacity}
Special requirements: {specialRequirements}
Student name: {studentName}
Matric number: {matricNumber}
Extra context: {extraContext}


STRUCTURE — follow this exactly:

Part 1:
Define the subject or concept first — not 
the building. Define what {users} are or 
what the main activity is. One or two short 
sentences. Example pattern: "A snack is a 
light meal eaten between regular meals."

Part 2:
Define the building type in relation to that 
subject. What is a {buildingType}? What does 
it do? Who uses it? Two short sentences maximum.

RULES:
- No history. No architect quotes. No long paragraphs.
- Two definitions only — subject first, building second.
- If student name and matric number are provided, do not include them in the written text — they appear in the title block only.
- Total length: 60-80 words maximum.
- Plain declarative sentences only.`,

  designBrief: `Write a Design Brief for this 
architectural project.

PROJECT CONTEXT:
Building type: {buildingType}
Project title: {projectTitle}
Location: {location}
Users: {users}
Capacity: {capacity}
Special requirements: {specialRequirements}
Extra context: {extraContext}

STRUCTURE — follow this exactly:

Write in FIRST PERSON. This is a commission statement.

Use this exact opening formula:
"I, [student name], have been commissioned to 
design a {buildingType} situated at {location}."

If no student name is available, use:
"I have been commissioned to design a 
{buildingType} situated at {location}."

Then one or two more sentences stating:
- Who the building serves ({users})
- The capacity ({capacity})
- Any special requirement ({specialRequirements})

RULES:
- First person throughout
- Maximum 3 sentences total
- Plain, direct language
- Total length: 40-60 words maximum`,

  briefDevelopment: `Write a Brief Development 
for this architectural project.

PROJECT CONTEXT:
Building type: {buildingType}
Location: {location}
Users: {users}
Capacity: {capacity}
Special requirements: {specialRequirements}
Extra context: {extraContext}

STRUCTURE — follow exactly:

Opening sentence (use this exactly):
"After careful analysis of the design brief 
and proper research studies, the following 
spaces were required:"

Then list the spaces, one per line:
→ [space name]

CRITICAL — spaces must be SPECIFIC to 
{buildingType}. Think carefully:
- What spaces does THIS building actually need?
- What are the primary functional spaces?
- What are the support and service spaces?
- What does {capacity} users of this building 
  actually require?

Do NOT use generic spaces that could apply 
to any building. Every space must make sense 
for a {buildingType} specifically.

List in functional order:
- Entry and reception spaces first
- Primary functional spaces next
- Support spaces after
- Service spaces last

Total spaces: 7-12 depending on building type`,

  siteAnalysis: `Write a Site Analysis for this 
architectural project as a series of annotated 
observations.

PROJECT CONTEXT:
Building type: {buildingType}
Location: {location}
Users: {users}
Special requirements: {specialRequirements}
Extra context: {extraContext}

STRUCTURE — follow this exactly:

Write short labelled observations. Each observation 
has a heading and 2-3 sentences. Use these headings:

Sun Path:
Describe sunrise and sunset direction for {location}.
Include approximate time and temperature implication.
e.g. "The sun rises from the east by approximately 
6:50am. The west facade will experience intense 
afternoon heat."

Prevailing Wind:
Describe the southwest trade wind and northeast 
trade wind for Nigeria. State which is beneficial 
and which brings harmattan.

Noise/Acoustics:
State the major noise source near the site.
e.g. "The major source of noise is from the 
existing road due to vehicular and pedestrian 
activities."

Accessibility:
How is the site reached? Vehicular and pedestrian.

Topography:
Brief note — flat, sloped, or undulating.

RULES:
- Annotations only — no flowing paragraphs
- Start observations with "The site..." or "This..."
- Plain direct language
- Total length: 150-200 words`,

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

Paragraph 1 (30-50 words):
Describe where the {buildingType} is placed 
on the site and why. Reference proximity to 
main routes or entry points. State the 
orientation and what drives it.

Paragraph 2 (30-50 words):
Describe how {users} approach and enter the 
building. Separate vehicular from pedestrian 
movement. State where parking or drop-off 
is located if relevant.

Paragraph 3 (30-50 words):
Describe outdoor spaces and landscaping. 
How does the site planning respond to 
{specialRequirements}? Close with the 
defining spatial gesture of the site layout.

RULES:
- Third person only
- Plain direct sentences
- Total length: 120-150 words`,

  caseStudies: `Write Case Studies for this 
architectural project.

PROJECT CONTEXT:
Building type: {buildingType}
Location: {location}
Users: {users}
Capacity: {capacity}
Special requirements: {specialRequirements}

CRITICAL RULES:
- Choose ONLY buildings that are actually 
  the same type as {buildingType}
- If the building type is a school, find 
  real schools as case studies
- If the building type is a clinic, find 
  real clinics
- If the building type is a market, find 
  real markets
- NEVER use unrelated building types as 
  case studies just because they are famous
- LOCAL Nigerian/African example FIRST
- INTERNATIONAL example SECOND
- Use REAL named buildings that actually exist
- No introduction paragraph
- No closing paragraph

FORMAT for each case study:

[Building Name]
[City, Country]
One sentence describing what it is and 
what makes it relevant to {buildingType}.

Strengths:
1. One specific sentence about this building.
2. One specific sentence about this building.

Weaknesses:
1. One specific sentence about this building.
2. One specific sentence about this building.

TOTAL LENGTH: 180-250 words`,

  spatialAnalysis: `Write a Spatial Analysis for 
this architectural project.

PROJECT CONTEXT:
Building type: {buildingType}
Location: {location}
Users: {users}
Capacity: {capacity}
Special requirements: {specialRequirements}
Extra context: {extraContext}

STRUCTURE — follow this exactly:

Write labelled zone observations using these 
three zones:

Public Zone:
List which spaces fall here. State why — 
these spaces face the road or entry, 
experience the most activity and noise.
e.g. "noisy and public, this area is closer 
to the road and experiences intense activity."

Semi-Public Zone:
List transitional spaces. State their role 
as a buffer between public and private.

Private Zone:
List service and restricted spaces. State 
that this zone "experiences less noise 
coming from the road."

After the three zones, write one short 
paragraph (30-40 words) listing all spaces 
with their approximate area in sqm.

RULES:
- Zone headings must be used as shown
- Each zone: 2-3 sentences + space list
- Plain direct language
- Total length: 150-200 words`,

  scheduleOfAccommodation: `Write a Schedule of 
Accommodation for this architectural project 
as flowing prose.

PROJECT CONTEXT:
Building type: {buildingType}
Location: {location}
Users: {users}
Capacity: {capacity}
Special requirements: {specialRequirements}
Extra context: {extraContext}

STRUCTURE:

Paragraph 1 (30-40 words):
State every space in the {buildingType} with 
its area in sqm. Write as continuous prose — 
not a list. Include every room or space.
e.g. "The building comprises an entrance lobby 
(12sqm), a main dining area (48sqm), a kitchen 
(20sqm), a store (9sqm), male and female 
toilets (6sqm each)."

Paragraph 2 (20-30 words):
State the total net floor area. Add 20% 
circulation allowance. State the gross 
floor area. State the approximate footprint.

RULES:
- No tables, no bullet points, no lists
- All areas must be specific numbers in sqm
- Areas must be realistic for {capacity} users
- Total length: 80-120 words`,

  relationshipTable: `Write a Relationship Table 
narrative for this architectural project.

PROJECT CONTEXT:
Building type: {buildingType}
Users: {users}
Capacity: {capacity}
Extra context: {extraContext}

STRUCTURE — follow this exactly:

Write three short labelled sections:

Direct Relationship:
List pairs of spaces that must be directly 
adjacent. State why for each pair in one 
sentence. e.g. "The kitchen and store share 
a direct relationship for ease of supply."

Indirect Relationship:
List spaces that benefit from proximity but 
do not require direct connection. One sentence 
each.

No Relationship:
List spaces that should be separated. State 
why — typically noise, hygiene, or privacy.

Close with one sentence stating how this 
analysis shaped the floor plan layout.

RULES:
- Use the three headings as shown
- Plain direct language
- One sentence per relationship
- Total length: 120-160 words`

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
    studentName: string
    matricNumber: string
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
    .replace(/{studentName}/g, details.studentName || '')
    .replace(/{matricNumber}/g, details.matricNumber || '')
    .replace(/{extraContext}/g, details.extraContext || '')


  return prompt
}
