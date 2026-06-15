# Mức B — lịch sử riêng theo ví + bắt login

Không cần cài thư viện mới.

## Giải nén đè (giữ cấu trúc thư mục)
- lib/store.ts                 (TxRecord có owner; lọc theo owner; xoá theo owner)
- lib/useSendUsdc.ts           (gửi kèm owner = ví người gửi)
- app/api/transactions/route.ts (GET/POST/DELETE đều theo ?owner=)
- components/HomeStats.tsx     (đọc theo owner)
- components/ExplorerClient.tsx (nhận transactions+owner+onChange; Clear theo owner)
- app/wallet/page.tsx          (bắt login)
- app/explorer/page.tsx        (bắt login + chỉ giao dịch của mình)
- app/contacts/page.tsx        (bắt login)

## Chạy
  Remove-Item -Recurse -Force .next
  npm run dev

### Kiểm tra:
- Khi CHƯA login: Wallet / History / Contacts đều hiện "Login", không lộ dữ liệu.
- Login -> gửi 1 giao dịch -> History chỉ hiện giao dịch của ví bạn.
- Lịch sử test CŨ (không có owner) sẽ KHÔNG hiện nữa (đã làm sạch theo ví) — bình thường.
- "Clear history" giờ chỉ xoá lịch sử của ví bạn, không đụng người khác.

## Build + push
  npm run build
  git add .
  git commit -m "Scope transactions per wallet + require login on Wallet/History/Contacts"
  git push
