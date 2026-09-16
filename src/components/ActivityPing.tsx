"use client";

import { useEffect } from "react";

export default function ActivityPing() {
  useEffect(() => {
    const ping = () => {
      fetch("/api/ping", { method: "POST" }).catch(() => {});
    };
    ping();
    const interval = setInterval(ping, 60000);
    return () => clearInterval(interval);
  }, []);
  return null;
}
