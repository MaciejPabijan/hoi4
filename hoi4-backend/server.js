import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const API_KEY = "D6B4456F575AD93A95DD4CA69B91B1F7";
const APP_ID = 394360;

app.get("/api/schema", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=${APP_ID}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Błąd pobierania listy osiągnięć" });
  }
});

app.get("/api/user/:steamId", async (req, res) => {
  const { steamId } = req.params;
  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${API_KEY}&steamid=${steamId}&appid=${APP_ID}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Błąd pobierania statusu użytkownika" });
  }
});

// NOWY endpoint - globalne procenty
app.get("/api/globalAchievements", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?gameid=${APP_ID}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Błąd pobierania globalnych procentów" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
