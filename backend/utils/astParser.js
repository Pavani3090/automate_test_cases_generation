const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

function parseFunction(code) {

  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx"]
  });

  let name = "";
  let params = [];

  traverse(ast, {

    // Normal functions
    FunctionDeclaration(path) {
      if (!name) {
        name = path.node.id.name;
        params = path.node.params.map(p => p.name);
      }
    },

    // Arrow functions or function expressions
    VariableDeclarator(path) {

      if (
        path.node.init &&
        (
          path.node.init.type === "ArrowFunctionExpression" ||
          path.node.init.type === "FunctionExpression"
        )
      ) {
        if (!name) {
          name = path.node.id.name;
          params = path.node.init.params.map(p => p.name);
        }
      }

    }

  });

  return { name, params };
}

module.exports = parseFunction;