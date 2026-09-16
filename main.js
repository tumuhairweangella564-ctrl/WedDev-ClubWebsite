/* ==========================================================================
   Web Dev Club — shared script
   Loaded by all seven pages. Each function checks whether the element it
   needs exists, so one file can safely run everywhere.
   ========================================================================== */

/* --- Mobile navigation -------------------------------------------------- */
function initNav() {
  var toggle = document.querySelector('.nav__toggle');
  var links  = document.querySelector('.nav__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close the menu when a link is chosen, so the page isn't hidden behind it.
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* --- Mark the current page in the navbar --------------------------------
   Compares each link's filename to the one in the address bar, so no page
   has to hard-code its own active state.                                   */
function markCurrentPage() {
  var here = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    if (a.getAttribute('href') === here) {
      a.classList.add('is-current');
      a.setAttribute('aria-current', 'page');
    }
  });
}

/* --- Date helpers ------------------------------------------------------- */
var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function splitDate(iso) {
  var d = new Date(iso + 'T00:00:00');
  return { day: d.getDate(), month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

function byDateAscending(a, b) { return new Date(a.date) - new Date(b.date); }

/* --- Events -------------------------------------------------------------
   Renders into any element with [data-events]. The attribute value chooses
   which set to show: "upcoming", "past", or "next" for the single spotlight.
   Add data-limit="3" to cap how many appear.                               */
function renderEvents() {
  var targets = document.querySelectorAll('[data-events]');
  if (!targets.length) return;

  var all = (window.CLUB_EVENTS || []).slice().sort(byDateAscending);

  targets.forEach(function (el) {
    var mode  = el.getAttribute('data-events');
    var limit = parseInt(el.getAttribute('data-limit'), 10);
    var list  = all.filter(function (ev) {
      return mode === 'past' ? ev.status === 'past' : ev.status === 'upcoming';
    });

    if (mode === 'past') list.reverse();
    if (mode === 'next') list = list.slice(0, 1);
    if (!isNaN(limit))   list = list.slice(0, limit);

    if (!list.length) {
      el.innerHTML = '<p class="loading">Nothing on the calendar yet. ' +
                     'Check the Discord for the next meeting.</p>';
      return;
    }

    el.innerHTML = list.map(eventMarkup).join('');
  });
}

function eventMarkup(ev) {
  var d = splitDate(ev.date);
  return '' +
    '<article class="event">' +
      '<div class="event__date">' +
        '<span class="event__day">' + d.day + '</span>' +
        '<span class="event__month">' + d.month + '</span>' +
      '</div>' +
      '<div>' +
        '<h3 class="event__title">' + ev.title + '</h3>' +
        '<p class="event__meta">' + ev.type + ' · ' + ev.time + ' · ' + ev.location + '</p>' +
        '<p class="event__meta">' + ev.description + '</p>' +
      '</div>' +
      '<div class="event__actions">' +
        (ev.status === 'upcoming'
          ? '<a class="btn btn--ghost" href="' + ev.rsvp + '">RSVP</a>'
          : '<span class="tag">Happened</span>') +
      '</div>' +
    '</article>';
}

/* --- Projects -----------------------------------------------------------
   Renders into any element with [data-projects]. Use data-projects="featured"
   for the Home page selection, "all" for the full Projects grid.           */
function renderProjects() {
  var targets = document.querySelectorAll('[data-projects]');
  if (!targets.length) return;

  var all = window.CLUB_PROJECTS || [];

  targets.forEach(function (el) {
    var mode = el.getAttribute('data-projects');
    var list = mode === 'featured'
      ? all.filter(function (p) { return p.featured; })
      : applyFilter(all);

    var counter = document.querySelector('[data-filter-count]');
    if (counter && mode === 'all') {
      counter.textContent = list.length + ' of ' + all.length + ' shown';
    }

    if (!list.length) {
      el.innerHTML = '<p class="loading">Nothing built with that yet. ' +
                     'It could be your project — pitch one at any session.</p>';
      return;
    }

    el.innerHTML = list.map(projectMarkup).join('');
  });
}

function projectMarkup(p) {
  var tags = p.stack.map(function (t) {
    return '<li class="tag">' + t + '</li>';
  }).join('');

  return '' +
    '<article class="card project-card">' +
      '<div class="project-card__thumb">' + p.name.charAt(0) + '</div>' +
      '<div class="project-card__body">' +
        '<h3>' + p.name + '</h3>' +
        '<p>' + p.summary + '</p>' +
        '<ul class="tags">' + tags +
          '<li class="tag tag--status">' + p.status + '</li>' +
        '</ul>' +
        '<div class="project-card__links">' +
          '<a href="' + p.demo + '">Live demo</a>' +
          '<a href="' + p.repo + '">Code</a>' +
        '</div>' +
      '</div>' +
    '</article>';
}


/* --- Project filtering --------------------------------------------------
   Buttons carry data-filter="key:value". "all" clears the filter. The full
   project list stays in memory, so filtering never refetches anything.     */
var activeFilter = { key: 'all', value: 'all' };

function initFilters() {
  var bar = document.querySelector('[data-filter-bar]');
  if (!bar) return;

  var all = window.CLUB_PROJECTS || [];

  // Build the buttons from the data itself, so a new tech stack in
  // data/projects.js appears here without touching the HTML.
  var stacks = [];
  all.forEach(function (p) {
    p.stack.forEach(function (s) { if (stacks.indexOf(s) === -1) stacks.push(s); });
  });

  var buttons = ['<span class="filters__label">Filter</span>'];
  buttons.push(filterButton('all', 'all', 'Everything', true));
  stacks.forEach(function (s) { buttons.push(filterButton('stack', s, s, false)); });
  buttons.push(filterButton('status', 'In Progress', 'In progress', false));
  buttons.push('<span class="filter-count" data-filter-count></span>');
  bar.innerHTML = buttons.join('');

  bar.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter');
    if (!btn) return;

    bar.querySelectorAll('.filter').forEach(function (b) {
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });

    activeFilter = { key: btn.dataset.key, value: btn.dataset.value };
    renderProjects();
  });
}

