import CTA from "@/modules/landing/components/CTA";
import Features from "@/modules/landing/components/Features";
import Footer from "@/modules/landing/components/Footer";
import Header from "@/modules/landing/components/Header";
import Hero from "@/modules/landing/components/Hero";

const Page = () => {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  );
};

export default Page;
