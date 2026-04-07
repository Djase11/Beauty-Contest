# Beauty Contest — King of Diamonds

A multiplayer web game inspired by Alice in Borderland.

## Rules
- All players pick a number between 0 and 100
- The target is **0.8 × the average** of all picks
- The player closest to the target wins the round
- Most rounds won takes the game

---

## Run Locally

### 1. Install dependencies
```bash
npm install
npm run build
```

### 2. Start the server
```bash
npm start
```

Open http://localhost:3001

---

## Deploy to Railway (Free, Online Multiplayer)

1. **Create a free account** at https://railway.app

2. **Install Railway CLI** (optional) or use the web dashboard

3. **Push to GitHub first:**
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   # Create a repo on github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/beauty-contest.git
   git push -u origin main
   ```

4. **Deploy on Railway:**
   - Go to https://railway.app/new
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects the config and deploys!

5. **Get your URL:**
   - In Railway dashboard → your project → Settings → Domains
   - Click "Generate Domain" — you'll get a free `.railway.app` URL
   - Share that URL with friends to play!

---

## Project Structure

```
beauty-contest/
├── server.js          ← Node.js + Socket.IO backend
├── package.json
├── railway.toml       ← Railway deploy config
└── client/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx        ← Socket connection + screen routing
        ├── index.css
        └── screens/
            ├── Home.jsx           ← Create / Join room
            ├── Lobby.jsx          ← Waiting room
            ├── Game.jsx           ← Number input + timer
            ├── Results.jsx        ← Round results
            └── FinalLeaderboard.jsx
```
