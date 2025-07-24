### **Generate the SenangWebs Story (sws/SWS) JavaScript Library**

**Objective:**

Create a lightweight, dependency-free JavaScript library named `SenangWebs Story` (shortened to `SWS`). This library will enable web developers to create interactive, visual novel-style story experiences, similar to Japanese light novels. The library must be initializable either through declarative HTML using `data-*` attributes or programmatically via a JSON object.

---

### **Core Features & APLI:**

1.  **Library Namespace:** The library should be available under a global namespace, `SWS`.

2.  **Initialization:**
    *   The library should automatically initialize on any element with the `data-sws` attribute upon DOM content load.
    *   It should also be possible to initialize a story manually by passing a DOM element and an optional configuration object to a constructor: `new SWS(element, options)`.

3.  **Scene & Dialogue Management:**
    *   The library must manage a sequence of scenes.
    *   Each scene contains a sequence of dialogues.
    *   The library must maintain an internal state of the current scene index and dialogue index.

4.  **Navigation:**
    *   Provide functionality to navigate forward ("next") and backward ("back") through the dialogue and scenes.
    *   This will be controlled by buttons designated with `data-sws-button="next"` and `data-sws-button="back"`.

5.  **Visuals & Effects:**
    *   **Backgrounds:** Change the background image when transitioning to a new scene.
    *   **Subjects (Characters):** Display character images for each scene. The library must toggle an `active` class on the `<img>` element of the character who is currently speaking.
    *   **Typewriter Effect:** Dialogue text within the dialog box must appear with a character-by-character "typewriter" animation.
    *   **Speaker's Name:** The name of the current speaker must be dynamically displayed in an element marked with `data-sws-active-subject-name`. If a dialog has no associated subject, this area should be cleared.

6.  **Callbacks:**
    *   Allow for JavaScript functions to be executed at the start of a scene (`data-sws-scene-start`) and at the start of a specific dialogue (`data-sws-dialog-start`).

---

### **Technical Specification:**

#### **1. HTML-Based Initialization (`data-*` attributes)**

The library must parse the following `data-*` attributes to construct the story.

*   `data-sws`: The root attribute for a story container.
*   `data-sws-id`: An optional unique identifier for the story instance.
*   `data-sws-scene-[n]`: Defines a scene, where `[n]` is a 1-based index (e.g., `data-sws-scene-1`). It should be a direct child of the `[data-sws]` container. At any time, only one scene should be visible.
*   `data-sws-scene-start`: An attribute on a scene element containing a string of JavaScript code to be executed via `new Function()` or `eval()` when the scene begins.
*   `data-sws-background`: A container within a scene for the background `<img>`.
*   `data-sws-subjects`: A container within a scene for all character `<img>` elements.
*   `data-sws-subject-id`: A unique ID for a character subject on an `<img>` tag.
*   `data-sws-subject-name`: The display name for a character subject on an `<img>` tag.
*   `data-sws-dialog-box`: The container within a scene that holds the dialogues and the speaker's name.
*   `data-sws-active-subject-name`: An element (e.g., `<h4>`) that will be populated with the `data-sws-subject-name` of the current speaker.
*   `data-sws-dialog-[n]`: Defines a single piece of dialogue within a `data-sws-dialog-box`, where `[n]` is a 1-based index.
*   `data-sws-subject`: An attribute on a dialog element that links it to a character via their `data-sws-subject-id`. If this attribute is absent, the dialog is considered narrative text, and no character is marked as `active`.
*   `data-sws-dialog-start`: An attribute on a dialog element containing JavaScript code to execute when that dialog becomes active.
*   `data-sws-actions`: The container for navigation controls.
*   `data-sws-button="back" | "next"`: An attribute on a `<button>` to define its function.

#### **2. JSON-Based Initialization**

The library must also be initializable using a JSON object that mirrors the HTML structure. This would be passed to the constructor.

**JSON Structure Example:**

```json
{
  "id": "story_beginning",
  "scenes": [
    {
      "sceneStart": "alert('Start!')",
      "background": "background1.jpg",
      "subjects": [
        { "id": "person_1", "name": "Person 1", "src": "subject1.png" }
      ],
      "dialogs": [
        { "subject": "person_1", "text": "Hello, welcome to the story! This is where our adventure begins." },
        { "subject": "person_1", "text": "May I ask you a few questions to get started?" }
      ]
    },
    {
      "background": "background2.jpg",
      "subjects": [
        { "id": "person_1", "name": "Person 1", "src": "subject1.png" },
        { "id": "person_2", "name": "Person 2", "src": "subject2.png" }
      ],
      "dialogs": [
        { "subject": "person_1", "dialogStart": "alert('Question!')", "text": "Great! Let's dive into the first question." },
        { "subject": "person_1", "text": "What is your favorite color?" },
        { "subject": "person_2", "text": "My favorite color is blue!" },
        { "text": "Without a subject, this is narrative text by default." }
      ]
    }
  ]
}
```

