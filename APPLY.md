# Tính năng mới: USP Arc + Payment link + AI Agent

## Cài (không có thư viện mới — chỉ dùng đồ đã có)
Không cần npm install gì thêm.

## Giải nén đè các file (giữ cấu trúc thư mục)
- lib/useSendUsdc.ts        (đo thời gian xác nhận + phí USDC + chế độ silent)
- components/SendForm.tsx   (điền sẵn amount+memo từ link yêu cầu)
- components/Navbar.tsx     (+ link "AI Agent")
- app/receive/page.tsx      (+ phần tạo link yêu cầu trả tiền + QR)
- app/api/ai-agent/route.ts (MỚI — AI lập kế hoạch trả nhiều người)
- components/AgentPayment.tsx (MỚI — UI agent)
- app/agent/page.tsx        (MỚI — trang /agent)

## Chạy thử
  npm run dev

### Thử #1 (USP Arc): gửi 1 giao dịch ở /send -> báo "Confirmed in 0.8s ⚡" + toast.
### Thử #2 (Payment link): vào /receive -> nhập Amount -> "Copy request link"
     -> mở link đó (tab ẩn danh) -> form Send đã điền sẵn người nhận + số tiền.
### Thử #3 (AI Agent): thêm 2-3 contact -> vào /agent -> gõ
     "Split 30 USDC between Alice and Bob" -> Plan with AI -> Send all.

## Build + push
  npm run build
  git add .
  git commit -m "Add Arc USP timing/fee, payment request links, AI agent batch payments"
  git push
