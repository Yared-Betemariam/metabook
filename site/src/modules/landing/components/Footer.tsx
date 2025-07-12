/* eslint-disable @next/next/no-img-element */

const Footer = () => {
  const date = new Date();
  return (
    <footer className="absolute bottom-0 inset-x-0 text-white border-t border-border/20 h-28 md:h-20">
      <section className="wrapper text-center font-normal h-full flex items-center justify-center gap-3 md:gap-6 flex-col md:flex-row md:justify-between ">
        <p className="opacity-45 hover:cursor-pointer  hover:opacity-50 duration-200 transition-all text-base">
          &copy; {date.getFullYear()} Metabook. All Rights Reserved.
        </p>
        <a
          target="_blank"
          href="https://www.orpad.cc"
          className="w-fit h-fit border border-zinc-900/25 flex items-center gap-2 font-sans rounded-xl text-sm p-1 px-2 opacity-60 hover:opacity-90 duration-300 transition-all drop-shadow-sm bg-white text-black"
        >
          <img
            src="https://www.orpad.cc/logo.png"
            width={15}
            height={15}
            alt="orpad logo"
            className="size-4"
          />
          <span>Made with Orpad</span>
        </a>
      </section>
    </footer>
  );
};

export default Footer;
