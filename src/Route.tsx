import { Routes, Route, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";
import "./App.css";
import "./index.css";
import Page from "./pages/page";
import Home from "./pages/home";
import About from "./pages/About";
import Songlist from "./pages/songlist";
import { Provider } from "react-redux";
import { store } from "./app/store";
import AudioPlayer from "./pages/Audioplayer";

// Admin Pages
import Adminpanel from "./adminpages/adminpanel";
import Serveraudio from "./adminpages/serveraudio";
import Albumadmin from "./adminpages/albumadmin";

import AlbumList from "./pages/AlbumList"; // Import AlbumList page
import SongDetails from "./pages/SongDetails"; // Import SongDetails page

function AppRoutes() {
  const location = useLocation();

  useLayoutEffect(() => {
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <Provider store={store}>
      <AudioPlayer />
      <Routes>
        <Route path="/" element={<Page />}>
          <Route index element={<Home />} />
          <Route path="/songlist" element={<Songlist />} />
          <Route path="/about" element={<About />} />

           {/* New Routes for Admin */}
          <Route path="/admin" element={<Adminpanel />} />
          <Route path="/serveraudio" element={<Serveraudio />} />
          <Route path="/albumadmin" element={<Albumadmin />} />


          {/* New Routes for Albums */}
          <Route path="/albums" element={<AlbumList />} />
          <Route path="/album/:albumId" element={<SongDetails />} />
        </Route>
      </Routes>
    </Provider>
  );
}

export default AppRoutes;
