/*
  BURGER HUB - script.js
    1. Mobile Navigation
    2. Shopping Cart
    3. Contact Form Validation
    4. Watch Video Modal
   */


/* ==========      1. MOBILE NAVIGATION       ========== */

// Select the elements we need
const navToggleButton = document.querySelector("#nav-toggle");
const mainNav = document.querySelector("#main-nav");
const navLinks = document.querySelectorAll(".nav-link");

// Close the menu and update the accessibility attributes
function closeMenu() {
  mainNav.classList.remove("is-open");
  navToggleButton.setAttribute("aria-expanded", "false");
  navToggleButton.setAttribute("aria-label", "Open main menu");
}

// Open the menu when closed, close it when open
navToggleButton.addEventListener("click", function () {
  // toggle() adds the class if missing, removes it if present,
  // and returns true (class added) or false (class removed)
  const menuIsOpen = mainNav.classList.toggle("is-open");

  navToggleButton.setAttribute("aria-expanded", String(menuIsOpen));
  navToggleButton.setAttribute(
    "aria-label",
    menuIsOpen ? "Close main menu" : "Open main menu"
  );
});

// Close the menu when a navigation link is clicked
navLinks.forEach(function (link) {
  link.addEventListener("click", closeMenu);
});


/* =======       2. SHOPPING CART          ========== */

// Elements that already exist in index.html
const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
const cartCountElement = document.querySelector("#cart-count");

// Optional elements (you need to add them to the HTML - see instructions).
// If they are missing, these variables will be null and the code skips them.
const cartItemsTotalElement = document.querySelector("#cart-items-total");
const cartSubtotalElement = document.querySelector("#cart-subtotal");
const cartMessageElement = document.querySelector("#cart-message");

// The cart is an array of objects: { name: "...", price: 5.49, quantity: 1 }
let cartItems = [];
let cartMessageTimer; // used to hide the message after a few seconds

// Add a product to the cart (or increase its quantity if already there)
function addToCart(name, price) {
  let existingItem = null;

  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i].name === name) {
      existingItem = cartItems[i];
    }
  }

  if (existingItem) {
    existingItem.quantity = existingItem.quantity + 1;
  } else {
    cartItems.push({ name: name, price: price, quantity: 1 });
  }
}

// Count every item in the cart (2 burgers + 1 pizza = 3)
function getTotalItems() {
  let total = 0;
  for (let i = 0; i < cartItems.length; i++) {
    total = total + cartItems[i].quantity;
  }
  return total;
}

// Add up price x quantity for every item
function getSubtotal() {
  let subtotal = 0;
  for (let i = 0; i < cartItems.length; i++) {
    subtotal = subtotal + cartItems[i].price * cartItems[i].quantity;
  }
  return subtotal;
}

// Show the new numbers on the page
function updateCartDisplay() {
  const totalItems = getTotalItems();
  const subtotal = getSubtotal();

  cartCountElement.textContent = totalItems;

  if (cartItemsTotalElement) {
    cartItemsTotalElement.textContent = totalItems;
  }
  if (cartSubtotalElement) {
    // toFixed(2) always shows two decimals, e.g. $5.40
    cartSubtotalElement.textContent = "$" + subtotal.toFixed(2);
  }
}

// Show a short message, then clear it after 3 seconds
function showCartMessage(message) {
  if (!cartMessageElement) {
    return; // the message element is not in the HTML yet
  }

  cartMessageElement.hidden = false;
  cartMessageElement.textContent = message;

  clearTimeout(cartMessageTimer);
  cartMessageTimer = setTimeout(function () {
    cartMessageElement.textContent = "";
    cartMessageElement.hidden = true;
  }, 3000);
}

// Listen for a click on every Add to Cart button
addToCartButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Read the data-* attributes from the button
    const productName = button.dataset.productName;
    const productPrice = Number(button.dataset.productPrice); // text -> number

    // Prevent a missing name or an invalid / zero / negative price
    if (!productName || isNaN(productPrice) || productPrice <= 0) {
      showCartMessage("Sorry, this item cannot be added right now.");
      return;
    }

    addToCart(productName, productPrice);
    updateCartDisplay();
    showCartMessage(productName + " was added to your cart. Yum!");
  });
});


/* ===========      3. CONTACT FORM VALIDATION       ============ */

const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");

// Turn off the browser's own pop-up messages so ours are shown.
// (You can also add the "novalidate" attribute to the <form> tag instead.)
contactForm.noValidate = true;

