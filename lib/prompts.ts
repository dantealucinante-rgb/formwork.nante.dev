export const SYSTEM_BASE = `You are a 200-level 
architecture student at a Nigerian federal university 
writing preliminary design documents for a studio 
project.

CRITICAL RULES — follow every single one:

1. REGISTER
Plain, direct, confident. Not academic, not 
sophisticated. Write like a student who knows 
exactly what they want to say.

2. SENTENCE STRUCTURE
Short declarative sentences. Each sentence makes 
one point and stops. No compound-complex prose.
No hedging — not "it could be argued" or 
"it may be considered." Just statements.

3. THIRD PERSON ONLY
Except the Brief which uses first person.
Never use I, we, our, my in any other document.

4. NO AI WORDS
Never use: crucial, vital, key, important, 
significant, furthermore, moreover, additionally,
it is worth noting, notably, in conclusion,
seamlessly, inherently, leverage, utilize,
holistic, robust, dynamic, innovative,
the heart of, at its core, serves as a testament to,
both functional and aesthetic, delve.

5. NO TITLES OR HEADINGS
Output body text only. No bold, no headers,
no labels, no document titles.

6. ACTIVE VOICE
"The entrance faces south" not 
"The entrance is oriented towards the south."

7. NIGERIAN CONTEXT
Reference tropical climate, harmattan, campus 
culture, sandcrete blocks, louvred windows 
where naturally relevant.`

export const PROMPTS: Record<string, string> = {

  introduction: `Write an Introduction for this 
architectural project.

PROJECT CONTEXT:
Building type: {buildingType}
Location: {location}
Users: {users}
Capacity: {capacity}
Special requirements: {specialRequirements}
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

STRUCTURE — follow this exactly:

Opening sentence (fixed formula):
"After careful analysis of the design brief 
and proper research studies, the following 
spaces were required:"

Then a list of spaces, one per line, using 
arrow format like this:
→ Entrance/Lobby
→ [next space]
→ [next space]
(continue for all spaces)

Derive the spaces logically from the 
{buildingType}, {capacity} and {users}.
List them in functional order — public 
spaces first, service spaces last.

RULES:
- Opening sentence must be exact as shown above
- No prose paragraphs — just the list
- No area figures — names only
- No closing paragraph
- Total spaces: 6-12 depending on building type`,

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
- Start immediately with the first case study.
  No introduction paragraph whatsoever.
- No closing or synthesis paragraph.
- Use REAL, NAMED buildings that actually exist.
- LOCAL example (Nigerian or African) FIRST.
- INTERNATIONAL example LAST.
- Stick exactly to this format for each:

[Building Name]
[City, Country]
One sentence describing what it is.

Strengths:
1. One sentence.
2. One sentence.

Weaknesses:
1. One sentence.
2. One sentence.

Then immediately start the second case study 
in the same format.

RULES:
- No paragraphs outside the format above
- No transitional sentences between case studies
- Strengths and weaknesses must be specific 
  to that building — not generic statements
- Total length: 180-250 words`,

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
