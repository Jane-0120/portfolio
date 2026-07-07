/* =========================================================
   Portfolio — script.js
   PROJECTS 데이터(projects.js)를 읽어 그리드를 렌더링합니다.
   ========================================================= */

/* ---- 그리드 렌더링 ---- */
function buildGrid() {
  const grid = document.getElementById('grid');

  PROJECTS.forEach(proj => {
    const facts = proj.intro.facts.map(f =>
      `<div><span>${f.label}</span><strong>${f.value}</strong></div>`
    ).join('');

    const figures = proj.images.detail.map(img =>
      `<figure${img.tall ? ' class="tall"' : ''}><img src="${img.src}" alt=""></figure>`
    ).join('');

    const col = document.createElement('div');
    col.className = 'col';
    col.dataset.index = proj.id;
    col.tabIndex = 0;
    col.role = 'button';
    col.setAttribute('aria-label', proj.ariaLabel);

    col.innerHTML = `
      <div class="col-inner">
        <div class="col-hero">
          <div class="col-media"><img src="${proj.images.hero}" alt=""></div>
          <span class="col-index">${proj.id}</span>
          <span class="asterisk">✳</span>
          <div class="col-label">${proj.label[0]}<br>${proj.label[1]}</div>
          <div class="proj-meta">
            <div class="eyebrow">${proj.eyebrow}</div>
            <p>${proj.metaDesc}</p>
          </div>
          <div class="scroll-hint"><span>Scroll to explore</span><span class="arr">↓</span></div>
        </div>
        <div class="col-detail">
          <div class="intro">
            <div class="k">${proj.intro.kicker}</div>
            <h2>${proj.intro.h2}</h2>
            <p>${proj.intro.p}</p>
            <div class="facts">${facts}</div>
          </div>
          ${figures}
          <div class="end">${proj.endTitle}<button type="button" class="end-next" data-next="${proj.nextId || ''}">${proj.endNext}</button></div>
        </div>
      </div>`;

    grid.appendChild(col);
  });
}

buildGrid();

/* ---- 컬럼 참조 (렌더링 후 획득) ---- */
const stage        = document.getElementById('stage');
const cols         = () => [...document.querySelectorAll('.col')];
const closeBtn     = document.getElementById('closeBtn');
const contactBtn   = document.getElementById('contactBtn');
const contact      = document.getElementById('contact');
const contactClose = document.getElementById('contactClose');

/* ---- 프로젝트 열기 ---- */
function openCol(col) {
  if (stage.classList.contains('expanded')) return;
  cols().forEach(c => c.classList.remove('active'));
  col.classList.add('active');
  stage.classList.add('expanded');
  const inner = col.querySelector('.col-inner');
  if (inner) inner.scrollTop = 0;
}

/* ---- 다음 프로젝트로 이동 ---- */
function goToProject(id) {
  const nextCol = cols().find(c => c.dataset.index === id);
  if (!nextCol) return;
  cols().forEach(c => c.classList.remove('active'));
  nextCol.classList.add('active');
  stage.classList.add('expanded');
  const inner = nextCol.querySelector('.col-inner');
  if (inner) inner.scrollTop = 0;
}

/* ---- 프로젝트 닫기 ---- */
function closeCol() {
  const active = document.querySelector('.col.active');
  if (active) {
    const inner = active.querySelector('.col-inner');
    if (inner) inner.scrollTo({ top: 0, behavior: 'smooth' });
  }
  stage.classList.remove('expanded');
  setTimeout(() => { cols().forEach(c => c.classList.remove('active')); }, 650);
}

/* ---- 컬럼 이벤트 바인딩 ---- */
document.getElementById('grid').addEventListener('click', e => {
  const nextBtn = e.target.closest('.end-next');
  if (nextBtn) {
    e.stopPropagation();
    const nextId = nextBtn.dataset.next;
    if (nextId) goToProject(nextId);
    else closeCol();
    return;
  }
  const col = e.target.closest('.col');
  if (!col) return;
  if (stage.classList.contains('expanded')) {
    if (col.classList.contains('active')) closeCol();
    return;
  }
  openCol(col);
});
document.getElementById('grid').addEventListener('keydown', e => {
  if (e.target.closest('.end-next')) return;
  if (e.key === 'Enter' || e.key === ' ') {
    const col = e.target.closest('.col');
    if (col) { e.preventDefault(); openCol(col); }
  }
});

closeBtn.addEventListener('click', closeCol);

/* ---- CONTACT 모달 ---- */
function openContact()  { contact.classList.add('open'); }
function closeContact() { contact.classList.remove('open'); }

contactBtn.addEventListener('click', openContact);
contactClose.addEventListener('click', closeContact);
contact.addEventListener('click', e => { if (e.target === contact) closeContact(); });

/* ---- ESC 키 ---- */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (contact.classList.contains('open')) closeContact();
    else if (stage.classList.contains('expanded')) closeCol();
  }
});
