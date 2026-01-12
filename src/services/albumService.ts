export const fetchAlbums = async () => {
  const res = await fetch("https://test-flute.onrender.com/get-urls/albums");
  if (!res.ok) throw new Error("Failed to fetch albums");

  const json = await res.json();
  return json.data;
};
