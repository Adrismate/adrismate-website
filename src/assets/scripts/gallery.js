/**
 * Gallery Modal for Adrismate Website
 * Handles full-screen image and video viewing with smart caching and performance optimization
 * Features: lazy loading, touch gestures, keyboard navigation, responsive design
 */

document.addEventListener("astro:page-load", () => {
	const gallery = document.querySelector("[data-gallery]");
	if (!gallery) return;

	const images = Array.from(gallery.querySelectorAll("[data-gallery-item]"));
	if (images.length === 0) return;

	const modal = document.createElement("div");
	modal.classList.add("gallery-modal");
	modal.setAttribute("role", "dialog");
	modal.setAttribute("aria-modal", "true");
	modal.setAttribute("aria-label", "Image gallery");
	document.body.appendChild(modal);

	let currentIndex = 0;
	let modalContainer, modalImage, modalCounter, closeBtn, prevBtn, nextBtn;
	const imageCache = new Map(); // Cache for loaded images
	const videoCache = new Map(); // Cache for loaded videos

	function createModalStructure() {
		modalContainer = document.createElement("div");
		modalContainer.className = "gallery-modal__container";

		// Create close button
		closeBtn = document.createElement("button");
		closeBtn.className = "gallery-modal__close";
		closeBtn.setAttribute("aria-label", "Close gallery");
		const closeIcon = document.createElement("img");
		closeIcon.src = "/icons/icons--cross.svg";
		closeIcon.alt = "Close gallery";
		closeBtn.appendChild(closeIcon);

		// Create previous button
		prevBtn = document.createElement("button");
		prevBtn.className = "gallery-modal__prev";
		prevBtn.setAttribute("aria-label", "Previous image");
		const prevIcon = document.createElement("img");
		prevIcon.src = "/icons/icons--little-arrow.svg";
		prevIcon.alt = "Previous image";
		prevBtn.appendChild(prevIcon);

		// Create next button
		nextBtn = document.createElement("button");
		nextBtn.className = "gallery-modal__next";
		nextBtn.setAttribute("aria-label", "Next image");
		const nextIcon = document.createElement("img");
		nextIcon.src = "/icons/icons--little-arrow.svg";
		nextIcon.alt = "Next image";
		nextBtn.appendChild(nextIcon);

		// Create counter
		modalCounter = document.createElement("div");
		modalCounter.className = "gallery-modal__counter";

		// Create image
		modalImage = document.createElement("img");
		modalImage.className = "gallery-modal__image";

		// Create tap zones for mobile navigation
		const leftTapZone = document.createElement("div");
		leftTapZone.className = "gallery-modal__tap-zone gallery-modal__tap-zone--left";
		leftTapZone.setAttribute("aria-label", "Previous image");
		leftTapZone.addEventListener("click", (e) => {
			e.stopPropagation();
			showPrevImage();
		});

		const rightTapZone = document.createElement("div");
		rightTapZone.className = "gallery-modal__tap-zone gallery-modal__tap-zone--right";
		rightTapZone.setAttribute("aria-label", "Next image");
		rightTapZone.addEventListener("click", (e) => {
			e.stopPropagation();
			showNextImage();
		});

		// Assemble structure
		modalContainer.appendChild(closeBtn);
		modalContainer.appendChild(prevBtn);
		modalContainer.appendChild(nextBtn);
		modalContainer.appendChild(modalCounter);
		modalContainer.appendChild(modalImage);
		modalContainer.appendChild(leftTapZone);
		modalContainer.appendChild(rightTapZone);

		modal.appendChild(modalContainer);

		// Add event listeners once
		closeBtn.addEventListener("click", hideImage);
		prevBtn.addEventListener("click", showPrevImage);
		nextBtn.addEventListener("click", showNextImage);

		modalContainer.addEventListener("click", (e) => {
			if (e.target === modalContainer) {
				hideImage();
			}
		});

		modal.addEventListener("click", (e) => {
			if (e.target === modal) {
				hideImage();
			}
		});
	}

	function pauseBackgroundVideos() {
		// Pause all background videos on the page
		const backgroundVideos = document.querySelectorAll("video:not(.gallery-modal__video)");
		backgroundVideos.forEach(video => {
			video.pause();
		});
	}

	function resumeBackgroundVideos() {
		// Resume all background videos on the page
		const backgroundVideos = document.querySelectorAll("video:not(.gallery-modal__video)");
		backgroundVideos.forEach(video => {
			if (video.hasAttribute("autoplay")) {
				video.play().catch(() => {
					// Handle any play() errors silently
				});
			}
		});
	}

	function lockBodyScroll() {
		// Simple scroll lock without position manipulation
		document.body.classList.add('gallery-modal-open');
	}

	function unlockBodyScroll() {
		// Simple scroll unlock
		document.body.classList.remove('gallery-modal-open');
	}

	function showImage(index) {
		currentIndex = index;
		const item = images[index];
		const src = item.dataset.fullResSrc || item.querySelector("img")?.src || "";
		const isVideo = item.dataset.mediaType === "video";
		const videoSrc = item.dataset.videoSrc;

		if (!src && !videoSrc) return;

		// Create modal structure if it doesn't exist
		if (!modalContainer) {
			createModalStructure();
		}

		// Update content based on media type
		if (isVideo && videoSrc) {
			// Pause all background videos when showing modal video
			pauseBackgroundVideos();

			// Replace image with video
			modalImage.style.display = "none";

			// Check if video is already cached
			let modalVideo = videoCache.get(videoSrc);
			if (!modalVideo) {
				// Create new video element only if not cached
				modalVideo = document.createElement("video");
				modalVideo.className = "gallery-modal__video";
				
				// Hide controls on mobile devices (touch screens)
				const isMobile = window.matchMedia("(max-width: 992px)").matches || 
								'ontouchstart' in window;
				modalVideo.controls = !isMobile;
				
				modalVideo.muted = true;
				modalVideo.autoplay = true;
				modalVideo.loop = true;
				modalVideo.playsInline = true; // Prevent fullscreen on mobile
				modalVideo.style.maxWidth = "100%";
				modalVideo.style.maxHeight = "100%";
				modalVideo.style.objectFit = "contain";
				modalVideo.src = videoSrc;
				
				// Prevent mobile auto-fullscreen
				modalVideo.setAttribute('webkit-playsinline', 'true');
				modalVideo.setAttribute('playsinline', 'true');
				
				modalContainer.appendChild(modalVideo);

				// Cache the video element
				videoCache.set(videoSrc, modalVideo);
			} else {
				// Reuse cached video
				modalContainer.appendChild(modalVideo);
			}

			// Hide other modal videos and show current one
			videoCache.forEach((video, url) => {
				if (url !== videoSrc) {
					video.style.display = "none";
					video.pause();
				}
			});

			modalVideo.style.display = "block";
			// Ensure autoplay starts when video becomes visible
			modalVideo.play().catch(() => {
				// Handle any play() errors silently
			});
		} else {
			// Hide all modal videos when showing image
			videoCache.forEach((video) => {
				video.style.display = "none";
				video.pause();
			});

			// Resume background videos when showing image (not video)
			resumeBackgroundVideos();

			// Check if image is already cached
			if (imageCache.has(src)) {
				// Use cached image immediately
				modalImage.src = src;
				modalImage.alt = item.querySelector("img")?.alt || "";
				modalImage.style.display = "block";
			} else {
				// Load image for the first time and cache it
				const newImage = new Image();
				newImage.onload = () => {
					// Cache the loaded image
					imageCache.set(src, newImage);

					modalImage.src = src;
					modalImage.alt = item.querySelector("img")?.alt || "";
					modalImage.style.display = "block";
				};

				// Only start downloading if not cached
				newImage.src = src;
			}
		}

		modalCounter.textContent = `${index + 1} - ${images.length}`;
		modal.classList.add("is-open");
		
		// Lock body scroll when modal opens
		lockBodyScroll();
	}

	function hideImage() {
		modal.classList.remove("is-open");
		
		// Pause all modal videos when closing
		videoCache.forEach((video) => {
			video.pause();
		});
		
		// Resume background videos when modal closes
		resumeBackgroundVideos();
		
		// Unlock body scroll when modal closes
		unlockBodyScroll();
	}

	function showNextImage() {
		showImage((currentIndex + 1) % images.length);
	}

	function showPrevImage() {
		showImage((currentIndex - 1 + images.length) % images.length);
	}

	images.forEach((image, index) => {
		image.addEventListener("click", () => {
			showImage(index);
		});
	});

	document.addEventListener("keydown", (e) => {
		if (!modal.classList.contains("is-open")) return;
		if (e.key === "ArrowRight") {
			showNextImage();
		} else if (e.key === "ArrowLeft") {
			showPrevImage();
		} else if (e.key === "Escape") {
			hideImage();
		}
	});

	// Touch gestures
	let touchstartX = 0;
	let touchendX = 0;
	let touchstartY = 0;
	let touchendY = 0;

	modal.addEventListener(
		"touchstart",
		(e) => {
			touchstartX = e.changedTouches[0].screenX;
			touchstartY = e.changedTouches[0].screenY;
		},
		{ passive: true }
	);

	modal.addEventListener(
		"touchend",
		(e) => {
			touchendX = e.changedTouches[0].screenX;
			touchendY = e.changedTouches[0].screenY;
			handleGesture();
		},
		{ passive: true }
	);

	function handleGesture() {
		const deltaX = Math.abs(touchendX - touchstartX);
		const deltaY = Math.abs(touchendY - touchstartY);
		const minSwipeDistance = 50; // Minimum distance for a swipe
		
		// Only process horizontal swipes, ignore if vertical movement is dominant
		if (deltaX > deltaY && deltaX > minSwipeDistance) {
			if (touchendX < touchstartX) {
				showNextImage();
			} else if (touchendX > touchstartX) {
				showPrevImage();
			}
		}
	}
});
