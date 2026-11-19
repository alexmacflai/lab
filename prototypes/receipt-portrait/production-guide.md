# Receipt production guide

Use this guide when editing the 100-receipt collection or preparing future receipts. The original six-receipt material proof was accepted as the basis for this expansion on 18 November 2026. The prototype's controls and current behaviour are documented in [README.md](README.md).

## Material direction

Aim for a collection of individually handled receipts photographed under one light. Paper should feel thin and coated, with small curls, compression folds and uneven thermal printing. Use pale off-white stock with restrained ageing. Strong yellowing should belong to a specific receipt. Fold placement must affect existing receipt lettering, camera ink, lighting and shadow together.

The collection contains 100 receipts across 24 design families. Six reference bodies remain, with refreshed header identities; the other 94 entries are distributed across the full set of families. Each entry has a stable ID, transaction, layout settings, stock, cutting profile, printer seed and fold configuration. All share one generated unprinted paper material. These are simulated receipts, not real scans. No dataset images or merchant logos are bundled. The sample portrait uses the photograph supplied in this chat; the camera supplies the live portrait.

## References and provenance

- [SROIE competition paper](https://arxiv.org/pdf/2103.10213): reference for dense business layouts, printer variation and scanned-paper defects.
- [CORD project](https://github.com/clovaai/cord): reference collection for item hierarchies and varied receipt structures. Dataset access does not itself establish permission to redistribute every image; record source and licence before bundling a scan.
- [Displacement and material documentation](https://threejs.org/docs/pages/MeshStandardMaterial.html#displacementMap): distinction between geometry displacement and lighting-only bump maps. The proof implements its own WebGL renderer and has no Three.js dependency.

`sample-portrait.png` is the user-supplied photograph, copied without editing the source. `sample.js` crops away its letterbox bars and fits the face to a 4:5 portrait without stretching. It preserves the photograph's orientation and sends the crop through `capturePrint()` at 144 × 180; the renderer then applies the same ink material as camera prints.

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

Exactly 33 tickets carry one mark: seven coffee stains, three tiny ink spots, three pen strokes, six graphite notes, six pen notes and eight doodles. Assignment remains fixed per receipt and independent of condition and family. Most tickets remain unmarked.

`physical-marks-v1.png` is an imagegen-generated material atlas: eight dried-coffee variations followed by fine black, blue and red pen marks and neutral graphite. These are generated textures, not physical scans. The generation brief specifies flat, translucent dried-liquid deposits, irregular narrow tidelines, occasional dragged or double rims and pooled pigment; handwriting has unequal letter forms, pen lifts, skipped ink and retraced strokes. No handwriting fonts or regular polygon paths are used for notes or doodles. The earlier procedural coffee rings and font-based notes have been replaced.

`doodle-marks-v1.png` adds eight generated scanned-style sketches: a flower, star, circle-and-arrow, smiley, heart, observational sparrow sketch, abstract looping scribble and wonky construction cube. The generation brief specifies real-looking fine ballpoint and graphite strokes, exploratory lines, pressure changes, skipped ink and retracing on a plain white carrier. The sparrow uses a recognisable outline, feather hatching and exploratory pencil lines. Each of the eight doodle-bearing tickets receives a different cell. Keep the reference flower on The Flower Stand, star on Station Supplies and circle-and-arrow on Restaurant; assign the other five by stable ID.

`mark-assets.js` crops each atlas cell to its visible pigment, then assigns variants deterministically by receipt ID. Seven coffee-bearing receipts receive seven different stain textures. Their full texture width is 350–425 authoring units against 400 units of paper width: 87.5–106.25% of the receipt, equivalent to 70–85 mm against nominal 80 mm stock. The dimensions set the visual scale; they were not measured from a physical cup. Placement can carry part of a cup rim beyond the paper edge; do not shrink the ring to fit it inside a slip. Handwritten notes are 175–200 units wide (35–40 mm); doodles are 120–140 units wide (24–28 mm). The “for home” note on Paw & Claw is 37.8 mm wide, and the flower on The Flower Stand is 25.4 mm wide. Preserve each asset's proportions. Clamp notes and doodles inside the paper after rotation so enlargement does not cut off their strokes; coffee can still cross the edges.

`aged-coffee.js` makes a restrained material adjustment: mix 12% towards neutral grey and increase pigment density by 10%. It adjusts pigment rather than the white carrier, so pure white remains white and does not create a dark rectangular patch. Coffee geometry and crop bounds remain unchanged. Keep this dried-stain treatment restrained; avoid pushing the stains towards grey or black.

All marks multiply into the opaque paper colour texture before displacement and lighting. White around an asset leaves the paper unchanged. Never threshold the receipt's alpha to remove a mark's background. Review stains on the receipt with the camera print off, then on, at normal size and close-up. Reject regular outlines, thick raised crust, font-like notes and repeated geometric doodles. Dried coffee should read as flat liquid residue, with [pigment concentrated at the drying perimeter](https://www.nature.com/articles/39827).

Treat these counts as an initial art-direction choice, not a physical statistic. Review at 12 fps: marks should be something to notice occasionally, not a repeating overlay. If they compete with the face, reduce opacity or frequency before adding more kinds.

## Print, lighting and shadow

`print.js` captures a central crop at 144 × 180 pixels, mirrored for the front camera and unmirrored for the back camera. Playback targets 12 fps by default, with a 500 ms timestamp queue. Camera frames stay in memory on the device. Higher paper resolution must not increase camera-print resolution.

Optional **Keep me in frame** and **Remove background** use the approved MediaPipe Tasks Vision 1.2.3 dependency from jsDelivr and Google's version-1 Selfie Segmenter model. They download only after an option is enabled; no camera images leave the device. A 256 × 192 frozen input is segmented before mirroring, cropping or dithering, so mask and portrait remain aligned. Confidence becomes a soft alpha edge. Framing follows the detected person's bounds with smoothing and limited zoom; it holds the last crop when no person is detected. This is person framing, not arbitrary-object tracking. CPU inference runs once per captured print on the main thread; slower devices may deliver less than 12 fps. The print remains 144 × 180 and joins the same 500 ms delay queue. Native Apple Center Stage is controlled by the system, not by the page. See [Apple's camera-effect controls](https://support.apple.com/en-by/105117) and [MediaPipe's person segmentation documentation](https://developers.google.com/edge/mediapipe/solutions/vision/image_segmenter?tab=Web).

Camera pigment is neutral black; alpha controls coverage. The shader retains the original fine fibre gaps and sub-dot edge feathering. The transfer material varies per impression, while an inspected or stopped impression stays fixed. [Epson's TM-L100 guide](https://files.support.epson.com/pdf/pos/bulk/tm-l100_trg_en_revb.pdf) describes density variation and white streaks during intermittent thermal printing. The slight bleed is an art-directed addition for this print illusion. A single black pass has no colour-channel misregistration; existing placement offsets supply registration error. Do not add RGB fringes.

The fragment shader samples the camera ink in the receipt's own coordinates, with a small registration offset and rotation. It multiplies ink reflectance into the paper and existing lettering in linear light, then lights the combined surface. Transparent camera pixels and white ink leave the paper unchanged. Nearest-neighbour camera sampling preserves the coarse print. The portrait spans 94% of paper width.

The renderer draws ink only as part of the paper mesh. Never draw the portrait as a second screen-aligned rectangle or clip it to a rectangular approximation of the paper.

Shadow uses sixteen projections of the displaced mesh across a broad light. Softness and displacement grow with local paper height. Surface shading uses the same fold normals. This approximates an area-light cast shadow; it is not ray tracing and does not model fold-to-fold self-shadowing, paper thickness, translucency or fibre-scale geometry. They remain possible later refinements.

Default paper placement varies by at most 0.0095625 paper widths horizontally, 0.0116875 vertically and about 0.55 degrees. Print registration varies by at most 0.01375 widths horizontally, 0.0175 vertically and about 0.79 degrees. Receipt translation and rotation are 85% of the previous 1.25× setting, or 1.0625× the original ranges. Independent print registration is also 1.25× its original range. Inspect still frames before increasing these values: movement should suggest careful placement, not shaking.

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

## Public and development views

`index.html` is the public experience: the receipt and camera controls. Phones use a settings drawer; at widths of at least 700 px and heights of at least 480 px, smaller controls show both toggles inline. On both mobile and desktop, Start camera has a dark fill. The button transitions to an outline as soon as camera start is requested and returns to a fill on stop, cancellation or failure. `dev/index.html` keeps the gallery, surface/background selectors, sample switch, proof playback and debug panel. Its base URL points to the prototype root so assets stay local to this piece. The lab index lists only the public view.

`player.js` owns the shared receipt state, rendering, camera processing and timestamp buffer. Both views use the same startup, capture and playback loop. Public auto-framing starts on; background removal starts off. Download person detection only when an active camera needs it. Hold the current print and paper until the first buffered frame is ready; stop playback when the camera stops. Rebuffer after changing subject options.

The public canvas uses the available viewport above a fixed-height camera bar, with safe-area padding. Its fit projection accounts for the actual canvas aspect ratio; it caps the paper at approximately 800 CSS pixels tall, including the small placement range. The modal drawer sits above the page and does not change the stage dimensions. `camera-controls.js` slides the fully opaque panel from below the screen over 320 ms and slides it fully below the screen over 240 ms. The panel never fades; only the backdrop dims. The dialog stays open until the exit animation finishes, including when closed with Escape or a backdrop tap. Interrupted animations continue from the current visual position. Reduced-motion mode skips panel travel and keeps it opaque. Toggle thumbs, hover, press, focus and disabled states also transition. These transitions apply to controls and panels; receipt frames remain discrete. Switching layout moves the same toggle elements, preserving their values and camera settings. Check drawer-open versus drawer-closed canvas bounds at phone, landscape and desktop sizes. Keep keyboard focus inside the open drawer and return it to the settings button on close. The public page shows no captions or debug values. Failures can show a concise message with a recovery step.


## Print conditions

Both views use the eight conditions in `print-material/`. The regular view uses **Random each frame** throughout the collection; the dev view defaults to the same mode and can also select individual conditions or **Current print**, which runs the earlier fixed ink block. The comparison panel remains in `dev/print-proof/`. Camera capture, delay, frame rate and placement ranges are unchanged.

| Condition | Nominal bleed radius | Weak-transfer strength | Fold response | Ridge smear |
|---|---:|---:|---:|---:|
| Well printed | 0.025 mm | 0 | 0 | 0 |
| Ordinary | 0.10 mm | 0.08 | 0.10 | 0 |
| Weak transfer | 0.06 mm | 0.88 | 0.05 | 0 |
| Moderate bleed | 0.28 mm | 0.08 | 0.10 | 0 |
| Rare heavy bleed | Up to 0.75 mm locally | 0.15 | 0.12 | 0 |
| Weak transfer + bleed | 0.32 mm | 0.88 | 0.12 | 0 |
| Fold-related transfer | 0.08 mm | 0.08 | 0.95 | 0 |
| Ridge smear | 0.12 mm | 0.10 | 0.25 | 0.85 |

Radii use an 80 mm paper width and a 75.2 × 94 mm print. Fibre absorption and contact modulate them locally; they are simulation parameters, not measurements from a real printer. The heavy-bleed condition restricts its larger radii to seeded patches. Its larger radii occur only within local patches; this condition has a 3% chance on each new frame.

`transfer.js` replaces the generated grunge bitmap with an analytical dry-transfer model. Seeded, feed-oriented footprints control where contact can fail. Fragmented ink-film fields supply internal surviving deposits; separate directional edge bands tear their contours. Both are evaluated at render resolution, with detail above the pixel footprint filtered out. The original fine-pore calculation is unchanged. Coverage features are now half their previous size (0.75× the initial footprint scale); the strong conditions remove up to 94% of ink in their worn regions. Local ink coverage influences the film threshold, and mesh-derived contact expands worn regions in recesses and reduces them on raised paper. Bleed and ridge-smear calculations retain their existing radii and feed offsets.

All conditions multiply neutral-black ink into the paper before lighting. Each new impression gets a fresh random seed and bounded condition-strength variation. A paused impression keeps those values through resizing and inspection changes. This is an art-directed transfer approximation, not a measured printer or fluid simulation; judge its shapes, scale and continuity visually.

`response.js` derives contact from the exact 65 × 145 vertex mesh normals used by the renderer. Their divergence identifies ridges and recesses. All folds, bumps, curl and microstructure come from the rendered receipt, with no flattened alternative or omitted folds. Recesses reduce transfer and increase spreading; raised creases reduce spreading and can drag ink. The response remains an approximation of ink transfer, rather than a simulation of printer mechanics. Maps stay in paper coordinates and are independent of light, camera pose and animation time. The displayed normals and print response describe the same receipt surface.

In random mode, independent weighted draws use 50% well printed, 35% ordinary, 3% weak transfer, 3% moderate bleed, 3% local heavy bleed, 2% weak transfer with bleed, 3% fold-related transfer and 1% ridge smear. These are probabilities, not quotas, a fixed sequence or an assignment to receipt IDs. Repeats are allowed. Named conditions still randomise their detail on each new frame. Fold locations remain attached to the current receipt; only their ink response strength varies.

Compare all eight conditions on the same selected paper and photograph before judging them on different receipts. Use full receipts for scale, detail crops for dots and fibres, and the coverage, bleed-radius and contact views to check causes. In the contact view, red is contact, green is ridge and blue is recess. The bleed view shifts from blue to red as the local radius approaches 0.8 mm. The main preview can use a live camera; comparison cards remain on the photograph.

When changing the print material, check that clean blacks stay dense, weak patches have varied shapes, heavy bleed remains local and faces remain readable. White or transparent source pixels must add no ink by themselves, paper interiors must remain opaque, displaced prints must remain inside the paper mesh and repeated renders must preserve the same material pattern. Use **Current print** as the earlier-treatment baseline and check that both views use the same material renderer. Visual realism still needs review; diagnostic maps alone do not establish it.


### Material and playback checks

The transfer mask has no source bitmap resolution cap. Inspect **Transfer mask** separately from the deliberately 144 × 180 camera halftone. Comparison cards follow their displayed width and device pixel ratio, capped at 3×, with a minimum 672 × 832 render size. Check both a full receipt and detail crops; fine film breakup should resolve with scale instead of magnifying source texels. Retain the original microscopic pores when changing the larger transfer field.

Opening receipt selection is uniform across the full catalogue in both views. After that, the index advances by one and wraps modulo 100; it is not a shuffled or truncated subset. Frame timing follows the frame-start schedule, with at most one receipt advance per tick. Preparing the next paper and contact map during idle time removes their construction work from the usual draw path. No extra full interval is added after rendering. Hardware and segmentation costs may reduce the effective rate below the configured maximum, but no receipt indices are intentionally skipped. Verify a complete 100-entry cycle, including 90–100 and the wrap to 1.

**Back camera** appears in compact layouts alongside the existing camera options. It requests an exact environment-facing camera; front capture uses the user-facing preference. Switching stops existing tracks before requesting a replacement and resets the delayed-print buffer, following the [getUserMedia camera-switch guidance](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia). Unavailable environment cameras fall back to the front; permission denial does not trigger another request. Generation checks release late streams after cancellation or a rapid switch. Confirm natural rear-camera orientation and mirrored front-camera orientation. Real device and lens behaviour still needs testing on physical phones.


### Performance budget

Lightly worn conditions use a two-band transfer approximation; full footprints are reserved for strong grunge. The strong model samples four neighbouring cells, and edge/film bands below the pixel footprint are not evaluated. Unresolvable bleed and inactive smear work are skipped. The original microscopic pores remain separate and unchanged. Next-receipt preparation shares the bounded renderer caches; it does not retain 100 decoded paper textures. Coverage scale changes affect feature size, not canvas resolution.
