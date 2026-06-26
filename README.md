# GREENOVA MVP

GREENOVA la demo web nhe cho he sinh thai nong nghiep so tai Ben Luc, Long An.

## Chuc nang chinh

- Landing page gioi thieu website, IoT, loi ich va quy trinh.
- Dashboard theo 5 role: nong dan, ky su nong nghiep, nha phan phoi, buyer va admin.
- Bang tin kieu Facebook cho nong dan va ky su.
- Mock data cho IoT ESP32, AI chan doan, san vat tu, escrow, QR passport, dau gia nguoc va quan tri KYC.
- Giao dien responsive cho desktop, tablet va dien thoai.

## Chay local

```bash
npm install
npm run dev
```

Mo `http://localhost:5173` hoac dia chi Vite hien trong terminal.

## Kiem tra truoc khi deploy

```bash
npm run lint
npm run build
```

App hien la frontend-only, phu hop host tren Vercel. Firebase/Firestore co the noi vao phase sau.
