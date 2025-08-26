import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";

function App() {
  const [code, setCode] = useState(""); // start empty, no function sum
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setLoading(true);
    setReview("");

    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", { code });
      setReview(response.data);
    } catch (err) {
      setReview("⚠️ Error connecting to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white flex flex-col">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center py-6">⚡ AI Code Reviewer</h1>

      {/* Main content */}
      <main className="flex flex-1 gap-6 px-8 pb-8 w-full">
        {/* Left: Code Editor */}
        <div className="flex-1 bg-black/80 border border-gray-700 rounded-2xl shadow-lg p-4 flex flex-col relative">
          <div className="flex-1 overflow-y-auto rounded-lg border border-gray-800 relative">
            {/* 👇 Placeholder when empty */}
            {code.trim() === "" && (
              <span className="absolute top-3 left-3 text-gray-500 pointer-events-none">
                Enter your code here...
              </span>
            )}

            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={12}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                minHeight: "100%",
                backgroundColor: "transparent",
                color: "white",
                overflow: "auto",
                maxHeight: "calc(100vh - 200px)",
              }}
            />
          </div>

          {/* Review Button */}
          <button
            onClick={reviewCode}
            disabled={!code.trim()} // disable if no code
            className={`mt-4 px-6 py-2 rounded-2xl font-semibold shadow-lg transition transform hover:scale-105 ${
              code.trim()
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "🔍 Reviewing..." : "🚀 Review"}
          </button>
        </div>

        {/* Right: AI Review Output*/}
        <div className="flex-1 bg-gray-800/80 border border-gray-700 rounded-2xl shadow-lg p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          {loading ? (
            <p className="text-center text-lg font-semibold text-purple-400 animate-pulse">
              Analyzing your code...
            </p>
          ) : review ? (
            <div className="prose prose-invert max-w-none">
              <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
            </div>
          ) : (
            <p className="text-gray-400 text-center">
              Your AI review will appear here.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
