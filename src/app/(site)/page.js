import Hero from "@/components/sections/home/Hero";
import Intro from "@/components/sections/home/Intro";
import Thoughts from "@/components/sections/home/Thoughts";
import ChairmanMessage from "@/components/sections/home/ChairmanMessage";
import Facilities from "@/components/sections/home/Facilities";
import Programs from "@/components/sections/home/Programs";
import GalleryRail from "@/components/sections/home/GalleryRail";
import Marquee from "@/components/motion/Marquee";
import { gallery } from "@/data/content";

const MARQUEE = ["Smart Classes", "Science Lab", "Computer Lab", "Safe Conveyance", "Values-led Learning", "Virtue of Wisdom"];

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee items={MARQUEE} className="border-b border-line py-8 font-serif text-[clamp(2.25rem,5vw,4.5rem)] italic leading-none text-forest md:py-10" />
      <Intro />
      <Thoughts />
      <ChairmanMessage />
      <Facilities />
      <Programs />
      <GalleryRail items={gallery.slice(0, 5)} />
    </>
  );
}
