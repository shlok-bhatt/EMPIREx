# EMPIREx Brand & Design System
Version: 1.0
Status: Phase 1 foundation
Scope: Website-wide visual standards for the existing EMPIREx physical enterprise card game.

## 1. Brand direction

**Positioning:** Premium editorial design × modern strategy game × educational clarity.

EMPIREx should feel sophisticated, energetic, practical and approachable. It is a physical enterprise card game for secondary-school learners. The website must feel like a credible product brand—not a generic school project, a children's activity template, a financial trading platform or a technology startup landing page.

**Brand promise:** Don't just learn business. Make the calls.

**Brand principles**
- Decision-led: show decisions, customers, market changes and consequences.
- Product-first: authentic cards and gameplay remain the main visual focus.
- Editorial: confident typography, deliberate composition and generous whitespace.
- Warm and premium: espresso, ivory and antique gold.
- Clear and credible: explain educational use accurately; do not claim proven learning outcomes or external endorsement.

## 2. Logo and wordmark

The existing HTML wordmark is retained for Phase 1: `EMPIRE` with a lowercase italic gold `x`, accompanied by the tagline `BUILD SMART. THINK FAST. RULE THE MARKET.`. The existing favicon remains the compact brand mark.

**Usage rules**
- Preserve the exact EMPIREx spelling and capitalisation in written brand references.
- Keep the lowercase italic x visually distinct.
- Use the wordmark primarily on the dark espresso header and footer.
- Keep the tagline directly below the wordmark; do not stretch, rotate, outline, glow or add decorative effects to it.
- Maintain clear space around the mark equal to at least the height of the lowercase x.
- Do not create alternate marks, redraw the symbol or substitute a different typeface without a separate brand approval.
- A dedicated vector master logo is not introduced in this phase; that requires confirmation of the final approved artwork.

## 3. Colour palette

### Core brand colours

| Token | Hex | Purpose |
|---|---|---|
| Espresso | `#211811` | Primary dark brand surface |
| Deep walnut | `#2C2017` | Secondary dark surface |
| Walnut | `#3A2A1D` | Layered dark surface |
| Warm ivory | `#F8F5EF` | Primary light page background |
| Soft sand | `#EFE6D8` | Secondary light surface |
| Soft white | `#FFFDF8` | Elevated light surface |
| Antique gold | `#C59B5D` | Brand accent, borders and gold buttons |
| Light gold | `#E4C991` | Text/accent on dark backgrounds only |
| Dark brass | `#89612C` | Gold-toned text on light backgrounds |

### Text and supporting colours

| Token | Hex | Purpose |
|---|---|---|
| Primary text | `#2B2118` | Main text on light backgrounds |
| Secondary text | `#706457` | Supporting text on light backgrounds |
| Muted light text | `#C8BBA7` | Secondary text on dark backgrounds |
| Light text | `#FFF5E7` | Main text on dark backgrounds |
| Light border | `#E1D6C5` | Borders on light surfaces |
| Dark border | `rgba(226,199,151,.22)` | Borders on dark surfaces |

### Colour rules
- Use Espresso for the main navigation, selected hero sections and dark editorial sections.
- Use Warm Ivory for the majority of reading surfaces.
- Use Soft Sand to separate related content without creating excessive boxes.
- Use Antique Gold as an accent, not as small text on light surfaces.
- Use Light Gold for text on dark surfaces only.
- Use Dark Brass for gold-toned text on light surfaces.
- Use Primary Text for headings and body copy on light backgrounds.
- Never communicate status or meaning by colour alone.
- Do not introduce extra accent colours without a defined semantic purpose.

**Accessibility note:** Light Gold is not approved for normal-sized text on Warm Ivory. Dark Brass is the approved gold-toned text colour on light surfaces. All final foreground/background combinations must be verified with an automated contrast check and visual inspection.

## 4. Typography

### Display typeface
**DM Serif Display**
- Use for H1, H2, H3 and prominent editorial statements.
- Use regular weight as the default.
- Use italic selectively for short emphasis.
- Avoid artificially bolding the typeface.
- Keep line lengths controlled and headings concise.

### Interface and body typeface
**Manrope**
- Use for body copy, navigation, labels, buttons, captions, forms and utility text.
- Use 400 for body text, 500–600 for emphasis, and 700–800 sparingly for strong interface labels.
- Do not use all-caps for long passages.

Both families are loaded with a system fallback. If the external font service is unavailable, the page must remain readable and correctly laid out.

### Type scale

| Role | Desktop target | Mobile behaviour |
|---|---:|---|
| Display / H1 | 48–88 px fluid | Clamp to a readable 40–52 px |
| H2 | 36–60 px fluid | Clamp to 30–40 px |
| H3 | 22–28 px | 21–25 px |
| Body | 16–18 px | 16 px minimum |
| Navigation | 14 px | 14–16 px |
| Button | 14–16 px | 14–16 px |
| Eyebrow | 11–12 px | 11–12 px |
| Caption | 12–13 px | 12–13 px |

