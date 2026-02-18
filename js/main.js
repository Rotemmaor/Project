$(document).ready(function () {

    // --- Catalog Filtering Logic ---
    // Only run if we are on the catalog page
    if ($('.product-card').length > 0) {

        // Handle Category Checkboxes
        $('input[type="checkbox"][id^="cat-"]').change(function () {
            // Dynamic styling: Highlight label if checked
            var $label = $('label[for="' + $(this).attr('id') + '"]');
            if ($(this).is(':checked')) {
                $label.addClass('fw-bold text-dark').removeClass('text-muted');
            } else {
                $label.removeClass('fw-bold text-dark').addClass('text-muted');
            }
            filterProducts();
        });

        // Handle Condition Checkboxes
        $('input[type="checkbox"][id^="cond-"]').change(function () {
            // Dynamic styling: Highlight label if checked
            var $label = $('label[for="' + $(this).attr('id') + '"]');
            if ($(this).is(':checked')) {
                $label.addClass('fw-bold text-dark').removeClass('text-muted');
            } else {
                $label.removeClass('fw-bold text-dark').addClass('text-muted');
            }
            filterProducts();
        });

        // Handle Search Input (Live Search)
        $('#product-search').on('input', function () {
            filterProducts();
        });

        function filterProducts() {
            // Get selected categories
            var selectedCategories = [];
            $('input[type="checkbox"][id^="cat-"]:checked').each(function () {
                // Get the ID suffix (e.g., 'dresses' from 'cat-dresses')
                var catId = $(this).attr('id').replace('cat-', '');
                selectedCategories.push(catId);
            });

            // Get selected conditions
            var selectedConditions = [];
            $('input[type="checkbox"][id^="cond-"]:checked').each(function () {
                // Get the ID suffix (e.g., 'new' from 'cond-new')
                var condId = $(this).attr('id').replace('cond-', '');
                selectedConditions.push(condId);
            });

            // Iterate through all product cards
            $('.col-md-6.col-xl-4').each(function () {
                var $card = $(this);
                // Read data attributes (fallback to empty string if undefined)
                var productCategory = $card.data('category') || '';
                var productCondition = $card.data('condition') || '';
                var productTitle = $card.find('h3').text().trim().toLowerCase();
                var searchTerm = $('#product-search').val().trim().toLowerCase();

                // Determine if product matches category
                var categoryMatch = true;
                if (selectedCategories.length > 0) {
                    categoryMatch = selectedCategories.includes(productCategory);
                }

                // Determine if product matches condition
                var conditionMatch = true;
                if (selectedConditions.length > 0) {
                    conditionMatch = selectedConditions.includes(productCondition);
                }

                // Determine if product matches search term
                var searchMatch = true;
                if (searchTerm) {
                    searchMatch = productTitle.includes(searchTerm);
                }

                // Show/Hide logic
                if (categoryMatch && conditionMatch && searchMatch) {
                    $card.fadeIn();
                } else {
                    $card.fadeOut();
                }
            });

            // Update "Results count" text
            setTimeout(function () {
                var visible = $('.col-md-6.col-xl-4:visible').length;
                $('.text-\\[\\#6B6B6B\\].mb-0').text(visible + ' פריטים זמינים');
            }, 400);
        }
    }

    // --- Data Passing to Product Details ---
    // Intercept clicks on product links in catalog
    $('.product-card').closest('a').click(function (e) {
        e.preventDefault();
        var $card = $(this).find('.product-card');

        // Extract data
        var title = $card.find('h3').text().trim();
        var price = $card.find('.fw-bold.text-dark').text().trim();
        var originalPrice = $card.find('.text-decoration-line-through').text().trim();
        var imgSrc = $card.find('img').attr('src');
        var brand = $card.find('.small.text-muted').first().text().trim();
        var size = $card.find('p.small.text-muted').last().text().trim().replace('מידה: ', '');

        // Construct URL params
        var params = new URLSearchParams();
        params.set('title', title);
        params.set('price', price);
        params.set('originalPrice', originalPrice);
        params.set('img', imgSrc);
        params.set('brand', brand);
        params.set('size', size);

        // Navigate
        window.location.href = `productdetails.html?title=${encodeURIComponent(title)}&price=${encodeURIComponent(price)}&originalPrice=${encodeURIComponent(originalPrice)}&img=${encodeURIComponent(imgSrc)}&brand=${encodeURIComponent(brand)}&size=${encodeURIComponent(size)}`;
    });

    // --- Product Details Page Dynamic Loading ---
    if (window.location.pathname.includes('productdetails.html')) {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('title')) {
            // Update page content
            $('h1.display-5').text(urlParams.get('title'));
            $('.text-3xl.font-bold').text(urlParams.get('price'));
            $('.text-xl.text-muted').text(urlParams.get('originalPrice'));
            $('.col-md-6 img').attr('src', urlParams.get('img'));

            // Allow user to see "brand" and "size" if we had specific fields, 
            // but for now title/price/img is good proof of concept.
        }
    }

    // --- "Not Implemented" Tooltips & Redirect ---
    $('a[href="#"]').not('.page-link').click(function (e) {
        e.preventDefault();
        window.location.href = 'under-construction.html';
    });

    // Change Text on Hover
    $('a[href="#"]').not('.page-link').hover(function () {
        var $el = $(this);
        // Store original text if not already stored
        if (!$el.data('original-text')) {
            $el.data('original-text', $el.text());
        }

        // Change text to "לא מומש"
        // Check if there are children elements (like icons) to avoid breaking them
        if ($el.children().length === 0) {
            $el.text('לא מומש');
        }
    }, function () {
        var $el = $(this);
        // Restore original text
        if ($el.data('original-text') && $el.children().length === 0) {
            $el.text($el.data('original-text'));
        }
    });

    // --- "Not Implemented" Buttons ---
    // Handle clicks
    $('.btn-not-implemented').click(function (e) {
        e.preventDefault();
        window.location.href = 'under-construction.html';
    });

    // Handle hover (swap content)
    $('.btn-not-implemented').hover(function () {
        var $el = $(this);
        // Store original HTML if not already stored
        if (!$el.data('original-html')) {
            $el.data('original-html', $el.html());
        }

        // Change content to "לא מומש"
        $el.html('לא מומש');
    }, function () {
        var $el = $(this);
        // Restore original HTML
        if ($el.data('original-html')) {
            $el.html($el.data('original-html'));
        }
    });

});
