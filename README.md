# Math Atlas

A GitHub-ready static math atlas for children ages 8-12.

The atlas presents math as an interactive map of connected concepts, including:

- addition
- subtraction
- multiplication
- division
- place value
- factors and multiples
- fractions
- decimals
- percentages
- ratios and proportions
- integers
- order of operations
- algebra, variables, expressions, and equations
- geometry, angles, perimeter, area, volume, and coordinates
- measurement and units
- time
- money
- data, graphs, averages, and probability
- estimation and word problems

## Open Locally

Open `index.html` in a browser.

For the most GitHub Pages-like local preview, run:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## GitHub Pages

1. Create a new GitHub repository.
2. Add every file in this folder to the repository root.
3. Commit and push.
4. In GitHub, open **Settings > Pages**.
5. Choose **Deploy from a branch**.
6. Select the main branch and `/root`.
7. Save.

The atlas has no build step and no package install.

## File Layout

- `index.html` contains the page structure.
- `styles.css` contains the visual design and responsive layout.
- `app.js` contains search, filtering, map rendering, routes, detail panels, and practice prompts.
- `data/math-concepts.js` contains all concept data.
- `assets/design-concept.png` is the generated design concept used as a visual reference.

## Expanding the Atlas

Add new concepts in `data/math-concepts.js`.

Each concept should include:

- `id`
- `title`
- `strand`
- `level`
- `ages`
- `summary`
- `bigIdea`
- `skills`
- `vocabulary`
- `example`
- `practice`
- `connections`
- `map`

To place a concept on the map, set `map.x` and `map.y` as percentages from 0 to 100.

## License

This project is released under the MIT License. See `LICENSE`.
