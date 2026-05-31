class UIComponent {
    constructor(tagName) {
        this.element = document.createElement(tagName);
    }
    
    // Virtual method to be overridden
    render() {
        return this.element;
    }
    
    mount(parentSelector) {
        document.querySelector(parentSelector).appendChild(this.render());
    }
}

// TODO: Create a Button class that extends UIComponent
// 1. Its constructor should call super('button') and accept a 'text' argument.
// 2. Override the render() method to set this.element.textContent = text, then return this.element.

// TODO: Instantiate your Button and call .mount('#app')
