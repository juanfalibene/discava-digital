const consumerKey = "lcSCxdPmqTHIbWMiCmBT";
const consumerSecret = "OKPFUYvAGKHMkxbCQjGqUIVOVkhFYBiX";
const authConsumer = `key=${consumerKey}&secret=${consumerSecret}`;
const baseURL = "https://api.discogs.com/";

const url = new URL(window.location.href);
const releaseID = url.searchParams.get("release_id");
const masterID = url.searchParams.get("master_id");
const fromFormat = url.searchParams.get("format");
const typeOfVersion = url.searchParams.get("type");
let switchFormat = fromFormat;
const toFormat =
  fromFormat === `7` ? (switchFormat = `12`) : (switchFormat = `7`);

async function searchDataMaster() {
  const masterURL = `${baseURL}releases/${releaseID}?${authConsumer}`;

  try {
    const response = await fetch(masterURL);
    const data = await response.json();
    const dataMaster = data;
    const searchTitle = dataMaster.title;
    const searchArtist = dataMaster.artists[0].name;

    console.log(data);

    await showDiscoData(dataMaster, typeOfVersion);

    if (masterID != 0 && typeOfVersion === "search") {
      const filterVersions = await searchVersions(toFormat, typeOfVersion);
      await showVersionsData(filterVersions);

      const compilations = await searchTitleOnCompilations(
        searchTitle,
        searchArtist
      );
      await showCompilationsData(compilations);
    }
  } catch (error) {
    console.error("Error on Info Master", error);
  }
}

// pintar master
async function showDiscoData(dataMaster, typeOfVersion) {
  // crear template se puede traer como function externa
  const container = document.querySelector(".single-result");
  const template = document.querySelector("#single-disco").content;
  const div = template.cloneNode(true);

  const disco = div.querySelector(".single-disco");
  const coverDiscoImg = div.querySelector(".single-disco-cover img");
  const divSingleInfo = div.querySelector(".single-disco-info");
  const singleTitleH1 = divSingleInfo.querySelector(".single-title");
  const singleYearP = divSingleInfo.querySelector(".single-year");
  const divSingleDiscoTracklist = div.querySelector(".single-disco-tracklist");
  const singleTracklistUL =
    divSingleDiscoTracklist.querySelector(".disco-tracklist");
  const singleNotes = divSingleInfo.querySelector(".single-notes");

  // sigle-div
  coverDiscoImg.src = dataMaster.images[0].uri;
  coverDiscoImg.alt = dataMaster.title;

  singleTitleH1.textContent = `${dataMaster.artists[0].name} - ${dataMaster.title}`;
  singleYearP.textContent = `Year: ${dataMaster.year} Genre: ${dataMaster.genres} Style: ${dataMaster.styles}`;

  const ratingLi = document.createElement("li");
  ratingLi.textContent =
    textContent = `Rating: ${dataMaster.community.rating.average}`;
  const haveWantLi = document.createElement("li");
  haveWantLi.textContent =
    textContent = `Have: ${dataMaster.community.have} / Want: ${dataMaster.community.want}`;
  const copiesPriceLi = document.createElement("li");
  copiesPriceLi.textContent =
    textContent = `Copies for sale: ${dataMaster.num_for_sale} from ${dataMaster.lowest_price}`;

  singleNotes.appendChild(ratingLi);
  singleNotes.appendChild(haveWantLi);
  singleNotes.appendChild(copiesPriceLi);

  for (const track of dataMaster.tracklist) {
    const trackTitle = document.createElement("li");

    if (typeOfVersion === "version" || typeOfVersion === "compilation") {
      for (artist of dataMaster.artists) {
        const trackTitleText = `${artist.name} - ${track.title} ${track.duration}`;
        trackTitle.textContent = trackTitleText;
      }
    } else {
      const trackTitleText = `${track.title} ${track.duration}`;
      trackTitle.textContent = trackTitleText;
    }

    //buscar videos segun title
    if (dataMaster.hasOwnProperty("videos")) {
      const videoLink = searchVideos(track, dataMaster.videos);
      if (videoLink) {
        trackTitle.appendChild(videoLink);
      }
    }

    singleTracklistUL.appendChild(trackTitle);
  }

  function searchVideos(track, videos) {
    const trackTitleMatch = track.title.toLowerCase();
    console.log(trackTitleMatch);
    const trackTitlePattern = new RegExp(trackTitleMatch);
    console.log(trackTitlePattern);

    for (const video of videos) {
      const videoTitleMatch = video.title.toLowerCase();
      console.log(videoTitleMatch);
      const videoTitlePattern = new RegExp(videoTitleMatch);
      console.log(videoTitlePattern);

      if (videoTitleMatch.match(trackTitlePattern)) {
        const videoLink = document.createElement("button");
        videoLink.textContent = "PLAY";

        videoLink.addEventListener("click", () => {
          const containerImgToIframe = document.querySelector(
            ".single-disco-image"
          );
          const videoEmbedCode = video.uri.split("=", 11);
          containerImgToIframe.innerHTML =
            '<iframe width="100%" height="450" src="https://www.youtube.com/embed/' +
            videoEmbedCode[1] +
            '?controls=1"></iframe>';
        });

        return videoLink;
      }
    }

    return null;
  }

  container.appendChild(div);

  // falso modal solo si es 12 o compilation
  if (typeOfVersion === "version" || typeOfVersion === "compilation") {
    changeCSS();
    createCloseButton();
    invertDiscoColors(
      disco,
      divSingleInfo,
      coverDiscoImg,
      divSingleDiscoTracklist
    );
  } else {
    dataMaster.tracklist.length > 2 &&
      (divSingleDiscoTracklist.style.overflowY = "scroll");
  }
}

