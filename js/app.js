$(document).ready(function() {
  setInterval(function() {
    window.location.reload();
  }, 1000 * 60 * 30);
  if ($.cookie('weather')) {
    var sehirler = $.cookie('weather').split(',');
    $.each(sehirler, function(index, value) {
      $.apiIslem(value, 0);
    });
  }

  $(document).keypress(function(e) {
    if (e.which == 13) {
      $("#add").click();
    }
  });

  $("#add").click(function() {
    var sehir = $('#sehir').val();
    $.ekle(sehir);
  });
  var veriSayisi = 0;
  $.sayfalama = function() {
    var toplamLi = $("ul#list li").length;
    veriSayisi = 5;
    $("ul#list li:gt(" + (veriSayisi - 1) + ")").hide();
    var sayfaSayisi = Math.ceil(toplamLi / veriSayisi);
    $('#sayfalama').empty();
    for (var i = 1; i <= sayfaSayisi; i++) {
      $('#sayfalama').append('<li><a href="javascript:void(0)">' + i + '</a></li>')
    }
    $('#sayfalama li:first').addClass('active');
  }
  $('#sayfalama').on("click", "a", function() {
    var indis = $(this).parent().index() + 1;
    var gt = veriSayisi * indis;
    //console.log(veriSayisi);
    $("#sayfalama li").removeClass("active");
    $(this).parent().addClass("active");
    $("ul#list li").hide();
    for (var i = gt - veriSayisi; i < gt; i++) {
      $("ul#list li:eq(" + i + ")").show();
    }
  });
  $("#list").on("click", "#delete", function() {
    console.log("silindi");
    var sehir = $(this).parents()[1].id;
    $(this).parents()[1].remove();
    var str = $.cookie('weather');
    str = str.replace(',' + sehir, "");
    str = str.replace(sehir, "");
    $.cookie('weather', str);
    $("#alert").html("<div class='alert alert-info' role='alert'>Şehir Silindi</div>");
  });
});
$.ekle = function(sehir) {
  if ($.cookie('weather')) {
    if ($.cookie('weather').indexOf(sehir) == -1) {
      $.cookie('weather', $.cookie('weather') + "," + sehir);
    } else {
      $("#alert").html("<div class='alert alert-warning' role='alert'>Şehir Daha Önce Eklendi</div>");
      $('#sehir').val("");
      return;
    }
  } else {
    $.cookie('weather', sehir);
  }
  $.apiIslem(sehir, 1);
}
$.apiIslem = function(sehir, islem) {
  var apiId = "0f6cf3a1e34e42120c0c3b27b771176f";
  var lang = "tr";
  $.getJSON("http://api.openweathermap.org/data/2.5/weather?q=" + sehir + "&mode=json&units=metric&cnt=10&APPID=" + apiId + "&lang=" + lang, function(result) {
      var cevap = "<li id='" + sehir + "' class='list-group-item' >";
      cevap += " <h2>" + result.name.toUpperCase() + "</h2>";
      cevap += " " + result.weather[0].description.toUpperCase();
      cevap += "  <h3>" + result.main.temp.toFixed(0) + "&deg;";
      cevap += " <img src='http://openweathermap.org/img/w/" + result.weather[0].icon + ".png'</h3>";
      cevap += " <br><button type='submit' id='delete' class='btn btn-danger'><i class='glyphicon glyphicon-trash pull-left'></i><span>Sil</span> </button>";
      cevap += "</li>";
      $('#sehir').val("");
      $("#list").prepend(cevap);
      $.sayfalama();
      if (islem == 1) {
        $("#alert").html("<div class='alert alert-success' role='alert'>Şehir Eklendi</div>");
      } else {
        $("#alert").html("<div class='alert alert-success' role='alert'>Şehirler Listelendi</div>");
      }
    })
    .fail(function() {
      var str = $.cookie('weather');
      var str = str.replace(',' + sehir, "");
      var str = str.replace(sehir, "");
      $.cookie('weather', str);
      $('#sehir').val("");
      $("#alert").html("<div class='alert alert-danger' role='alert'>Şehir Bulunamadı</div>");
    });
}