// Each field is an object holding its input and its error paragraph
const nameField = {
  input: document.querySelector("#contact-name"),
  error: document.querySelector("#contact-name-error")
};
const emailField = {
  input: document.querySelector("#contact-email"),
  error: document.querySelector("#contact-email-error")
};
const subjectField = {
  input: document.querySelector("#contact-subject"),
  error: document.querySelector("#contact-subject-error")
};
const messageField = {
  input: document.querySelector("#contact-message"),
  error: document.querySelector("#contact-message-error")
};
const allFields = [nameField, emailField, subjectField, messageField];

// Simple pattern: some text, an @, some text, a dot, some text (no spaces)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Show an error under a field
function showFieldError(field, message) {
  field.error.textContent = message;
  field.error.hidden = false;
  field.input.setAttribute("aria-invalid", "true");
  field.input.setAttribute("aria-describedby", field.error.id);
}

// Remove the error from a field
function clearFieldError(field) {
  field.error.textContent = "";
  field.error.hidden = true;
  field.input.removeAttribute("aria-invalid");
  field.input.removeAttribute("aria-describedby");
}

// Check that a field is not empty. Returns true or false.
function checkRequired(field, message) {
  if (field.input.value.trim() === "") {
    showFieldError(field, message);
    return false;
  }
  clearFieldError(field);
  return true;
}

// Check the email: required first, then the format
function checkEmail() {
  const emailValue = emailField.input.value.trim();

  if (emailValue === "") {
    showFieldError(emailField, "Please enter your email address.");
    return false;
  }
  if (!emailPattern.test(emailValue)) {
    showFieldError(emailField, "Please enter a valid email, like name@example.com.");
    return false;
  }
  clearFieldError(emailField);
  return true;
}

// Run when the user presses the Submit button
contactForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading / submitting

  // Check every field (each check returns true or false)
  const nameIsValid = checkRequired(nameField, "Please enter your full name.");
  const emailIsValid = checkEmail();
  const subjectIsValid = checkRequired(subjectField, "Please enter a subject.");
  const messageIsValid = checkRequired(messageField, "Please write a message.");

  if (nameIsValid && emailIsValid && subjectIsValid && messageIsValid) {
    // Everything is correct. NOTE: nothing is sent anywhere in this demo.
    const visitorName = nameField.input.value.trim();

    formFeedback.textContent =
      "Thank you, " + visitorName + "! Your message looks good. " +
      "(This demo form does not send emails yet.)";
    formFeedback.hidden = false;

    contactForm.reset(); // empty all the fields
  } else {
    formFeedback.hidden = true;

    // Move the cursor to the first field that has a problem
    if (!nameIsValid) {
      nameField.input.focus();
    } else if (!emailIsValid) {
      emailField.input.focus();
    } else if (!subjectIsValid) {
      subjectField.input.focus();
    } else {
      messageField.input.focus();
    }
  }
});

// Remove a field's error as soon as the user starts typing in it
allFields.forEach(function (field) {
  field.input.addEventListener("input", function () {
    clearFieldError(field);
  });
});


/* ===========      4. WATCH VIDEO MODAL      =========== */

const watchVideoButton = document.querySelector("#watch-video-btn");
const videoModal = document.querySelector("#video-modal"); // a <dialog> element
const closeVideoButton = document.querySelector("#close-video-btn");

// Open the modal. showModal() also dims the page and traps keyboard focus.
function openVideoModal() {
  videoModal.showModal();
}

// Close the modal
function closeVideoModal() {
  if (videoModal.open) {
    videoModal.close();
  }
}

watchVideoButton.addEventListener("click", openVideoModal);
closeVideoButton.addEventListener("click", closeVideoModal);

// Click outside the content: clicks on the dark background
// have the <dialog> itself as event.target
videoModal.addEventListener("click", function (event) {
  if (event.target === videoModal) {
    closeVideoModal();
  }
});

// Press Escape to close
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeVideoModal();
  }
});

// The "close" event fires every time the modal closes (button, background
// click or Escape), so this one place sends focus back to the Watch Video button
videoModal.addEventListener("close", function () {
  watchVideoButton.focus();
});




// ==================== Dark Mode Toggle ====================== //

const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");

// Get saved theme //
const savedTheme = localStorage.getItem("burger-theme");

//  Apply saved theme //
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeIcon.textContent = "Light";
  themeToggle.setAttribute("aria-label", "switch to light mode");
}

// Toggle theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDarkMode = 
  document.body.classList.contains("dark-mode");

  if (isDarkMode) {
    themeIcon.textContent = "Light";
    themeToggle.setAttribute("aria-label", "switch to light mode");
    localStorage.setItem("burger-theme", "dark");
  } else{
    themeIcon.textContent = "Dark"
    themeToggle.setAttribute("aria-label", "switch to dark mode");
    localStorage.setItem("burger-theme", "light");
  }
});