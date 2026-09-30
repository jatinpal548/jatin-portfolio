/* Runs before first paint: apply saved/system theme and set up the Vercel Analytics queue.
   Kept as a tiny external file so the Content-Security-Policy can forbid inline scripts. */
(function () {
  try {
    var t = localStorage.getItem('jp-theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
})();
