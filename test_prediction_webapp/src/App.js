import React, { useEffect, useState } from "react";
import {
  Route,
  Routes,
} from "react-router-dom";
import { AuthProvider } from "./provider/authProvider";
import { Layout } from "./provider/layout";
import { ErrorBoundary } from 'react-error-boundary';
import { RequireAuth } from "./provider/requireAuth";
import { APIRequest } from "./services/axios";
import { Management } from "./routes/Admin/management";
import useLocalStorage from "use-local-storage";
import AreaRiservata from "./routes/AreaRiservata/areaRiservata";
import BlockedWebSite from "./routes/AreaRiservata/blockedWebSite";
import Stats from "./routes/AreaRiservata/stats";
import SegnalazioneGuasti from "./routes/AreaRiservata/segnalazioniGuasti";
import BlockedWords from "./routes/AreaRiservata/blockedWords";
import Login from "./routes/login";
import Home from "./routes/home";
import Loader from "./components/loader";
import "./index.css";
import './App.css';
import BlockWebSites from "./routes/AreaRiservata/blockWebSites";


function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Qualcosa è andato storto:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  )
}

export let AuthContext = React.createContext()

function App() {
  const [token, setToken] = useState(null);
  const [user, setuser] = useState(null);
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');
  let username = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))?.username : undefined

  useEffect(() => {
    async function trovaRisultato() {
      if (username) {
        await APIRequest('GET', `auth/checktoken?username=${username}`)
          .then(res => {
            setToken(localStorage.getItem('token'));
            setuser(username)
          }).catch((e) => {
            console.log(e);
            localStorage.setItem('user', '')
            window.location.reload()
          })
      } else {
        localStorage.setItem('user', '')
        localStorage.setItem('token', '')
      }
    }
    trovaRisultato();
  }, [user, token, username])

  if (!token && username) {
    return (
      <div className="App">
        <div className="bodyRow d-flex flex-column justify-content-center">
          <Loader />
        </div>
      </div>
    )
  }

  return (
    <div className="App" data-theme={theme}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AuthProvider>
          <Routes>
            <Route element={<Layout token={token} theme={theme} setTheme={setTheme} />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login theme={theme} token={token} />} />
              <Route path="/segnalazioni" element={<RequireAuth token={token} accepted={'OPERATORE'} > <AreaRiservata /></RequireAuth>} />
              <Route path="/guasti" element={<RequireAuth token={token} accepted={'OPERATORE'} > <SegnalazioneGuasti /></RequireAuth>} />
              <Route path="/bloccoparole" element={<RequireAuth token={token} accepted={'OPERATORE'} > <BlockedWords /></RequireAuth>} />
              <Route path="/siteList" element={<RequireAuth token={token} accepted={'OPERATORE'} ><BlockedWebSite /></RequireAuth>} />
              <Route path="/stats" element={<RequireAuth token={token} accepted={'OPERATORE'} ><Stats /></RequireAuth>} />
              <Route path="/blockwebsites" element={<RequireAuth token={token} accepted={'OPERATORE'} ><BlockWebSites /></RequireAuth>} />
              <Route path="/management" element={<RequireAuth token={token} accepted={'ADMIN'} ><Management /></RequireAuth>} />
            </Route>
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
