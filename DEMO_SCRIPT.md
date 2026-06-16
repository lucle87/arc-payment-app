# 🎬 Kịch bản video demo — ARC Payment App (~45–60s)

Mục tiêu: cho team Arc + người xem trên X thấy **3 điểm wow** trong chưa đầy 1 phút:
1. Đăng nhập bằng **email → có ví ngay** (không seed phrase).
2. **AI Agent**: một câu → chia & gửi nhiều người.
3. **Nhanh < 1 giây + gas bằng USDC** (USP của Arc).

---

## Chuẩn bị trước khi quay
- Đăng xuất sẵn (để quay cảnh login từ đầu).
- Ví đã có sẵn USDC test (nạp từ faucet trước).
- Có sẵn 2 contact (vd Alice, Bob) trong Contacts.
- Trình duyệt full-screen, ẩn thanh bookmark cho gọn (`Ctrl+Shift+B`).
- Quay dọc (9:16) nếu đăng X/TikTok/Reels; ngang (16:9) nếu để demo dài. Dùng OBS hoặc bản quay màn hình của Windows (`Win+G`).
- Giữ tổng thời lượng **dưới 60 giây**. Nhanh, dứt khoát.

---

## Phân cảnh (shot-by-shot)

| # | Thời lượng | Trên màn hình | Thao tác | Caption (EN) overlay |
|---|---|---|---|---|
| 1 | 0–5s | Landing page (hero) | Cuộn nhẹ qua hero + 4 thẻ tính năng | **Pay in USDC by just typing.** |
| 2 | 5–12s | Nút Login | Bấm Login → nhập email → nhập mã OTP | **No seed phrase. Log in with email.** |
| 3 | 12–18s | Navbar hiện ví + số dư | Trỏ vào ví `0x… · 80 USDC` vừa được tạo | **A self-custodial wallet, instantly.** |
| 4 | 18–24s | Trang AI Agent | Gõ: `Split 30 USDC between Alice and Bob for dinner` → bấm Plan with AI | **One sentence → a payment plan.** |
| 5 | 24–30s | Bảng review (2 khoản 15/15) | Bấm **Send all** | **The agent pays everyone at once.** |
| 6 | 30–38s | Từng dòng hiện ✅ + thời gian | Để hiện "✅ 0.8s" mỗi dòng + tổng kết | **Settled in under a second ⚡** |
| 7 | 38–45s | (tuỳ chọn) /receive | Tạo payment request link + QR | **Request money with a link or QR.** |
| 8 | 45–55s | Kết | Hiện logo + dòng "Built on Arc" + @ace9vn | **Built on Arc · @ace9vn** |

---

## Lời thoại / voiceover (nếu có giọng đọc — tiếng Anh)

> "Paying with stablecoins should feel like a normal app. So I built one on Arc.
> Log in with your email — and you instantly get a self-custodial wallet. No seed phrase.
> Now watch this: I just type, *split 30 USDC between Alice and Bob* …
> the AI agent plans it, I hit send, and both payments settle in under a second — with gas paid in USDC.
> That's ARC Payment App. Built on Arc."

(Không có giọng đọc thì dùng caption overlay ở bảng trên + nhạc nền nhẹ.)

---

## Bản caption ngắn để đăng kèm X

> Built a USDC payment app on @Arc 👇
>
> • Email login → instant self-custodial wallet (no seed phrase)
> • Type *"split 30 USDC between Alice and Bob"* — an AI agent pays them both
> • Settled in <1s, gas paid in USDC
>
> Live on Arc testnet 🟠
> #Arc #USDC #stablecoin

---

## Mẹo quay cho "pro"
- Quay từng cảnh ngắn rồi ghép, đừng quay một mạch (dễ vấp).
- Khi gõ câu lệnh AI, gõ **chậm rõ** để người xem đọc kịp.
- Cảnh #6 (thời gian ✅ 0.8s) là **điểm nhấn** — để nó hiện rõ 2–3 giây.
- Thêm 1 dòng chữ to ở đầu video ("Pay USDC by typing") để giữ người xem 3 giây đầu.
- Xuất 1080p, để link demo `boarcpay.vercel.app` ở cuối hoặc trong bài đăng.
