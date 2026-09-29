import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Stack from "./sections/Stack";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Certificates from "./sections/Certificates";
import Contact from "./sections/Contact";

export default function App() {
  return (
    <>
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded focus:bg-surface focus:px-3 focus:py-2 focus:text-sm">
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Stack />
        <Projects />
        <Experience />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
