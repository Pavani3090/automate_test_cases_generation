const express = require("express");
const parseFunction = require("../utils/astParser");
const history = require("../data/history");

const router = express.Router();

router.post("/generate", (req, res) => {

  const { code, testCount } = req.body;

  if (!code || code.trim().length === 0) {
    return res.json({ testCode: "No code provided" });
  }

  const { name, params } = parseFunction(code);

  if (!name) {
    return res.json({ testCode: "No function detected" });
  }

  const TEST_COUNT = Math.min(Number(testCount) || 3, 20);

  let tests = [];
  const lowerCode = code.toLowerCase();

  // ------------------------------------------------
  // Detect function type
  // ------------------------------------------------
  const isString =
    lowerCode.includes("string") ||
    lowerCode.includes('"') ||
    lowerCode.includes("'");

  const isArray =
    lowerCode.includes("arr") ||
    lowerCode.includes("length") ||
    lowerCode.includes("map") ||
    lowerCode.includes("filter");

  const isBoolean =
    lowerCode.includes(">") ||
    lowerCode.includes("<") ||
    lowerCode.includes("===") ||
    lowerCode.includes("%");

  const isArithmetic =
    lowerCode.includes("+") ||
    lowerCode.includes("-") ||
    lowerCode.includes("*") ||
    lowerCode.includes("/");

  // ------------------------------------------------
  // Execute function dynamically to compute expected
  // ------------------------------------------------
  let fn;
  try {
    fn = new Function(`${code}; return ${name};`)();
  } catch (e) {
    fn = null;
  }

  function computeExpected(values) {
    try {
      if (!fn) return `"result"`;
      const result = fn(...values);

      if (typeof result === "string") return `"${result}"`;
      if (typeof result === "object") return JSON.stringify(result);

      return result;
    } catch {
      return `"error"`;
    }
  }

  // ------------------------------------------------
  // Generate values based on type
  // ------------------------------------------------
  function generateValues() {

    if (isString) {
      return params.map(() => "hello");
    }

    if (isArray) {
      return params.map(() => [1, 2, 3]);
    }

    if (isBoolean) {
      return params.map(() =>
        Math.floor(Math.random() * 20) - 10
      );
    }

    if (isArithmetic) {
      return params.map(() =>
        Math.floor(Math.random() * 10) + 1
      );
    }

    return params.map(() => 1);
  }

  // ------------------------------------------------
  // Random Tests
  // ------------------------------------------------
  for (let i = 0; i < TEST_COUNT; i++) {

    const values = generateValues();

    const args = values
      .map(v => Array.isArray(v) ? JSON.stringify(v) :
      typeof v === "string" ? `"${v}"` : v)
      .join(",");

    const expected = computeExpected(values);

    tests.push(`
test("Random Test ${i + 1}", () => {
  expect(${name}(${args})).toBe(${expected});
});
`);
  }

  // ------------------------------------------------
  // Boundary Cases (numeric only)
  // ------------------------------------------------
  if (isArithmetic && params.length > 0) {

    const edgeSets = [
      { label: "Zero", value: 0 },
      { label: "Negative", value: -5 },
      { label: "Large", value: 1000 }
    ];

    edgeSets.forEach(edge => {

      const values = params.map(() => edge.value);
      const args = values.join(",");
      const expected = computeExpected(values);

      tests.push(`
test("Edge Case - ${edge.label}", () => {
  expect(${name}(${args})).toBe(${expected});
});
`);
    });
  }

  // ------------------------------------------------
  // String Edge Cases
  // ------------------------------------------------
  if (isString && params.length > 0) {

    const values = params.map(() => "");
    const args = values.map(v => `"${v}"`).join(",");
    const expected = computeExpected(values);

    tests.push(`
test("Edge Case - Empty String", () => {
  expect(${name}(${args})).toBe(${expected});
});
`);
  }

  // ------------------------------------------------
  // Array Edge Cases
  // ------------------------------------------------
  if (isArray && params.length > 0) {

    const values = params.map(() => []);
    const args = values.map(v => JSON.stringify(v)).join(",");
    const expected = computeExpected(values);

    tests.push(`
test("Edge Case - Empty Array", () => {
  expect(${name}(${args})).toBe(${expected});
});
`);
  }

  // ------------------------------------------------
  // Build final test file
  // ------------------------------------------------
  const testCode = `
const { ${name} } = require('./file');

describe("${name} Tests", () => {

${tests.join("\n")}

});
`;

  history.push({ code, test: testCode });

  res.json({ testCode });

});

router.get("/history", (req, res) => {
  res.json(history);
});

module.exports = router;