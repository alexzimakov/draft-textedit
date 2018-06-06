module.exports = function removeCssImports() {
  return {
    visitor: {
      ImportDeclaration(path) {
        if (/\.css$/i.test(path.node.source.value)) {
          path.remove();
        }
      }
    }
  };
};
