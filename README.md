# Houseplant Field Guide

A static, dependency-free website for GitHub Pages. It includes a plant catalogue with a left sidebar, text search, filters, and one HTML page per plant.

## Included

- `index.html` — home page and catalogue
- `plants/` — 24 individual plant profile HTML pages
- `plants-data.js` — plant information used by all pages
- `app.js` — catalogue, filtering, and profile rendering
- `styles.css` — responsive layout and styling

## Publish with GitHub Pages

1. Create a GitHub repository (or use an existing one).
2. Upload the **contents of this folder** so that `index.html` is at the repository root. Keep the `plants/` directory and the three shared files alongside it.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, choose your branch (usually `main`) and folder `/ (root)`, then save.
5. GitHub Pages will publish the site at the URL shown in Settings → Pages.

You can also preview it locally by opening `index.html` in a browser. Because all assets are local, no package installation or build step is required.

## Editing or adding plants

Plant information is stored in `plants-data.js` as the `window.PLANTS` array. Edit an existing plant object there. To add a plant, add a new object with a unique `slug`, then copy any profile HTML file in `plants/`, update the `data-plant` value to the new slug, and update its title and description. The sidebar and filters update automatically from the data.

## Assumptions and safety notes

- “Inch plant” is treated as *Tradescantia zebrina*.
- “Ivy tree” is treated as *× Fatshedera lizei* (tree ivy / bush ivy). The name can be used for other plants, so confirm the scientific name on the label.
- Toxicity is split into cats/dogs and humans. “Not established” means species-specific information was insufficient in the references used; it does **not** mean safe.
- “Listed as non-toxic” reflects the specific cited reference and does not mean that eating plant material is recommended. The ASPCA notes that even non-toxic plant material can cause gastrointestinal upset.
- Plant care recommendations are general starting points. Watering depends on pot size, medium, season, temperature, humidity, and lighting; always check the mix before watering.
- This site is educational and is not a substitute for veterinary or medical advice. For suspected ingestion, contact a veterinarian or poison center promptly.

## References

Profiles link to sources such as NC State Extension Plant Toolbox, the American Society for the Prevention of Cruelty to Animals (ASPCA), New York Botanical Garden, and Poison Control resources. Use the linked sources to confirm details for a particular cultivar or plant label.