function filterButton(key, value, label, pressed) {
  return '<button class="filter" type="button" data-key="' + key +
         '" data-value="' + value + '" data-filter="' + key + ':' + value +
         '" aria-pressed="' + (pressed ? 'true' : 'false') + '">' + label + '</button>';
}

function applyFilter(list) {
  if (activeFilter.key === 'all') return list;
  if (activeFilter.key === 'stack') {
    return list.filter(function (p) { return p.stack.indexOf(activeFilter.value) !== -1; });
  }
  return list.filter(function (p) { return p.status === activeFilter.value; });
}

/* --- Signup form --------------------------------------------------------
   Validates in the browser and shows a confirmation panel. There is no
   server behind a static site, so nothing is transmitted — swap the
   handler for a real form endpoint when the club has one.                  */
function initForm() {
  var form = document.querySelector('[data-join-form]');
  if (!form) return;

  form.setAttribute('novalidate', '');           // use our own messages

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var problems = 0;
    form.querySelectorAll('[data-required]').forEach(function (input) {
      var field = input.closest('.field');
      var value = input.value.trim();
      var ok = value !== '';

      if (ok && input.type === 'email') {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      field.classList.toggle('field--invalid', !ok);
      if (!ok) problems++;
    });

    var status = form.querySelector('[data-form-status]');
    if (problems) {
      status.textContent = problems === 1
        ? 'One field still needs filling in.'
        : problems + ' fields still need filling in.';
      var firstBad = form.querySelector('.field--invalid input, .field--invalid select');
      if (firstBad) firstBad.focus();
      return;
    }

    showFormSuccess(form);
  });

  // Clear an error as soon as the person starts fixing it.
  form.addEventListener('input', function (e) {
    var field = e.target.closest('.field');
    if (field) field.classList.remove('field--invalid');
  });
}

function showFormSuccess(form) {
  var name = (form.querySelector('[name="name"]').value || '').trim().split(' ')[0];

  var panel = document.createElement('div');
  panel.className = 'form-success';
  panel.setAttribute('role', 'status');
  panel.setAttribute('tabindex', '-1');   // so focus lands here for screen readers
  panel.innerHTML =
    '<h3>You\'re on the list' + (name ? ', ' + name : '') + '.</h3>' +
    '<p>Here\'s what happens next:</p>' +
    '<ol>' +
      '<li>Join the Discord — the link is in the section above.</li>' +
      '<li>Come to the next Wednesday session, 5pm, Room B12.</li>' +
      '<li>Pick a project team whenever you feel ready.</li>' +
    '</ol>';

  form.replaceWith(panel);
  panel.focus();
}

/* --- Stat counters ------------------------------------------------------
   Counts up once, when the stats bar first comes into view.               */
function initCounters() {
  var nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return;   // final value already in the HTML

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      countUp(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  nums.forEach(function (n) { io.observe(n); });
}

function countUp(el) {
  var target = parseInt(el.textContent, 10);
  if (isNaN(target)) return;
  var start = null, duration = 900;

  function frame(now) {
    if (!start) start = now;
    var progress = Math.min((now - start) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = target;
  }
  requestAnimationFrame(frame);
}

/* --- Start everything once the HTML is parsed --------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  document.documentElement.classList.add('js');
  initNav();
  markCurrentPage();
  renderEvents();
  initFilters();
  renderProjects();
  initForm();
  initCounters();

  // Trigger the one page-load reveal after the first paint.
  requestAnimationFrame(function () { document.body.classList.add('is-ready'); });
});
