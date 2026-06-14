/* 明航寺 — 共用互動 */
(function () {
  // 行動選單
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () { links.classList.toggle('open'); });
  }

  // 捲動揭示
  var rvls = document.querySelectorAll('.rvl');
  if ('IntersectionObserver' in window && rvls.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    rvls.forEach(function (el) { io.observe(el); });
  } else {
    rvls.forEach(function (el) { el.classList.add('in'); });
  }

  // 燈箱
  var lb = document.querySelector('.lb');
  if (lb) {
    var lbImg = lb.querySelector('img');
    document.querySelectorAll('[data-lb]').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        lbImg.src = a.getAttribute('href') || a.getAttribute('data-lb');
        lb.classList.add('open');
      });
    });
    function close() { lb.classList.remove('open'); lbImg.src = ''; }
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'BUTTON') close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  // 法會狀態：依今日國曆自動標記
  var rows = document.querySelectorAll('tr[data-start]');
  if (rows.length) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    rows.forEach(function (tr) {
      var s = new Date(tr.getAttribute('data-start') + 'T00:00:00');
      var e = new Date((tr.getAttribute('data-end') || tr.getAttribute('data-start')) + 'T00:00:00');
      var cell = tr.querySelector('.status');
      if (!cell) return;
      var b = document.createElement('span');
      b.className = 'badge';
      if (today > e) { b.className += ' done'; b.textContent = '已圓滿'; }
      else if (today >= s && today <= e) { b.className += ' now'; b.textContent = '進行中'; }
      else { b.className += ' up'; b.textContent = '即將舉行'; }
      cell.innerHTML = ''; cell.appendChild(b);
    });
    // 標記下一場
    var next = null;
    rows.forEach(function (tr) {
      if (next) return;
      var s = new Date(tr.getAttribute('data-start') + 'T00:00:00');
      if (s >= today) next = tr;
    });
    if (next) next.classList.add('is-next');
  }
})();
