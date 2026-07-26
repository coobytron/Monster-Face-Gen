# LLM Handoff: GitHub-Deployed Vector Drawing System with Agent Workflows

## Project Goal

Build a GitHub-hosted vector drawing system that allows:

- A browser-based drawing or composition interface
- LLM agents to create, edit, review, and batch vector artwork
- Preset-based and guide-based visual generation
- GitHub to remain the source of truth for assets, manifests, prompts, and design rules
- Agents to work through branches and pull requests
- Static deployment for the frontend
- Secure backend execution for LLM calls and repository writes

This system should support projects such as:

- Monster character generators
- Comic generators
- Thermal-printable artwork
- Contact sheets
- Character design systems
- Preset-driven vector illustration
- Batch asset generation
- Structured scene editing

The preferred direction is **pre-authored vector assets and structured composition**, not unconstrained procedural anatomy generation.

---

## Primary Recommendation

Use the following stack:

- **Canvas/editor:** tldraw embedded in a React or Vite application
- **Source control:** GitHub
- **Frontend deployment:** GitHub Pages, Vercel, or Cloudflare Pages
- **Agent API:** Vercel Functions, Cloudflare Workers, or a small Node/Python server
- **Batch automation:** GitHub Actions
- **Development environments:** GitHub Codespaces
- **Vector format:** SVG
- **Scene format:** JSON
- **Asset metadata:** JSON manifests
- **Review workflow:** branches and pull requests
- **Optional sketch rendering:** Rough.js
- **Optional PNG export:** browser Canvas or server-side rendering
- **Optional embedded project data:** JSON stored in PNG metadata

The high-level architecture is:

```text
GitHub Repository
├── React + tldraw canvas
├── Authored SVG asset library
├── JSON scene documents
├── Character rules
├── Style guides
├── Agent instructions
├── Validation scripts
└── GitHub Actions workflows
        │
        ▼
Frontend Deployment
GitHub Pages / Vercel / Cloudflare Pages
        │
        ▼
Agent Backend
Vercel Functions / Cloudflare Workers / Local Server
        │
        ▼
LLM Provider
OpenAI / Anthropic / Local Model
```

---

## Important Deployment Distinction

### GitHub Pages Can Host

GitHub Pages can host the static application, including:

- The tldraw canvas
- Custom vector editors
- SVG asset libraries
- JSON manifests
- Preset guides
- Scene composition tools
- Client-side SVG export
- Client-side PNG export
- Thermal-print preparation
- UI controls for creating agent jobs
- Local browser-based editing

### GitHub Pages Cannot Safely Handle

GitHub Pages should not directly handle:

- Secret LLM API keys
- Secure GitHub write tokens
- Private repository operations
- Long-running agent jobs
- Shared persistent queues
- Server-side authentication
- Secure branch or pull-request creation

Any API key placed in frontend JavaScript should be considered public.

For secure agent execution, use a backend or serverless function.

---

## Recommended Deployment Options

### Option A: GitHub Pages + Serverless API

Use:

- GitHub Pages for the frontend
- Cloudflare Workers or Vercel Functions for `/api/agent`
- GitHub Actions for batch generation

This preserves GitHub Pages while keeping secrets off the client.

### Option B: Vercel

Use Vercel for both:

- React frontend
- Serverless LLM endpoints

This is likely the easiest deployment for a prototype.

### Option C: Cloudflare Pages + Workers

Use:

- Cloudflare Pages for the frontend
- Cloudflare Workers for agent calls and lightweight orchestration

This is a strong option for fast, inexpensive deployment.

### Option D: Local-First

Use:

- GitHub repository
- Local Node or Python agent server
- Local LLM through LM Studio or another OpenAI-compatible endpoint
- GitHub Actions only for validation and deployment

This is useful when privacy or offline operation matters.

---

## Why tldraw Is a Strong Fit

tldraw is preferable to having an LLM generate raw SVG directly because it provides a structured canvas model.

Agents can reason about objects such as:

- Shapes
- Bounds
- Positions
- Rotations
- Groups
- Selections
- Parent-child relationships
- Custom shapes
- Metadata
- Connections

