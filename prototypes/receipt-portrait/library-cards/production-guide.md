# Library borrowing card review batch

Twenty individually generated card faces, for development review only. The public paper selector lists this collection as in review and disables it. Receipts remain the only public collection. No receipt artwork, material profiles, print kernels, resolution, gamma or camera timing settings are changed by this batch.

## Reference and design decisions

These are book circulation cards kept in a book pocket and filed during a loan, rather than modern plastic borrower IDs. The [Smithsonian Libraries account of book pockets and date guides](https://library.si.edu/finding-aid/book-pockets-and-date-guides-intricacies-paper-based-library-system) describes the card, pocket, tray and date-stamp system. [Demco's book card specifications](https://www.demco.com/demco-reg-book-cards-author-title-date-loaned-borrower-s-name-date-returned) document 3 × 5 inch medium-weight index Bristol stock, blue print and author/title fields with loan, borrower and return columns. [Demco's catalogue](https://resources.demco.com/ED_Supplies_Perfect_Bound_2019.pdf) shows multiple two-, three- and four-column forms. [Parramatta's historical library collection](https://historyandheritage.cityofparramatta.nsw.gov.au/sites/phh/files/field/media/file/2022-09/Parramatta%20Libraries.pdf) supplies a visual reference for accumulated dates, signatures and worn forms.

The review batch uses portrait 76.2 × 127 mm proportions. Cards vary by institutional form, ruling, stock tint, date-stamp colour, typewriter impressions and loan history. The generated names, stamps and accession details are fictional; the book titles identify the variants. None of the source photographs or scans from the references are copied into the prototype.

The faces must feel like functional records: small headings, plausible writing sizes, regular printed tables interrupted by uneven handwritten entries and imperfect rubber date stamps. Blank rows are allowed. The camera print overlays the existing record; there is no cleared photograph box. Avoid uniformly distressed templates, exaggerated yellowing, decorative script, repeated perfect signatures and giant stamps.

## Assets and material

Each `assets/card-NN.jpg` comes from a separate image-generation call, not a contact sheet. The full prompt requests a sharp, diffuse flatbed scan of one edge-to-edge card face, with no background, perspective, portrait, silhouette or baked fold shadow. Each call specifies its own form, book record, colours, handwriting and wear. The generated PNG originals remain outside the repository; High-quality JPEG copies retain their full pixel dimensions. Generation prompts and source-path mapping are kept in the task's review evidence.

`collection.js` decodes the 20 faces only when selected in dev, centres them to 3:5 proportions and creates 800 × 1333 pixel textures. Geometry provides the opaque silhouette, small rounded corners, subtle edge wear, shallow card bow and occasional minor corner bend. Stiff card avoids the receipts' deep folds, torn thermal edges and crumpled-paper motion. Interiors have no colour-key mask or transparent holes. Generated surface texture remains an approximation; review it at close range before promoting it.

The shared camera print retains resolution 96 × 120, gamma 1.20, ordered dithering, ink transfer, multiply/reflectance compositing, surface highlights and delayed 12 fps capture. The portrait, existing record and stock share the same mesh and normals. Per-collection framing fits the shorter card without changing the receipt projection.

## Review and extension

In dev, choose **Library borrowing cards** under **Paper**. The viewer holds the first card; use arrows, thumbnails or **Play proof** to inspect all 20. Turn off **Sample print** to read the raw card, use **Close-up** for fibres and marks, and choose **Surface normals** or **Silhouette** for geometry checks. Live camera options and the print controls apply to either collection.

The desktop viewer stays on the left while grouped controls sit on the right. On narrow screens they stack. Collection thumbnails and optional comparisons sit below. Print-condition and surface-comparison renderers initialise only when opened. Switching collections cancels old thumbnail work and releases their GPU resources and event handlers; it keeps the camera stream, print settings and movement settings.

Before promotion: inspect every face for malformed text, repeated handwriting, implausible wear, baked lighting, edge artefacts and portrait clipping. Check opaque interiors, card proportions, live switching in both directions, camera pause/start, drawer keyboard focus, phone layout and complete playback cycles. Treat the current 20 as a review set, not an approved or historically accurate archive.

Add future paper types through `paper-types.js`, with a label, count, lazy loader and public-release flag. A type must stay unavailable in public options until approved. Do not import dev card assets on public startup.
