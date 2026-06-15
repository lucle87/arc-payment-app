export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/70 mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <span>Built on</span>
          <span className="font-semibold text-orange-400">Arc</span>
          <span>🟠</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://faucet.circle.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-orange-400 transition"
          >
            💧 Get test USDC
          </a>
          <a
            href="https://x.com/ace9vn"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            𝕏 @ace9vn
          </a>
        </div>
      </div>
    </footer>
  );
}