An agent can perform operations such as:

- Create
- Duplicate
- Move
- Rotate
- Resize
- Align
- Distribute
- Group
- Delete
- Reorder
- Inspect
- Annotate

This is much more reliable than asking an LLM to repeatedly rewrite a large SVG document.

The tldraw agent starter approach is useful for:

- Live canvas agents
- Visual workflow agents
- Diagram-aware reasoning
- Structured object editing
- Tool-call-based canvas operations

---

## Recommended Design Philosophy

Do not let the LLM invent the entire SVG freely.

Instead, use a strict intermediate scene format.

Example:

```json
{
  "character": "mr-bento",
  "head": {
    "preset": "head_04",
    "scale": 1.0,
    "rotation": 0
  },
  "eyes": {
    "preset": "teardrop_03",
    "spacing": 0.42,
    "scale": 1.15
  },
  "mouth": {
    "preset": "teeth_18",
    "curve": 0.38,
    "scale": 1.1
  },
  "horns": {
    "preset": "ram_04",
    "enabled": true
  },
  "style": {
    "inkPreset": "heavy-vector",
    "distress": 0.2,
    "thermalSafe": true
  }
}
```

Recommended flow:

```text
Prompt
  ↓
LLM produces validated JSON
  ↓
Asset selector resolves preset IDs
  ↓
Vector compositor builds scene
  ↓
Rule validator checks design constraints
  ↓
SVG export
  ↓
PNG export
  ↓
Optional thermal-print optimization
```

This preserves the authored visual language.

---

## Two Types of Agents

### 1. Live Canvas Agents

Live agents operate inside the deployed application.

Example user request:

> Make twelve Mr. Bento mouth studies using only approved teeth assets. Keep the head silhouette and eyes locked.

The agent should:

1. Read the current selected character.
2. Inspect locked and editable features.
3. Duplicate the character into a grid.
4. Swap only approved mouth assets.
5. Align and distribute the variations.
6. Check stroke width and spacing rules.
7. Generate a contact sheet.
8. Save the scene as JSON.
9. Export SVG and PNG.
10. Optionally open a GitHub pull request.

Live agents are ideal for:

- Interactive direction
- Composition changes
- Asset selection
- Layout
- Contact sheets
- Manual review
- Small iteration loops

### 2. Batch Repository Agents

Batch agents run through GitHub Actions, Codespaces, a local CLI, or a coding agent.

They can:

- Read the repository
- Inspect design guides
- Generate batches
- Add SVG files
- Update manifests
- Create contact sheets
- Run validators
- Update documentation
- Commit to a branch
- Open a pull request

Batch agents are ideal for:

- Large asset families
- Overnight or manual workflow runs
- Validation
- Documentation maintenance
- Manifest regeneration
- Export preparation
- Library curation

---

## Recommended Repository Structure

```text
vector-studio/
├── README.md
├── package.json
├── app/
│   ├── src/
│   ├── public/
│   └── components/
├── assets/
│   ├── heads/
│   ├── eyes/
│   ├── mouths/
│   ├── teeth/
│   ├── horns/
│   ├── accessories/
│   ├── textures/
│   └── frames/
├── characters/
│   └── mr-bento/
│       ├── character.json
│       ├── locked-features.json
│       ├── approved-combinations.json
│       ├── proportions.json
│       └── examples/
├── scenes/
│   ├── drafts/
│   ├── approved/
│   └── archived/
├── guides/
│   ├── STYLE-GUIDE.md
│   ├── CHARACTER-GUIDE.md
│   ├── COMPOSITION-RULES.md
│   ├── THERMAL-PRINT-RULES.md
│   ├── SVG-RULES.md
│   └── AGENT-RULES.md
├── agents/
│   ├── creative-director.md
│   ├── asset-selector.md
│   ├── composition-agent.md
│   ├── silhouette-reviewer.md
│   ├── cleanup-agent.md
│   ├── print-validator.md
│   └── manifest-agent.md
├── schemas/
│   ├── scene.schema.json
│   ├── asset.schema.json
│   ├── character.schema.json
│   └── job.schema.json
├── jobs/
│   ├── pending/
│   ├── running/
│   ├── completed/
│   └── failed/
├── outputs/
│   ├── svg/
│   ├── png/
│   ├── thermal/
│   └── contact-sheets/
├── scripts/
│   ├── generate-batch.ts
│   ├── validate-assets.ts
│   ├── render-contact-sheet.ts
│   ├── optimize-svg.ts
│   └── update-manifest.ts
└── .github/
    └── workflows/
        ├── deploy.yml
        ├── generate-vector-batch.yml
        ├── validate-assets.yml
        └── build-contact-sheets.yml
```

