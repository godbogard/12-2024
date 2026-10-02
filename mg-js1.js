(function() {
  if (window.__dacmInit) return;
  window.__dacmInit = true;

  document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.dacm-desp').forEach(panel => {

      const tabButtons = panel.querySelectorAll('.dacm-tab-btn');
      const tabPanes   = panel.querySelectorAll('.dacm-tab-pane');

      tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          tabButtons.forEach(b => b.classList.remove('dacm-active'));
          tabPanes.forEach(p => p.classList.remove('dacm-active'));
          btn.classList.add('dacm-active');
          const target = panel.querySelector('#' + btn.dataset.dacmTab);
          if (target) target.classList.add('dacm-active');
        });
      });

      const mainBg = panel.querySelector('.dacm-desp-bg1');
      const thumbs = panel.querySelectorAll('.dacm-thumb');

      thumbs.forEach(t => {
        const url = t.dataset.dacmFull;
        if (url) t.style.backgroundImage = `url(${url})`;
      });

      const initialThumb = panel.querySelector('.dacm-thumb.dacm-active') ||
                           panel.querySelector('.dacm-thumb');
      if (mainBg && initialThumb) {
        const initialUrl = initialThumb.dataset.dacmFull;
        if (initialUrl) mainBg.style.backgroundImage = `url(${initialUrl})`;
      }

      thumbs.forEach(thumb => {
        thumb.addEventListener('click', (e) => {
          e.stopPropagation();
          thumbs.forEach(t => t.classList.remove('dacm-active'));
          thumb.classList.add('dacm-active');

          const newImg = thumb.dataset.dacmFull;
          if (mainBg && newImg) {
            mainBg.style.backgroundImage = `url(${newImg})`;
          }
        });
      });

      let activeTooltip = null;

      thumbs.forEach(thumb => {
        const descSource = thumb.querySelector('.dacm-thumb-desc');
        const descHTML = descSource ? descSource.innerHTML : '';
        if (!descHTML) return;

        descSource.style.display = 'none';

        thumb.addEventListener('mouseenter', () => {
          if (activeTooltip) {
            activeTooltip.remove();
            activeTooltip = null;
          }

          const tip = document.createElement('div');
          tip.className = 'dacm-tooltip-float';
          tip.innerHTML = descHTML;
          document.body.appendChild(tip);
          activeTooltip = tip;

          const rect = thumb.getBoundingClientRect();
          const tipRect = tip.getBoundingClientRect();

          let left = rect.left + (rect.width / 2) - (tipRect.width / 2);
          let top  = rect.top - tipRect.height - 10;

          if (top < 5) top = rect.bottom + 10;
          if (left < 5) left = 5;
          if (left + tipRect.width > window.innerWidth - 5) {
            left = window.innerWidth - tipRect.width - 5;
          }

          tip.style.left = left + 'px';
          tip.style.top  = top + 'px';

          requestAnimationFrame(() => {
            tip.style.opacity = '1';
            tip.style.transform = 'translateY(0)';
          });
        });

        thumb.addEventListener('mouseleave', () => {
          if (activeTooltip) {
            const t = activeTooltip;
            t.style.opacity = '0';
            t.style.transform = 'translateY(4px)';
            setTimeout(() => t.remove(), 250);
            activeTooltip = null;
          }
        });
      });

      if (panel.closest('.quote, blockquote, .citation')) return;

      const CREDIT_URL = 'https://chamber-of-mysteries.foroactivo.com/u9';
      let credit = panel.querySelector('a.dml-cr');

      if (!credit) {
        credit = document.createElement('a');
        credit.className = 'dml-cr';
        const creditsBox = panel.querySelector('.dacm-cr');
        (creditsBox || panel).appendChild(credit);
      }

      credit.href = CREDIT_URL;
      credit.target = '_blank';
      credit.rel = 'noopener noreferrer';
      credit.setAttribute('aria-label', 'Créditos');
    });

  });
})();
