# EMPIREx — Enterprise Card Game Website

A responsive, multi-page product and enquiry website for the EMPIREx physical enterprise card game.

## Pages
- Home: product overview, learning experience, card showcase, research context, price and enquiries
- How to Play: setup, seven rounds, scoring formula and end-of-game sequence
- Cards: six standalone card-family previews and Market Pulse profiles
- Individual explanations for Customer, Action, Event, Ability, Secret Goal and Business
- Market Pulse, For Schools, Our Story, FAQs, Contact, Privacy and Website Terms

## Card imagery
The six main card-family previews are standalone SVG files in `assets/cards/`. Each contains its own vector artwork and text. The Home and Cards pages load each card directly as an individual image; no AVIF, nested SVG image loading, canvas, or JavaScript image assembly is required. Each individual card page also opens its own standalone SVG for full-size viewing.

## Clean page URLs
GitHub Pages uses Jekyll front matter and `_config.yml` to publish clean trailing-slash paths, such as `/how-to-play/` and `/categories/`. Internal navigation points to those clean routes.

## Product information
- Displayed individual price: ₹599 MRP and ₹549 introductory selling price.
- Confirm current availability and purchase arrangements directly with the team.
- No online checkout or payment collection is enabled.
- The survey result (64/87; 73.6%) is an internal project survey, not a representative national estimate.
- No Cambridge International endorsement or affiliation is claimed.
