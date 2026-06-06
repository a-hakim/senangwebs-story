---
name: senangwebs-story
description: Interactive visual novel story engine with scenes, dialogue, typewriter effects, character management, and JSON/HTML authoring.
version: 1.0.7
package: senangwebs-story
---

# SenangWebs Story (SWS)

## Quick Reference

- **Purpose**: Visual novel / interactive story experiences with typewriter text and character dialogue
- **Entry**: `dist/sws.min.js`
- **Dependencies**: none
- **Scripts**: `npm run build`, `npm run dev` (`npm test` is currently a placeholder)

## Workflow

Start in `C:\wamp64\www\sw-libraries\senangwebs-story`. Read `README.md`, `package.json`, and touched source files. Match existing patterns, CSS prefix `sws-`.

## HTML Data Attributes

### Story container
| Attribute | Values |
|---|---|
| `data-sws` | Story container flag |
| `data-sws-id` | Story identifier |
| `data-sws-dialog-speed` | Typewriter speed (ms per character) |

### Scene
| Attribute | Description |
|---|---|
| `data-sws-scene-N` | Scene N container (N = 1, 2, 3...) |
| `data-sws-scene-start` | Marks the starting scene |
| `data-sws-background` | Background image URL for scene |
| `data-sws-subjects` | JSON array of `[{id, name, image}]` |

### Dialog
| Attribute | Description |
|---|---|
| `data-sws-dialog-box` | Dialog text display container |
| `data-sws-dialog-N` | Dialog line N |
| `data-sws-subject` | Subject/character ID speaking this line |

## JavaScript API

```js
const story = new SWS(container, {
  scenes: [{ id, background, subjects, dialogs: [{ subjectId, text }] }],
  dialogSpeed: 50
})

story.next()     // advance (completes typing if in progress)
story.back()     // previous dialog
story.destroy()  // cleanup
```

### Callbacks
`sceneStart`, `dialogStart`

## Focus Areas

- JSON scene/dialog structure: scenes contain backgrounds, character "subjects", dialog lines
- Typewriter effect: character-by-character text reveal, customizable speed
- Smart navigation: `next()` while typing → completes current text instantly, second press advances
- Character management: subjects have name, image, position; multiple per scene
- Scene transitions: background changes, subject entrance/exit
- Zero dependency, no framework requirements
- Scoped keyboard controls: the focused story handles arrow keys and Space; editable controls retain native behavior

## Implementation Guidance

- Preserve backward compatibility for all attributes, method names, and callback signatures
- Keep keyboard listeners scoped to the story container so multiple instances remain independent
- Typewriter timing: test with long text, fast/slow speeds, rapid navigation
- Handle missing images gracefully (background, subject portraits)
- Verify scene transitions don't leave stale DOM elements

## Validation

```bash
npm run build
npm test        # expected to fail until a test suite is added
npm run dev     # browser verification
```
