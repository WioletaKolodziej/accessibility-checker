import { Checker } from "./components/Checker";

function App() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f7fa", color: "#333" }}>
      <h1 style={{ textAlign: "center", padding: "2rem", fontSize: "2rem", fontWeight: "bold" }}>
        Accessibility Checker 🕵️‍♀️
      </h1>
      <Checker />
    </div>
  );
}

export default App;
