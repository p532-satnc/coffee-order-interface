document.addEventListener("DOMContentLoaded", function () {

    const startOrderBtn = document.getElementById("startOrderBtn");

    if (startOrderBtn) {
            startOrderBtn.addEventListener("click", function () {

                window.location.href = "beverage.html";
            });
        }

    const beverageForm = document.getElementById("beverageForm");
    const beverageButtons = document.querySelectorAll(".beverage-btn");

    let selectedBeverage = null;

    if (beverageButtons.length > 0) {
        beverageButtons.forEach(button => {
            button.addEventListener("click", function () {

                beverageButtons.forEach(btn => btn.classList.remove("selected"));

                this.classList.add("selected");
                selectedBeverage = this.getAttribute("data-value");
            });
        });
    }

    if (beverageForm) {
        beverageForm.addEventListener("submit", function (event) {
            event.preventDefault();
            if (!selectedBeverage) {
                alert("Please select a beverage!");
                return;
            }
            localStorage.setItem("beverage", selectedBeverage);
            window.location.href = "condiments.html";
        });
    }

    const condimentsForm = document.getElementById("condimentsForm");
    const condimentButtons = document.querySelectorAll(".condiment-btn");

    let selectedCondiments = new Set();

    if (condimentButtons.length > 0) {
        condimentButtons.forEach(button => {
            button.addEventListener("click", function () {
                const value = this.getAttribute("data-value");
                if (selectedCondiments.has(value)) {
                    selectedCondiments.delete(value);
                    this.classList.remove("selected");
                } else {
                    selectedCondiments.add(value);
                    this.classList.add("selected");
                }
            });
        });
    }

    if (condimentsForm) {
        condimentsForm.addEventListener("submit", function (event) {
            event.preventDefault();
            localStorage.setItem("condiments", JSON.stringify([...selectedCondiments]));
            window.location.href = "order.html";
        });
    }

    const orderSummary = document.getElementById("orderSummary");

    if (!orderSummary) {
            console.error("Order summary element not found!");
            return;
        }

    if (orderSummary) {
        const beverage = localStorage.getItem("beverage") || "No beverage selected";
        const condiments = JSON.parse(localStorage.getItem("condiments") || "[]");


        fetch("https://coffee-order-latest-12y9.onrender.com/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ beverage, condiments })
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Full response from backend:", data);
                    orderSummary.innerHTML = `
                        <h2>Order Summary</h2>
                        <p><strong>Order ID:</strong> ${data.id}</p>
                        <p><strong>Beverage:</strong> ${beverage}</p>
                        <p><strong>Condiments:</strong> ${condiments.length > 0 ? condiments.join(", ") : "None"}</p>
                        <p><strong>Total Cost:</strong> $${data.cost.toFixed(2)}</p>
                    `;
                    localStorage.clear();
                })
                .catch(error => {
                    orderSummary.innerHTML = `<p style="color: red;">Error placing order. Please try again.</p>`;
                    console.error("Error placing order:", error);
                });
            }


    const homeButton = document.getElementById("homeButton");

    if (homeButton) {
            homeButton.addEventListener("click", function () {
                window.location.href = "index.html";
            });
        }

});
