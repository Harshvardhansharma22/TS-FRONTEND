Environment variable setup — VITE_BACKEND_URL

Purpose
- Point the frontend to your deployed backend (Render) using the Vite public env variable `VITE_BACKEND_URL`.

Vercel (recommended for production)
1. Open your Vercel dashboard and select the project.
2. Go to Settings → Environment Variables.
3. Add an environment variable:
   - Key: `VITE_BACKEND_URL`
   - Value: `https://your-backend.onrender.com` (replace with your Render URL)
   - Environment: select `Production` (and `Preview`/`Development` if desired)
4. Save and trigger a redeploy (Vercel will rebuild with the new env variable).

Local development
1. Create a file at the project root: `frontend/.env` (do NOT commit secrets to git).
2. Add the line:

   VITE_BACKEND_URL=https://your-backend.onrender.com

3. Restart the dev server:

```bash
npm run dev
```

Notes & troubleshooting
- Vite injects env vars at build time. Make sure to redeploy Vercel after changing the variable.
- The variable must start with `VITE_` to be available in the client.
- Socket connections: the app uses `VITE_BACKEND_URL` for socket.io; ensure your backend's socket endpoint is accessible and CORS/socket origins are configured on the backend.
- CORS errors: if you see CORS errors in the browser console, allow your frontend origin (Vercel domain) in backend CORS or enable wildcard for testing.

If you'd like, provide your Render backend URL and I can:
- add it to a local `.env` file here (if you approve), or
- prepare a short README commit message for you to push.
