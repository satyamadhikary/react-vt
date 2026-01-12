import albumsData from "@/arrays/albumsData.json";
import AlbumClient from "./AlbumClient";

const Page = ({
  params,
}: {
  params: { albumId: string };
}) => {
  const album = albumsData.find((a) => a.id === params.albumId);

  if (!album) {
    return (
      <p className="text-white text-center mt-10">
        Album not found.
      </p>
    );
  }

  return <AlbumClient album={album} />;
};

export default Page;
