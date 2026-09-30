import Header from "./components/Header";
import Footer from "./components/Footer";
import Intro from "./sections/Intro";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Skills from "./sections/Skills";
import Certificates from "./sections/Certificates";
import Contact from "./sections/Contact";

export default function App() {
  return (
    <>
      <a
        href="#projects"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-paper focus:p-3 focus:font-sans"
      >
        Skip to content
      </a>
      <Header />
      <main>
        <Intro />
        <Projects />
        <Experience />
        <Skills />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
