// Додає "sticky" клас при прокручуванні сторінки
const navbar = document.querySelector("nav");
window.addEventListener("scroll", () => 
    navbar.classList.toggle("sticky", window.scrollY > 0)
);

document.addEventListener("DOMContentLoaded", function () {
    const menu = document.querySelector("nav .menu");
    const openBtn = document.querySelector("nav .menu-btn");
    const closeBtn = document.querySelector("nav .close-btn");

    openBtn.addEventListener("click", function () {
        menu.classList.add("menu-active");
    });

    closeBtn.addEventListener("click", function () {
        menu.classList.remove("menu-active");
    });
});


document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".toggle-info-btn").forEach(button => {
        button.addEventListener("click", function () {
            const carInfo = this.nextElementSibling;
            carInfo.classList.toggle("show");
        });
    });
});

// Функція для вибору авто та переходу на booking.html
function bookCar(carModel) {
    window.location.href = "booking.html?car=" + encodeURIComponent(carModel);
}

// Автоматичне встановлення вибраного авто в списку на сторінці booking.html
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const carModel = params.get("car");
    if (carModel) {
        const carSelectInput = document.getElementById("car-select-input");
        if (carSelectInput) {
            carSelectInput.value = carModel;
        }
    }
});

// 1. Забороняємо вибір дати в минулому
document.addEventListener("DOMContentLoaded", function () {
    let today = new Date().toISOString().split('T')[0];
    document.querySelector('#date-start').setAttribute('min', today);
    document.querySelector('#date-end').setAttribute('min', today);
});

// 2. Показ бронювань (не змінено)
document.addEventListener("DOMContentLoaded", function () {
    const bookingsListContainer = document.getElementById("bookings-list");
    const noBookingsMessage = document.getElementById("no-bookings");

    if (!bookingsListContainer || !noBookingsMessage) return; // Якщо ми не на тій сторінці

    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    if (bookings.length === 0) {
        noBookingsMessage.style.display = "block";
    } else {
        noBookingsMessage.style.display = "none";

        bookings.forEach((booking, index) => {
            const bookingItem = document.createElement("div");
            bookingItem.className = "booking-entry";
            bookingItem.innerHTML = `
                <h3>Бронювання #${index + 1}</h3>
                <p><strong>Ім’я:</strong> ${booking.name}</p>
                <p><strong>Email:</strong> ${booking.email}</p>
                <p><strong>Телефон:</strong> ${booking.phone}</p>
                <p><strong>Авто:</strong> ${booking.carType}</p>
                <p><strong>З:</strong> ${booking.dateStart} <strong>по:</strong> ${booking.dateEnd}</p>
                <hr>
            `;
            bookingsListContainer.appendChild(bookingItem);
        });
    }
});

// 3. Основна логіка бронювання
function saveBooking() {
    const carType = document.getElementById('car-select-input').value;
    const dateStart = document.getElementById('date-start').value;
    const dateEnd = document.getElementById('date-end').value;
    const name = document.querySelector('input[name="name"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const phone = document.querySelector('input[name="phone"]').value.trim();

    // порожні поля
    if (!carType || !dateStart || !dateEnd || !name || !email || !phone) {
        alert("Будь ласка, заповніть всі поля перед бронюванням!");
        return;
    }

    // дата закінчення < початку
    if (dateEnd < dateStart) {
        alert("Дата закінчення не може бути раніше за дату початку!");
        return;
    }

    // правильність імені (лише букви, мінімум 2 символи)
    if (!/^[А-Яа-яA-Za-zІіЇїЄєҐґ]{2,}( [А-Яа-яA-Za-zІіЇїЄєҐґ]{2,})?$/.test(name)) {
        alert("Введіть коректне ім’я (тільки літери, мінімум 2 символи).");
        return;
    }

    // правильність email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Введіть коректну адресу електронної пошти.");
        return;
    }

    // телефон (10-15 цифр, дозволяємо +, пробіли, тире)
    if (!/^\+?[0-9\s\-]{10,15}$/.test(phone)) {
        alert("Введіть коректний номер телефону (10-15 цифр).");
        return;
    }

    // кількість машин
    const carItems = document.querySelectorAll('.car-select-item');
    let available = true;
    carItems.forEach(item => {
        const label = item.querySelector('label');
        const h6 = item.querySelector('h6');
        if (label && h6 && label.textContent.includes('Назва машини') && h6.textContent.trim() === "0") {
            if (carType === document.querySelector('#car-select-input').value) {
                available = false;
            }
        }
    });

    if (!available) {
        alert("Вибраної машини більше немає в наявності!");
        return;
    }

    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    //чи машина вже заброньована на ті дати
    const alreadyBooked = bookings.some(b => 
        b.carType === carType &&
        !(dateEnd < b.dateStart || dateStart > b.dateEnd)
    );

    if (alreadyBooked) {
        alert("Ця машина вже заброньована на вибрані дати!");
        return;
    }

    const bookingData = {
        carType,
        dateStart,
        dateEnd,
        name,
        email,
        phone
    };

    bookings.push(bookingData);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    console.log("Бронювання збережено:", bookingData);
    window.location.href = 'yourbooks.html';
}

console.log("js rabotae");