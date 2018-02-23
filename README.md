#openweathermap-jquery

##Openweathermap 
	```
	API kullanarak jquery ile json verisini alıp sayfaya işliyoruz
	Şehir bilgilerini cookielerde saklıyoruz ki yeniden girildiğinde veriler kaybolmasın
	jquery ile cookie yönetimi yapabilmek için jquery-cookie kütüphanesini kullandım.
	https://github.com/carhartl/jquery-cookie
	```
##İşleyiş
	```
	Öncelikle text boxtan şehrimizi giriyoruz. Veri cookielere ekleniyor. Ardından liste
	halinde API'dan gelen veriler listeleniyor. Sayfalama ise sayfa başı 5 şehir olmak üzere
	her şehir eklendiğinde düzenleniyor. Silme işleminde ise liste itemlerin id'lerinde 
	şehir isimleri bulunuyor. Buradan id'yi çekerek hem cookiden hem de ekrandan siliyoruz.
	```

##Neler Kullandım
	```
	Bootstrap, Javascript/jQuery , openweathermap API
	```
