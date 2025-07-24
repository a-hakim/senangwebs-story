/**
 * SenangWebs Story (SWS)
 * A lightweight, dependency-free JavaScript library for creating interactive, visual novel-style story experiences.
 */
class SWS {
    constructor(element, options) {
        this.element = element;
        this.config = options;
        this.storyId = null;
        this.scenes = [];
        this.currentSceneIndex = 0;
        this.currentDialogIndex = 0;
        this.typewriterTimeout = null;

        if (this.config) {
            this._initFromJSON();
        } else {
            this._initFromHTML();
        }

        this._setupUI();
        this._updateUI();
        this._attachEventListeners();
    }

    //------------------------------------------------------------------------------------------------------------------
    // INITIALIZATION
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Parses the story structure from data-* attributes in the HTML.
     * @private
     */
    _initFromHTML() {
        this.storyId = this.element.dataset.swsId;
        const sceneElements = Array.from(this.element.querySelectorAll('[data-sws-scene-1], [data-sws-scene-2], [data-sws-scene-3], [data-sws-scene-4], [data-sws-scene-5], [data-sws-scene-6], [data-sws-scene-7], [data-sws-scene-8], [data-sws-scene-9]'));

        sceneElements.forEach((sceneEl, i) => {
            const scene = {
                element: sceneEl,
                sceneStart: sceneEl.dataset.swsSceneStart || null,
                background: sceneEl.querySelector('[data-sws-background] img')?.src,
                subjects: [],
                dialogs: []
            };

            const subjectElements = Array.from(sceneEl.querySelectorAll('[data-sws-subject-id]'));
            scene.subjects = subjectElements.map(subjectEl => ({
                id: subjectEl.dataset.swsSubjectId,
                name: subjectEl.dataset.swsSubjectName,
                element: subjectEl
            }));

            const dialogElements = Array.from(sceneEl.querySelectorAll('[data-sws-dialog-1], [data-sws-dialog-2], [data-sws-dialog-3], [data-sws-dialog-4], [data-sws-dialog-5], [data-sws-dialog-6], [data-sws-dialog-7], [data-sws-dialog-8], [data-sws-dialog-9]'));
            dialogElements.forEach((dialogEl, j) => {
                scene.dialogs.push({
                    element: dialogEl,
                    text: dialogEl.querySelector('p').innerHTML.trim(),
                    subjectId: dialogEl.dataset.swsSubject || null,
                    dialogStart: dialogEl.dataset.swsDialogStart || null
                });
            });

            this.scenes.push(scene);
        });
    }

    /**
     * Generates the required HTML structure from a JSON object.
     * @private
     */
    _initFromJSON() {
        this.storyId = this.config.id;
        this.element.dataset.sws = true;
        this.element.dataset.swsId = this.storyId;
        this.element.innerHTML = ''; // Clear existing content

        this.config.scenes.forEach((sceneData, i) => {
            const sceneEl = document.createElement('div');
            sceneEl.dataset[`swsScene${i + 1}`] = 'true';
            if (sceneData.sceneStart) {
                sceneEl.dataset.swsSceneStart = sceneData.sceneStart;
            }
            if (i > 0) {
                sceneEl.style.display = 'none';
            }

            // Background
            const backgroundEl = document.createElement('div');
            backgroundEl.dataset.swsBackground = '';
            const backgroundImg = document.createElement('img');
            backgroundImg.src = sceneData.background;
            backgroundImg.alt = `Scene Background ${i + 1}`;
            backgroundEl.appendChild(backgroundImg);
            sceneEl.appendChild(backgroundEl);

            // Subjects
            const subjectsEl = document.createElement('div');
            subjectsEl.dataset.swsSubjects = '';
            sceneData.subjects.forEach(subjectData => {
                const subjectImg = document.createElement('img');
                subjectImg.src = subjectData.src;
                subjectImg.dataset.swsSubjectId = subjectData.id;
                subjectImg.dataset.swsSubjectName = subjectData.name;
                subjectImg.alt = subjectData.name;
                subjectsEl.appendChild(subjectImg);
            });
            sceneEl.appendChild(subjectsEl);

            // Dialog Box
            const dialogBoxEl = document.createElement('div');
            dialogBoxEl.dataset.swsDialogBox = '';
            const activeSubjectNameEl = document.createElement('h4');
            activeSubjectNameEl.dataset.swsActiveSubjectName = '';
            dialogBoxEl.appendChild(activeSubjectNameEl);

            sceneData.dialogs.forEach((dialogData, j) => {
                const dialogEl = document.createElement('div');
                dialogEl.dataset[`swsDialog${j + 1}`] = '';
                if (dialogData.subject) {
                    dialogEl.dataset.swsSubject = dialogData.subject;
                }
                if (dialogData.dialogStart) {
                    dialogEl.dataset.swsDialogStart = dialogData.dialogStart;
                }
                const p = document.createElement('p');
                p.innerHTML = dialogData.text;
                dialogEl.appendChild(p);
                dialogBoxEl.appendChild(dialogEl);
            });
            sceneEl.appendChild(dialogBoxEl);

            this.element.appendChild(sceneEl);
        });

        // Actions
        const actionsEl = document.createElement('div');
        actionsEl.dataset.swsActions = '';
        const backButton = document.createElement('button');
        backButton.dataset.swsButton = 'back';
        backButton.textContent = 'Back';
        const nextButton = document.createElement('button');
        nextButton.dataset.swsButton = 'next';
        nextButton.textContent = 'Next';
        actionsEl.appendChild(backButton);
        actionsEl.appendChild(nextButton);
        this.element.appendChild(actionsEl);

        // Repopulate scenes from generated HTML
        this._initFromHTML();
    }


