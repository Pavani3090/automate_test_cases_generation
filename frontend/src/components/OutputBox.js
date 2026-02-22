function OutputBox({ output }) {
  return (
    <div style={{
      background:"#000",
      color:"#00ff9c",
      padding:"15px",
      marginTop:"20px"
    }}>
      <pre>{output}</pre>
    </div>
  );
}

export default OutputBox;