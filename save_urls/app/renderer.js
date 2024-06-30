// DOM elements

const linkSection = document.querySelector(".links");
const errorMessage = document.querySelector(".error-message");
const newLinkForm = document.querySelector(".new-link-form");
const newLinkUrl = document.querySelector(".new-link-url");
const newLinkButton = document.querySelector(".new-link-button");
const clearStorageButton = document.querySelector(".clear-storage");

// DOM Apis
const parser = new DOMParser();
const { shell } = require("electron");

const parserResponse = (text) => {
  return parser.parseFromString(text, "text/html");
};

const findTitle = (nodes) => {
  return nodes.querySelector("title").innerText;
};

const storageLink = (title, url) => {
  localStorage.setItem(url, JSON.stringify({ title, url }));
};

const getLinks = () => {
  return Object.keys(localStorage).map((key) =>
    JSON.parse(localStorage.getItem(key))
  );
};

const createLinkElement = (link) => {
  return `
  <div>
    <h3>
      <p><a href="${link.url}">${link.title}<a/></p>
    </h3>
  </div>
  `;
};

const renderLink = () => {
  const linksElements = getLinks().map(createLinkElement).join("");

  linkSection.innerHTML = linksElements;
};

const clearForm = () => {
  newLinkUrl.value = "";
};

const handleError = (url, error) => {
  errorMessage.innerHTML = `
    There was an issue adding "${url}": ${error.message}
  `.trim();

  setTimeout(() => {
    errorMessage.innerHTML = null;
  }, 5000);
};

renderLink();

newLinkUrl.addEventListener("keyup", () => {
  newLinkButton.disabled = !newLinkUrl.validity.valid;
});

newLinkForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = newLinkUrl.value;

  try {
    const response = await fetch(url);
    const text = await response.text();
    const html = parserResponse(text);
    const title = findTitle(html);

    storageLink(title, url);
    renderLink();
    clearForm();
  } catch (error) {
    handleError(url, error);
  }
});

clearStorageButton.addEventListener("click", () => {
  localStorage.clear();
  linkSection.innerHTML = "";
});

linkSection.addEventListener("click", (e) => {
  if (e.target.href) {
    e.preventDefault();
    shell.openExternal(e.target.href);
  }
});
