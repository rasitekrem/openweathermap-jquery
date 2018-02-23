$(document).ready(function() {

  // 30 dakikada bir sayfayı yenileyerek bilgilerin
  //otomatik olarak güncellenmesini sağlıyoruz
  setInterval(function() {
    window.location.reload();
  }, 1000 * 60 * 30);

  //Girilen şehir bilgilerini cookilerde tutuyoruz
  //Bu yüzden öncelikle cookileri kontrol edip önceden
  //eklenmiş olan şehirlerimize ulaşıyoruz
  if ($.cookie('weather')) {
    var sehirler = $.cookie('weather').split(',');
    $.each(sehirler, function(index, value) {
      $.apiIslem(value, 0);
    });
  }

  //Enter tuşuna basılınca da buttona tıklanmış gibi olsun
  $(document).keypress(function(e) {
    if (e.which == 13) {
      $("#add").click();
    }
  });

  //Buttona tıklama işlemi olduğunda text boxtaki veriyi alıyoruz
  $("#add").click(function() {
    var sehir = $('#sehir').val().toUpperCase(); //kOnya Konya konya gibi tekrarların olmaması için sabit bir düzene sokuyoruz.
    $.ekle(sehir);
  });
  var veriSayisi = 0; //1 sayfada gösterilmesi gereken şehir sayısını 2 farklı yerde kullanmak için burada tanımladık.

  //Sayfalama işlemini burada yapıyoruz.
  $.sayfalama = function() {
    var toplamLi = $("ul#list li").length; // Eklenen şehirler liste halinde bulunduğu için listedeki eleman sayısı alıyoruz
    veriSayisi = 5; //Sayfalama yaparken bir sayfada kaç eleman bulunduracaksak buradan ayarlıyoruz.
    $("ul#list li:gt(" + (veriSayisi - 1) + ")").hide(); //öncelikle sayfa açıldığında 1. sayfada olacağımız için diğer sayfada bulunacakları gizliyoruz.
    var sayfaSayisi = Math.ceil(toplamLi / veriSayisi); //ceil fonksiyonu 5.1 gibi bir sayıyı 6'ya yuvarlıyor bu yüzden bunu kullandım.
    $('#sayfalama').empty(); //veri ekledikçe burası değişeceği için eski verileri temizliyoruz
    for (var i = 1; i <= sayfaSayisi; i++) {
      $('#sayfalama').append('<li><a href="javascript:void(0)">' + i + '</a></li>'); //burada ise yeni sayfa numaralarını ekliyoruz
    }
    $('#sayfalama li:first').addClass('active'); //1. sayfa numarasını aktif hale getiriyoruz
  }
  //sayfalama id'sinin içerisindeki a tagından click bekliyoruz.
  //Başta sayfa boşken bu yok. Sonradan eklediğimiz için bu yöntemi kullandık.
  $('#sayfalama').on("click", "a", function() {
    var indis = $(this).parent().index() + 1; //tıklanan a tagının parentı liste itemi olduğu için parentının indexini aldık.
    var gt = veriSayisi * indis; //nereye kadar gizleneceğini buluyoruz.
    $("#sayfalama li").removeClass("active"); //sayfa numaralarındaki aktif olanın classını siliyoruz.
    $(this).parent().addClass("active"); //seçilen sayfa numarasını aktif hale getiriyoruz.
    $("ul#list li").hide(); //tüm liste itemlarını gizliyoruz
    for (var i = gt - veriSayisi; i < gt; i++) { //gösterilmesini istediğimiz liste itemlerini gösteriyoruz.
      $("ul#list li:eq(" + i + ")").show();
    }
  });

  //list id'sinini içerisindkei delete id'sine sahib buttondan tıklama bekliyoruz.
  //ilk başta veri olmadığı için sil butonu bulunmuyor
  //bu yüzden bu yöntemi kullandık
  $("#list").on("click", "#delete", function() {
    var sehir = $(this).parents()[1].id; //sil butonunun parentlarınıdan 1. indisinde liste elemanı bulunuyor.
    $(this).parents()[1].remove(); //id'sinde şehir adı bulunmakta. Burda listeden siliyoruz.
    var str = $.cookie('weather'); //cookie'yi çekiyoruz
    str = str.replace(',' + sehir, ""); //sehirden önce virgül olabileceği için bunu kullandık
    str = str.replace(sehir, ""); //ilk ya da tek elemansa bu yöntem olacaktır
    $.cookie('weather', str); //cookieyi güncelledik
    $("#alert").html("<div class='alert alert-info' role='alert'>Şehir Silindi</div>");
  });
});

