
const url = "https://darill.my.id/api/book";
const container = document.getElementById("output");

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");

// close modal function
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// close the modal when the close button and overlay is clicked
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// open modal function
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
// open modal event
openModalBtn.addEventListener("click", openModal);


async function fetchData() {
    const res = await fetch(url);
    const data = await res.json();

    data.forEach((element) => {
        const row = document.createElement("ul");
        row.innerHTML = `
                <li key=${element.id}>${element.name} ${element.author}</li>
            `;
        container.appendChild(row);
    });
}
fetchData();
// Call the function to fetch data
