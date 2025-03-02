import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChatRoundDots } from "solar-icon-set";

export default function Home() {
  return (
    <main className=" h-screen overflow-hidden">
      <header className="w-full px-10 lg:px-32 py-8 flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <ChatRoundDots iconStyle="Bold" size={30} />
          <h1 className="text-3xl font-extrabold text-black">
            Chat <span className="">flow</span>
          </h1>
        </div>
        <div className="flex gap-2 items-center">
          <Button size={"lg"} variant={"outline"} className="font-bold text-base">
            Book a demo
          </Button>
          <Button size={"lg"} className="font-bold text-base">
            Free trial
          </Button>
        </div>
      </header>
      <section className="grid gap-14 h-[85vh] grid-cols-1 lg:grid-cols-2 items-center px-10 lg:px-32 place-items-center relative ">
        <div className="z-10">
          <h1 className="text-5xl font-extrabold text-black mb-8">
            Craft <span className="text-6xl text-foreground">intelligent</span> conversations, <span className="text-6xl text-foreground">Effortlessly</span>
          </h1>
          <p className="text-xl ">✨ Build smart, engaging chatbots with ease—no coding required! Automate conversations, enhance user experience, and scale your business effortlessly.</p>
          <div className="flex items-center gap-4 mt-14">
            <Link href={"/builder"}>
              <Button className="bg-foreground h-14 rounded-xl text-lg font-bold" size={"lg"}>
                Start from template
              </Button>
            </Link>
            <Link href={"/builder"}>
              <Button variant={"outline"} className="h-14 rounded-xl text-lg font-bold" size={"lg"}>
                Start from scratch
              </Button>
            </Link>
          </div>
        </div>
        <div className="w-full flex items-center justify-center relative">
          <img src="/chat-bot.gif" className="w-3/5 z-10" />
        </div>
      </section>
    </main>
  );
}
