class Node {
  constructor(el) {
    this.el = el;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  // 添加元素到链表尾部
  append(el) {
    let newNode = new Node(el);

    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }

      current.next = newNode;
    }
  }

  // 添加元素到链表头部
  push(el) {
    let newNode = new Node(el);

    newNode.next = this.head;
    this.head = newNode;
  }

  // 在指定元素后插入新元素
  insertAfter(target, el) {
    let newNode = new Node(el);
    let current = this.head;

    while (current && current.el !== target) {
      current = current.next;
    }

    if (current) {
      newNode.next = current.next;
      current.next = newNode;
    } else {
      console.log("Target not found in the list");
    }
  }

  // 删除指定节点
  remove(el) {
    if (!this.head) return;

    if (this.head.el === el) {
      this.head = this.head.next;
      return;
    }

    let prev = null;
    let current = this.head;

    while (current && current.el !== el) {
      prev = current;
      current = current.next;
    }

    if (current) {
      prev.next = current.next;
    } else {
      console.log("El not found in this list");
    }
  }

  print() {
    let current = this.head;

    while (current) {
      console.log(current.el);
      current = current.next;
    }
  }
}
