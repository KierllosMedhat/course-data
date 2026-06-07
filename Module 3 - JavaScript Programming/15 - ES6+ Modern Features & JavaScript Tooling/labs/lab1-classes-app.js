// Lab 1: Class-Based Component System
// TODO: Implement the UIComponent base class and the Modal subclass.

// 1. TODO: Implement the UIComponent class
class UIComponent {
  // - Constructor(selector): Select the DOM element and store it as this.element
  // - show(): Remove the "hidden" class from this.element
  // - hide(): Add the "hidden" class to this.element
  // - render(html): Set this.element.innerHTML to the provided html
}

// 2. TODO: Implement the Modal class that extends UIComponent
class Modal extends UIComponent {
  // - Constructor(selector, title, content):
  //   - Call super(selector)
  //   - Store title and content
  // - render(): Override render to set the innerHTML with modal structure:
  //   An overlay div and content box. Must include a button to close.
  // - open(): Render the modal content and call show()
  // - close(): Call hide()
  // - static create(title, content): Instantiates a Modal on '#modal-container', calls open()
}

// --- Test Setup ---
document.getElementById("open-modal-btn").addEventListener("click", () => {
  // 3. TODO: Test your modal static creator
  // Modal.create("Hello World", "This modal was created dynamically using ES6 classes!");
});

