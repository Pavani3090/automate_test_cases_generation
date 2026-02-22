import { useState } from "react";
import CodeEditor from "../components/CodeEditor";
import OutputBox from "../components/OutputBox";
import { generateTests } from "../api";

function Home() {

  const [code, setCode] = useState(`function add(a, b){
  return a + b;
}`);

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [testCount, setTestCount] = useState(3);

  // Generate tests
  const handleGenerate = async () => {

    if (!code.trim()) {
      alert("Please enter a function first");
      return;
    }

    try {
      setLoading(true);
      const data = await generateTests(code, testCount);
      setOutput(data.testCode);
    } 
    catch (error) {
      alert("Backend error or invalid code");
    } 
    finally {
      setLoading(false);
    }
  };

  // Download test file
  const downloadFile = () => {

    if (!output) {
      alert("Generate tests first");
      return;
    }

    const blob = new Blob([output], { type: "text/javascript" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "generated.test.js";
    a.click();
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>Automatic Unit Test Generator</h2>

      <CodeEditor code={code} setCode={setCode} />

      {/* Test count input */}
      <div style={{ marginTop: "15px" }}>
        <label>Number of Tests:</label>

        <input
          type="number"
          min="1"
          max="20"
          value={testCount}
          onChange={(e) => setTestCount(Number(e.target.value))}
          style={{ marginLeft: "10px", width: "70px" }}
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <button onClick={handleGenerate} style={{ marginRight: "10px" }}>
          {loading ? "Generating..." : "Generate Tests"}
        </button>

        <button onClick={downloadFile}>
          Download Test File
        </button>
      </div>

      <OutputBox output={output} />

    </div>
  );
}

export default Home;