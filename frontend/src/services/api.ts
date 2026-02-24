export const fetchAlbums = async () => {
  const res = await fetch("https://flute-backend.onrender.com/get-urls/albums");
  if (!res.ok) throw new Error("Failed to fetch albums");

  const json = await res.json();
  return json.data;
};

export const fetchSongs = async (query: string) => {
  const res = await fetch(
    `https://flute-backend.onrender.com/api/search?q=${encodeURIComponent(query)}`,
  );

  if (!res.ok) throw new Error("Failed to Search songs");
  const json = await res.json();

  if (Array.isArray(json)) return json;

  console.error("Unexpected response format:", json);
  return [];
};
