# SenangWebs Story (SWS)

A lightweight, dependency-free JavaScript library for creating interactive, visual novel-style story experiences.

## Features

- **Zero Dependencies:** Pure JavaScript with no external libraries required.
- **Dual Initialization:** Build stories declaratively with simple `data-*` attributes in your HTML, or programmatically using a clean JSON structure.
- **Scene & Dialogue Management:** Manages a sequence of scenes and dialogues, tracking the story's state automatically.
- **Dynamic Visuals:**
  - Change background images with each new scene.
  - Display and highlight character images ("subjects").
  - Automatically toggles an `active` class on the current speaker.
- **Typewriter Effect:** Dialogue text is rendered with a classic character-by-character animation.
- **Simple Navigation:** Built-in "next" and "back" navigation through the entire story flow.
- **Event Callbacks:** Execute custom JavaScript functions at the start of any scene or dialogue for enhanced interactivity.
- **Automatic UI Generation:** When using JSON, the library creates the complete HTML structure for the story.
- **Flexible Integration:** Works with your existing HTML structure and is easy to style with CSS.

## Quick Start

1.  **Include the files:** (Assuming a `dist/` directory)
    ```html
    <link rel="stylesheet" href="dist/sws.css">
    <script src="dist/sws.js"></script>
    ```

2.  **Create a minimal story:**
    ```html
    <div data-sws>
        <!-- Scene 1 -->
        <div data-sws-scene-1>
            <div data-sws-background>
                <img src="path/to/background1.jpg" alt="Background">
            </div>
            <div data-sws-subjects>
                <img src="path/to/character1.png" data-sws-subject-id="char1" data-sws-subject-name="Hero">
            </div>
            <div data-sws-dialog-box>
                <h4 data-sws-active-subject-name></h4>
                <div data-sws-dialog-1 data-sws-subject="char1">
                    <p>Hello, welcome to the story!</p>
                </div>
            </div>
        </div>
    
        <!-- Navigation -->
        <div data-sws-actions>
            <button data-sws-button="next">Next</button>
        </div>
    </div>
    ```

The library automatically initializes on page load and brings your story to life.

## Installation & Build

### Using CDN (Quickest Start)

For the fastest setup, include SWS directly from a CDN:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Story</title>
    <!-- SWS CSS from CDN -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/senangwebs-story@latest/dist/sws.css">
</head>
<body>
    <!-- Your Story HTML here -->
    
    <!-- SWS JavaScript from CDN -->
    <script src="https://cdn.jsdelivr.net/npm/senangwebs-story@latest/dist/sws.js"></script>
</body>
</html>
```

### Development Setup

```bash
# Clone and install dependencies
git clone <repository-url>
cd senangwebs-story
npm install

# Development build with watch mode
npm run dev

# Production build (minified)
npm run build
```

This generates `sws.js` and `sws.css` in the `dist/` directory.

### Direct Usage

Include the built files in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="path/to/dist/sws.css">
</head>
<body>
    <!-- Your story HTML here -->
    <script src="path/to/dist/sws.js"></script>
</body>
</html>```

## Story Configuration (HTML)

Configure your story using `data-*` attributes.

| Attribute | Description |
|-----------|-------------|
| `data-sws` | **Required.** Marks the root container for a story. |
| `data-sws-id` | An optional unique identifier for the story instance. |
| `data-sws-scene-[n]` | Defines a scene, where `[n]` is a 1-based index (e.g., `data-sws-scene-1`). |
| `data-sws-scene-start` | A string of JavaScript to execute when the scene begins. |
| `data-sws-background` | A container within a scene for the background `<img>`. |
| `data-sws-subjects` | A container within a scene for all character `<img>` elements. |
| `data-sws-subject-id` | A unique ID for a character `<img>` tag. |
| `data-sws-subject-name` | The display name for a character, shown above the dialogue. |
| `data-sws-dialog-box` | The container within a scene that holds the dialogue text. |
| `data-sws-active-subject-name`| An element (e.g., `<h4>`) to display the current speaker's name. |
| `data-sws-dialog-[n]` | Defines a single piece of dialogue within a scene. |
| `data-sws-subject` | Links a dialogue to a character via their `data-sws-subject-id`. |
| `data-sws-dialog-start` | A string of JavaScript to execute when the dialogue begins. |
| `data-sws-actions` | The container for navigation controls. |
| `data-sws-button` | Defines a button's function. Values: `back` or `next`. |

