# EMPIREx — Enterprise Card Game Website

A responsive, multi-page product and enquiry website for the EMPIREx physical enterprise card game.

## Pages
- Home: product overview, learning experience, card showcase, research context, price and enquiries
- How to Play: setup, seven rounds, scoring formula and end-of-game sequence
- Cards: complete original supplied card sheet and six family previews
- Individual explanations for Customer, Action, Event, Ability, Secret Goal and Business
- Market Pulse, For Schools, Our Story, FAQs, Contact, Privacy and Website Terms

## Card imagery
The full card sheet is stored in the existing assets/card-sheet-parts folder as six text fragments containing one AVIF image. The website script joins the fragments into a single image and creates six card-family previews by cropping the supplied image. Card designs and printed details are not recreated or changed.

## Local preview
Serve the repository root over HTTP and open index.html. The product-sheet loader uses relative fetch requests; opening the HTML file directly with a file URL will prevent those requests from working.

## GitHub Pages
In repository Settings → Pages, choose Deploy from a branch, select main and /(root). Use the URL shown by GitHub Pages after deployment completes.

## Product information
- Displayed individual price: ₹599 MRP and ₹549 introductory selling price.
- Confirm current availability and purchase arrangements directly with the team.
- No online checkout or payment collection is enabled.
- The survey result (64/87; 73.6%) is an internal project survey, not a representative national estimate.
- No Cambridge International endorsement or affiliation is claimed.