---

## Character Constraint Example

Each character should include explicit editable and locked properties.

```json
{
  "character": "mr-bento",
  "locked": [
    "eye-language",
    "tooth-language",
    "head-silhouette",
    "primary-stroke-weight"
  ],
  "editable": [
    "mouth-preset",
    "horn-preset",
    "expression",
    "accessories",
    "pose",
    "texture-level"
  ],
  "allowedOperations": [
    "select-approved-asset",
    "translate",
    "rotate",
    "uniform-scale",
    "mask",
    "clip",
    "boolean-union",
    "boolean-subtract"
  ],
  "forbiddenOperations": [
    "procedural-anatomy",
    "unapproved-eye-generation",
    "unapproved-tooth-generation",
    "nonuniform-face-distortion",
    "raster-only-source-art"
  ]
}
```

This is important because visual drift is one of the largest risks in multi-agent creative work.

---

## Agent Role Definitions

### Creative Director Agent

Responsibilities:

- Interpret the brief
- Select the intended visual direction
- Define acceptance criteria
- Choose which features are locked
- Assign work to specialist agents
- Reject work that violates the character identity

Should not directly generate final assets unless necessary.

### Asset Selector Agent

Responsibilities:

- Choose only approved assets
- Check compatibility tags
- Avoid invalid combinations
- Produce scene JSON
- Record which asset IDs were used

### Composition Agent

Responsibilities:

- Position and scale approved assets
- Maintain visual balance
- Respect silhouette rules
- Preserve negative space
- Build grids and contact sheets

### Silhouette Reviewer

Responsibilities:

- Compare the outer contour against approved examples
- Detect floating horns or disconnected parts
- Detect accidental tangencies
- Flag awkward mouth cutoffs
- Check whether combined parts feel attached

### Cleanup Agent

Responsibilities:

- Normalize stroke widths
- Remove stray points
- Merge overlapping shapes when allowed
- Simplify paths
- Fix masks and clipping
- Ensure clean SVG output

### Print Validator

Responsibilities:

- Enforce minimum line thickness
- Remove unsupported gray values when needed
- Test thresholding
- Check thermal-printer-safe contrast
- Confirm output dimensions
- Produce one-bit PNG when requested

### Manifest Agent

Responsibilities:

- Register new assets
- Update IDs
- Add tags
- Record file dimensions and viewBox
- Track compatibility
- Update version and changelog

---

## GitHub Actions Batch Workflow

Example workflow:

```yaml
name: Generate Vector Batch

on:
  workflow_dispatch:
    inputs:
      collection:
        description: Asset collection
        required: true
      character:
        description: Character ID
        required: true
      count:
        description: Number of variations
        required: true
        default: "12"

jobs:
  generate:
    runs-on: ubuntu-latest

    permissions:
      contents: write
      pull-requests: write

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm ci

      - name: Generate vector batch
        run: |
          npm run agent:generate -- \
            --collection "${{ inputs.collection }}" \
            --character "${{ inputs.character }}" \
            --count "${{ inputs.count }}"

      - name: Validate assets
        run: npm run validate:assets

      - name: Update manifest
        run: npm run manifest:update

      - name: Build contact sheets
        run: npm run contact-sheets

      - name: Create pull request
        uses: peter-evans/create-pull-request@v7
        with:
          branch: agent/vector-batch-${{ github.run_id }}
          title: "Add generated vector batch"
          commit-message: "Generate vector asset batch"
          body: |
            Generated by the vector batch workflow.

            Review:
            - SVG quality
            - character consistency
            - thermal-print compatibility
            - manifest entries
```

