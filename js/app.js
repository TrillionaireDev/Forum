const buttonField = document.getElementById('buttonField');
const sideInfo = document.getElementById('sideInfo');
const dateBtn = document.getElementById('dateBtn');

function setActiveButton(type) {
  document.querySelectorAll('.stack-item').forEach(item => {
    item.classList.toggle('active', item.dataset.type === type);
  });
}

function togglePost(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.style.display = (el.style.display === 'none' || el.style.display === '')
    ? 'block'
    : 'none';
}

function renderDefaultMessage() {
  stopFloatingPosts();

  Promise.all([
    fetch('what.html').then(res => res.text()),
    fetch('when.html').then(res => res.text())
  ])
    .then(([what, when]) => {
      buttonField.innerHTML = `
        <div class="post-row" id="postField">
          <div class="floating-post" id="post1" onclick="expandPost(this)">${what}</div>
          <div class="floating-post" id="post2" onclick="expandPost(this)">${when}</div>
        </div>
      `;

      requestAnimationFrame(() => {
        startFloatingPosts();
      });
    })
    .catch(() => {
      buttonField.innerHTML = `
        <div class="dfi-box">
          <p>Unable to load forum posts.</p>
        </div>
      `;
    });
}

function renderFormFields() {
  stopFloatingPosts();

  buttonField.innerHTML = `
    <div class="form-layout">
      <div class="form-top-left wide">
        <iframe
          class="dot-frame"
          src="dots.html"
          title="Dot input"
        ></iframe>
      </div>

      <div class="form-bottom-left wide">
        <iframe
          class="grass-frame"
          src="grass.html"
          title="Grass input"
        ></iframe>
      </div>
    </div>
  `;
}

function show(type) {
  setActiveButton(type);

  if (type !== 'forum') {
    stopFloatingPosts();
  }

  if (type === 'form') {
    renderFormFields();
    sideInfo.innerHTML = `
      <div class="side-info-inner">
        <p>Screenshot or copy&amp;paste the form to save it.</p>
      </div>
    `;
    return;
  }

  if (type === 'privacy') {
    buttonField.innerHTML = '';
    sideInfo.innerHTML = `
      <div class="side-info-inner">
        <p>
          The form submission on drugfreeinu.forum is built from code that doesn’t send, save, or record anything that is typed into the form.
        </p>
        <p>(select to view the code)</p>
      </div>
    `;
    return;
  }

  if (type === 'formula') {
    buttonField.innerHTML = '';
    sideInfo.innerHTML = `
      <div class="side-info-inner">
        <p>A calculation to see how the theories on .forum came from using the art of thought.</p>
        <p><strong>art + thought = theory</strong></p>
      </div>
    `;
    return;
  }

  if (type === 'forum') {
    renderDefaultMessage();
    sideInfo.innerHTML = `
      <div class="side-info-inner">
        <p>
          Information and beliefs from the artist’s mind behind DFI.
        </p>
      </div>
    `;
    return;
  }
}

dateBtn.addEventListener('click', () => {
  alert("Date button clicked.");
});

fetch('menu.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('menuButtons').innerHTML = html;
    show('forum');
  })
  .catch(() => {
    document.getElementById('menuButtons').innerHTML = `
      <div class="stack">

        <div class="stack-item" data-type="form" onclick="show('form')">
          <div class="layer l7"></div><div class="layer l6"></div><div class="layer l5"></div>
          <div class="layer l4"></div><div class="layer l3"></div><div class="layer l2"></div><div class="layer l1"></div>
          <button type="button">form</button>
        </div>

        <div class="stack-item" data-type="forum" onclick="show('forum')">
          <div class="layer l7"></div><div class="layer l6"></div><div class="layer l5"></div>
          <div class="layer l4"></div><div class="layer l3"></div><div class="layer l2"></div><div class="layer l1"></div>
          <button type="button">forum</button>
        </div>

        <div class="stack-item" data-type="privacy" onclick="show('privacy')">
          <div class="layer l7"></div><div class="layer l6"></div><div class="layer l5"></div>
          <div class="layer l4"></div><div class="layer l3"></div><div class="layer l2"></div><div class="layer l1"></div>
          <button type="button">privacy</button>
        </div>

        <div class="stack-item" data-type="formula" onclick="show('formula')">
          <div class="layer l7"></div><div class="layer l6"></div><div class="layer l5"></div>
          <div class="layer l4"></div><div class="layer l3"></div><div class="layer l2"></div><div class="layer l1"></div>
          <button type="button">.formula</button>
        </div>

      </div>
    `;
    show('forum');
  });