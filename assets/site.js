(function () {
  var LANG = localStorage.getItem('lang') || 'hi';

  function applyLang() {
    document.querySelectorAll('[data-hi]').forEach(function (el) {
      var t = LANG === 'hi' ? el.dataset.hi : el.dataset.en;
      if (t) el.textContent = t;
    });
    var btn = document.getElementById('lang');
    if (btn) btn.textContent = LANG === 'hi' ? 'English' : 'हिंदी';
    document.documentElement.lang = LANG;
  }

  var btn = document.getElementById('lang');
  if (btn) btn.addEventListener('click', function () {
    LANG = LANG === 'hi' ? 'en' : 'hi';
    localStorage.setItem('lang', LANG);
    applyLang();
  });

  // Copy an RTI application to the clipboard.
  document.querySelectorAll('.copybtn').forEach(function (b) {
    b.addEventListener('click', function () {
      var items = b.parentElement.querySelectorAll('ol li');
      var text = Array.prototype.map.call(items, function (li, i) {
        return (i + 1) + '. ' + li.textContent;
      }).join('\n');
      navigator.clipboard.writeText(text).then(function () {
        b.textContent = LANG === 'hi' ? 'कॉपी हो गया ✓' : 'Copied ✓';
        setTimeout(function () {
          b.textContent = LANG === 'hi' ? 'आवेदन कॉपी करें' : 'Copy application';
        }, 2000);
      });
    });
  });

  // Search — filters already-rendered content. No network, works offline.
  var search = document.getElementById('q-search');
  if (search) {
    search.addEventListener('input', function () {
      var term = search.value.trim().toLowerCase();
      var show = function (el, hay) {
        el.classList.toggle('hidden', term !== '' && hay.indexOf(term) === -1);
      };

      // question cards (homepage, theme pages)
      document.querySelectorAll('#qlist .q').forEach(function (card) {
        var p = card.querySelector('.qtext');
        show(card, ((p.dataset.hi || '') + ' ' + (p.dataset.en || '') + ' ' +
                    card.textContent).toLowerCase());
      });

      // seat rows (constituency index) — hide the district block when it empties
      document.querySelectorAll('#qlist table.seat').forEach(function (tbl) {
        var visible = 0;
        tbl.querySelectorAll('tr').forEach(function (tr, i) {
          if (i === 0) return;               // header row always stays
          show(tr, tr.textContent.toLowerCase());
          if (!tr.classList.contains('hidden')) visible++;
        });
        var block = tbl.closest('.scroll');
        if (block) {
          block.classList.toggle('hidden', visible === 0);
          var h = block.previousElementSibling;   // the district heading
          if (h && h.tagName === 'H2') h.classList.toggle('hidden', visible === 0);
        }
      });
    });
  }

  applyLang();
})();