//burada ekleme işlemimize ön hazırlık yapıyoruz.
$.ekle = function(sehir) {
  if ($.cookie('weather')) { //öncelikle cookie var mı yok mu kontrol ediyoruz
    if ($.cookie('weather').indexOf(sehir) == -1) { //cookie varsa cookienin içerisinde bizim değerimiz var mı bakıyoruz.
      $.cookie('weather', $.cookie('weather') + "," + sehir); //yoksa sehri ekliyoruz
    } else {
      $("#alert").html("<div class='alert alert-warning' role='alert'>Şehir Daha Önce Eklendi</div>");
      $('#sehir').val("");
      return; //sehir varsa ekleme işlemi yapmıyoruz
    }
  } else {
    $.cookie('weather', sehir); //cookiede yoksa doğrudan cookieye atıyoruz
  }
  $.apiIslem(sehir, 1); //cookiden gönderim için 0 ekleme yapmak için kontrol mekanizmasını 1 kullandık.
}

//Ekranda gösterme işlemini burada yapıyoruz.
//Gelen verilerden listeyi elemanını oluşturuyoruz
$.apiIslem = function(sehir, islem) {
  var apiId = "0f6cf3a1e34e42120c0c3b27b771176f"; //openweathermap sitesinden API alıyoruz.
  var lang = "tr"; // dil seçeneklerinde bulunan dilleri kullanabiliyoruz.
  //API ile sorgumuzu yapıyoruz. json verisi dönüyor bize.
  $.getJSON("http://api.openweathermap.org/data/2.5/weather?q=" + sehir + "&mode=json&units=metric&cnt=10&APPID=" + apiId + "&lang=" + lang, function(result) {
      var cevap = "<li id='" + sehir + "' class='list-group-item' >";
      cevap += " <h2>" + result.name.toUpperCase() + "</h2>";
      cevap += " " + result.weather[0].description.toUpperCase();
      cevap += "  <h3>" + result.main.temp.toFixed(0) + "&deg;"; //toFixed yapma sebebim float değerler dönmesiydi.
      cevap += " <img src='http://openweathermap.org/img/w/" + result.weather[0].icon + ".png'</h3>"; //json verisinde png ismi geliyor. bu sorguyla hava durumu görselini alıyoruz
      cevap += " <br><button type='submit' id='delete' class='btn btn-danger'><i class='glyphicon glyphicon-trash pull-left'></i><span>Sil</span> </button>";
      cevap += "</li>";
      $('#sehir').val("");
      $("#list").prepend(cevap); //listenin hep başına ekleme yapıyoruz. son eklediğimiz ilk gözüküyor
      $.sayfalama(); //her ekleme sonrası sayfalama işlemini yapıyoruz ki sayfalama işlemi güncel kalsın
      if (islem == 1) { //ekleme yapıldıysa
        $("#alert").html("<div class='alert alert-success' role='alert'>Şehir Eklendi</div>");
      } else { //cookiden veri çekildiyse
        $("#alert").html("<div class='alert alert-success' role='alert'>Şehirler Listelendi</div>");
      }
    })
    .fail(function() { //işlem başarısız olursa buraya giriyoruz.
      var str = $.cookie('weather'); //cookieyi önceden eklediğimiz için cookieden siliyoruz
      var str = str.replace(',' + sehir, "");
      var str = str.replace(sehir, "");
      $.cookie('weather', str);
      $('#sehir').val("");
      $("#alert").html("<div class='alert alert-danger' role='alert'>Şehir Bulunamadı</div>");
    });
}
