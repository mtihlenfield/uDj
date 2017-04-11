'use_strict';

// Utility to perform general operations dealing with elements.
export default class EleUtil {

  static addClass(ele, className) {
    ele.classList.add(className);
  }

  static addClasses(ele, classes) {
    for (let i = 0; i < classes.length; i++) {
      this.addClass(ele, classes[i]);
    }
  }

  static dropClass(ele, className) {
    ele.classList.remove(className);
  }

  static dropClasses(ele, classes) {
    classes.forEach(c => this.dropClass(ele, c));
  }

  static hasClass(ele, className) {
    return ele.classList.contains(className);
  }

  static toggleClass(ele, className) {
    ele.classList.toggle(className);
  }

  /*
  * Takes in an object with multiple properties. Tag
  * property is required, while the rest are optional.
  * Returns the element created based on the parameters.
  */
  static createEleWithAttrs({ tag = 'div', idName, className, classes}) {
    const ele = document.createElement(tag);

    if (idName) ele.setAttribute('id', idName);

    if (className) {
      ele.setAttribute('class', className);
    } else if (classes) {
      for (let i = 0; i < classes.length; i++) {
        this.addClass(ele, classes[i]);
      }
    }

    return ele;
  }

  static dropChildren(ele) {
    while (ele.firstChild) {
      ele.removeChild(ele.firstChild);
    }
  }
}