//mostrar versiones
async function showVersionsData(filterVersions) {
  const template = document.querySelector("#disco-versions").content;
  const containerUL = document.querySelector(".versions-list");

  if (filterVersions.length !== 0) {
    showElement("other");

    for (version of filterVersions) {
      const li = template.cloneNode(true);

      const aVersionHref = li.querySelector("a");
      aVersionHref.href = `single.html?release_id=${version.id}&master_id=0&format=${toFormat}&type=version&${authConsumer}`;

      const coverDiscoThumb = li.querySelector("img");
      coverDiscoThumb.src =
        version.thumb === "" ? "./../img/cover.jpg" : version.thumb;

      // quitar todos los create element
      const divDiscoInfo = li.querySelector(".disco-version-info");
      const discoInfoPtitle = document.createElement("p");
      discoInfoPtitle.textContent = `${version.title}`;
      const discoInfoFormat = document.createElement("p");
      discoInfoFormat.textContent = `${version.format}`;
      divDiscoInfo.appendChild(discoInfoPtitle);
      divDiscoInfo.appendChild(discoInfoFormat);

      const discoInfoPlabel = document.createElement("p");
      discoInfoPlabel.textContent = `${version.label} ${version.released} ${version.country}`;
      divDiscoInfo.appendChild(discoInfoPlabel);

      containerUL.appendChild(li);
    }

    // if < 6
    filterVersions.length < 6 &&
      (containerUL.style.justifyContent = "flex-start");
  } else {
    hideElement("other");
  }
}

// mostrar compilados
async function showCompilationsData(compilations) {
  const container = document.querySelector(".discos");
  const template = document.querySelector("#compilations").content;

  if (compilations.length !== 0) {
    showElement("compilations");

    for (compilation of compilations) {
      const div = template.cloneNode(true);
      const aCompilationHref = div.querySelector("a");
      const coverDiscoImg = div.querySelector("img");

      const divDiscoInfo = div.querySelector(".disco-info");
      const discoTitleP = divDiscoInfo.querySelector(".disco-title");
      const discoYearP = divDiscoInfo.querySelector(".disco-year");
      const discoLabelP = divDiscoInfo.querySelector(".disco-label");

      coverDiscoImg.src =
        compilation.cover_image.includes("spacer.gif") ||
        compilation.cover_image === ""
          ? "./../img/cover.jpg"
          : compilation.cover_image;
      coverDiscoImg.alt = compilation.title;

      discoTitleP.textContent = compilation.title;
      discoYearP.textContent = `${compilation.country} — ${compilation.year}`;
      discoLabelP.textContent = compilation.label[0];
      aCompilationHref.href = `single.html?release_id=${compilation.id}&master_id=${compilation.master_id}&type=compilation`;

      container.appendChild(div);
    }
    // if < 3
    compilations.length < 3 && (container.style.justifyContent = "flex-start");
  } else {
    hideElement("compilations");
  }
}

// busquedas versiones async
async function searchVersions(formatToFilter) {
  const versionsURL = `${baseURL}masters/${masterID}/versions?${authConsumer}`;
  const format = formatToFilter;

  try {
    const response = await fetch(versionsURL);
    const data = await response.json();
    const dataVersions = data;

    const filterVersions = dataVersions.versions.filter((resultado) => {
      return resultado.format.includes(format);
    });

    return filterVersions;
  } catch (error) {
    console.error("Error on Versions Info", error);
  }
}

// busquedas compliados async
async function searchTitleOnCompilations(title, artist) {
  const searchURL = `${baseURL}database/search`;
  const query = `q=${title}-${artist}`;
  const params = `?${query}&type=release&${authConsumer}`;

  try {
    const response = await fetch(searchURL + params);
    const data = await response.json();
    const releases = data.results;

    const compilations = releases.filter((release) => {
      return (
        release.format.includes("Compilation") &&
        release.format.includes("Vinyl")
      );
    });

    return compilations;
  } catch (error) {
    console.error("Error on Compilations Info:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  searchDataMaster();
});

function invertDiscoColors(
  disco,
  divSingleInfo,
  coverDiscoImg,
  divSingleDiscoTracklist
) {
  //only if version || compilation data
  disco.classList.add("invert-sd");
  //divSingleInfo.classList.add("invert-sd-info");
  coverDiscoImg.style.height = "auto";
  divSingleDiscoTracklist.classList.add("invert-sd-tracklist");
}

function showElement(div) {
  document
    .querySelector(`.${div}-versions-results h3`)
    .classList.remove("hide-div");
  document
    .querySelector(`.${div}-versions-results h3`)
    .classList.add("show-div");
}

function hideElement(div) {
  document.querySelector(`.${div}-versions-results`).classList.add("hide-div");
}
