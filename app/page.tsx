import AnimeList from "./components/anime-lists";
import Hero from "./components/hero";
import Navbar from "./components/navbar";

export default function Home() {
  return (
    <div className=" min-h-screen items-center  bg-zinc-50 font-sans dark:bg-black">
      <Navbar/>
      <br />
      <br />
      <br />
      <Hero/>
      <br />
      <br />
      <AnimeList/>
    </div>
  );
}