## Core Components Explained

### Scenes & Dialogues
A story is a collection of **scenes**. Each scene has its own background, set of characters, and a sequence of **dialogues**. The library progresses linearly from dialogue to dialogue, and from scene to scene.

### Subjects (Characters)
Subjects are the characters in your story. You define them with an `<img>` tag and give them a `data-sws-subject-id`. To make a character speak, you link their `id` to a dialogue using the `data-sws-subject` attribute. The library will automatically apply an `active` class to the current speaker.

### Typewriter Effect
To create an immersive experience, all dialogue text is animated with a character-by-character "typewriter" effect. Clicking "next" or "back" while the animation is running will instantly complete the text before moving on.

## JavaScript API

### Programmatic Initialization

Besides using HTML attributes, you can initialize a story with a JavaScript object. This is ideal for dynamically loading story content.

```javascript
// Get the container element
const storyContainer = document.getElementById('my-story');

// Define the story using a JSON structure
const storyData = {
  "id": "my_json_story",
  "scenes": [
    {
      "sceneStart": "alert('Chapter 1 Begins!')",
      "background": "path/to/background1.jpg",
      "subjects": [
        { "id": "hero", "name": "Hero", "src": "path/to/hero.png" }
      ],
      "dialogs": [
        { "subject": "hero", "text": "This story was created entirely from a JavaScript object." },
        { "text": "This line is narrative text, with no active speaker." }
      ]
    },
    {
      "background": "path/to/background2.jpg",
      "subjects": [
        { "id": "hero", "name": "Hero", "src": "path/to/hero.png" },
        { "id": "villain", "name": "Villain", "src": "path/to/villain.png" }
      ],
      "dialogs": [
        { "subject": "villain", "dialogStart": "console.log('The villain appears!')", "text": "You've finally arrived!" },
        { "subject": "hero", "text": "It's over, Villain!" }
      ]
    }
  ]
};

// Create a new SWS instance
const myStory = new SWS(storyContainer, storyData);
```

### Public Methods

You can control the story flow programmatically.

```javascript
// Assuming 'myStory' is an SWS instance
myStory.next(); // Moves to the next dialogue/scene
myStory.back(); // Moves to the previous dialogue/scene
```

## Styling & Customization

### Key CSS Selectors & Classes

| Selector/Class | Description |
|----------------|-------------|
| `[data-sws]` | The main story container. |
| `[data-sws-scene-n]` | An individual scene container. |
| `[data-sws-background] img`| The background image. |
| `[data-sws-subjects] img` | A character image. |
| `.active` | Applied to the currently speaking character's `<img>`. |
| `[data-sws-dialog-box]` | The black box containing the dialogue text. |
| `[data-sws-active-subject-name]` | The element holding the speaker's name. |
| `[data-sws-actions] button` | The navigation buttons. |

### Custom Styling Example

```css
/* Make the active character pop */
[data-sws-subjects] img {
    transition: transform 0.3s ease, opacity 0.3s ease;
    opacity: 0.6;
}

[data-sws-subjects] img.active {
    opacity: 1;
    transform: scale(1.05) translateY(-10px);
}

/* Customize the dialog box */
[data-sws-dialog-box] {
    background: rgba(50, 20, 80, 0.8); /* A dark purple */
    border-top: 4px solid #9f7aea;
}

/* Style the speaker's name */
[data-sws-active-subject-name] {
    color: #fbd38d; /* A nice gold color */
    font-style: italic;
}
```

## Examples

Check the `examples/` directory for complete implementations:
- **`examples/declarative-html.html`** - A full story built using only HTML `data-*` attributes.
- **`examples/programmatic-json.html`** - A story initialized from a JavaScript object.

## Browser Support

Works in all modern browsers supporting:
- ES6 Classes and Arrow Functions
- Dataset API (`element.dataset`)
- Modern DOM methods (`querySelector`, `addEventListener`)

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please ensure any changes maintain the library's lightweight, dependency-free nature.