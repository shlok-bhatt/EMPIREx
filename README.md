# EMPIREx — Enterprise Card Game Website

A responsive, multi-page product and enquiry website for the EMPIREx physical enterprise card game.

## Pages
- Home: product overview, learning experience, card showcase, research context, price and enquiries
- How to Play: setup, seven rounds, scoring formula and end-of-game sequence
- Cards: complete original supplied card sheet and six family previews
- Individual explanations for Customer, Action, Event, Ability, Secret Goal and Business
- Market Pulse, For Schools, Our Story, FAQs, Contact, Privacy and Website Terms

## Card imagery
The current card-sheet fallback is stored in assets/card-sheet-parts as six text fragments containing the supplied AVIF artwork. The website script first checks for a full-resolution image asset and falls back to the existing card sheet if it is not available. Six card-family previews are rendered from the source artwork at its native crop resolution; the artwork and printed details are not recreated or changed. To enable the 4K-first path, add assets/empirex-card-showcase-4k.avif (3840 × 2160) to the repository.

## Required product image assets\nThe site expects `assets/empirex-card-showcase-4k.png` and `assets/cards/customer.png`, `action.png`, `event.png`, `ability.png`, `secret-goal.png`, and `business.png`. These files are supplied in the `EMPIREx-4K-image-assets.zip` asset pack.\n\n## Local preview
Serve the repository root over HTTP and open index.html. The product-sheet loader uses relative fetch requests; opening the HTML file directly with a file URL will prevent those requests from working.

## GitHub Pages
In repository Settings → Pages, choose Deploy from a branch, select main and /(root). Use the URL shown by GitHub Pages after deployment completes.

## Product information
- Displayed individual price: ₹599 MRP and ₹549 introductory selling price.
- Confirm current availability and purchase arrangements directly with the team.
- No online checkout or payment collection is enabled.
- The survey result (64/87; 73.6%) is an internal project survey, not a representative national estimate.
- No Cambridge International endorsement or affiliation is claimed.
