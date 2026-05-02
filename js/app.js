const buttonField = document.getElementById('buttonField');
const sideInfo = document.getElementById('sideInfo');
const dateBtn = document.getElementById('dateBtn');
const menuButtons = document.getElementById('menuButtons');

function setActiveButton(type) {
  document.querySelectorAll('.stack-item').forEach((item) => {
    item.classList.toggle('active', item.dataset.type === type);
  });
}

function clearMainArea() {
  if (typeof stopFloatingPosts === 'function') {
    stopFloatingPosts();
  }
  buttonField.innerHTML = '';
}

function renderDefaultMessage() {
  clearMainArea();

  Promise.all([
    fetch('what.html').then((res) => res.text()),
    fetch('when.html').then((res) => res.text())
  ])
    .then(([what, when]) => {
      buttonField.innerHTML = `
        <div class="post-row" id="postField">
          <div class="floating-post" id="post1" onclick="expandPost(this)">${what}</div>
          <div class="floating-post" id="post2" onclick="expandPost(this)">${when}</div>
        </div>
      `;

      requestAnimationFrame(() => {
        if (typeof startFloatingPosts === 'function') {
          startFloatingPosts();
        }
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
  clearMainArea();

  buttonField.innerHTML = `
    <div class="form-layout">
      <div class="form-top-left">
        <div class="dots-branch-wrap">
          <iframe
            class="dot-frame"
            src="dots.html"
            title="Dot input"
          ></iframe>

          <iframe
            class="branch-frame"
            src="branch.html"
            title="Branch input"
          ></iframe>
        </div>
      </div>

      <div class="form-bottom-left">
        <iframe
          class="grass-frame"
          src="grass.html"
          title="Grass input"
        ></iframe>
      </div>
    </div>
  `;
}

function renderPrivacy() {
  clearMainArea();

  sideInfo.innerHTML = `
    <div class="side-info-inner">
      <p>
        The form submission on drugfreeinu.forum is built from code that doesn’t send, save, or record anything that is typed into the form.
      </p>
      <p>(select to view the code)</p>
    </div>
  `;
}

function renderFormula() {
  clearMainArea();

  sideInfo.innerHTML = `
    <div class="side-info-inner">
      <p>A calculation to see how the theories on .forum came from using the art of thought.</p>
      <p><strong>art + thought = theory</strong></p>
    </div>
  `;
}

function renderFormInfo() {
  sideInfo.innerHTML = `
    <div class="side-info-inner">
      <div class="dfi-keyboard">

        <div class="row numbers">
          <div class="key number">1</div>
          <div class="key number">2</div>
          <div class="key number">3</div>
          <div class="key number">4</div>
          <div class="key number">5</div>
          <div class="key number">6</div>
          <div class="key number">7</div>
          <div class="key number">8</div>
          <div class="key number">9</div>
          <div class="key number">0</div>
        </div>

        <div class="row qwerty">
          <div class="key">Q</div>
          <div class="key">W</div>
          <div class="key">E</div>
          <div class="key">R</div>
          <div class="key">T</div>
          <div class="key">Y</div>
          <div class="key">U</div>
          <div class="key">I</div>
          <div class="key">O</div>
          <div class="key">P</div>
        </div>

        <div class="row asdf">
          <div class="key">A</div>
          <div class="key">S</div>
          <div class="key">D</div>
          <div class="key">F</div>
          <div class="key">G</div>
          <div class="key">H</div>
          <div class="key">J</div>
          <div class="key">K</div>
          <div class="key">L</div>
        </div>

        <div class="row zxcv">
          <div class="key">Z</div>
          <div class="key">X</div>
          <div class="key">C</div>
          <div class="key">V</div>
          <div class="key">B</div>
          <div class="key">N</div>
          <div class="key">M</div>
        </div>

      </div>
    </div>
  `;
}

function renderForumInfo() {
  sideInfo.innerHTML = `
    <div class="side-info-inner">
      <p>
        Information and beliefs from the artist’s mind behind DFI.
      </p>
    </div>
  `;
}

function show(type) {
  setActiveButton(type);

  if (type === 'form') {
    renderFormFields();
    renderFormInfo();
    return;
  }

  if (type === 'privacy') {
    renderPrivacy();
    return;
  }

  if (type === 'formula') {
    renderFormula();
    return;
  }

  if (type === 'forum') {
    renderDefaultMessage();
    renderForumInfo();
  }
}

dateBtn.addEventListener('click', () => {
  alert('Date button clicked.');
});

fetch('menu.html')
  .then((res) => res.text())
  .then((html) => {
    menuButtons.innerHTML = html;
    show('forum');
  })
  .catch(() => {
    menuButtons.innerHTML = `
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