### Typography rules
- Keep body copy at a comfortable reading line-height (approximately 1.65–1.8).
- Use a tighter line-height (approximately 1.05–1.15) for large display headings.
- Keep paragraphs at a readable measure; do not run long text across the full desktop viewport.
- Use tabular numerals for prices, statistics and scoring where available.
- Maintain a clear H1 → H2 → H3 hierarchy; do not choose heading levels for visual size alone.

## 5. Layout and spacing

### Grid and content widths
- Main content maximum width: 1,200 px.
- Use one shared centred content container across pages.
- Desktop layouts may use a 12-column grid.
- Align section titles, paragraphs, images and CTA groups to consistent grid lines.
- Use a fluid page gutter: 20 px minimum, scaling up to 48 px on wide screens.
- Avoid arbitrary per-section left/right offsets.

### Spacing scale
Use a consistent 4 px base scale:
- 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 and 112 px.

Recommended section rhythm:
- Desktop section padding: 80–104 px.
- Mobile section padding: 56–64 px.
- Standard card padding: 20–28 px.
- Large feature panel padding: 32–48 px.
- Related components should use the same gap values.

## 6. Shape, borders and elevation

| Token | Value | Typical use |
|---|---:|---|
| Small radius | 4 px | Buttons, compact elements |
| Medium radius | 12 px | Standard cards |
| Large radius | 18 px | Feature panels |
| Pill radius | 999 px | Status labels only |

- Use thin borders and restrained shadows.
- Avoid heavy shadows, excessive glassmorphism and decorative gradients.
- Do not make every element a rounded card.
- Reserve stronger elevation for product imagery and genuinely interactive surfaces.

## 7. Component standards

### Header
- Dark Espresso surface.
- Wordmark on the left, primary navigation on the right.
- Navigation text target: 14 px.
- One visually dominant enquiry action.
- Clear active, hover and keyboard-focus states.
- Mobile navigation must expose its open/closed state accessibly.

### Buttons
- Primary: Antique Gold background with dark text.
- Secondary: transparent or surface background with a clear border.
- Tertiary: text link with a visible interaction cue.
- Minimum target height: 46–48 px.
- Consistent padding, font weight, radius and focus treatment.
- Button labels should describe the action, not use vague wording.

### Cards
- Consistent image ratio and crop behaviour within each card family.
- Consistent title, description and CTA hierarchy.
- Use authentic EMPIREx artwork for product cards.
- Hover effects must not be required to understand the content.
- Keyboard focus must be as visible as pointer hover.

### Section heading
1. Eyebrow label (optional).
2. Clear H2.
3. Brief supporting sentence (optional).
4. CTA (optional).

### Product imagery
- Use authentic product photographs and original card artwork.
- Never imply a stock concept image is an actual EMPIREx product.
- Keep full card artwork legible and avoid crops that remove important text.
- Provide meaningful alt text; where a card contains essential information, repeat that information as HTML text.

## 8. Motion and interaction

- Use motion to clarify state changes, not as decoration.
- Standard transitions should be subtle and brief (approximately 150–220 ms).
- Avoid parallax, autoplay, flashing effects and unnecessary motion.
- Respect `prefers-reduced-motion`.
- Every interactive control must work by keyboard and pointer.

## 9. Responsive principles

- Mobile is a first-class layout, not a compressed desktop page.
- Start with a single-column content flow and progressively enhance for larger screens.
- Prevent horizontal overflow at 320 px.
- Keep body text at least 16 px where practical.
- Make buttons and navigation controls easy to tap.
- Reflow multi-column cards deliberately; do not rely on accidental wrapping.
- Verify at 320, 360, 390, 768, 1024, 1440 and 1920 px widths.

## 10. Accessibility and quality gates

- Target WCAG 2.2 AA.
- Normal text contrast: at least 4.5:1.
- Large text contrast: at least 3:1.
- UI component boundaries and meaningful graphical indicators: at least 3:1 against adjacent colours.
- All controls must have visible focus states and accessible names.
- Use semantic HTML and a logical heading sequence.
- Support keyboard operation and reduced motion.
- Check zoom, text scaling, image failures and narrow viewports.
- Do not use colour as the only way to convey meaning.

## 11. Do not do

- Do not replace the established espresso/ivory/gold identity with unrelated colours.
- Do not use light gold for small text on ivory.
- Do not mix multiple display and body font families.
- Do not use random spacing values or inconsistent card radii.
- Do not use generic stock imagery as proof of what the real product looks like.
- Do not add unverified product contents, performance claims, testimonials, prices or release dates.
- Do not claim Cambridge International endorsement or affiliation.
- Do not add visual effects that make the website slower or less accessible.

## 12. Phase 1 completion boundary

Phase 1 establishes the source-of-truth visual system, typography, palette, spacing, logo rules and baseline global styling. Page-specific redesigns, detailed component rebuilds, new product photography, interactive demos and full accessibility/performance testing belong to later phases.
