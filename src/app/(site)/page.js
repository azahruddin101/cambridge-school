import Hero from "@/components/sections/home/Hero";
import Intro from "@/components/sections/home/Intro";
import Thoughts from "@/components/sections/home/Thoughts";
import ChairmanMessage from "@/components/sections/home/ChairmanMessage";
import Facilities from "@/components/sections/home/Facilities";
import Programs from "@/components/sections/home/Programs";
import GalleryRail from "@/components/sections/home/GalleryRail";
import Marquee from "@/components/motion/Marquee";
import { getGallery } from "@/lib/server/data";

const MARQUEE = ["Smart Classes", "Science Lab", "Computer Lab", "Safe Conveyance", "Values-led Learning", "Virtue of Wisdom"];

export default async function Home() {
  const gallery = await getGallery();

  return (
    <>
      <Hero />
      <Marquee items={MARQUEE} className="border-b border-line py-8 font-serif text-[clamp(2.25rem,5vw,4.5rem)] italic leading-none text-forest md:py-10" />
      <Intro />
      <Thoughts />
      <ChairmanMessage />
      <Facilities />
      <Programs />
      {gallery.length > 0 && <GalleryRail items={gallery.slice(0, 5)} />}
    </>
  );
}
