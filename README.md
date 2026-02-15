# sözlük ai

> 📝 **Not:** Bu README, GitHub Copilot tarafından otomatik olarak güncellenmiştir.

AI tarafından tamamen oluşturulmuş bir ekşi sözlük klonu. Bu proje, modern web teknolojileri kullanılarak basit ama işlevsel bir sözlük/forum uygulaması örneğidir.

## 📸 Ekran Görüntüleri

### Başlangıç Ekranı
![Boş Durum](https://github.com/user-attachments/assets/70fe81d6-36ed-41b8-951b-02a79af4c05e)

### İçerik ile Görünüm
![İçerik ile](https://github.com/user-attachments/assets/9190f482-5f81-4e91-a707-d046ed5d742e)

## 🏗️ Mimari Kararlar ve Teknik Seçimler

### Backend Teknolojileri

#### **Node.js + Express.js**
- **Karar:** Hızlı prototipleme ve basit API yapısı için Express.js framework'ü seçildi.
- **Neden:** Minimal yapılandırma gerektirir, geniş topluluk desteği vardır ve JavaScript ekosistemiyle tam uyumludur.

#### **SQLite (In-Memory Database)**
- **Karar:** Veritabanı olarak bellek içi (in-memory) SQLite kullanıldı.
- **Neden:** 
  - Kolay kurulum (ekstra veritabanı sunucusu gerektirmez)
  - Geliştirme ve demo için ideal
  - İlişkisel veri yapısını destekler
- **Not:** Uygulama her yeniden başlatıldığında veriler sıfırlanır. Production ortamı için disk tabanlı SQLite veya PostgreSQL gibi alternatifler tercih edilmelidir.

### Frontend Teknolojileri

#### **Vanilla JavaScript**
- **Karar:** React, Vue gibi framework'ler yerine saf JavaScript kullanıldı.
- **Neden:**
  - Bağımlılıkları minimum seviyede tutar
  - Öğrenme eğrisi gerektirmez
  - Küçük projeler için yeterli esnekliği sağlar

#### **Modern CSS**
- **Karar:** CSS preprocessor veya CSS-in-JS yerine vanilla CSS kullanıldı.
- **Neden:** Basitlik ve sıfır derleme zamanı

### Veri Modeli

**İki ana tablo:**

1. **topics (başlıklar)**
   - `id`: Benzersiz tanımlayıcı
   - `title`: Başlık metni (unique)
   - `entry_count`: Entry sayısı
   - `last_updated`: Son güncelleme zamanı

2. **entries (entry'ler)**
   - `id`: Benzersiz tanımlayıcı
   - `topic_id`: İlişkili başlık (foreign key)
   - `content`: Entry içeriği
   - `author`: Yazar takma adı
   - `created_at`: Oluşturulma zamanı

**İlişki:** Bir başlığın birden fazla entry'si olabilir (1:N ilişki)

### API Tasarımı

**RESTful API Endpoints:**
- `GET /api/topics` - Tüm başlıkları listele
- `GET /api/topics/:id` - Belirli bir başlığı entry'leriyle birlikte getir
- `POST /api/entries` - Yeni entry oluştur (başlığı otomatik oluşturur)

**Tasarım Kararı:** Basit ve anlaşılır endpoint yapısı tercih edildi. CRUD operasyonlarının tamamı yerine sadece gerekli olanlar implement edildi.

### Güvenlik

#### **XSS Koruması**
- Frontend'de `escapeHtml()` fonksiyonu ile tüm kullanıcı girdileri temizleniyor
- HTML injection saldırılarına karşı koruma sağlanıyor

#### **Body Parser**
- JSON payload'ları güvenli şekilde parse etmek için `body-parser` middleware kullanılıyor

### UI/UX Tasarım Kararları

#### **İki Panel Layout**
- **Sol panel:** Başlık listesi ve yeni entry formu
- **Sağ panel:** Seçili başlığın entry'leri
- **Neden:** Ekşi Sözlük'ün klasik arayüzünü taklit eder, kullanıcı deneyimi tanıdık gelir

#### **Renk Paleti**
- **Ana renk:** `#53a245` (yeşil) - Ekşi Sözlük'ün ikonik yeşil rengine gönderme
- **Arka plan:** Temiz beyaz ve açık gri tonları
- **Neden:** Okunabilirliği artırır ve göze hoş gelir

#### **Türkçe Arayüz**
- Tüm arayüz elementleri Türkçe
- Tarih formatı: `GG.AA.YYYY SS:DD` (Türkiye standardı)

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın:**
   ```bash
   git clone https://github.com/ssg/sozluk-ai.git
   cd sozluk-ai
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Uygulamayı başlatın:**
   ```bash
   npm start
   ```

4. **Tarayıcınızda açın:**
   ```
   http://localhost:3000
   ```

## 📝 Kullanım

1. **Yeni Entry Eklemek:**
   - Sol panelde "başlık" alanına bir başlık girin
   - "entry girin..." alanına içeriğinizi yazın
   - "nick" alanına kullanıcı adınızı girin
   - "gönder" butonuna tıklayın

2. **Entry'leri Görüntülemek:**
   - Sol paneldeki başlık listesinden bir başlığa tıklayın
   - Sağ panelde o başlığa ait tüm entry'ler görünecektir

3. **Mevcut Başlığa Entry Eklemek:**
   - Bir başlığa tıklayın (başlık otomatik olarak form alanına gelir)
   - Yeni içeriğinizi ve nick'inizi girin
   - "gönder" butonuna tıklayın

## 🔄 Gelecek Geliştirmeler

- [ ] Kalıcı veritabanı desteği (disk tabanlı SQLite veya PostgreSQL)
- [ ] Kullanıcı kimlik doğrulama sistemi
- [ ] Entry düzenleme ve silme özellikleri
- [ ] Favori entry'leri işaretleme
- [ ] Arama fonksiyonu
- [ ] Sayfalama (pagination)
- [ ] Responsive tasarım iyileştirmeleri

## 📄 Lisans

ISC

## 👨‍💻 Katkıda Bulunma

Pull request'ler kabul edilir. Büyük değişiklikler için lütfen önce bir issue açarak ne değiştirmek istediğinizi tartışın.
