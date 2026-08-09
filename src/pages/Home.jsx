import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedBirds from "../components/FeaturedBirds";
import About from "../components/About";
import WhyChooseUs from "../components/WhyChooseUs";
import Contact from "../components/Contact";

function Home() {
  return (
    <>
      {/* HERO */}
      <Hero />

      {/* POPULAR CATEGORIES - ONLY ONCE */}
      <Categories />

      {/* FEATURED BIRDS */}
      <FeaturedBirds />

      {/* ABOUT */}
      <About />

      {/* WHY CHOOSE US */}
      <WhyChooseUs />

      {/* CONTACT */}
      <Contact />
    </>
  );
}

export default Home;