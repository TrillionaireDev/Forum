let floatAnimationId = null;
let floatingItems = [];
let expandedPost = null;

function stopFloatingPosts() {
  if (floatAnimationId) {
    cancelAnimationFrame(floatAnimationId);
    floatAnimationId = null;
  }
  floatingItems = [];
}

function startFloatingPosts() {
  stopFloatingPosts();

  const field = document.getElementById('postField');
  if (!field) return;

  const posts = [...field.querySelectorAll('.floating-post')];
  if (!posts.length) return;

  const width = field.clientWidth;
  const height = field.clientHeight;

  floatingItems = posts.map((el) => {
    const w = el.offsetWidth;
    const h = el.offsetHeight;

    return {
      el,
      x: Math.random() * Math.max(0, width - w),
      y: Math.random() * Math.max(0, height - h),
      w,
      h,
      vx: (Math.random() * 0.04 + 0.015) * (Math.random() > 0.5 ? 1 : -1),
      vy: (Math.random() * 0.03 + 0.01) * (Math.random() > 0.5 ? 1 : -1)
    };
  });

  function animate() {
    const maxW = field.clientWidth;
    const maxH = field.clientHeight;

    for (const item of floatingItems) {
      item.x += item.vx;
      item.y += item.vy;

      if (item.x <= 0) {
        item.x = 0;
        item.vx *= -1;
      }
      if (item.x + item.w >= maxW) {
        item.x = maxW - item.w;
        item.vx *= -1;
      }
      if (item.y <= 0) {
        item.y = 0;
        item.vy *= -1;
      }
      if (item.y + item.h >= maxH) {
        item.y = maxH - item.h;
        item.vy *= -1;
      }

      item.el.style.transform = `translate(${item.x}px, ${item.y}px)`;
    }

    floatAnimationId = requestAnimationFrame(animate);
  }

  animate();
}

function expandPost(el) {
  const field = document.getElementById('postField');
  if (!field) return;

  const posts = [...field.querySelectorAll('.floating-post')];

  if (expandedPost === el) {
    closeExpandedPost();
    return;
  }

  stopFloatingPosts();
  expandedPost = el;

  posts.forEach(p => {
    if (p !== el) p.classList.add('post-dim');
    else p.classList.remove('post-dim');
  });

  const rect = field.getBoundingClientRect();
  const postRect = el.getBoundingClientRect();

  const centerX = rect.width / 2 - postRect.width / 2;
  const centerY = rect.height / 2 - postRect.height / 2;

  el.classList.add('expanded');
  el.style.transform = `translate(${centerX}px, ${centerY}px)`;
}

function closeExpandedPost() {
  const field = document.getElementById('postField');
  if (!field || !expandedPost) return;

  const posts = [...field.querySelectorAll('.floating-post')];
  const el = expandedPost;

  posts.forEach(p => p.classList.remove('post-dim'));
  el.classList.remove('expanded');

  const width = field.clientWidth;
  const height = field.clientHeight;
  const w = el.offsetWidth;
  const h = el.offsetHeight;

  const targetX = Math.random() * Math.max(0, width - w);
  const targetY = Math.random() * Math.max(0, height - h);

  el.style.transform = `translate(${targetX}px, ${targetY}px)`;

  expandedPost = null;

  setTimeout(() => {
    startFloatingPosts();
  }, 400);
}

function resetPosts() {
  const posts = document.querySelectorAll('.floating-post');

  posts.forEach(p => {
    p.classList.remove('expanded');
    p.classList.remove('post-dim');
    p.style.transform = '';
  });

  expandedPost = null;
  startFloatingPosts();
}
