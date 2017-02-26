## Dizin Yapısı

* **actions:** İlgili verileri alır, işler ve ilgili yerlere kaydeder. Tüm işlemlerin döndüğü yerdir.
  - **tree.js:** Kullanıcı anahtarı girdikten sonra Github'a bağlanarak gerekli dosyaları alır analizini yapar ve gerekli yerlere kaydeder.
  - **documents.js** Listeleme ya da düzenleme sayfasına gidildiğinde çalıştırılır. tree.js ile oluşmuş verileri istek yapılan yola göre sınırlar, analiz eder ve sonuçları ilgili yere kaydeder.
  - **save.js** Bir belge kaydedilmek istendikten sonraki işlemlerin döndüğü yerdir.

* **reducers:** Sistem içerisinde kullanılan verilerin tutulduğu yerdir.
* **views:** Tasarımla ilgili her şey bu dizin altında bulunur.
  - **inputs:** Gerek form kısmında gerekse tablo listelemesinde değişkenlerin nasıl görüntüleneceği burada tanımlanmıştır.
  - **layouts:** Şablonlar burada bulunur.
  - **pages:** Sayfalar burada tutulur.
    * **NotFound.js:** Sayfa bulunamadığında gösterilen sayfa.
    * **login.js:** Kullanıcı anahtarının istendiği sayfa
    * **list.js:** Verilerin listelendiği sayfa
    * **edit.js:** Verilerin düzenlendiği sayfa

## Geliştirme
**NOT:** Komutlar npm ile verilmiştir ama npm yerine [yarn](https://yarnpkg.com/en/) kullanılmasını tavsiye ederim. Basitçe komutlardaki npm yazan yerleri yarn ile değiştirebilirsiniz.

Bağımlılıkları yüklemek için;
```
npm install
```

Geliştirme sırasında değişikliğin canlı takibi için;
```
npm run start
```

Ürün haline getirmek için derleme işlemi
```
npm run build
```
