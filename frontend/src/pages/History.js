import { useEffect, useState } from "react";
import { getHistory } from "../api";

function History() {

  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getHistory();
      setHistory(data);
    }
    load();
  }, []);

  return (
    <div style={{padding:"20px"}}>
      <h2>History</h2>

      {history.map((item, index) => (
        <div key={index} style={{border:"1px solid gray", marginBottom:"10px", padding:"10px"}}>
          <pre>{item.code}</pre>
          <hr/>
          <pre>{item.test}</pre>
        </div>
      ))}
    </div>
  );
}

export default History;