    /**
     * Hides all scenes and dialogs to prepare the initial state.
     * @private
     */
    _setupUI() {
        this.scenes.forEach((scene, i) => {
            scene.element.style.display = i === 0 ? '' : 'none';
            scene.dialogs.forEach((dialog, j) => {
                if (dialog.element) {
                    dialog.element.style.display = 'none';
                }
            });
        });
    }

    /**
     * Attaches click event listeners to the navigation buttons.
     * @private
     */
    _attachEventListeners() {
        const nextButton = this.element.querySelector('[data-sws-button="next"]');
        const backButton = this.element.querySelector('[data-sws-button="back"]');

        if (nextButton) nextButton.addEventListener('click', () => this.next());
        if (backButton) backButton.addEventListener('click', () => this.back());
    }

    //------------------------------------------------------------------------------------------------------------------
    // NAVIGATION
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Moves to the next dialog or scene.
     */
    next() {
        this._completeTypewriter();
        const currentScene = this.scenes[this.currentSceneIndex];

        if (this.currentDialogIndex < currentScene.dialogs.length - 1) {
            this.currentDialogIndex++;
            this._updateUI();
        } else if (this.currentSceneIndex < this.scenes.length - 1) {
            this.currentSceneIndex++;
            this.currentDialogIndex = 0;
            this._updateUI(true);
        }
    }

    /**
     * Moves to the previous dialog or scene.
     */
    back() {
        this._completeTypewriter();
        if (this.currentDialogIndex > 0) {
            this.currentDialogIndex--;
            this._updateUI();
        } else if (this.currentSceneIndex > 0) {
            this.currentSceneIndex--;
            this.currentDialogIndex = this.scenes[this.currentSceneIndex].dialogs.length - 1;
            this._updateUI(true);
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // UI & EFFECTS
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Updates the entire story display based on the current state.
     * @param {boolean} [sceneChanged=false] - Indicates if the scene has changed.
     * @private
     */
    _updateUI(sceneChanged = false) {
        if (sceneChanged) {
            this.scenes.forEach((scene, i) => {
                scene.element.style.display = i === this.currentSceneIndex ? '' : 'none';
            });
            this._executeCallback(this.scenes[this.currentSceneIndex].sceneStart);
        }

        const scene = this.scenes[this.currentSceneIndex];
        const dialog = scene.dialogs[this.currentDialogIndex];

        // Update dialog visibility
        scene.dialogs.forEach((d, i) => {
            if (d.element) d.element.style.display = 'none';
        });

        const activeDialogElement = scene.element.querySelector(`[data-sws-dialog-${this.currentDialogIndex + 1}]`);

        // Update active subject and name
        const activeSubjectNameEl = scene.element.querySelector('[data-sws-active-subject-name]');
        const subject = scene.subjects.find(s => s.id === dialog.subjectId);

        // Remove active class from all subjects first
        scene.subjects.forEach(s => s.element?.classList.remove('active'));

        if (subject) {
            activeSubjectNameEl.textContent = subject.name;
            subject.element?.classList.add('active');
        } else {
            activeSubjectNameEl.textContent = '';
        }


        // Start typewriter effect
        this._typewriter(dialog.text, activeDialogElement.querySelector('p'));


        // Execute dialog callback
        this._executeCallback(dialog.dialogStart);
    }

    /**
     * Displays text with a typewriter effect.
     * @param {string} text - The text to display.
     * @param {HTMLElement} element - The target element for the text.
     * @private
     */
    _typewriter(text, element) {
        if (!element) return;
        element.parentElement.style.display = '';
        element.textContent = '';
        let i = 0;
        const speed = 50; // milliseconds

        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                this.typewriterTimeout = setTimeout(type, speed);
            }
        };
        type();
    }

    /**
     * Instantly completes the typewriter animation.
     * @private
     */
    _completeTypewriter() {
        if (this.typewriterTimeout) {
            clearTimeout(this.typewriterTimeout);
            this.typewriterTimeout = null;
            const scene = this.scenes[this.currentSceneIndex];
            const dialog = scene.dialogs[this.currentDialogIndex];
            const dialogElement = scene.element.querySelector(`[data-sws-dialog-${this.currentDialogIndex + 1}]`);
            if (dialogElement) {
                dialogElement.querySelector('p').textContent = dialog.text;
            }
        }
    }


    /**
     * Executes a callback string.
     * @param {string} callbackString - The JS code to execute.
     * @private
     */
    _executeCallback(callbackString) {
        if (callbackString) {
            try {
                // Using new Function() is safer than eval()
                new Function(callbackString)();
            } catch (e) {
                console.error("Error executing callback:", e);
            }
        }
    }
}

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const storyElements = document.querySelectorAll('[data-sws]');
    storyElements.forEach(el => new SWS(el));
});