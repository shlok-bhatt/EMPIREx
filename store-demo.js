(() => {
  "use strict";

  const root = document.querySelector("[data-shop-demo]");
  if (!root) return;

  const dialog = document.getElementById("demo-cart");
  const unitPrice = Number(root.dataset.unitPrice);
  if (!dialog || !Number.isFinite(unitPrice) || unitPrice < 0) return;

  let quantity = 0;

  const formatPrice = (amount) => "₹" + Math.round(amount).toLocaleString("en-IN");
  const nodes = {
    cartQuantity: root.querySelector("[data-cart-quantity]"),
    cartTotal: root.querySelector("[data-cart-total]"),
    checkoutQuantity: root.querySelector("[data-checkout-quantity]"),
    checkoutTotal: root.querySelector("[data-checkout-total]"),
    reviewPanel: root.querySelector("[data-demo-review]"),
    reviewCopy: root.querySelector("[data-review-copy]")
  };

  const update = () => {
    const total = quantity * unitPrice;
    if (nodes.cartQuantity) nodes.cartQuantity.textContent = String(quantity);
    if (nodes.cartTotal) nodes.cartTotal.textContent = formatPrice(total);
    if (nodes.checkoutQuantity) nodes.checkoutQuantity.textContent = String(quantity);
    if (nodes.checkoutTotal) nodes.checkoutTotal.textContent = formatPrice(total);

    const reviewButton = root.querySelector("[data-review-demo]");
    if (reviewButton) reviewButton.disabled = quantity < 1;
    if (nodes.reviewPanel) nodes.reviewPanel.hidden = true;

    const cartButtons = root.querySelectorAll("[data-add-to-cart]");
    cartButtons.forEach((button) => {
      button.setAttribute("aria-label", quantity > 0 ? "Add to demo cart — add another EMPIREx item" : "Add to demo cart — add EMPIREx");
    });
  };

  const openDialog = () => {
    update();
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  };

  const closeDialog = () => {
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
  };

  root.querySelectorAll("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      quantity = Math.min(quantity + 1, 99);
      update();
      openDialog();
    });
  });

  root.querySelector("[data-quantity-increase]")?.addEventListener("click", () => {
    quantity = Math.min(quantity + 1, 99);
    update();
  });

  root.querySelector("[data-quantity-decrease]")?.addEventListener("click", () => {
    quantity = Math.max(quantity - 1, 0);
    update();
  });

  root.querySelector("[data-cart-remove]")?.addEventListener("click", () => {
    quantity = 0;
    update();
  });

  root.querySelector("[data-cart-close]")?.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  root.querySelector("[data-continue-preview]")?.addEventListener("click", () => {
    closeDialog();
    root.querySelector("#checkout-preview")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  root.querySelector("[data-review-demo]")?.addEventListener("click", () => {
    if (quantity < 1 || !nodes.reviewPanel) return;
    if (nodes.reviewCopy) {
      nodes.reviewCopy.textContent =
        "Demonstration summary: " + quantity + (quantity === 1 ? " EMPIREx deck" : " EMPIREx decks") +
        ", illustrative subtotal " + formatPrice(quantity * unitPrice) +
        ". No order has been placed. No customer details or payment information have been collected or transmitted.";
    }
    nodes.reviewPanel.hidden = false;
    nodes.reviewPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  update();
})();
