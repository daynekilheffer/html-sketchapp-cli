module.exports = (args) => {
  const { layer, node } = args;

  layer.setName(`node class ${node.className}`)
};
