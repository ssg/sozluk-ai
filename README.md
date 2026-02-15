# sozluk-ai
AI tarafından oluşturulmuş ekşi sözlük klonu

## Özellikler

- Kullanıcı girişi gerektirmez - herkes istediği nick ile entry girebilir
- İki panelli arayüz: solda başlıklar, sağda entry'ler
- Başlıklar en son güncellenen en üstte olacak şekilde sıralanır
- Her başlıktaki entry'ler en eskiden yeniye doğru sıralanır
- Her başlık için entry sayısı gösterilir
- Temiz ve basit bir arayüz
- Tamamen istemci tarafında çalışır (GitHub Pages uyumlu)
- Veriler localStorage'da saklanır

## GitHub Pages'te Yayınlama

Bu proje GitHub Pages'te çalışacak şekilde tasarlanmıştır. Yayınlamak için:

1. Repository ayarlarından "Pages" bölümüne gidin
2. Source olarak "Deploy from a branch" seçin
3. Branch olarak `main` (veya `copilot/create-dictionary-site`) ve `/ (root)` seçin
4. Save'e tıklayın

Birkaç dakika içinde siteniz `https://[kullanıcı-adı].github.io/sozluk-ai/` adresinde yayında olacaktır.

## Yerel Olarak Çalıştırma

Herhangi bir web sunucusu ile çalıştırabilirsiniz:

```bash
# Python 3 ile
python -m http.server 8000

# Node.js http-server ile
npx http-server

# PHP ile
php -S localhost:8000
```

Daha sonra tarayıcınızda `http://localhost:8000` adresini açın.

Ya da `index.html` dosyasını doğrudan tarayıcınızda açabilirsiniz (ancak bazı tarayıcılar localStorage'ı file:// protokolünde kısıtlayabilir).

## Teknolojiler

- Frontend: HTML, CSS, JavaScript (Vanilla)
- Storage: localStorage (browser-based)
- Tamamen statik, sunucu gerektirmez
