import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{
      background: "#111",
      color: "white",
      padding: "12px",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <h2>Auto Unit Test Generator</h2>

      <div>
        <Link style={{color:"white", marginRight:"15px"}} to="/">Home</Link>
        <Link style={{color:"white"}} to="/history">History</Link>
      </div>
    </div>
  );
}

export default Navbar;