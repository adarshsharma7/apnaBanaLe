# Next.js State Lab

Experimental Next.js 16 + Express + MongoDB state & interaction playground.

## Local Development

### 1. Backend (`PORT=5006`)
```bash
cd backend
npm install
npm run start
```

### 2. Frontend (`PORT=3006`)
```bash
cd frontend
npm install
npm run dev
```

### 3. Background Audio
Drop any MP3 file at `frontend/public/audio/bgm.mp3` to override the built-in Web Audio ambient synth loop.

### 4. Responses Viewer
Open `http://localhost:3006/secret-inbox` (passphrase: `adarsh` or `yashika20`) to view saved responses and notes.
