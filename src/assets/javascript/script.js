// FUNCTIONS ===============================================================

function vh(v) {
  let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return (v * h) / 100;
}

function turnUpAction(target) {
  const tg = document.querySelector(target);
  tg.addEventListener('click', () => {
    window.scrollTo(0, 0);
  });
}

function revealBasedOnScrollPosition(elements, viewportHeight, classListName) {
  let targets = document.querySelectorAll(elements);
  let executedPosition = vh(viewportHeight);

  window.addEventListener('scroll', function () {
    targets.forEach((target) => {
      let elementTopDistance = target.getBoundingClientRect().top;
      //Debug options
      // console.log('element distance: ' + elementTopDistance);
      // console.log('executed desired position: ' + executedPosition);
      // When the elements get higher than the executedPosition value
      if (elementTopDistance <= executedPosition) {
        target.classList.add(classListName);
      } else {
        target.removeAttribute('style');
        target.classList.remove(classListName);
      }
    });
  });
}

function animateBasedOnScrollPosition(targets, steps) {
  const allTargets = document.querySelectorAll(targets);
  function applyStyles(allTargets, styles) {
    allTargets.forEach((target) => {
      Object.entries(styles).forEach(([property, value]) => {
        // console.log(`${property}: ${value}`);
        target.style[property] = value;
      });
    });
  }

  window.addEventListener('scroll', function () {
    let windowScrollY = window.scrollY;
    steps(windowScrollY, allTargets, applyStyles);
  });
}

//go projects section page and scrollIntoView into the fisrt project
function goToProjectsSection() {
  if (window.location.pathname == '/') {
    const firstProject = document.querySelector('#projects-section > div > a:nth-child(1)');
    firstProject.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.location.replace('/#projects');
    navPageCloseAll();
    return;
  }
  window.location.assign('/#projects');
  window.sessionStorage.clear();
}
//About me page stack elements on top software group
function stackElementsOnTop(query) {
  let index = query.length;
  query.forEach((img) => {
    index = index - 1;
    img.style.zIndex = index;
  });
}

function createBlurBackdrop() {
  let blurBackdrop = document.createElement('div');
  blurBackdrop.className = 'blur-backdrop';
  blurBackdrop.dataset.display = 'false';
  blurBackdrop.addEventListener('click', navPageCloseAll);
  return blurBackdrop;
}

function isView() {
  if (window.matchMedia('(max-width: 992px)').matches) return 'tablet-view';
  return 'desktop-view';
}

function preventScroll() {
  body.classList.add('lock-position');
  //overflow prevent
  if (allMenuPages.some((page) => page.dataset.pageStatus == 'opened') || navMobile.container.dataset.menuStatus == 'opened') {
    return;
  }
  body.classList.remove('lock-position');
}

function burguerMenuToggle() {
  navMobile.burguerMenu.checked == true ? (navMobile.container.dataset.menuStatus = 'opened') : (navMobile.container.dataset.menuStatus = 'closed');
  preventScroll();
}

function menuPagesToggle(targetPage) {
  targetPage = document.querySelector(targetPage);
  navMobile.burguerMenu.checked = false;
  switch (isView()) {
    case 'tablet-view':
      if (targetPage.dataset.pageStatus == 'closed') {
        targetPage.dataset.pageStatus = 'opened';
        document.location.replace(`#${targetPage.id.replace('_page', '')}`);
        targetPage.scrollIntoView({ behavior: 'smooth' });
        //mobile menu check
        console.log('mobile menu opened');
      } else {
        targetPage.scrollIntoView({ behavior: 'smooth' });
        if (targetPage.scrollTop > 0) targetPage.scrollTo(0, 0);
        //mobile menu check
        console.log('mobile menu keeps opened');
      }
      burguerMenuToggle();
      break;
    case 'desktop-view':
      buttonClicked = document.querySelector(`.nav-desktop__link--${targetPage.className.replace('_page', '')}`);
      console.log(buttonClicked);
      if (targetPage.dataset.pageStatus == 'closed') {
        targetPage.dataset.pageStatus = 'opened';
        buttonClicked.children[0].style.display = 'initial';
        buttonClicked.querySelector('.nav-desktop__text').style.opacity = '0';
        //prevent creating a new blurBackdrop if it's already created
        //preeter-ignore
        if (navDesktop.blurBackdrop.dataset.display == 'false') navDesktop.aboutMePage.before(navDesktop.blurBackdrop);
        navDesktop.blurBackdrop.dataset.display = 'true';
        document.location.replace(`#${targetPage.id.replace('_page', '')}`);
        header.style.top = '0px';
        //desktop nav check
        console.log('opened');
      } else {
        targetPage.dataset.pageStatus = 'closed';
        buttonClicked.querySelector('.nav-desktop__arrow').removeAttribute('style');
        buttonClicked.querySelector('.nav-desktop__text').removeAttribute('style');
        history.pushState(null, null, '/');
        //desktop nav check
        console.log('closed');
      }
      preventScroll();
  }
  if (allMenuPages.every((page) => page.dataset.pageStatus == 'closed')) navPageCloseAll(), updateHeaderPosition();
;
}

