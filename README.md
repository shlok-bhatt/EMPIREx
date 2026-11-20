# EMPIREx — Enterprise Card Game Website

A responsive, multi-page product and enquiry website for the EMPIREx physical enterprise card game.

## Pages
- Home: product overview, learning experience, card showcase, research context, price and enquiries
- How to Play: setup, seven rounds, scoring formula and end-of-game sequence
- Cards: complete original supplied card sheet and six family previews
- Individual explanations for Customer, Action, Event, Ability, Secret Goal and Business
- Market Pulse, For Schools, Our Story, FAQs, Contact, Privacy and Website Terms

## Card imagery
The website now uses direct static image files. It does not rely on canvas rendering, AVIF support, or JavaScript fragment assembly for the product artwork. The master card sheet is 3840 × 2160 pixels. Six lossless card-family PNGs are cropped from the same source at their native pixel sizes (441–442 × 765 pixels). The original card text and artwork are preserved.

## Required image assets
The website expects these files:
- `assets/empirex-card-showcase-4k.png`
- `assets/cards/customer.png`
- `assets/cards/action.png`
- `assets/cards/event.png`
- `assets/cards/ability.png`
- `assets/cards/secret-goal.png`
- `assets/cards/business.png`

These files are supplied in the `EMPIREx-4K-image-assets.zip` asset pack. Merge the included `assets/` folder into the repository root without deleting the existing assets.

## Local preview
Serve the repository root over HTTP and open `index.html`. The card images load directly from the static `assets/` paths.

## GitHub Pages
In repository Settings → Pages, choose Deploy from a branch, select `main` and `/(root)`. Use the URL shown by GitHub Pages after deployment completes.

## Product information
- Displayed individual price: ₹599 MRP and ₹549 introductory selling price.
- Confirm current availability and purchase arrangements directly with the team.
- No online checkout or payment collection is enabled.
- The survey result (64/87; 73.6%) is an internal project survey, not a representative national estimate.
- No Cambridge International endorsement or affiliation is claimed.
