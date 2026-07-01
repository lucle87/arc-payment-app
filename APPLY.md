# Bridge USDC cross-chain (Circle CCTP via Arc App Kit)

Trang /bridge mới: chuyển USDC giữa các chain bằng CCTP, ký bằng ví Privy.
Luồng browser-wallet KHÔNG cần API key.

## 1) Cài 2 package (BẮT BUỘC) - máy mình không cài được, bạn chạy:
  npm install @circle-fin/app-kit @circle-fin/adapter-viem-v2 --legacy-peer-deps

(viem đã có sẵn trong dự án.)

## 2) Giải nén đè (giữ cấu trúc) - 3 file
- components/BridgeForm.tsx   (form chọn chain + amount, gọi kit.bridge, hiện tiến trình)
- app/bridge/page.tsx         (trang /bridge, login-gated)
- components/Navbar.tsx        (thêm mục "Bridge")

## 3) next.config — có thể cần transpile SDK
Nếu build báo lỗi liên quan @circle-fin, mở next.config.js (hoặc .ts) thêm:

  const nextConfig = {
    transpilePackages: ["@circle-fin/app-kit", "@circle-fin/adapter-viem-v2"],
  };

## 4) Ví Privy phải mở được chain nguồn
Bridge từ Ethereum Sepolia -> Arc thì ví cần hoạt động trên Sepolia + có ÍT ETH Sepolia để trả gas.
Nếu chuyển chain báo lỗi, mở app/providers.tsx, thêm các chain vào cấu hình Privy
(supportedChains), ví dụ thêm sepolia, baseSepolia từ viem/chains. Gửi mình providers.tsx
nếu cần mình chỉnh.

## Chạy thử
  Remove-Item -Recurse -Force .next
  npm run dev
  # mở http://localhost:3000/bridge
  # Chọn From=Ethereum Sepolia, To=Arc Testnet, amount=1, bấm Bridge.
  # Theo dõi các bước: Approve -> Burn -> Fetch attestation -> Mint, mỗi bước có link explorer.

## Build + push
  npm run build
  git add .
  git commit -m "Add cross-chain USDC bridge (Circle CCTP via App Kit)"
  git push

## LƯU Ý QUAN TRỌNG
- Bridge luôn đụng 1 chain ngoài Arc -> cần native gas (ETH/AVAX) ở chain đó. Đây là bản chất CCTP.
- Lấy USDC testnet ở faucet.circle.com; ETH Sepolia ở faucet công khai (vd alchemy.com/faucets/ethereum-sepolia).
- Khi bridge TỪ Arc, amount phải lớn hơn CCTP max fee, nếu nhỏ quá bước burn sẽ revert.
- Mình không cài/chạy thử được SDK (máy không mạng). Code theo đúng tài liệu Arc.
  Nếu có lỗi runtime/build, copy log gửi mình, mình sửa.
- Danh sách chain hỗ trợ đầy đủ: docs.arc.io/app-kit/references/supported-blockchains
  (mình để sẵn Arc, Ethereum Sepolia, Base Sepolia, Avalanche Fuji; thêm/bớt trong CHAINS của BridgeForm.tsx).
- Nav giờ 9 mục, nếu thấy chật mình làm menu thu gọn (hamburger), cứ báo.