Repository settings may need to allow GitHub Actions to create pull requests.

---

## Example Job File

Jobs should be structured and reviewable.

```json
{
  "jobId": "mr-bento-mouth-study-001",
  "type": "contact-sheet",
  "character": "mr-bento",
  "count": 12,
  "prompt": "Create twelve mouth studies using approved teeth assets.",
  "lockedFeatures": [
    "head-silhouette",
    "eyes",
    "primary-stroke-weight"
  ],
  "variationTargets": [
    "mouth-preset",
    "mouth-scale",
    "mouth-curve",
    "expression"
  ],
  "output": {
    "svg": true,
    "png": true,
    "contactSheet": true,
    "thermalVersion": true
  },
  "reviewRequired": true
}
```

---

## Preset and Asset Manifest Example

```json
{
  "id": "mouth_teeth_018",
  "type": "mouth",
  "characterCompatibility": [
    "mr-bento"
  ],
  "file": "assets/mouths/mouth_teeth_018.svg",
  "tags": [
    "large-teeth",
    "wide",
    "aggressive",
    "thermal-safe"
  ],
  "viewBox": "0 0 640 320",
  "strokeClass": "heavy",
  "minimumScale": 0.7,
  "maximumScale": 1.4,
  "allowedTransforms": [
    "translate",
    "uniform-scale",
    "rotate"
  ],
  "forbiddenTransforms": [
    "horizontal-stretch",
    "vertical-stretch"
  ]
}
```

---

## Scene Graph Requirements

The scene graph should preserve:

- Stable object IDs
- Asset references
- Parent-child relationships
- Transform values
- Z-order
- Masks
- Groups
- Locked states
- Agent notes
- Revision history
- Export settings

Example:

```json
{
  "sceneId": "mr-bento-sheet-004",
  "version": 3,
  "objects": [
    {
      "id": "head-01",
      "assetId": "head_004",
      "type": "svgAsset",
      "x": 120,
      "y": 80,
      "scale": 1,
      "rotation": 0,
      "locked": true,
      "zIndex": 1
    },
    {
      "id": "mouth-01",
      "assetId": "mouth_teeth_018",
      "type": "svgAsset",
      "x": 164,
      "y": 238,
      "scale": 1.12,
      "rotation": 0,
      "locked": false,
      "zIndex": 4
    }
  ]
}
```

---

## Validation Rules

A generated scene should fail validation when:

- It references an unknown asset ID
- It changes a locked feature
- It uses a forbidden transform
- It stretches character features non-uniformly
- It includes disconnected horns when attachment is required
- It clips the mouth incorrectly
- It creates unsupported SVG filters
- It contains text that has not been converted to paths when required
- Stroke widths fall below thermal-print limits
- The SVG lacks a viewBox
- The artwork exceeds output bounds
- The manifest is not updated
- The generated output does not include source scene JSON

---

## Thermal Printing Considerations

For thermal-printer output, include:

- One-bit or high-contrast export
- Minimum line thickness
- No subtle opacity effects
- No low-contrast gray textures
- Controlled halftones
- Safe page width
- Vertical roll layout support
- Automatic threshold preview
- Dither options
- Padding and cut markers
- Optional panel sequencing for comic rolls

Recommended export pipeline:

```text
SVG Master
  ↓
Flatten masks and transforms
  ↓
Render high-resolution grayscale
  ↓
Apply threshold or dither
  ↓
Resize to printer width
  ↓
Export one-bit PNG
  ↓
Send to print application
```

Do not discard the editable SVG or scene JSON after thermal conversion.

---

## Pull Request Review Model

Agents should not write directly to the approved asset library without review.

Recommended process:

```text
Agent job
  ↓
New branch
  ↓
Generated assets
  ↓
Validation
  ↓
Contact sheet
  ↓
Pull request
  ↓
Human art-direction review
  ↓
Approve, request changes, or reject
  ↓
Merge into approved library
```

A pull request should contain:

