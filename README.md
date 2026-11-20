# EMPIREx — Enterprise Card Game Website

A responsive, multi-page GitHub Pages website for the EMPIREx physical enterprise card game.

## Technology

- GitHub Pages and Jekyll
- HTML page content with YAML front matter
- Shared Jekyll layouts, includes and data files
- CSS modules, with a lightweight JavaScript file for navigation and image fallbacks
- Original card artwork stored in `assets/`

The site remains a static website. It does not require a front-end framework, application server, account system or checkout service.

## Page routes

| Page | Source file | Published route |
|---|---|---|
| Home | `index.html` | `/` |
| How to Play | `how-to-play.html` | `/how-to-play/` |
| Cards | `categories.html` | `/categories/` |
| Customer | `customer.html` | `/customer/` |
| Action | `action.html` | `/action/` |
| Event | `event.html` | `/event/` |
| Ability | `ability.html` | `/ability/` |
| Secret Goal | `secret-goal.html` | `/secret-goal/` |
| Business | `business.html` | `/business/` |
| Market Pulse | `market-pulse.html` | `/market-pulse/` |
| For Schools | `schools.html` | `/schools/` |
| Our Story | `about.html` | `/about/` |
| Future Editions | `future-editions.html` | `/future-editions/` |
| FAQs | `faq.html` | `/faq/` |
| Contact | `contact.html` | `/contact/` |
| Privacy | `privacy.html` | `/privacy/` |
| Terms | `terms.html` | `/terms/` |
| Not found | `404.html` | `/404.html` |

The published routes are preserved by each page's `permalink` front matter.

## Repository architecture

```text
_data/
  site.yml             # Brand/site-wide text and asset version
  navigation.yml       # Primary and footer navigation
  cards.yml            # Card family content, routes and artwork
  team.yml             # Founding team information
  homepage.yml         # Homepage hero cards and round-step content

_includes/
  head.html            # Shared metadata, fonts and stylesheet loading
  header.html          # Shared wordmark and primary navigation
  footer.html          # Shared footer and links
  card-grid.html       # Data-driven card-family gallery
  card-showcase.html   # Data-driven image showcase for the Cards page
  team-grid.html       # Data-driven team profiles
  home-hero-gallery.html # Data-driven cards featured in the homepage hero
  home-round-steps.html # Four-step homepage round overview

_layouts/
  default.html         # Shared document shell
  card.html            # Shared card-family detail template

assets/css/
  site-core.css        # Existing core site styles
  site-components.css  # Supporting, accessibility and image/gallery styles
  site-future.css      # Future Editions page styles
  homepage.css         # Homepage hero, product gallery and page sections
  product-experience.css # Phase 4 rules, card detail and Market Pulse layouts
  brand-foundation.css # Phase 1 design tokens and brand refinements

styles.css             # Backwards-compatible CSS import entry point
script.js              # Navigation and image-fallback behaviour
```

## Where to make changes

- **Primary navigation:** edit `_data/navigation.yml`.
- **Footer links:** edit the footer list in `_data/navigation.yml`.
- **Brand name, tagline, disclaimer and asset version:** edit `_data/site.yml`.
- **Card-family names, artwork, descriptions and prompts:** edit `_data/cards.yml`.
- **Product prices:** edit the `pricing` values in `_data/site.yml`; homepage, FAQs and terms read from these shared values.
- **Founding team names, roles and descriptions:** edit `_data/team.yml`.
- **Homepage featured cards and round steps:** edit `_data/homepage.yml`; each hero card key must match an entry in `_data/cards.yml`.
- **Card-family page structure:** edit `_layouts/card.html`.
- **Shared page shell and metadata:** edit `_layouts/default.html` and `_includes/head.html`.
- **Shared header/footer:** edit their matching files in `_includes/`.
- **Page-specific content:** edit the relevant root-level HTML file while preserving its front matter and published permalink.
- **Global styling:** edit the ordered CSS modules in `assets/css/`. The Phase 4 product-page experience is in `product-experience.css`; keep its position aligned between `_includes/head.html` and `styles.css`.
- **Homepage layout and visual styles:** edit `index.html` and `assets/css/homepage.css`; keep the product artwork linked to the original card assets.
- **How to Play and Market Pulse:** edit `how-to-play.html` and `market-pulse.html`; keep the reveal order and scoring sequence aligned with the published game rules.
- **Cards directory:** edit `categories.html` and the reusable gallery includes in `_includes/`.
- **Individual card-family content:** edit `_data/cards.yml`; the six detail pages are rendered by `_layouts/card.html`. Keep each card's timing, mechanics and rule note consistent with the game.

The six card detail pages use `layout: card` and a `card_key` that matches an entry in `_data/cards.yml`. Their content is rendered from that single data source. The homepage hero and four-step round summary are also rendered from central data in `_data/homepage.yml`.

## URL and asset handling

- Internal page and asset links in page content use `{{ site.baseurl }}` so the project works at the configured GitHub Pages subpath.
- Shared templates use Jekyll's `relative_url` and `absolute_url` filters.
- Canonical URLs are generated from the published page URL.
- Navigation, cards and team information are rendered from `_data/` rather than duplicated in page markup.
- CSS module order is defined in `_includes/head.html`. Keep it aligned with the compatibility imports in `styles.css`.
- Bump `asset_version` in `_data/site.yml` when a changed asset needs a cache-busting URL.

## Product and policy information

- Displayed individual price: ₹599 MRP and ₹549 introductory selling price.
- Availability and purchase arrangements must be confirmed directly with the team.
- The website does not provide online checkout or payment collection.
- The survey result (64/87; 73.6%) is an internal project survey, not a representative national estimate.
- No Cambridge International endorsement or affiliation is claimed.
- Future editions are concepts under consideration unless a page explicitly confirms availability.

## Maintenance principles

1. Keep public permalinks stable unless a redirect plan is prepared.
2. Update central data files instead of duplicating shared content.
3. Preserve product rules and pricing accuracy; do not introduce unverified claims.
4. Keep CSS modules in the defined load order.
5. Check navigation, image paths, metadata and mobile layouts after content or architecture changes.

## Automated checks

Pull requests and pushes to `main` run the Architecture Checks workflow. It validates the page/front-matter set, unique permalinks, central navigation and card data, referenced card assets, CSS module order, and shared-layout structure. The workflow then builds the Jekyll site with the project base URL and checks the generated routes, metadata, shared landmarks, and local links/assets.