//prettier-ignore
function navPageCloseAll() {
  body.classList.remove('lock-position');
  document.querySelector(`.nav-desktop__link--${navDesktop.contactPage.id.replace('_page', '')}`).children[0].removeAttribute('style');
  navDesktop.navDesktop.querySelectorAll('.nav-desktop__arrow').forEach((arrow) => arrow.removeAttribute('style'));
  navDesktop.navDesktop.querySelectorAll('.nav-desktop__text').forEach((text) => text.removeAttribute('style'));
  navDesktop.blurBackdrop.dataset.display = 'false';
  history.pushState(null, null, '/');
  navMobile.burguerMenu.checked = false;
  navMobile.container.dataset.menuStatus = 'closed';
  let allMenuPages = Array.from(document.querySelectorAll('[data-page-status]'));
  allMenuPages.forEach((page) => page.dataset.pageStatus = 'closed');
  //prettier-ignore
  navDesktop.blurBackdrop.addEventListener('animationend', () => {
    if (navDesktop.blurBackdrop.dataset.display == 'false') navDesktop.blurBackdrop.remove();
  }, { once: true }
  );
}

function showProjectNumber() {
  const aux = [...document.querySelectorAll('.projects__project')].map((project) => Math.abs(project.getBoundingClientRect().top));
  const min = Math.min(...aux);
  projectsPointer.textContent = aux.indexOf(min) + 1;
}

// DOM LOGIC ===============================================================

const body = document.querySelector('body');
const softwareItems = document.querySelectorAll('.about-me__software-item');
const revealProjectsProject = revealBasedOnScrollPosition('.projects__project', 30, 'projects__project--reveal');
const releveaApproachingText = revealBasedOnScrollPosition('.approaching__group > .approaching__text', 70, 'approaching__text--reveal');
const revealBgBlurryShape = revealBasedOnScrollPosition('.footer__bg-blurry-shape', 100, 'footer__bg-blurry-shape--reveal');
const revealProjectsApproaching = revealBasedOnScrollPosition('.project__approaching', 50, 'project__approaching--reveal');
const scrollDownButton = document.querySelector('.introduction__call-to-action');
const pageButtons = document.querySelectorAll('[data-page-link]');
const allMenuPages = Array.from(document.querySelectorAll('[data-page-status]'));
const projectsPointer = document.querySelector('.projects__pointer');
const projectBackBtn = document.querySelector('.project__back-btn');
const header = document.querySelector('.header');
const disclaimerMinimal = document.querySelector('.introduction__disclaimer-minimal');
const headerOffset = 62;

// Mobile menu content
const navMobile = {
  burguerMenu: document.querySelector('#burguer-bar-toggle'),
  container: document.querySelector('.nav-mobile'),
};

//Desktop menu content
const navDesktop = {
  navDesktop: document.querySelector('.nav-desktop'),
  contactPage: document.querySelector('#contact_page'),
  aboutMePage: document.querySelector('#about_me_page'),
  blurBackdrop: createBlurBackdrop(),
  projectsButton: document.querySelector('#projects_section_btn'),
};

if (document.location.hash === '#contact') menuPagesToggle('#contact_page');
if (document.location.hash === '#about_me') menuPagesToggle('#about_me_page');
if (document.location.hash === '#projects' || window.sessionStorage.getItem('projects-section')) goToProjectsSection();

pageButtons.forEach((button) => {
  let targetPage = button.dataset.pageLink;
  button.addEventListener('click', () => menuPagesToggle(`#${targetPage}_page`));
});

//Logo icon interaction -----
document.querySelector('header .header__brand-icon').addEventListener('click', () => {
  document.querySelector('#burguer-bar-toggle').checked = false;
  document
    .querySelectorAll('.contact-and-about-me__container > *')
    .forEach((e) => (e.className.includes('--opened') === true ? e.classList.remove(e.classList[e.classList.length - 1]) : undefined));
  backgroundBlur.classList.remove('background-blur--true');
  document.body.removeAttribute('style');
});

navDesktop.projectsButton.addEventListener('click', () => goToProjectsSection());

navMobile.burguerMenu.addEventListener('change', function () {
  burguerMenuToggle();
});

stackElementsOnTop(softwareItems);

//Turn up action
turnUpAction('.footer__turn-up');

//HOME PAGE ===============================================================
if (window.location.pathname == '/') {
  scrollDownButton.addEventListener('click', () => {
    goToProjectsSection();
  });

  window.sessionStorage.clear();

  window.addEventListener('scroll', () => showProjectNumber());
  //Introduction section text animation with the scrolling
  animateBasedOnScrollPosition(['.introduction__text-group'], function steps(windowScrollY, allTargets, applyStyles) {
    if (windowScrollY <= vh(1)) {
      allTargets.forEach((target) => {
        target.removeAttribute('style');
      });
    }
    if (windowScrollY > vh(2.5)) {
      applyStyles(allTargets, {
        transform: 'scale(' + (1 - windowScrollY / 1000) + ')',
        opacity: 1 - windowScrollY / 1000,
        filter: 'blur(' + windowScrollY / 10 + 'px)',
      });
    }
    if (windowScrollY > vh(48)) {
      applyStyles(allTargets, {
        opacity: 0,
        filter: 'blur(200px)',
      });
    }
  });
}

//PROJECT PAGE =========================================================
if (window.location.pathname.includes('/projects/')) {
  projectBackBtn.addEventListener('click', () => window.sessionStorage.setItem('projects-section', true));
}

//Disclaimer-minimal animation function
let disclaimerMinimalPosition = disclaimerMinimal.getBoundingClientRect().top;
function updateHeaderPosition() {
  const scrollPosition = window.scrollY;
  const newHeaderTop = Math.max(0, disclaimerMinimalPosition - scrollPosition + headerOffset);
  header.style.top = `${newHeaderTop}px`;
}
window.addEventListener('scroll', updateHeaderPosition);
window.addEventListener('load', () => {
  disclaimerMinimalPosition = disclaimerMinimal.getBoundingClientRect().top;
  updateHeaderPosition();
});

//Imagery carrousel function (not yet implemented)

