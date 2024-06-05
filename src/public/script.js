
const url = "https://darill.my.id/api/book";
const container = document.getElementById("output");

async function fetchData() {
  const res = await fetch(url);
  const data = await res.json();

  data.forEach((element) => {
    const row = document.createElement("ul");
    row.innerHTML = `
    <div class="listBook">
    <div>
      <p class="name-book">${element.name}</p>
      <p class="author-book">${element.author}</p>
    </div>
    <div class="button-container">
      <button class="delete-button" onclick="deleteBook(${element.id})">Hapus</button>
      <button class="edit-button">Edit</button>
    </div>
    </div>`;
    container.appendChild(row);
  });
}
fetchData();
// Call the function to fetch data


const deleteBook = async(id) => {
  try {
    const res = await  fetch(`https://darill.my.id/api/book/${id}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      location.reload();
    }
  } catch (error) {
    console.error(error.message)
  }
}