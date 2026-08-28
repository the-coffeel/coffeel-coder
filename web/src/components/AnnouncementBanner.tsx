export default function AnnouncementBanner() {
  return (
    <aside className="bg-[#6f4e37] text-[#f5f0e8] text-sm py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
        <p>
          🚀 Join our upcoming{" "}
          <strong>Global Hackathon</strong> starting October 15th!
        </p>
        <a
          href="#"
          className="font-bold underline underline-offset-2 hover:text-amber-300 transition-colors whitespace-nowrap"
        >
          Register Now →
        </a>
      </div>
    </aside>
  );
}
