# AdminJS
Github gibi web tabanlı depolama servisleri üzerinde bulunan dosyaların ilişkisel olarak yönetilmesini sağlayan yönetim panelidir.

* **Kolay Kullanım**
Kullanmak için bir şeyler indirip yüklemeniz gerekmez, direk tarayıcı üzerinden çalışır.

* **Güvenli** 
Tamamı tarayıcı üzerinde çalışır ve tüm iletişim sadece depolama servisi ile tarayıcınız arasındadır. Kodların tamamı açıktır.

* **İlişkisel**
Dosyaların içerisinde üst kısmında dosya ile ilgili bir takım özellikler yazılı olabilir. Sistem, tüm dosyaları tarayarak listeleme ekranında ortak özellikleri gösterir. Ekleme anında ise bu ortak özelliklerin belirtilmesini ister. Eğer bir dosyanın oluşması için başka dosyaların da oluşması, düzenlenmesi gerekiyorsa bunları toplu olarak gerçekleştirir.

* **Düzenleyici**
Dosya türüne bağlı olarak dosya içeriğini renklendirir ve hatalı yazımları belirtir.

* **Eş Zamanlı Çalışmaz**
Çoğu işlem birbirinden bağımsız çalışır. Örneğin ilk yüklenme esnasında bir dosya tarayıcı hafızasından okunurken başka bir dosya onu beklemeden depolama servisinden indirilmeye başlanabilir. Ya da siz değişiklikleri depolama servisine gönder dediğinizde bu işlem arka planda gerçekleşirken siz sistemi kullanmaya devam edebilirsiniz ve işlemin tamamlanmasını beklemezsiniz.

## Kullanım
* **Anahtar oluşturma:** https://github.com/settings/tokens
Verilen bağlantıdan giriş için anahtar oluşturun. Anahtar oluştururken izinler kısmında sadece "public_repo" seçeneğini işaretleyin. Eğer test amaçlı kullanacaksanız hiçbir kutucuğu işaretlemeniz gerekmez.

* **Demo:** <https://bugra9.github.io/adminjs/>
Verilen bağlantı ile karalama yaptığımız depoyu yönetebilirsiniz.

* **Kendi projende kullanma:**
Bu depoyu çatallayın ve `docs/index.html` ile `public/index.html` dosyalarında `window.repo=".."` kısmını `window.repo="kullanıcıAdı/depo/dal"` şeklinde kendinize göre düzenleyin. Daha sonra `https://kullanıcıAdı.github.io/adminjs/` bağlantısı ile dosyalarınızı yönetmeye başlayabilirsiniz.

## Ekran Görüntüleri

<img src="https://s8.postimg.org/jmitwuuol/adminjs_ana_Dizin.png" width="49%" />
<img src="https://s8.postimg.org/czw63od05/adminjs_list.png" width="49%" />
<img src="https://s8.postimg.org/dzmgzds5x/adminjs_edit.png" width="40%" />
<img src="https://s8.postimg.org/eqf755uj9/adminjs_edit2.png" width="40%" />
<img src="https://s8.postimg.org/odipevnit/adminjs_resim_Ekleme.png" width="18%" />

## Gerçekler
Her ne kadar sistem yukarıdaki özellikleri karşılamayı amaçlasa da şu an en temel özellikleri geliştirilme aşamasında olduğu için amacından sapabilir. Bu sapmalar şunlardır;

* Sistem sadece Github ile çalışmak üzere ayarlıdır.
* Sistem sadece Jekyll statik site oluşturucusu ile çalışması için ayarlıdır.
* Sistem en hatasız şekilde [SudoPortal](https://github.com/ubuntu-tr/ubuntu-tr.github.io) veya çatalları ile çalışabilir. Diğer sistemlerde sorunlar çıkar.

Kararlı ve tertemiz bir sistem kullanmak istiyor ama bulut tabanlı ve ilişkisel olmasa da olur diyorsanız vakit kaybetmeden aşağıdaki projeye bakın derim. Hatta ne olursa olsun bakın, bir şey kaybetmezsiniz ve çok şey kazanırsınız. :)
https://github.com/jekyll/jekyll-admin


## Yol Haritası
### Temel
- [x] Giriş ekranı
- [x] Verilerin Github üzerinden alınması
- [x] Alınan verilerin analiz edilerek gerekli biçimlere dönüştürülmesi
- [x] Belgelerin listelenmesi
- [x] Dizinlerin ve dosyaların listelenmesi
- [x] Belgelerin düzenlenmesi
- [x] Giriş yapılarının tanımlanması
- [x] Editörün yapılandırılması
- [x] Hızlı Ekleme (Örneğin makale eklerken sayfa değişmeden yeni etiket eklenebilmesi)
- [x] Belgenin kaydedilmesi
- [x] Yeni belge oluşturma
- [x] Dosya yükleme
- [x] Eğer bir dizin altında ayar dosyası bulunuyorsa bunun okunup yorumlanması
- [x] İlgili kayıtların Github'a gönderilmesi (commit)
- [ ] "Commit" kayıtlarının "Pull Request" ile gönderilmesi

### Detaylı
- [ ] Dosyaların Github üzerinden alınma sırasında durum çubuğundaki değişimin daha kararlı hale getirilmesi
- [ ] Giriş yapılarının çoğaltılması
- [ ] Hızlandırma işlemleri
- [ ] Testlerin eklenmesi
- [ ] İstatistik sayfasının eklenmesi
- [ ] Github gibi diğer servislerin desteklenmesi
- [ ] Jekyll gibi diğer sistemlerin desteklenmesi
- [ ] [SudoPortal](https://github.com/ubuntu-tr/ubuntu-tr.github.io) gibi diğer sistemlerin desteklenmesi

## Kaynaklar
### Karalama
Bu çalışma için aşağıdaki depolarda karalama çalışmaları yapılmıştır. Buradaki çalışmalar react üzerine sistemli bir şekilde giydirilerek bu proje ortaya çıkmıştır.

https://github.com/bugra9/adminJS-core  
https://github.com/bugra9/JekyllAdminJS

### Kullanılan temel bileşenler
* https://facebook.github.io/react/docs/
* http://redux.js.org/
* http://react.semantic-ui.com/introduction
* https://localforage.github.io/localForage/

### Kullanılan diğer bileşenler
* https://github.com/ReactTraining/react-router
* https://github.com/NextStepWebs/simplemde-markdown-editor
* https://github.com/ajaxorg/ace

### Bu projeye yön veren projeler
* https://github.com/jekyll/jekyll-admin
* https://github.com/jekyll/jekyll
* [SudoPortal](https://github.com/ubuntu-tr/ubuntu-tr.github.io)
