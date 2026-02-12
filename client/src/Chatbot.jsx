import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]); // historique des messages

  const addMessage = (sender, content, type = "text") => {
    setMessages((prev) => [...prev, { sender, content, type }]);
  };

  const handleSend = async () => {
    if (!question.trim()) return;

    addMessage("user", question);
    setLoading(true);
    setQuestion("");

    try {
      const res = await axios.post("http://localhost:5005/api/chatbot", { message: question });
      const data = res.data;
      console.log(data.products);

      if (data.products && data.products.length > 0) {
        addMessage("bot", data.products, "products");
      } else {
        addMessage("bot", data.answer);
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.status === 429
        ? "⚠️ Trop de requêtes. Réessaie dans quelques secondes."
        : "❌ Une erreur est survenue. Merci de réessayer plus tard.";
      addMessage("bot", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
      {isOpen ? (
        <div style={{
          width: "350px",
          height: "500px",
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{
            padding: "15px",
            backgroundColor: "#007bff",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            Chatbot Assistant
            <button onClick={() => setIsOpen(false)} style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "18px",
              cursor: "pointer"
            }}>×</button>
          </div>

          {/* Chat Body */}
          <div style={{ flex: 1, padding: "15px", overflowY: "auto" }}>
            {messages.map((msg, index) => {
              if (msg.type === "products") {
                return (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <strong>Bot:</strong>
                    {msg.content.map((product) => (
                      <div key={product._id} style={{
                        backgroundColor: "#f9f9f9",
                        border: "1px solid #eee",
                        borderRadius: "10px",
                        padding: "10px",
                        marginTop: "5px"
                      }}>
                        <img src={`http://localhost:5005/${product.images[0]}`} alt={product.nom} style={{ width: "100%", borderRadius: "5px" }} />
                        <h4>{product.nom}</h4>
                        <p><strong>Prix:</strong> {product.prix} €</p>
                        <p>{product.description}</p>
                        <Link 
                          to="/details" 
                          state={product}
                          style={{ color: "#007bff", textDecoration: "none", cursor: "pointer" }}
                        >
                          Voir le produit
                        </Link>
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  style={{
                    textAlign: msg.sender === "user" ? "right" : "left",
                    marginBottom: "10px"
                  }}
                >
                  <div style={{
                    display: "inline-block",
                    backgroundColor: msg.sender === "user" ? "#007bff" : "#f1f0f0",
                    color: msg.sender === "user" ? "white" : "black",
                    padding: "10px",
                    borderRadius: "15px",
                    maxWidth: "80%"
                  }}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div style={{
            padding: "10px",
            borderTop: "1px solid #eee",
            display: "flex",
            gap: "5px"
          }}>
            <input
              type="text"
              placeholder="Écrivez un message..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "15px",
                border: "1px solid #ccc"
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              style={{
                padding: "10px 15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "15px",
                cursor: "pointer"
              }}
            >
              ➤
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "15px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
        }}>
          💬
        </button>
      )}
    </div>
  );
};

export default Chatbot;
