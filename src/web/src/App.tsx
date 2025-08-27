import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { LoginPage } from "./routes/Login";
import { Roulette } from "./routes/Roulette";
import "./App.css";
import { useEffect, useState } from "react";
import { SignUpPage } from "./routes/SignUp";
import { VerifyPage } from "./routes/Verify";
import { tryRefresh } from "./trpc";
import { RouletteListings } from "./routes/RouletteListings";

// Simple helpers to check auth
function hasToken() {
  return !!localStorage.getItem("token");
}

// Guard: only allow when authenticated. It tries refresh-once if no token.
function RequireAuth() {
  const [checking, setChecking] = useState(!hasToken());
  const location = useLocation();

  useEffect(() => {
    let active = true;
    (async () => {
      if (hasToken()) {
        setChecking(false);
        return;
      }
      const ok = await tryRefresh();
      if (active) setChecking(false);
      if (!ok && active) {
        // Not authed; fall through to redirect
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (checking) return <div>Loading…</div>;
  if (!hasToken()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

// If already authed, redirect to /roulette (bypass auth flow)
function RedirectIfAuthed() {
  const [checking, setChecking] = useState(!hasToken());

  useEffect(() => {
    let active = true;
    (async () => {
      if (hasToken()) {
        setChecking(false);
        return;
      }
      const ok = await tryRefresh();
      if (active) setChecking(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (checking) return <div>Loading…</div>;
  if (hasToken()) return <Navigate to="/roulette" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      {/* Public auth flow, but auto-redirect if authed */}
      <Route>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyPage />} />
      </Route>

      {/* Protected app */}
      <Route>
        <Route path="/roulette-listings" element={<RouletteListings />} />
        <Route path="/roulette" element={<Roulette />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
