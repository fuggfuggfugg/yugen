/*
	Multiverse by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ]
		});

	// Hack: Enable IE workarounds.
		if (browser.name == 'ie')
			$body.addClass('ie');

	// Touch?
		if (browser.mobile)
			$body.addClass('touch');

	// Transitions supported?
		if (browser.canUse('transition')) {

			// Play initial animations on page load.
				$window.on('load', function() {
					window.setTimeout(function() {
						$body.removeClass('is-preload');
					}, 100);
				});

			// Prevent transitions/animations on resize.
				var resizeTimeout;

				$window.on('resize', function() {

					window.clearTimeout(resizeTimeout);

					$body.addClass('is-resizing');

					resizeTimeout = window.setTimeout(function() {
						$body.removeClass('is-resizing');
					}, 100);

				});

		}

	// Scroll back to top.
		$window.scrollTop(0);

	// Panels.
		var $panels = $('.panel');

		$panels.each(function() {

			var $this = $(this),
				$toggles = $('[href="#' + $this.attr('id') + '"]'),
				$closer = $('<div class="closer" />').appendTo($this);

			// Closer.
				$closer
					.on('click', function(event) {
						$this.trigger('---hide');
					});

			// Events.
				$this
					.on('click', function(event) {
						event.stopPropagation();
					})
					.on('---toggle', function() {

						if ($this.hasClass('active'))
							$this.triggerHandler('---hide');
						else
							$this.triggerHandler('---show');

					})
					.on('---show', function() {

						// Hide other content.
							if ($body.hasClass('content-active'))
								$panels.trigger('---hide');

						// Activate content, toggles.
							$this.addClass('active');
							$toggles.addClass('active');

						// Activate body.
							$body.addClass('content-active');

					})
					.on('---hide', function() {

						// Deactivate content, toggles.
							$this.removeClass('active');
							$toggles.removeClass('active');

						// Deactivate body.
							$body.removeClass('content-active');

					});

			// Toggles.
				$toggles
					.removeAttr('href')
					.css('cursor', 'pointer')
					.on('click', function(event) {

						event.preventDefault();
						event.stopPropagation();

						$this.trigger('---toggle');

					});

		});

		// Global events.
			$body
				.on('click', function(event) {

					if ($body.hasClass('content-active')) {

						event.preventDefault();
						event.stopPropagation();

						$panels.trigger('---hide');

					}

				});

			$window
				.on('keyup', function(event) {

					if (event.keyCode == 27
					&&	$body.hasClass('content-active')) {

						event.preventDefault();
						event.stopPropagation();

						$panels.trigger('---hide');

					}

				});

	// Header.
		var $header = $('#header');

		// Links.
			$header.find('a').each(function() {

				var $this = $(this),
					href = $this.attr('href');

				// Internal link? Skip.
					if (!href
					||	href.charAt(0) == '#')
						return;

				// Redirect on click.
					$this
						.removeAttr('href')
						.css('cursor', 'pointer')
						.on('click', function(event) {

							event.preventDefault();
							event.stopPropagation();

							window.location.href = href;

						});

			});

	// Footer.
		var $footer = $('#footer');

		// Copyright.
		// This basically just moves the copyright line to the end of the *last* sibling of its current parent
		// when the "medium" breakpoint activates, and moves it back when it deactivates.
			$footer.find('.copyright').each(function() {

				var $this = $(this),
					$parent = $this.parent(),
					$lastParent = $parent.parent().children().last();

				breakpoints.on('<=medium', function() {
					$this.appendTo($lastParent);
				});

				breakpoints.on('>medium', function() {
					$this.appendTo($parent);
				});

			});

	// Main.
		var $main = $('#main');

		// build filters
		// <button data-year="2025" class="primary">2023</button>
		// <button data-year="2024">2024</button>
		// <button data-year="2023">2025</button>

		$.getJSON('images/images.json', function(images) {
			images.sort(function(a, b) {
			  const dateA = a.filename.substring(0, 10);
			  const dateB = b.filename.substring(0, 10);

			  // Compare date descending
			  if (dateA > dateB) return -1;
			  if (dateA < dateB) return 1;

			  // Same date — compare suffix descending
			  function getSuffix(filename) {
			    const name = filename.replace(/\.[^/.]+$/, ""); // strip extension
			    const parts = name.split("-");
			    if (parts.length > 3) {
			      const n = parseInt(parts[3], 10);
			      return isNaN(n) ? -Infinity : n; // Non-number suffix goes first
			    }
			    return 0; // no suffix, lowest number
			  }

			  const suffixA = getSuffix(a.filename);
			  const suffixB = getSuffix(b.filename);

			  return suffixB - suffixA; // descending order for suffix
			});

			// --- Assign global counter (newest gets largest number) ---
			images.forEach((img, i) => {
			    img.idx = images.length - i; // oldest = 1, newest = max
			});

		    // Extract unique years
		    let years = [...new Set(images.map(img => img.filename.substring(0, 4)))].sort().reverse();

		    // Create filter buttons
		    let filterContainer = $('#year-tabs');
		    filterContainer.empty();
		    //filterContainer.append(`<button class="filter-btn" data-year="all">All</button> `);
		    years.forEach(year => {
		        filterContainer.append(`<button class="filter-btn" data-year="${year}">${year}</button> `);
		    });

		    // Open image popup by filename
		    function openImagePopup(filename) {
		        let $link = $(`a.image[data-file="${filename}"]`);
		        if ($link.length) {
		            $link.trigger('click');
		        }
		    }

		    // Function to apply filter and render gallery
		    function applyFilter(year) {
		        $('.filter-btn').removeClass('primary');
		        if(year === 'all' || !year) {
		            $('.filter-btn[data-year="all"]').addClass('primary');
		        } else {
		            $('.filter-btn[data-year="' + year + '"]').addClass('primary');
		        }

		        let filtered = (year === "all" || !year) ? images : images.filter(img => img.filename.startsWith(year));
		        renderGallery(filtered);
		    }

		    // Initial load: check URL hash for year or filename
		    let hash = window.location.hash.substring(1);
		    if (hash) {
		        if (/^\d{4}$/.test(hash)) {
		            // Hash is a year
		            applyFilter(hash);
		        } else {
		            // Hash is an image filename
		            let yearFromFilename = hash.substring(0, 4);
		            applyFilter(yearFromFilename);
		            // Delay popup to allow gallery render & poptrox init
		            setTimeout(() => {
		                openImagePopup(hash);
		            }, 300);
		        }
		    } else {
		        // No hash, show all or default year (e.g., first year)
		        applyFilter("2025");
		    }

		    // Filter on click
		    $(document).on('click', '.filter-btn', function() {
		        let year = $(this).data('year');
		        applyFilter(year);
		        window.location.hash = year;
		    });

		    // Optional: respond to hashchange event (e.g. user presses back button)
		    $(window).on('hashchange', function() {
		        let year = window.location.hash ? window.location.hash.substring(1) : 'all';
		        if(year !== 'all' && !years.includes(year)) {
		            year = 'all';
		        }
		        applyFilter(year);
		    });
		});


		function renderGallery(imageList) {
			let gallery = $('#main');
			gallery.empty();
			imageList.forEach(item => {
				gallery.append(`
					<article class="thumb">
						<a href="images/art/${item.filename}" data-file="${item.filename}" class="image"><img loading="lazy" src="images/art/${item.filename}" alt="${item.title}" /></a>
						<h2><b>#${item.idx}</b> · ${item.title}</h2>
						<p>${item.desc}</p>
					</article>
				`);
			});

			// renderThumbs();
			setupPoptrox()
		}

		// Thumbs.
		function renderThumbs(){
			var $main = $('#main');
			$main.children('.thumb').each(function() {

				var	$this = $(this),
					$image = $this.find('.image'), $image_img = $image.children('img'),
					x;

				// No image? Bail.
					if ($image.length == 0)
						return;

				// Image.
				// This sets the background of the "image" <span> to the image pointed to by its child
				// <img> (which is then hidden). Gives us way more flexibility.

				// Set background.
					$image.css('background-image', 'url("' + $image_img.attr('src') + '")');


				// Set background position.
					if (x = $image_img.data('position'))
						$image.css('background-position', x);

				// Hide original img.
					$image_img.hide();

			});
		}

		// Poptrox.
		function setupPoptrox() {
			$main.poptrox({
				baseZIndex: 20000,
				caption: function($a) {

					var s = '';

					$a.nextAll().each(function() {
						s += this.outerHTML;
					});

					return s;

				},
				fadeSpeed: 300,
				onPopupClose: function() { $body.removeClass('modal-active'); },
				onPopupOpen: function() { $body.addClass('modal-active'); },
				onImageLoaded: function(e,i) { 
					$img = $('.image > img[src="'+ e.src +'"]');
					$img[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); 
					$('.image').removeClass("active");
					$img.parent().addClass("active");
				},
				overlayOpacity: 0.5,
				popupCloserText: '',
				popupHeight: 150,
				popupLoaderText: '',
				popupSpeed: 300,
				popupWidth: 150,
				selector: '.thumb > a.image',
				usePopupCaption: true,
				usePopupCloser: true,
				usePopupDefaultStyling: false,
				usePopupForceClose: true,
				usePopupLoader: true,
				usePopupNav: true,
				windowMargin: 50,
				usePopupEasyClose: false
			});
		
			// Hack: Set margins to 0 when 'xsmall' activates.
			breakpoints.on('<=xsmall', function() {
				$main[0]._poptrox.windowMargin = 20;
			});

			breakpoints.on('>xsmall', function() {
				$main[0]._poptrox.windowMargin = 50;
			});

		}

})(jQuery);
