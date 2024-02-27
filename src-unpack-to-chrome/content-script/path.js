/**
 * @param {HTMLElement} node
 * @param {string[]} parents
 */
const getParentElements = (node, parents) => {
  let rootNode;

  const _getParentElements = (_node) => {
    rootNode = _node;
    let selector;
    if (_node.getAttribute('data-tag-name')) {
      selector = `[data-tag-name=${_node.getAttribute('data-tag-name')}]`;
    } else {
      selector = _node.tagName.toLowerCase();
    }

    if (_node.parentElement) {
      const parentChildren = Array.from(_node.parentElement.children);
      if (parentChildren.length > 1) {
        const childIndex = parentChildren.findIndex((child) => child === _node);
        const childSuffix = `:nth-child(${childIndex + 1})`;
        selector = `${selector}${childSuffix}`;
      }
      _getParentElements(_node.parentElement);
    }
    parents.push(selector);
  };
  _getParentElements(node, true);

  return { parents, rootNode };
};

/**
 * @param {HTMLElement} targetNode
 */
const getDOMs = (targetNode) => {
  const structure = [];

  const _getDOMs = (_targetNode) => {
    const { rootNode, parents } = getParentElements(_targetNode, []);

    structure.unshift(parents);

    if (rootNode.getRootNode() && rootNode.getRootNode().host) {
      _getDOMs(rootNode.getRootNode().host, []);
    }
  };
  _getDOMs(targetNode);

  return structure;
};

/**
 * Returns a query string that can be used with `eval()` or similar
 * to select the selected node with JavaScript, from the top document
 *
 * Takes into account that tag names can be scoped tag names, and uses
 * the data-tag-name when available. Also refrains from using attribute
 * selectors where we cannot be sure that the value is the same across
 * page loads.
 *
 * @param {HTMLElement} node
 */
const jsPath = (node) => {
  let queryString;

  /**
   * @type {Array<Array<String>>}
   */
  const doms = getDOMs(node);
  doms.forEach((dom, i) => {
    if (i === 0) {
      //queryString = `document.querySelector('`;
      queryString = "";
    } 
    // else {
    //   queryString = `${queryString}.shadowRoot.querySelector('`;
    // }
    dom.forEach((selector, j) => {
      const sep = j === dom.length - 1 ? '' : ' > ';
      queryString = `${queryString}${selector}${sep}`;
    });
    queryString = `${queryString}`;
  });

  return queryString;
};



//// Code pulled from https://github.com/jorenbroekema/js-path-util/blob/main/src/js-path.js