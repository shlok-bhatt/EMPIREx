# EMPIREx — Enterprise Card Game Website

A responsive, multi-page product and enquiry website for the EMPIREx physical enterprise card game.

## Pages
- Home: product overview, learning experience, card showcase, research context, price and enquiries
- How to Play: setup, seven rounds, scoring formula and end-of-game sequence
- Cards: six standalone card-family previews and Market Pulse profiles
- Individual explanations for Customer, Action, Event, Ability, Secret Goal and Business
- Market Pulse, For Schools, Our Story, FAQs, Contact, Privacy and Website Terms

## Card imagery
The six main card-family previews are self-contained SVG files in `assets/cards/`. Each file contains its artwork and text directly; it does not depend on an external AVIF, embedded image, canvas, or JavaScript image assembly. The full showcase is `assets/empirex-card-showcase.svg`, which displays the six individual vector previews. Open an individual card image to inspect it at full vector resolution.

## Clean page URLs
GitHub Pages uses Jekyll front matter and `_config.yml` to publish pages with clean trailing-slash paths, such as `/how-to-play/` and `/categories/`. Internal navigation points to those clean routes.

## Local preview
Serve the repository through Jekyll with the configured base URL. For a plain local static server, replace the Liquid base URL in each page head with the local root.

## Product information
- Displayed individual price: ₹599 MRP and ₹549 introductory selling price.
- Confirm current availability and purchase arrangements directly with the team.
- No online checkout or payment collection is enabled.
- The survey result (64/87; 73.6%) is an internal project survey, not a representative national estimate.
- No Cambridge International endorsement or affiliation is claimed.
