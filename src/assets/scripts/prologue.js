/**
 * Project page — prólogo animation.
 * Staggers content reveal on load, then updates --prologue-progress for CSS-driven effects.
 */

function initPrologue() {
	const prologue = document.querySelector("[data-prologue]");
	if (!prologue) return;

	// Staged reveal: title → tags/description → scroll hint
	prologue.setAttribute("data-prologue-stage", "0");
	requestAnimationFrame(() => {
		setTimeout(() => prologue.setAttribute("data-prologue-stage", "1"), 80);
		setTimeout(() => prologue.setAttribute("data-prologue-stage", "2"), 800);
		setTimeout(() => prologue.setAttribute("data-prologue-stage", "3"), 1600);
	});

	let ticking = false;
	const onScroll = () => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			const rect = prologue.getBoundingClientRect();
			const progress = Math.min(1, Math.max(0, -rect.top / window.innerHeight));
			prologue.style.setProperty("--prologue-progress", progress.toFixed(3));
			ticking = false;
		});
	};

	onScroll();
	window.addEventListener("scroll", onScroll, { passive: true });

	document.addEventListener(
		"astro:before-preparation",
		() => window.removeEventListener("scroll", onScroll),
		{ once: true }
	);
}

document.addEventListener("astro:page-load", initPrologue);
if (document.readyState !== "loading") initPrologue();
