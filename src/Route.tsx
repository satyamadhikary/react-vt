import { Routes, Route } from "react-router-dom";
import "./App.css"
import "./index.css"
import Page from "./pages/page"; 
import Home from "./pages/home";
import About from "./pages/About";
import Songlist from "./pages/songlist";


function AppRoutes() {
  return (
    <Routes>

      <Route
       path="/"
       element={<Page />}>

      <Route
       index
       element={<Home />}/>

      <Route
       path="/songlist"
       element={<Songlist />}/>

        <Route path="/About" element={<About />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
