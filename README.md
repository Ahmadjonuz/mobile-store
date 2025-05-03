# Mobil Do'kon Web Ilovasi

Bu loyiha - mobil telefonlar sotuvchi onlayn do'kon uchun yaratilgan zamonaviy web ilovasi.

## Asosiy Xususiyatlar

- 🛍️ Mahsulotlar katalogi
- ❤️ Sevimlilar ro'yxati
- 🛒 Savat
- 👤 Foydalanuvchi hisobi
- 🌐 Ko'p tilli qo'llab-quvvatlash (O'zbek, Rus, Ingliz)
- 💳 So'mda narxlar
- ⭐ Mahsulotlar uchun sharhlar
- 🔍 Qidiruv
- 📱 Mobil qurilmalarga moslashgan dizayn

## Texnologiyalar

- Next.js 14
- TypeScript
- Supabase (Backend)
- Tailwind CSS
- Framer Motion (Animatsiyalar)
- React Context API
- i18next (Tarjimalar)

## O'rnatish

1. Loyihani klonlang:
```bash
git clone [repository-url]
cd mobile-store
```

2. Zarur paketlarni o'rnating:
```bash
npm install
```

3. `.env.local` faylini yarating:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Loyihani ishga tushiring:
```bash
npm run dev
```

## Supabase Sozlamalari

1. Yangi Supabase loyihasi yarating
2. Quyidagi jadvallarni yarating:
   - products
   - categories
   - user_wishlist
   - user_cart
   - reviews
   - orders

3. SQL migratsiyalarni bajaring:
```sql
-- insert_categories.sql faylidagi SQL so'rovlarni bajaring
```

## Deployment

1. Vercel hisobingizga kiring
2. Yangi loyiha yarating
3. GitHub repozitoriyangizni ulang
4. Environment variables ni sozlang:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
5. Deploy tugmasini bosing

## Loyiha Tuzilishi

```
mobile-store/
├── app/                 # Asosiy ilova fayllari
├── components/          # UI komponentlari
├── contexts/           # Context providerlar
├── hooks/              # Custom hooks
├── lib/                # Utility funksiyalar
├── locales/            # Tarjima fayllari
├── public/             # Statik fayllar
├── styles/             # CSS fayllari
└── types/              # TypeScript interfeyslari
```

## Foydalanuvchi Imkoniyatlari

- 👤 Ro'yxatdan o'tish va kirish
- 🔍 Mahsulotlarni qidirish
- 🛍️ Mahsulotlarni savatga qo'shish
- ❤️ Sevimlilar ro'yxatini boshqarish
- 📝 Mahsulotlarga sharh yozish
- 💳 Buyurtma berish
- 👤 Profilni tahrirlash

## Rivojlanish

- [ ] To'lov tizimini qo'shish
- [ ] SMS xabarnomalar
- [ ] Mahsulot filtrlari
- [ ] Chegirmalar va aksiyalar
- [ ] Admin paneli

## Karimov Ahmadjon

[Ahmadjon]

## Litsenziya

MIT 