- Generated SVGs
- PNG previews
- Contact sheet
- Updated manifest
- Scene JSON
- Validation report
- Short agent summary
- List of changed design rules, if any

---

## Suggested Status Labels

Useful GitHub labels:

- `agent-task`
- `vector-generation`
- `needs-art-direction`
- `needs-cleanup`
- `thermal-review`
- `manifest-update`
- `character-drift`
- `approved-asset`
- `rejected-asset`
- `batch-ready`

---

## Suggested Agent Commands

Example commands exposed in the app or CLI:

```text
/generate character=mr-bento count=12 variation=mouth
/review silhouette
/normalize strokes
/build contact-sheet
/validate thermal
/export svg
/export png
/open-pr
/update manifest
/lock eyes
/unlock accessories
```

The agent should translate these into structured tool calls, not unbounded freeform SVG generation.

---

## Suggested MVP

The first implementation should be deliberately narrow.

### MVP Scope

- One character: Mr. Bento
- Five head assets
- Five eye assets
- Twelve mouth assets
- Six horn assets
- One tldraw-based editor
- One JSON scene schema
- One asset manifest
- One character constraints file
- One live composition agent
- One GitHub Action for batch contact sheets
- SVG and PNG export
- Thermal-print preview
- Pull-request-based asset approval

### MVP User Flow

1. Open the deployed editor.
2. Select Mr. Bento.
3. Enter a prompt.
4. Agent creates variations from approved assets.
5. User manually adjusts the canvas.
6. Run validation.
7. Export a contact sheet.
8. Save scene JSON.
9. Open a pull request.
10. Merge approved assets into the library.

---

## Technical Risks

### Visual Drift

Mitigation:

- Locked features
- Approved preset IDs
- Character-specific schemas
- Reference contact sheets
- Pull-request review
- Automated silhouette checks

### Invalid SVG Output

Mitigation:

- Avoid raw SVG generation where possible
- Use stable asset files
- Validate all viewBox and path data
- Run SVG optimization
- Render preview PNGs during CI

### API Key Exposure

Mitigation:

- Never call private APIs directly from GitHub Pages
- Use serverless endpoints
- Store secrets in deployment platform or GitHub Actions secrets

### Agent Collision

Mitigation:

- One branch per job
- Unique job IDs
- No direct writes to main
- PR-based merging
- File-level locks or ownership rules when needed

### Long-Running Jobs

Mitigation:

- Use GitHub Actions or a queue
- Keep live canvas operations short
- Save intermediate job state
- Split batches into chunks

### Licensing

The tldraw SDK license should be reviewed before commercial production deployment. Prototype and development usage may differ from commercial requirements.

---

## Alternative Libraries

### Rough.js

Use when a hand-drawn rendering style is needed.

Best role:

- Render approved geometry with a rough or sketch-like appearance
- Add stylistic variation without changing structure

Do not use it as the source-of-truth scene model.

### Excalidraw

Useful for:

- Diagrams
- Whiteboarding
- Flow charts
- Simple visual planning

Less appropriate for detailed illustration and character asset composition.

### Native SVG DOM

Useful when:

- Full control is required
- The application has a custom scene graph
- No external editor SDK is desired

More engineering work is required for selection, transforms, grouping, undo, and agent tooling.

### Fabric.js or Konva

Useful for:

- Canvas-based editors
- Object transforms
- Image composition
- Custom UI

They can work well, but tldraw is currently more directly aligned with agent-oriented structured canvas workflows.

---

## Final Recommendation

Build a **Vector Studio** where:

- GitHub stores all approved assets and rules
- tldraw provides the live editable canvas
- LLMs produce structured scene operations
- authored SVG assets preserve the visual identity
- GitHub Actions handle large batches
- every generated collection becomes a pull request
- humans approve assets before they enter the official library
- PNG and thermal exports are derivatives of the SVG and scene JSON source

The core principle should be:

> Agents may compose, transform, validate, and organize approved artwork, but they should not freely reinvent the character language.

This architecture is particularly appropriate for pre-authored monster parts, comic layouts, contact sheets, thermal printing, character systems, and repeatable multi-agent art-direction workflows.
