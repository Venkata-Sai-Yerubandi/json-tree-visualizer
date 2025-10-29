import React, { useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import "./App.css";

export default function App() {
  const [jsonInput, setJsonInput] = useState(""); // starts empty
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Convert JSON to graph nodes & edges
  const handleGenerate = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setError("");
      const { nodes, edges } = buildGraph(parsed);
      setNodes(nodes);
      setEdges(edges);
    } catch {
      setError("❌ Invalid JSON format");
    }
  };

  // Recursive function to create vertical tree
  const buildGraph = (obj, parentId = null, depth = 0, position = { x: 0, y: 0 }) => {
    let nodes = [];
    let edges = [];

    const id = Math.random().toString(36).substring(2, 9);

    nodes.push({
      id,
      data: { label: parentId || "Root" },
      position: { x: position.x, y: position.y },
      style: {
        background: darkMode ? "#1f2937" : "#f9fafb",
        color: darkMode ? "#f9fafb" : "#111827",
        padding: 10,
        borderRadius: 8,
        border: `1px solid ${darkMode ? "#4b5563" : "#d1d5db"}`,
      },
    });

    if (typeof obj === "object" && obj !== null) {
      Object.entries(obj).forEach(([key, value], index) => {
        const childY = position.y + (index + 1) * 100;
        const child = buildGraph(value, key, depth + 1, {
          x: position.x + 220,
          y: childY,
        });
        nodes = [...nodes, ...child.nodes];
        edges = [...edges, ...child.edges];
        edges.push({ id: `${id}-${key}`, source: id, target: child.nodes[0].id });
      });
    }

    return { nodes, edges };
  };

  return (
    <div className={`app-root ${darkMode ? "dark" : ""}`}>
      <div className="card">
        {/* Header */}
        <div className="card-header">
          <div className="title">JSON → Tree Visualizer</div>
          <div className="header-controls">
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span className="slider"></span>
            </label>
            <span>{darkMode ? "🌙" : "☀️"}</span>
          </div>
        </div>

        <div className="card-body">
          {/* Left side - JSON input */}
          <div className="left">
            <label className="input-label">Enter JSON</label>
            <textarea
              className="json-input"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Example: {"name": "Venkata", "skills": ["JS", "React"]}'
            />
            {error && <div className="error-text">{error}</div>}

            <button className="generate-btn" onClick={handleGenerate}>
              Generate Tree
            </button>
          </div>

          {/* Right side - Tree view */}
          <div className="right">
            <div className="search-row">
              <input
                className="search-input"
                type="text"
                placeholder="Search node..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="search-btn">Search</button>
            </div>

            <div className="flow-wrapper">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
              >
                <Background color={darkMode ? "#475569" : "#e5e7eb"} />
                <Controls />
              </ReactFlow>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

