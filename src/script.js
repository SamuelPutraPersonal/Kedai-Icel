(function () {
  // ---- WhatsApp link setup ----
  var waNumber = "6281379531206"; // 0813-7953-1206 in international format
  var waMessage = encodeURIComponent("Halo Kedai Icel, saya mau tanya-tanya soal menu catering 🙂");
  var waLink = "https://wa.me/" + waNumber + "?text=" + waMessage;
  document.querySelectorAll('.hero-wa-btn, #nav-wa-btn, #float-wa').forEach(function (el) {
    el.setAttribute('href', waLink);
  });

  // ---- Menu category filters (fade transition, see .menu-item / .is-hidden in style.css) ----
  var filterButtons = document.querySelectorAll('.menu-filter');
  var menuItems = document.querySelectorAll('.menu-item');
  var FADE_MS = 250;

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.dataset.filter;
      menuItems.forEach(function (item) {
        var match = filter === 'semua' || item.dataset.category === filter;
        if (match) {
          item.style.display = '';
          requestAnimationFrame(function () { item.classList.remove('is-hidden'); });
        } else {
          item.classList.add('is-hidden');
          setTimeout(function () {
            if (item.classList.contains('is-hidden')) item.style.display = 'none';
          }, FADE_MS);
        }
      });
    });
  });

  // ---- WhatsApp quote builder ----
  var quoteModal = document.getElementById('quote-modal');
  var quoteDishesEl = document.getElementById('quote-dishes');
  var quoteForm = document.getElementById('quote-form');
  var quoteError = document.getElementById('quote-error');
  var openQuoteBtn = document.getElementById('open-quote-btn');
  var closeQuoteBtn = document.getElementById('quote-modal-close');
  var selectButtons = document.querySelectorAll('.menu-select-btn');

  // Build the dish checklist once, from every "+ Pilih Menu" button on the page
  // (single source of truth: dish names live on .menu-select-btn[data-dish]).
  var dishNames = [];
  selectButtons.forEach(function (btn) {
    var name = btn.dataset.dish;
    if (dishNames.indexOf(name) === -1) dishNames.push(name);
  });
  dishNames.forEach(function (name, i) {
    var row = document.createElement('label');
    row.className = 'quote-dish-row';
    row.innerHTML =
      '<input type="checkbox" class="quote-dish-check" value="' + name + '">' +
      '<span class="quote-dish-name">' + name + '</span>' +
      '<input type="number" min="1" value="1" class="quote-dish-qty" id="quote-qty-' + i + '" disabled>';
    quoteDishesEl.appendChild(row);
  });

  function rowForDish(name) {
    var rows = quoteDishesEl.querySelectorAll('.quote-dish-row');
    for (var i = 0; i < rows.length; i++) {
      var check = rows[i].querySelector('.quote-dish-check');
      if (check && check.value === name) return rows[i];
    }
    return null;
  }

  function syncCardButtons(name, selected) {
    selectButtons.forEach(function (btn) {
      if (btn.dataset.dish === name) {
        btn.classList.toggle('selected', selected);
        btn.textContent = selected ? '✓ Dipilih' : '+ Pilih Menu';
      }
    });
  }

  function setDishSelected(name, selected) {
    var row = rowForDish(name);
    if (!row) return;
    var check = row.querySelector('.quote-dish-check');
    var qty = row.querySelector('.quote-dish-qty');
    check.checked = selected;
    qty.disabled = !selected;
    syncCardButtons(name, selected);
  }

  function openQuoteModal() {
    quoteModal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeQuoteModal() {
    quoteModal.hidden = true;
    document.body.style.overflow = '';
  }

  // Checkbox <-> card button two-way sync
  quoteDishesEl.querySelectorAll('.quote-dish-check').forEach(function (check) {
    check.addEventListener('change', function () {
      var qty = check.closest('.quote-dish-row').querySelector('.quote-dish-qty');
      qty.disabled = !check.checked;
      if (check.checked) qty.focus();
      syncCardButtons(check.value, check.checked);
    });
  });

  // "+ Pilih Menu" on a food card selects that dish and opens the quote form
  selectButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var name = btn.dataset.dish;
      var willSelect = !btn.classList.contains('selected');
      setDishSelected(name, willSelect);
      if (willSelect) openQuoteModal();
    });
  });

  openQuoteBtn.addEventListener('click', openQuoteModal);
  closeQuoteBtn.addEventListener('click', closeQuoteModal);
  quoteModal.addEventListener('click', function (e) {
    if (e.target === quoteModal) closeQuoteModal();
  });

  var monthNamesID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  function formatDateID(isoStr) {
    if (!isoStr) return '';
    var parts = isoStr.split('-');
    var day = parseInt(parts[2], 10);
    var month = monthNamesID[parseInt(parts[1], 10) - 1];
    return day + ' ' + month + ' ' + parts[0];
  }

  quoteForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var checkedBoxes = quoteDishesEl.querySelectorAll('.quote-dish-check:checked');
    if (checkedBoxes.length === 0) {
      quoteError.hidden = false;
      return;
    }
    quoteError.hidden = true;

    var lines = [];
    checkedBoxes.forEach(function (check) {
      var qty = check.closest('.quote-dish-row').querySelector('.quote-dish-qty').value || '1';
      lines.push('- ' + check.value + ' x' + qty);
    });

    var date = document.getElementById('quote-date').value;
    var address = document.getElementById('quote-address').value.trim();
    var notes = document.getElementById('quote-notes').value.trim();

    var msg = 'Halo Kedai Icel, saya ingin minta penawaran harga untuk:\n' + lines.join('\n') + '\n';
    if (date) msg += '\nTanggal acara: ' + formatDateID(date);
    if (address) msg += '\nAlamat kirim: ' + address;
    if (notes) msg += '\nCatatan: ' + notes;
    msg += '\n\nMohon info harga & ketersediaannya. Terima kasih!';

    window.open('https://wa.me/' + waNumber + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    closeQuoteModal();
  });

  // ---- Image lightbox ----
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.lightbox-trigger').forEach(function (img) {
    img.addEventListener('click', function () {
      openLightbox(img.src, img.alt);
    });
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!quoteModal.hidden) closeQuoteModal();
    if (!lightbox.hidden) closeLightbox();
  });
})();
