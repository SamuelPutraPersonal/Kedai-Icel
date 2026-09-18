// WhatsApp link setup
  var waNumber = "6281379531206"; // 0813-7953-1206 in international format
  var waMessage = encodeURIComponent("Halo Kedai Icel, saya mau tanya-tanya soal menu catering 🙂");
  var waLink = "https://wa.me/" + waNumber + "?text=" + waMessage;
  document.querySelectorAll('.hero-wa-btn, #nav-wa-btn, #float-wa').forEach(function(el){
    el.setAttribute('href', waLink);
  });

  // Menu tabs
  var tabs = document.querySelectorAll('.menu-tab');
  var panels = document.querySelectorAll('.menu-panel');
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){ t.classList.remove('active'); });
      panels.forEach(function(p){ p.classList.remove('active'); });
      tab.classList.add('active');
      document.querySelector('.menu-panel[data-panel="' + tab.dataset.tab + '"]').classList.add('active');
    });
  });