When initialized with JSON, the library should dynamically generate the required HTML structure within the target element.

---

### **Behavioral Logic:**

1.  **Initialization State:** On load, hide all scenes except the first one (`data-sws-scene-1`). Display the first dialog (`data-sws-dialog-1`) of the first scene, applying the typewriter effect. Set the active subject and name based on this first dialog.

2.  **`next` Button Click:**
    *   If there is another dialog in the current scene, advance to it.
    *   If it is the last dialog of the current scene, advance to the first dialog of the next scene.
        *   Hide the current scene and show the next scene.
        *   Update the background and visible subjects.
    *   If it is the last dialog of the last scene, the `next` button may be disabled or do nothing.
    *   For each new dialog:
        *   Remove the `active` class from the previous speaking subject.
        *   Apply the `active` class to the new speaking subject (based on `data-sws-subject`).
        *   Update the content of `[data-sws-active-subject-name]`.
        *   Render the dialog text with the typewriter effect.
        *   Execute any `data-sws-dialog-start` or `data-sws-scene-start` callbacks if applicable.

3.  **`back` Button Click:**
    *   Implement the reverse logic of the `next` button. Navigate to the previous dialog. If at the beginning of a scene, navigate to the last dialog of the previous scene.

4.  **Typewriter Effect Implementation:**
    *   Create a function that takes a text string and a target element.
    *   This function should clear the element's content and then append the text one character at a time using `setTimeout` or `requestAnimationFrame` for a smooth effect.
    *   If the user clicks `next` or `back` while the effect is running, the full text of the current dialog should be displayed instantly before transitioning to the next/previous one.

---

### **Example Usage (HTML)**

Use the following HTML structure as the primary reference for the data-attribute-driven implementation.

```html
<section data-sws data-sws-id="story_beginning">
    <!-- Scene 1 -->
    <div data-sws-scene-1="true" data-sws-scene-start="alert('Start!')">
        <div data-sws-background>
            <img src="background1.jpg" alt="Scene Background 1" />
        </div>
        <div data-sws-subjects>
            <img src="subject1.png" data-sws-subject-id="person_1" data-sws-subject-name="Person 1" alt="Subject 1" />
        </div>
        <div data-sws-dialog-box>
            <h4 data-sws-active-subject-name></h4>
            <div data-sws-dialog-1 data-sws-subject="person_1">
                <p>Hello, welcome to the story! This is where our adventure begins.</p>
            </div>
            <div data-sws-dialog-2 data-sws-subject="person_1">
                <p>May I ask you a few questions to get started?</p>
            </div>
        </div>
    </div>

    <!-- Scene 2 -->
    <div data-sws-scene-2="true" style="display: none;">
        <div data-sws-background>
            <img src="background2.jpg" alt="Scene Background 2" />
        </div>
        <div data-sws-subjects>
            <img src="subject1.png" data-sws-subject-id="person_1" data-sws-subject-name="Person 1" alt="Subject 1" />
            <img src="subject2.png" data-sws-subject-id="person_2" data-sws-subject-name="Person 2" alt="Subject 2" />
        </div>
        <div data-sws-dialog-box>
            <h4 data-sws-active-subject-name></h4>
            <div data-sws-dialog-1 data-sws-subject="person_1" data-sws-dialog-start="alert('Question!')">
                <p>Great! Let's dive into the first question.</p>
            </div>
            <div data-sws-dialog-2 data-sws-subject="person_1">
                <p>What is your favorite color?</p>
            </div>
            <div data-sws-dialog-3 data-sws-subject="person_2">
                <p>My favorite color is blue!</p>
            </div>
            <div data-sws-dialog-4>
                <p>Without data-sws-subject this is narrative text by default.</p>
            </div>
        </div>
    </div>

    <!-- Actions -->
    <div data-sws-actions>
        <button data-sws-button="back">Back</button>
        <button data-sws-button="next">Next</button>
    </div>
</section>
```