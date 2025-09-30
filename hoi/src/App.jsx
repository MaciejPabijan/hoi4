import React, { useState } from "react";

export default function App() {
  const [steamId, setSteamId] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [unlocked, setUnlocked] = useState({});
  const [filterStatus, setFilterStatus] = useState("all");
  const [globalPercents, setGlobalPercents] = useState({});
  const [sortMode, setSortMode] = useState("none");

  // Pobranie pełnej listy osiągnięć z Node.js
  const fetchSchema = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/schema");
      const data = await res.json();
      setAchievements(data.game.availableGameStats.achievements || []);
    } catch (err) {
      console.error("Błąd pobierania listy osiągnięć", err);
    }
  };
  const handleFetchAll = () => {
    fetchSchema();
    fetchUserAchievements();
    fetchGlobalPercents();
  };

  // Pobranie statusu użytkownika z Node.js
  const fetchUserAchievements = async () => {
    if (!steamId) return alert("Wpisz swoje SteamID!");
    try {
      const res = await fetch(`http://localhost:5000/api/user/${steamId}`);
      const data = await res.json();
      if (data.playerstats && data.playerstats.achievements) {
        const map = data.playerstats.achievements.reduce((acc, a) => {
          acc[a.apiname] = a.achieved;
          return acc;
        }, {});
        setUnlocked(map);
      } else {
        setUnlocked({});
      }
    } catch (err) {
      console.error("Błąd pobierania statusu użytkownika", err);
    }
  };

  // Pobranie globalnych procentów
  const fetchGlobalPercents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/globalAchievements");
      const data = await res.json();
     if (data.achievementpercentages && data.achievementpercentages.achievements) {
  const map = data.achievementpercentages.achievements.reduce((acc, a) => {
    acc[a.name] = a.percent;
    return acc;
  }, {});
       setGlobalPercents(map);
    }    else {
      console.error("Brak danych o globalnych procentach", data);
    }

    } catch (err) {
      console.error("Błąd pobierania globalnych procentów", err);
    }
  };

  // Filtracja
  let filteredAchievements = achievements.filter(ach => {
    const isDone = unlocked[ach.name] === 1;
    if (filterStatus === "done" && !isDone) return false;
    if (filterStatus === "notdone" && isDone) return false;
    return true;
  });

  // Sortowanie
  if (sortMode === "rarity") {
    filteredAchievements = [...filteredAchievements].sort((a, b) => {
      const pa = globalPercents[a.name] || 0;
      const pb = globalPercents[b.name] || 0;
      return pa - pb; 
    });
  }
    if (sortMode === "rarity-") {
    filteredAchievements = [...filteredAchievements].sort((a, b) => {
      const pa = globalPercents[a.name] || 0;
      const pb = globalPercents[b.name] || 0;
      return pb-pa; 
    });
  }
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
    
      <h1>HOI4 Achievements Checker</h1>
      
      <div style={{ marginBottom: "10px" }}>
        <input
          value={steamId}
          onChange={e => setSteamId(e.target.value)}
          placeholder="Wpisz swoje SteamID"
          style={{ border: "1px solid #ccc", padding: "5px", marginRight: "10px" }}
        />
        <button onClick={handleFetchAll} style={{ padding: "5px 10px", marginRight: "5px" }}>
          Pobierz listę osiągnięć
        </button>
      </div>

      {achievements.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: "5px", marginRight: "10px" }}>
            <option value="all">Wszystkie</option>
            <option value="done">Odblokowane</option>
            <option value="notdone">Nieodblokowane</option>
          </select>

          <select value={sortMode} onChange={e => setSortMode(e.target.value)} style={{ padding: "5px" }}>
            <option value="none">Bez sortowania</option>
            <option value="rarity">Sortuj od najrzadszych</option>
            <option value="rarity-">Sortuj od najczęstszych</option>
          </select>
        </div>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredAchievements.map(ach => {
          const isDone = unlocked[ach.name] === 1;
          const percent = globalPercents[ach.name];
          return (
            <li 
              key={ach.name} 
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                background: isDone ? "#2e3b4e" : "#3c2f2f"
              }}
            >
              <h3>{ach.displayName}</h3>
              <p>{ach.description}</p>
              {ach.icon && <img src={ach.icon} alt={ach.displayName} style={{ width: "48px", height: "48px" }} />}
              <p>Status: {isDone ? "Odblokowane" : "Nieodblokowane"}</p>
              {percent !== undefined && <p>
                       Odblokowane globalnie: 
                      {percent ? Number(percent).toFixed(2) : "brak danych"}%
                      </p>
              }
            </li>
          );
        })}
      </ul>
    </div>
  );
}
