# 🎬 Kịch bản video demo, ARC Payment App (~50 đến 60s)

Mục tiêu: cho team Arc và người xem trên X thấy 4 điểm mạnh trong dưới 1 phút:
1. Đăng nhập bằng email, có ví ngay (không seed phrase).
2. AI Agent: một câu, chia và gửi nhiều người.
3. Nhanh dưới 1 giây, gas trả bằng USDC (USP của Arc).
4. Đa tiền tệ: USDC và EURC.

---

## Chuẩn bị trước khi quay
- Đăng xuất sẵn (để quay cảnh login từ đầu).
- Ví đã có sẵn USDC và EURC test (nạp từ faucet.circle.com, chọn Arc Testnet).
- Có sẵn 2 contact (ví dụ Alice, Bob) trong trang Contacts.
- Trình duyệt full-screen, ẩn thanh bookmark (Ctrl+Shift+B) cho gọn.
- Quay dọc 9:16 nếu đăng X / TikTok / Reels; ngang 16:9 nếu để demo dài.
- Dùng OBS hoặc bản quay màn hình Windows (Win+G).
- Giữ tổng thời lượng dưới 60 giây. Nhanh, dứt khoát.

---

## Phân cảnh (shot-by-shot)

| # | Thời lượng | Trên màn hình | Thao tác | Caption (EN) overlay |
|---|---|---|---|---|
| 1 | 0 đến 5s | Landing page (hero) | Cuộn nhẹ qua hero và 4 thẻ tính năng | **Pay in USDC by just typing.** |
| 2 | 5 đến 11s | Nút Login | Bấm Login, nhập email, nhập mã OTP | **No seed phrase. Log in with email.** |
| 3 | 11 đến 16s | Navbar hiện ví và số dư | Trỏ vào ví 0x... và số dư vừa được tạo | **A self-custodial wallet, instantly.** |
| 4 | 16 đến 23s | Trang AI Agent | Gõ: `Split 30 USDC between Alice and Bob for dinner`, bấm Plan with AI | **One sentence, a full payment plan.** |
| 5 | 23 đến 29s | Bảng review (2 khoản 15 và 15) | Bấm Send all | **The agent pays everyone at once.** |
| 6 | 29 đến 37s | Từng dòng hiện tích xanh và thời gian | Để hiện "✅ 0.8s" mỗi dòng và tổng kết | **Settled in under a second.** |
| 7 | 37 đến 45s | Trang Send | Bấm nút EURC, số dư đổi sang EURC, gửi 1 EURC | **USDC and EURC, same wallet.** |
| 8 | 45 đến 52s | Trang Receive | Tạo payment request link và QR | **Request money with a link or QR.** |
| 9 | 52 đến 60s | Kết | Hiện logo, dòng "Built on Arc", @ace9vn | **Built on Arc · @ace9vn** |

(Nếu muốn ngắn hơn 45s, có thể bỏ cảnh 7 hoặc 8.)

---

## Lời thoại / voiceover (nếu có giọng đọc, tiếng Anh)

> "Paying with stablecoins should feel like a normal app. So I built one on Arc.
> Log in with your email, and you instantly get a self-custodial wallet. No seed phrase.
> Now watch: I just type, split 30 USDC between Alice and Bob.
> The AI agent plans it, I hit send, and both payments settle in under a second, with gas paid in USDC.
> It works with EURC too. Same wallet, same speed.
> That's ARC Payment App. Built on Arc."

(Không có giọng đọc thì dùng caption overlay ở bảng trên cùng nhạc nền nhẹ.)

---

## Caption ngắn để đăng kèm trên X

> Built a stablecoin payment app on @Arc 👇
>
> • Email login, instant self-custodial wallet (no seed phrase)
> • Type "split 30 USDC between Alice and Bob", an AI agent pays them both
> • Settled in under 1s, gas paid in USDC
> • Works with USDC and EURC
>
> Live on Arc testnet 🟠
> #Arc #USDC #EURC #stablecoin

---

## Mẹo quay cho "pro"
- Quay từng cảnh ngắn rồi ghép, đừng quay một mạch (dễ vấp).
- Khi gõ câu lệnh AI, gõ chậm và rõ để người xem đọc kịp.
- Cảnh 6 (thời gian tích xanh 0.8s) là điểm nhấn. Để nó hiện rõ 2 đến 3 giây.
- Thêm một dòng chữ to ở đầu video ("Pay USDC by typing") để giữ người xem 3 giây đầu.
- Xuất 1080p. Để link demo boarcpay.vercel.app ở cuối video hoặc trong bài đăng.
