// Consumer Key && Consumer Secret
const consumerKey = "lcSCxdPmqTHIbWMiCmBT";
const consumerSecret = "OKPFUYvAGKHMkxbCQjGqUIVOVkhFYBiX";
const authConsumer = `key=${consumerKey}&secret=${consumerSecret}`;
//Test endPoint base URL Discogs ej base
const baseURL = "https://api.discogs.com/database/";

//form-inputs
const searchSingleInput = document.getElementById("search-query");
const selectGenreMenu = document.getElementById("menu-genre");
// radio buttons
const btnFormatRadio7 = document.getElementById("7");
const btnFormatRadio12 = document.getElementById("12");
let btnRadioValue = "7";

function switchleFormatChange(e) {
  if (e.target.checked) {
    btnRadioValue = e.target.value;
  }
}
btnFormatRadio7.addEventListener("change", switchleFormatChange);
btnFormatRadio12.addEventListener("change", switchleFormatChange);

//submit btn
const btnSearch = document.getElementById("search-btn");
let currentQueryType = undefined;

//principal search function
async function searchReleasesByQuery(query, genre, format, page, label) {
  if (currentQueryType !== label ? "label" : "search") {
    currentQueryType = label ? "label" : "search";
    emptyContainer("discos");
    console.log(currentQueryType);
  }

  // validaciones inputs
  const searchQuery = query.replace(/ /g, "-");
  const searchGenre = `&genre=funk+%2F+soul`;
  const searchStyle = `&style=${genre}`;
  const nameofLabel = label !== undefined ? `&label=${label}` : "";
  const filterFormat = `&format=${format}`;
  const numberOfPage = page !== 1 ? `&page=${page}` : "";

  const url = `${baseURL}search?q=${searchQuery}&type=release${filterFormat}${searchGenre}${searchStyle}${nameofLabel}${numberOfPage}&${authConsumer}`;
  console.log(url);

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    const originalPaginationResults = data.pagination;
    const originalResults = [...data.results];

    if (originalPaginationResults.items > 1) {
      await showDiscosData(
        originalResults,
        filterFormat,
        originalPaginationResults,
        label
      );
    }

    createFilterButton(
      originalResults,
      filterFormat,
      originalPaginationResults,
      "year"
    );
    createFilterButton(
      originalResults,
      filterFormat,
      originalPaginationResults,
      "most wanted"
    );
  } catch (error) {
    console.error("Error on Search Results:", error);
  }
}

async function showDiscosData(results, format, pagination, label) {
  resultsContainer = document.querySelector("#results");
  resultsContainer.style.display = "block";
  // crear copia de template
  const container = document.querySelector(".discos");
  const template = document.querySelector("#disco").content;
  // Mostrar los resultados en el elemento HTML
  for (const disco of results) {
    const div = template.cloneNode(true);
    const aSingleHref = div.querySelector("a");
    const coverDiscoImg = div.querySelector("img");

    const divDiscoInfo = div.querySelector(".disco-info");
    const discoTitleP = divDiscoInfo.querySelector(".disco-title");
    const discoYearP = divDiscoInfo.querySelector(".disco-year");
    const discoLabelP = divDiscoInfo.querySelector(".disco-label");

    aSingleHref.href = `single.html?release_id=${disco.id}&master_id=${disco.master_id}${format}&type=search`;

    // convertir a funcion de validacion y response 429 // demasiadas peticiones
    coverDiscoImg.src =
      disco.cover_image.includes("spacer.gif") || disco.cover_image === ""
        ? "./../img/cover.jpg"
        : disco.cover_image;
    coverDiscoImg.alt = disco.title;

    discoTitleP.textContent = disco.title;
    discoYearP.textContent = `${disco.country} — ${disco.year}`;
    discoLabelP.textContent = disco.label[0];

    container.appendChild(div);
  }
  if (currentQueryType === "search" && label === undefined) {
    await createPagination(pagination);
  } else {
    document.querySelector(".pagination").innerHTML = "";
  }
}

function createFilterButton(
  originalResults,
  filterFormat,
  originalPaginationResults,
  sortButton
) {
  const filtersContainer = document.querySelector(".disco-filters");

  const newSortButton = document.createElement("button");
  newSortButton.textContent = `${sortButton}`;

  newSortButton.addEventListener("click", () => {
    const container = document.querySelector(".discos");
    container.innerHTML = "";

    if (sortButton === "year") {
      const sortedResults = sortByYearResults(originalResults.slice());
      showDiscosData(
        sortedResults,
        filterFormat,
        originalPaginationResults,
        filtersContainer
      );
    }

    if (sortButton === "most wanted") {
      const sortedResults = sortByWantResults(originalResults.slice());
      showDiscosData(
        sortedResults,
        filterFormat,
        originalPaginationResults,
        filtersContainer
      );
    }
  });

  filtersContainer.appendChild(newSortButton);
}

// tipos de sort() // criterios de orden
function sortByYearResults(results) {
  const sortedResults = [...results];
  sortedResults.sort((a, b) => b.year - a.year);

  return sortedResults;
}

function sortByWantResults(results) {
  const sortedResults = [...results];

  sortedResults.sort((a, b) => {
    const wantA = a.community.want;
    const wantB = b.community.want;

    return wantB - wantA;
  });

  return sortedResults;
}

async function createPagination(pagination) {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  const numOfResults = document.createElement("p");
  numOfResults.textContent = `Number Of Results: ${pagination.items} / Total Pages: ${pagination.pages}`;

  paginationContainer.appendChild(numOfResults);

  const paginationList = document.createElement("ul");
  paginationContainer.appendChild(paginationList);

  for (let i = 1; i <= pagination.pages; i++) {
    const listItem = document.createElement("li");
    listItem.textContent = i;
    listItem.addEventListener("click", function () {
      searchOnPage(i);
    });
    paginationList.appendChild(listItem);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  recommendedCover();
  addListenLinkToNavbar();
});

btnSearch.addEventListener("click", async function (e) {
  e.preventDefault();
  emptyContainer("discos");
  await searchReleasesByQuery(
    searchSingleInput.value,
    selectGenreMenu.value,
    btnRadioValue
  );
});

async function searchOnPage(page) {
  emptyContainer("discos");
  await searchReleasesByQuery(
    searchSingleInput.value,
    selectGenreMenu.value,
    btnRadioValue,
    page
  );
  scrollTo("results");
}

function recommendedCover() {
  const singleCovers = document.querySelectorAll(".single-cover");
  singleCovers.forEach((div) => {
    const dataLabel = div.getAttribute("data-label");

    div.addEventListener("click", async function (e) {
      e.preventDefault();
      emptyContainer("discos", "disco-filters");
      await searchReleasesByQuery(
        searchSingleInput.value,
        selectGenreMenu.value,
        btnRadioValue,
        1,
        dataLabel
      );

      scrollTo("results");
    });
  });
}

// export
function emptyContainer(container) {
  document.querySelector(`.${container}`).innerHTML = "";
  document.querySelector(".disco-filters").innerHTML = "";
}

function scrollTo(id) {
  console.log(id);
  document
    .querySelector(`#${id}`)
    .scrollIntoView({ behavior: "smooth", offsetTop: 500 });
}

window.addEventListener("scroll", function () {
  const header = document.getElementById("header");
  const bodyHeight = document.body.offsetHeight;
  const windowHeight = window.innerHeight;
  const scrollPosition = window.scrollY;
  const triggerHeight = (bodyHeight - windowHeight) * 0.3;

  if (scrollPosition >= triggerHeight) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
