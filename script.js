const searchForm = document.querySelector("#search-form");
const searchBox = document.querySelector("#search-box");
const searchResult = document.querySelector("#search-result");
const showMoreBtn = document.querySelector("#show-more-btn");
const searchBtn = document.querySelector(".search-data");
const apiKey = "9AqKI41KG345Ec1UafsA0Y1r0XG7Ls9PU6LzR2HrrKQNR5TlpB1T1Wgt";
const errorBox = document.querySelector("#error-message");
let query = "";
let page = 1;
async function getImages() {
  try {
    if (page === 1) {
      searchBox.innerHTML = "";
    }
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=12&page=${page}`,
      { method: "GET", headers: { Authorization: apiKey } }
    );
    if (!response.ok) {
      throw new Error("Invalid Response");
    }

    const data = await response.json();
    const photos = Array.isArray(data.photos) ? data.photos : [];
    if (photos.length === 0) {
      if (page === 1) showError("No images found.");
      showMoreBtn.style.display = "none";
      return;
    }

    photos.forEach((photo) => {
      const image = document.createElement("img");
      image.src = photo.src.medium;
      const linkTag = document.createElement("a");
      linkTag.href = photo.url;
      linkTag.target = "_blank";
      linkTag.append(image);
      searchResult.append(linkTag);
    });

    if (data.next_page) {
      showMoreBtn.style.display = "block"; // dikhado
    } else {
      showMoreBtn.style.display = "none"; // chhupa do
    }

  } catch (err) {
    function showError(message) {
      errorBox.textContent = message;
      errorBox.style.display = "block";
      showMoreBtn.style.display = "none";
    }
    if (err.message === "Failed to fetch") {
      showError("Network error! Please check your internet connection.");
    } else {
      showError(err.message);
    }
  }
}
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  query = searchBox.value.trim();
  if (!query) {
    showError("Please enter a search term.");
    return;
  }
  page = 1;  
  getImages();
});

showMoreBtn.addEventListener("click", () => {
  page++;
  getImages();
});

// 1. response.ok ka matlab
// fetch() se jo response object aata hai, usme ek property hoti hai .ok.
// Ye true hota hai agar HTTP status code 200–299 range me hai (matlab request successful hai).
// Agar status code 200–299 ke bahar hai, to ye false hota hai.
// 500 se 599 wale server error codes hote hain
// 400 se 499 wale client error coedes hain
// 300 se 399 ye redirect ke codes hain
