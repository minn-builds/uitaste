# Design critique rubric

Used by the `design-critic` subagent (this repo) and shipped to end users' agents (the product).
Score each category 1–5. Every score below 4 must come with a concrete fix that names the element and the token or change.

| #   | Category        | 5 looks like                                                                                                      |
| --- | --------------- | ----------------------------------------------------------------------------------------------------------------- |
| 1   | Hierarchy       | One clear focal point per screen; eye path is obvious; 3 or fewer type sizes visible above the fold               |
| 2   | Typography      | Display and body faces have contrast; tight display leading, comfortable body (1.5–1.7); measure 55–75ch          |
| 3   | Spacing rhythm  | All gaps come from the spacing scale; related items grouped tighter than unrelated ones; generous section padding |
| 4   | Color restraint | One accent used sparingly; neutrals carry the layout; contrast passes AA                                          |
| 5   | Composition     | Layout follows the preset's signature moves (asymmetry, grid, density). Doesn't read as a template                |
| 6   | Detail          | Consistent radius/border/shadow language; hover/focus states exist; icons are a consistent set and size           |
| 7   | Responsiveness  | 390px is designed, not squeezed; no horizontal scroll; tap targets ≥44px                                          |
| 8   | Distinctiveness | A stranger could not guess "AI made this"                                                                         |

## AI-default tells (each one found = −1 on Distinctiveness)

- Centered hero with gradient headline text, plus a "Get Started" / "Learn More" button pair
- Indigo/purple/violet gradients, especially on white
- Inter/Roboto/system font as the display face
- Three identical feature cards with an icon in a colored circle
- `rounded-xl shadow-lg` on every surface; glassmorphism without reason
- Emoji used as icons
- A testimonial grid with stock avatars; logo cloud of fake companies
- Every section the same height and centered

## Output format (critic must follow it)

```
SCORES: H4 T3 S4 C5 Co2 D4 R3 Di2  (avg 3.4)
TOP FIXES (max 5, highest impact first):
1. [Composition] Hero is centered-template. Switch to the preset's 7/5 split; headline left, product shot bleeding right edge.
2. ...
TELLS FOUND: gradient headline (hero), 3-card grid (features)
```
