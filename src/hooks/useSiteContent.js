import { useEffect, useState } from "react";
import { settingsApi } from "../api/settingsApi.js";

export function useSiteContent() {
  const [content, setContent] = useState({ gallery: [], amenities: [], dining: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    settingsApi.list()
      .then((response) => {
        const next = { gallery: [], amenities: [], dining: [] };
        (response.data || []).forEach((setting) => {
          if (!Object.prototype.hasOwnProperty.call(next, setting.key)) return;
          try {
            const value = JSON.parse(setting.value);
            next[setting.key] = Array.isArray(value) ? value : [];
          } catch {
            next[setting.key] = [];
          }
        });
        if (active) setContent(next);
      })
      .catch((error) => {
        console.error("Unable to load site content.", error);
        if (active) setContent({ gallery: [], amenities: [], dining: [] });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { content, loading };
}

export function contentImage(value, width = 1000) {
  if (!value) return "";
  return value.startsWith("http")
    ? value
    : `https://images.unsplash.com/${value}?auto=format&fit=crop&w=${width}&q=85`;
}
