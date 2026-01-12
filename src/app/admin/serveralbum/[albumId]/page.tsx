import AlbumClient from "./AlbumClient";

async function getAlbum(albumId: string) {
  const res = await fetch(
    "https://test-flute.onrender.com/get-urls/albums",
    { cache: "no-store" } // or "force-cache" if data is static
  );

  if (!res.ok) {
    throw new Error("Failed to fetch album");
  }

  const data = await res.json();
  return data.data.find((a: any) => a._id === albumId) || null;
}

const AlbumPage = async ({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) => {
  const { albumId } = await params;
  const album = await getAlbum(albumId);

  if (!album) {
    return (
      <p className="text-white text-center mt-10">
        Album not found
      </p>
    );
  }

  return <AlbumClient album={album} />;
};

export default AlbumPage;
