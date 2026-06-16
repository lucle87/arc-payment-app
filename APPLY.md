# EURC — hỗ trợ 2 loại tiền (USDC + EURC)

Không cần cài thư viện mới.

## Giải nén đè (giữ cấu trúc thư mục) — 11 file
- lib/chain.ts                 (thêm EURC, getEurcBalance, TOKENS, detectToken)
- lib/useSendUsdc.ts           (tham số token)
- lib/store.ts                 (TxRecord có token)
- app/api/transactions/route.ts (lưu token)
- components/SendForm.tsx      (nút chọn USDC/EURC + số dư token đang chọn)
- components/HomeStats.tsx     (số dư cả USDC và EURC)
- components/TransactionTable.tsx (hiện đúng đồng tiền mỗi dòng)
- components/ChatPayment.tsx   (AI Wallet nhận "EURC")
- components/AISendForm.tsx    (nhận "EURC")
- components/AgentPayment.tsx  (nhận "EURC" cho cả lô)
- app/receive/page.tsx         (request link chọn USDC/EURC)

## Chạy
  Remove-Item -Recurse -Force .next
  npm run dev

### Thử:
- /send: bấm nút EURC -> số dư đổi sang EURC -> gửi 1 EURC (cần đã nạp EURC từ faucet).
- AI Wallet: gõ "Send 1 EURC to Alice" -> review hiện EURC -> gửi.
- /wallet: thấy số dư USDC + EURC.
- /explorer: dòng giao dịch hiện đúng "USDC" hoặc "EURC".

## Lấy EURC test
faucet.circle.com -> chọn Arc Testnet -> sẽ có cả USDC và EURC.

## Build + push
  npm run build
  git add .
  git commit -m "Add EURC: multi-currency send, balances, history, AI detection"
  git push
