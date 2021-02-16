export const SetVdDom = function (node, key, value) {
  switch (key) {
    case "style":
      node.style.cssText = value;
      break;

    case "value":
      let tagName = node.tagName || "";
      tagName = tagName.toLowerCase();
      if (tagName === "input" || tagName === "select") {
        node.value = value;
      } else {
        node.setAttribute(key, value);
      }
      break;

    default:
      node.setAttribute(key, value);
      break;
  }
};

export class Element {
  constructor(tagName, attrs = {}, child = []) {
    this.tagName = tagName;
    this.attrs = attrs;
    this.child = child;
  }

  render() {
    let ele = document.createElement(this.tagName);
    let attrs = this.attrs;

    for (let key in attrs) {
      SetVdDom(ele, key, attrs[key]);
    }

    let childNodes = this.child;
    childNodes.forEach(function (child) {
      let childEle =
        childNodes instanceof Element
          ? child.render()
          : document.createTextNode(child);
      ele.appendChild(childEle);
    });

    return ele;
  }
}

export function newElement(tag, attr, child) {
  return new Element(tag, attr, child);
}
