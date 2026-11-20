# EMPIREx — Flagship Product Website

A responsive, Jekyll-powered product website and non-transactional investor demonstration for the EMPIREx physical enterprise card game.

## Published experience

The website contains 19 published routes, including the investor-facing Shop prototype. The Shop demonstrates a product page, temporary in-memory demo cart and checkout-review interface. It does not accept orders, collect customer details or process payments.

## Technology

- GitHub Pages and Jekyll
- Semantic HTML, modular CSS and lightweight JavaScript
- Central Jekyll data files for navigation, card families, team and product facts
- Playwright browser checks and desktop/mobile axe-core accessibility checks
- GitHub Actions validation, generated-site checks and browser screenshots

No production checkout, payment provider, customer database, tracking service or account system is connected.

## Page routes

| Page | Published route |
|---|---|
| Home | `/` |
| Shop / product presentation | `/shop/` |
| How to Play | `/how-to-play/` |
| Cards | `/categories/` |
| Customer | `/customer/` |
| Action | `/action/` |
| Event | `/event/` |
| Ability | `/ability/` |
| Secret Goal | `/secret-goal/` |
| Business | `/business/` |
| Market Pulse | `/market-pulse/` |
| For Schools | `/schools/` |
| Our Story | `/about/` |
| Future Editions | `/future-editions/` |
| FAQs | `/faq/` |
| Contact | `/contact/` |
| Privacy | `/privacy/` |
| Terms | `/terms/` |
| Not found | `/404.html` |

## Source of truth

- `_data/site.yml`: brand, asset version and displayed prices.
- `_data/product.yml`: confirmed public product facts and specification boundary.
- `_data/navigation.yml`: primary and footer navigation.
- `_data/cards.yml`: the six main card-family descriptions, routes and artwork.
- `_data/team.yml`: founding team roles.
- `_data/homepage.yml`: homepage featured cards and round steps.

Do not invent physical card counts, packaging, materials, dimensions, player count, playing time, delivery terms, availability, endorsements or educational outcomes. Verify those details against the final production version before publication.

## Design architecture

- Existing brand foundation: espresso, ivory, antique gold, DM Serif Display and Manrope.
- CSS modules are loaded in order in `_includes/head.html` and mirrored in `styles.css`.
- `flagship.css` is the final responsive refinement layer.
- `_layouts/default.html` provides the shared shell and Shop pathway.
- `_layouts/card.html` renders the six data-driven card pages.
- `shop.html` provides a prototype-only product and purchase journey.
- `store-demo.js` uses temporary in-memory state only. It has no network, storage or payment integration.

## Investor prototype safety

The Shop is visibly labelled as an investor demonstration. Its cart state is temporary and resets on reload. Checkout fields are non-interactive visual placeholders. There are no real transactions, customer data submissions, order creation, payment calls or external payment links. Do not remove those safeguards unless a separately reviewed production-commerce project is authorised and implemented.

## Quality checks

GitHub Actions runs:
1. JavaScript syntax validation.
2. Source architecture and content checks.
3. Jekyll production build.
4. Generated-route, metadata and local-target checks.
5. Playwright tests across all 19 routes.
6. Responsive overflow checks at 10 viewport widths.
7. axe-core WCAG 2.2 A/AA automated accessibility checks at desktop and mobile widths.
8. Accessibility checks of the Shop cart dialog and keyboard skip link.
9. Mobile navigation and Shop demo-cart interaction checks.
10. Screenshot and accessibility-audit artifact generation.

Browser screenshots and the accessibility report are uploaded as a workflow artifact for review. Automated tools do not replace manual screen-reader, keyboard, real-device or production-user testing.

## Before a real product launch

Confirm the final product specification, physical pack contents, approved price, availability, delivery and returns arrangements, and genuine product photographs. Update the privacy and terms pages if hosting, external services or data collection changes. The current Shop must remain a clearly labelled non-transactional prototype until a real commerce implementation is separately approved.
