const wrapperEl = document.querySelector(".wrapper");
const loadingEl = document.querySelector(".loading");
const btnSeemore = document.querySelector(".btn__seemore");
const collectionEl = document.querySelector(".collection");
const categoryLoadingEl = document.querySelector(".category__loading");
const BASE_URL = "https://dummyjson.com";

const perPageCount = 10;
let offset = 0;
let productEndpoint = "/products";

async function fetchData(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  response
    .json()
    .then((res) => {
      createCard(res);
      if (res.total <= perPageCount + offset * perPageCount) {
        btnSeemore.style.display = "none";
      } else {
        btnSeemore.style.display = "block";
      }
    })
    .catch((err) => console.log(err))
    .finally(() => {
      loadingEl.style.display = "none";
      btnSeemore.removeAttribute("disabled");
      btnSeemore.textContent = "See more";
    });
}

window.addEventListener("load", () => {
  collectionEl.style.display = "none";
  createLoading(perPageCount);
  fetchData(`${productEndpoint}?limit=${perPageCount}`);
  fetchCategory("/products/category-list");
});

function createLoading(n) {
  loadingEl.style.display = "grid";
  loadingEl.innerHTML = null;
  Array(n)
    .fill()
    .forEach(() => {
      const div = document.createElement("div");
      div.className = "loading__item";
      div.innerHTML = `
            <div class="loading__image to-left"></div>
            <div class="loading__title to-left"></div>
            <div class="loading__title to-left"></div>
        `;
      loadingEl.appendChild(div);
    });
}

function createCard(data) {
  // while(wrapperEl.firstChild){
  //     wrapperEl.firstChild.remove()
  // }
  data.products.forEach((product) => {
    const divEl = document.createElement("div");
    divEl.className = "card";
    divEl.innerHTML = `
            <img data-id=${product.id} src=${product.thumbnail} alt="rasm">
            <h3>${product.title}</h3>
            <p>${product.price} USD</p>
            <button>Buy now</button>
        `;
    wrapperEl.appendChild(divEl);
  });
}

btnSeemore.addEventListener("click", () => {
  btnSeemore.setAttribute("disabled", true);
  btnSeemore.textContent = "Loading...";
  createLoading(perPageCount);
  offset++;

  fetchData(
    `${productEndpoint}?limit=${perPageCount}&skip=${offset * perPageCount}`
  );
});

async function fetchCategory(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  response
    .json()
    .then((res) => {
      createCategory(res);
    })
    .catch()
    .finally(() => {
      categoryLoadingEl.style.display = "none";
      collectionEl.style.display = "flex";
    });
}

function createCategory(data) {
  ["all", ...data].forEach((category) => {
    const listEl = document.createElement("li");
    listEl.className = category === "all" ? "item active" : "item";
    listEl.dataset.category =
      category === "all" ? "/products" : `/products/category/${category}`;
    listEl.textContent = category;
    collectionEl.appendChild(listEl);
    listEl.addEventListener("click", (e) => {
      let endpoint = e.target.dataset.category;

      productEndpoint = endpoint;
      offset = 0;
      wrapperEl.innerHTML = null;
      fetchData(`${endpoint}?limit=${perPageCount}`);
      document.querySelectorAll(".collection .item").forEach((i) => {
        i.classList.remove("active");
      });
      e.target.classList.add("active");
    });
  });
}

wrapperEl.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") {
    // BOM
    open(`/pages/product.html?id=${e.target.dataset.id}`, "_self");
  }
});
