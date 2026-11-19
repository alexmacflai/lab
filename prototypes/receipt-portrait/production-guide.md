# Receipt production guide

Use this guide when editing the 100-receipt collection or preparing future receipts. The original six-receipt material proof was accepted as the basis for this expansion on 18 November 2026. The prototype's controls and current behaviour are documented in [README.md](README.md).

## Material direction

Aim for a collection of individually handled receipts photographed under one light. Paper should feel thin and coated, with small curls, compression folds and uneven thermal printing. Use pale off-white stock with restrained ageing. Strong yellowing should belong to a specific receipt. Fold placement must affect existing receipt lettering, camera ink, lighting and shadow together.

The collection contains 100 receipts across 24 design families. Six reference bodies remain, with refreshed header identities; the other 94 entries are distributed across the full set of families. Each entry has a stable ID, transaction, layout settings, stock, cutting profile, printer seed and fold configuration. All share one generated unprinted paper material. These are simulated receipts, not real scans. No dataset images or merchant logos are bundled. The sample portrait is an illustration for checking print behaviour; the camera supplies the live portrait.

## References and provenance

- [SROIE competition paper](https://arxiv.org/pdf/2103.10213): reference for dense business layouts, printer variation and scanned-paper defects.
- [CORD project](https://github.com/clovaai/cord): reference collection for item hierarchies and varied receipt structures. Dataset access does not itself establish permission to redistribute every image; record source and licence before bundling a scan.
- [Displacement and material documentation](https://threejs.org/docs/pages/MeshStandardMaterial.html#displacementMap): distinction between geometry displacement and lighting-only bump maps. The proof implements its own WebGL renderer and has no Three.js dependency.

`thermal-paper.png` was generated with the built-in imagegen tool as a material sample. Prompt: a sharp, edge-to-edge macro scanner image of blank thermal receipt stock; neutral pale ivory, microscopic cellulose fibres, subtle mottling and occasional flecks; uniform diffuse illumination; no text, edges, folds, wrinkles, shadows, stains or background. Lighting and folds are added by the renderer. The full generation prompt was supplied in the creation chat.

## Design families

| Receipt | Distinguishing features | Typical stock |
|---|---|---|
| Supermarket | Dense item list, quantities, savings, VAT and barcode | Pale off-white stock |
| Card terminal | No product list; transaction fields and large approval message | Cool stock |
| Café order | Large serif wordmark, order number, modifiers and loose spacing | Warmer stock |
| Restaurant | Table and guests, mixed-case dishes, service charge | Fine off-white stock |
| Hardware shop | Heavy heading, product codes, unit quantities and VAT breakdown | Slightly grey stock |
| Shop and coupon | Compact purchase list, rewards and large offer block | Cream stock |
| Bookshop | Mixed book and stationery purchases, optional product codes and a quieter footer | Pale stock |
| Bakery | Prominent order number, quantities and large item spacing | Slightly warm stock |
| Petrol station | Pump number, litres, price per litre and a VAT summary | Cool stock |
| Deli | Counter items, unit prices and quantities on separate lines | Warm stock |
| Pharmacy | Cross mark, retail product list and record-keeping footer | Neutral stock |
| Florist | Script wordmarks, flower purchases and a care message | Pale warm stock |
| Cinema counter | Film-strip symbol, admission and concession purchases, payment-receipt notice | Pale thermal stock |
| Takeaway | Bowl and chopstick seal, large order number, collection time and packing checks | Pale thermal stock |
| Pizzeria | Pizza-slice mark, collection order, pizza sizes and order footer | Pale thermal stock |
| Fishmonger | Fish symbol, counter sale, portion quantities and chilled-storage footer | Pale thermal stock |
| Record shop | Vinyl mark, catalogue references, formats and condition notes | Pale thermal stock |
| Garden centre | Sprout mark, plants, pots and nursery footer | Pale thermal stock |
| Pet shop | Paw seal, product list and loyalty marks | Pale thermal stock |
| Repair counter | Gear mark, job number, parts/labour and collection stamp | Pale thermal stock |
| Laundry | Hanger wordmark, bag/tag number and collection instruction | Pale thermal stock |
| Barber | Scissor seal, barber name, services/products and tip line | Pale thermal stock |
| Stationer | Nib symbol, product references and quantities | Pale thermal stock |
| Museum shop | Column mark, editions/objects and shop-only payment notice | Pale thermal stock |

The added families vary item structures, order and pump numbers, product codes, headings and footers. `catalogue.js` and `extra-families.js` list merchants explicitly and defines the stable transaction and design variation for each entry. The six reference bodies remain, while their headers now use the shared brand system.

Changing a shop name or total does not create a new design family. Vary hierarchy, density, alignment, line spacing, print width, footer structure and printer behaviour. Use coherent prices and arithmetic. Existing text can sit behind the camera print; do not reserve an empty portrait window. Barcodes in this collection are decorative and do not encode the displayed transaction.

## Asset and geometry contract

- `catalogue.js` and `extra-families.js` define the 94 new receipt records; `receipts.js` retains the six reference records and the shared geometry. Reference layouts live in `layouts.js`; collection layouts live in `collection-layouts.js` and `extra-layouts.js`, with typography helpers in `collection-type.js`. Brand headers live in `brands.js` and `brand-marks.js`.
- Keep height-to-width ratios between 2.18 and 2.33 for this collection. Author layouts for their stock; never stretch type or splice a receipt to force its shape.
- `paper.js` builds opaque colour textures on demand at 800 pixels wide. Their height follows the stock ratio. Fine grain, streaks and missing printer dots are fixed per receipt, not randomised every frame.
- `makeMesh()` produces an indexed 64 × 144 cell surface: 9,425 vertices and a shared triangle-index buffer. Compact geometry is retained after first use. The main renderer retains at most eight paper textures; the gallery renderer retains two, and gallery snapshots are cached separately. Evicted full-resolution textures are deleted from the GPU and rebuilt when revisited. The boundary defines the silhouette. The paper interiors are opaque. Antialiasing applies at the boundary. There is no colour threshold or flood-fill mask.
- Each fold is an object with `u`, `v`, `angle`, `amplitude`, `width` and `length`. Its line can be horizontal, vertical or diagonal, with a local length envelope. `heightAt()` supplies vertex height; `surfaceAt()` adds compression along the fold normal. Mesh normals come from neighbouring positions on the same surface. Geometry uses paper width as its unit: on 80 mm stock, an amplitude of 0.025 means approximately 2 mm of lift.
- Keep large folds in geometry. Do not derive height directly from receipt brightness: dark ink would become a dent, and baked lighting would be counted twice.
- Retain a source record for future imported scans: creator, URL or original file, permission, capture conditions and pixel dimensions. Prepare colour, silhouette and measured or authored folds separately. Fit geometry to visible folds; do not add unrelated creases over a scan's lighting.

## Headers and physical condition

Receipt-printer references support graphics as well as device fonts: [Star Micronics logo and graphics examples](https://starmicronics.com/help-center/knowledge-base/how-to-store-and-edit-logos-and-other-graphics-using-starprnt/). All marks here are original canvas drawings, not copied merchant logos. Use pictograms, seals, reverse-print panels, framed or stacked wordmarks, script and condensed faces. Keep some terminal slips deliberately plain. Fit lettering within the print area without forcing all brands to the same font or size. Reverse-printed lettering knocks out ink to reveal the paper; it does not add a white rectangle.

Physical condition is fixed per ticket. `conditions.js` ranks stable IDs with an avalanche hash, independently of family and playback order, then assigns this distribution:

| Condition | Tickets | Surface |
|---|---:|---|
| Pristine | 24 | No folds, almost flat, slight edge lift |
| Single fold | 22 | One near-central horizontal fold, with small angle variation |
| Three folds | 20 | Three independently placed and oriented creases |
| Five folds | 12 | Five independently placed and oriented creases |
| Pocket-crumpled | 14 | 12–20 short local creases and seven small height bumps |
| Lightly handled | 8 | Two broad, subdued folds and modest curl |

Keep normals fixed for each ticket so its damage is the same when it appears again. Do not sort the playback sequence by fold location or interpolate between surfaces. Check that successive tickets change condition without a slow travelling-fold effect.

## Occasional marks

Exactly 18 tickets carry one restrained mark: five coffee rings, three tiny ink spots, three marker strokes, four pencil notes, two pen notes and one small doodle. Assignment uses a separate stable hash, so marks are independent of paper condition and family. Most sit near the top or footer, at low opacity. They are drawn into the paper material with multiply and deform with it. They never float above the receipt, flash randomly, cut holes in its alpha or change when its texture is rebuilt. Most tickets remain unmarked.

Treat these counts as an initial art-direction choice, not a physical statistic. Review at 12 fps: marks should be something to notice occasionally, not a repeating overlay. If they compete with the face, reduce opacity or frequency before adding more kinds.

## Print, lighting and shadow

`print.js` captures a mirrored central crop at 144 × 180 pixels. Default capture is 12 fps with a 500 ms timestamp queue. Camera frames stay in memory on the device. Higher paper resolution must not increase camera-print resolution.

The fragment shader samples the camera ink in the receipt's own coordinates, with a small registration offset and rotation. It multiplies ink reflectance into the paper and existing lettering in linear light, then lights the combined surface. Transparent camera pixels and white ink leave the paper unchanged. Nearest-neighbour camera sampling preserves the coarse print. The portrait spans 94% of paper width.

The renderer draws ink only as part of the paper mesh. Never draw the portrait as a second screen-aligned rectangle or clip it to a rectangular approximation of the paper.

Shadow uses sixteen projections of the displaced mesh across a broad light. Softness and displacement grow with local paper height. Surface shading uses the same fold normals. This approximates an area-light cast shadow; it is not ray tracing and does not model fold-to-fold self-shadowing, paper thickness, translucency or fibre-scale geometry. They remain possible later refinements.

Default paper placement varies by at most 0.009 paper widths horizontally, 0.011 vertically and about 0.52 degrees. Print registration varies by at most 0.011 widths horizontally, 0.014 vertically and about 0.63 degrees. This gives the print slightly more independent movement than the paper. Inspect still frames before increasing these values: movement should suggest careful placement, not shaking.

## Acceptance when changing the collection

1. Compare all five gallery pages and inspect individual receipts at normal size and close-up. Their layouts should be recognisable without reading the shop names.
2. Disable the sample print. Check that paper detail and text remain sharp, with no repeated patches or baked shadows crossing geometric folds.
3. Check the silhouette on dark and checkerboard backgrounds. Reject holes, colour fringes, floating edge fragments or a rectangular matte.
4. Enable the sample print, then the camera. Inspect portrait edges near both sides. Ink must remain on paper, including during registration changes.
5. Check a white test image: it must not lighten the receipt. Black ink must retain the paper's lighting and folds.
6. Compare paper-and-ink with surface normals. Lettering and portrait deformation should agree with the same creases. Raised edges should separate from their shadow; contact regions should remain tighter.
7. Play the proof. Review placement, rotation, first visible print and delay by eye. Keep camera buffering separate from paper changes.
8. Check a narrow viewport, camera cancellation, stop/restart and console errors. Run the index and repository checks from `knowledge/setup.md`.

Use automated checks for catalogue size, unique IDs and physical profiles, transaction arithmetic, opaque interiors, print containment, multiply behaviour and bounded texture caching. Review contact sheets for all 100 entries, including header fit, flat versus crumpled stock, and the sparse mark distribution; automated checks do not establish visual realism. Human review still decides whether the collection feels sufficiently physical. Future additions should preserve differences beyond names and totals. Record permission and provenance before introducing real scans.
