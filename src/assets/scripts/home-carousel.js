/**
 * Home page horizontal carousel.
 * Vertical scroll through .home-projects translates the card track horizontally.
 * The sidebar index and progress bar sync with the active card.
 * On tablet/mobile falls back to native horizontal scroll-snap.
 */

function initHomeCarousel() {
	const section = document.querySelector("[data-carousel]");
	if (!section) return;

	const track = section.querySelector("[data-carousel-track]");
	const cards = track ? Array.from(track.querySelectorAll("[data-carousel-card]")) : [];
	const sidebarBtns = Array.from(section.querySelectorAll("[data-carousel-sidebar]"));
	const progressBar = section.querySelector("[data-carousel-progress]");

	if (!track || cards.length === 0) return;

	const isMobile = () => window.matchMedia("(max-width: 992px)").matches;

	const sizeSection = () => {
		if (isMobile()) {
			section.style.height = "";
			track.style.transform = "";
			return;
		}
		// Each non-first card gets one viewport height of vertical scroll room.
		const totalScroll = (cards.length - 1) * window.innerHeight;
		section.style.height = `${totalScroll + window.innerHeight}px`;
	};

	const updateActive = (idx) => {
		cards.forEach((c, i) => c.classList.toggle("is-active", i === idx));
		sidebarBtns.forEach((b, i) => b.classList.toggle("is-active", i === idx));
	};

	let ticking = false;
	const onScroll = () => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			if (isMobile()) { ticking = false; return; }

			const rect = section.getBoundingClientRect();
			const scrollable = section.offsetHeight - window.innerHeight;
			const progress = Math.min(1, Math.max(0, -rect.top / scrollable));

			const cardStep = cards[0].offsetWidth + 24; // matches the 24px gap in CSS
			const maxTranslate = cardStep * (cards.length - 1);
			track.style.transform = `translate3d(${-progress * maxTranslate}px, 0, 0)`;

			if (progressBar) progressBar.style.transform = `scaleX(${progress})`;

			updateActive(Math.min(cards.length - 1, Math.round(progress * (cards.length - 1))));
			ticking = false;
		});
	};

	sidebarBtns.forEach((btn) => {
		btn.addEventListener("click", () => {
			const idx = Number(btn.dataset.carouselSidebar);
			if (Number.isNaN(idx)) return;
			if (isMobile()) {
				cards[idx]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
				return;
			}
			const scrollable = section.offsetHeight - window.innerHeight;
			const target = section.offsetTop + (scrollable * idx) / Math.max(1, cards.length - 1);
			window.scrollTo({ top: target, behavior: "smooth" });
		});
	});

	sizeSection();
	onScroll();

	const onResize = () => { sizeSection(); onScroll(); };
	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onResize);

	document.addEventListener(
		"astro:before-preparation",
		() => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onResize);
		},
		{ once: true }
	);
}

document.addEventListener("astro:page-load", initHomeCarousel);
if (document.readyState !== "loading") initHomeCarousel();
