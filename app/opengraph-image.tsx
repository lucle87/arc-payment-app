import { ImageResponse } from "next/og";

export const alt = "ARC Payment App";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(60% 60% at 20% 0%, rgba(249,115,22,0.35), transparent 60%), #09090b",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#f97316",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 800,
              color: "#0a0a0a",
            }}
          >
            ⚡
          </div>
          <div style={{ fontSize: 30, color: "#fdba74", fontWeight: 700 }}>ARC Payment App</div>
        </div>

        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
          Pay in USDC by typing.
        </div>

        <div style={{ fontSize: 34, color: "#a1a1aa", marginTop: 24, maxWidth: 850 }}>
          Log in with email, get a wallet, send USDC on Arc testnet.
        </div>

        <div style={{ fontSize: 24, color: "#71717a", marginTop: 48 }}>
          Built on Arc · @ace9vn
        </div>
      </div>
    ),
    { ...size }
  );
}
