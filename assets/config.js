/* ============================================================
   AYARLAR — HER MUSTERI ICIN SADECE BU DOSYAYI DEGISTIR
   • whatsapp : ulke kodlu, sadece rakam (90...)
   • bank     : Havale/EFT icin banka + IBAN + hesap sahibi
   • products : img = "assets/xxx.jpg" ya da bos (sik yer tutucu)
   ============================================================ */
const CONFIG = {
  brand:"İZMİT SPOR", brandSub:"Giyim · 41", fullName:"İZMİT SPOR GİYİM 41",
  accent:"#e11d2a",
  heroEyebrow:"İzmit · Kocaeli",
  heroTitle:"İzmit'in en uygun<br>giyim adresi.",
  heroText:"Güncel modeller, uygun fiyat. Online sipariş ver, güvenle kapına gelsin.",
  heroImg:"assets/u-02.jpg",
  heroMeta:[["26B+","Takipçi"],["1-3 gün","Kargo"],["%100","Güvenli"]],
  bannerEy:"Fırsat", bannerTitle:"Yeni sezon kampanyası", bannerText:"Seçili ürünlerde uygun fiyat fırsatı. Stoklarla sınırlı.",
  about:"İzmit'in en uygun giyim mağazası. Güncel modeller için takipte kalın. Sipariş ve sorularınız için WhatsApp'tan ulaşın.",
  whatsapp:"905387199516", instagram:"izmitspor.41", phone:"0538 719 95 16",
  currency:"₺",
  shipping:{fee:49, freeOver:750},
  bank:{name:"Banka Adı", iban:"TR00 0000 0000 0000 0000 0000 00", holder:"İzmit Spor Giyim 41"},
  categories:["Tümü","Sweatshirt","Kazak"],
  products:[
    {id:1,name:"Basic Sweatshirt",category:"Sweatshirt",price:349,img:"assets/u-01.jpg",sizes:["S","M","L","XL"],desc:"Şardonlu iç dokulu, sıcak tutan düz kesim sweatshirt. Günlük kullanıma ideal.",fabric:"Pamuk / Polyester",fit:"Regular"},
    {id:2,name:"Örme Triko Kazak",category:"Kazak",price:549,img:"assets/u-02.jpg",sizes:["S","M","L","XL"],desc:"Burgu örgü detaylı, yumuşak dokulu triko kazak. Şık ve rahat.",fabric:"Akrilik / Pamuk",fit:"Regular"},
    {id:3,name:"Oversize Kapüşonlu",category:"Sweatshirt",price:449,img:"assets/u-03.jpg",sizes:["S","M","L","XL"],desc:"Salaş kesim kapüşonlu sweatshirt. Geniş kalıp, sokak stili.",fabric:"Pamuk / Polyester",fit:"Oversize"},
    {id:4,name:"Yarım Fermuar Sweatshirt",category:"Sweatshirt",price:399,img:"assets/u-04.jpg",sizes:["S","M","L","XL"],desc:"Polo yaka, yarım fermuar detaylı sweatshirt. Spor şık kombinler için.",fabric:"Pamuk / Polyester",fit:"Regular"},
    {id:5,name:"Fermuarlı Triko Kazak",category:"Kazak",price:579,img:"assets/u-05.jpg",sizes:["S","M","L","XL"],desc:"Dik yaka yarım fermuarlı burgu triko. Kışlık, sıcak tutar.",fabric:"Akrilik / Pamuk",fit:"Regular"}
  ]
};
