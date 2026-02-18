document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    // Prevent default HTML5 validation to use our custom validation
    form.setAttribute('novalidate', true);

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (validateForm()) {
            form.submit(); // Submit the form to process_upload.php
        }
    });

    function validateForm() {
        let isValid = true;

        // Clear previous error messages
        document.querySelectorAll('.error-feedback').forEach(el => el.remove());
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        // 1. Validate Description Length (Minimum 20 chars)
        const description = form.querySelector('textarea');
        if (description.value.length < 20) {
            showError(description, 'נא להזין תיאור של לפחות 20 תווים');
            isValid = false;
        }

        // 2. Validate Price (Must be positive)
        const priceInput = document.getElementById('currentPrice');
        const originalPriceInput = document.getElementById('originalPrice');

        // Basic price validation
        if (!priceInput.value || parseFloat(priceInput.value) <= 0) {
            showError(priceInput, 'נא להזין מחיר חוקי גדול מ-0');
            isValid = false;
        }

        // Validate Original Price (must be higher than current price if entered)
        if (originalPriceInput.value && originalPriceInput.value.trim() !== '') {
            const currentPrice = parseFloat(priceInput.value);
            const originalPrice = parseFloat(originalPriceInput.value);

            if (originalPrice <= currentPrice) {
                showError(originalPriceInput, 'המחיר המקורי חייב להיות גבוה ממחיר המכירה');
                isValid = false;
            }
        }

        // 3. Validate Category Selection
        const categorySelect = form.querySelectorAll('select')[0];
        if (categorySelect.selectedIndex === 0) {
            showError(categorySelect, 'נא לבחור קטגוריה');
            isValid = false;
        }

        // 4. Validate Condition Selection
        const conditionSelect = form.querySelectorAll('select')[1];
        if (conditionSelect.selectedIndex === 0) {
            showError(conditionSelect, 'נא לבחור את מצב הפריט');
            isValid = false;
        }

        // 5. Validate Title
        const titleInput = form.querySelector('input[name="title"]');
        const titleValue = titleInput.value.trim();
        if (!titleValue) {
            showError(titleInput, 'נא להזין כותרת למוצר');
            isValid = false;
        } else if (titleValue.split(/\s+/).length < 2) {
            showError(titleInput, 'הכותרת חייבת להכיל לפחות 2 מילים');
            isValid = false;
        }


        // 6. Validate Brand (Letters only)
        const brandInput = form.querySelector('input[name="brand"]');
        if (brandInput.value.trim() !== '') {
            const brandPattern = /^[a-zA-Z\u0590-\u05FF\s]+$/;
            if (!brandPattern.test(brandInput.value)) {
                showError(brandInput, 'שם המותג חייב להכיל אותיות בלבד');
                isValid = false;
            }
        }

        return isValid;
    }

    function showError(element, message) {
        element.classList.add('is-invalid');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-feedback text-danger small mt-1';
        errorDiv.innerText = message;
        element.parentElement.appendChild(errorDiv);

        // Handle input-group specific structure
        if (element.parentElement.classList.contains('input-group')) {
            element.parentElement.parentElement.appendChild(errorDiv);
        }
    }
});
