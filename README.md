# sozluk-ai
AI tarafından oluşturulmuş ekşi sözlük klonu

## Özellikler

- Kullanıcı girişi gerektirmez - herkes istediği nick ile entry girebilir
- İki panelli arayüz: solda başlıklar, sağda entry'ler
- Başlıklar en son güncellenen en üstte olacak şekilde sıralanır
- Her başlıktaki entry'ler en eskiden yeniye doğru sıralanır
- Her başlık için entry sayısı gösterilir
- Temiz ve basit bir arayüz

## Kurulum ve Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Sunucuyu başlat
npm start
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## Teknolojiler

- Backend: Node.js, Express, SQLite
- Frontend: HTML, CSS, JavaScript
- Not: Veriler in-memory SQLite veritabanında saklanır, sunucu yeniden başlatıldığında silinir
