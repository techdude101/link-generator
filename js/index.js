(function () {
    const schemeSelect = document.querySelector("#scheme");
    const ipOrDomainInput = document.querySelector("#ip-or-domain");
    const subdirectoryInput = document.querySelector("#subdirectory");
    const addButton = document.querySelector("#add-button");
    const formElement = document.querySelector("form");
    const generatedLink = document.querySelector("#generated-link a");
    const linksList = document.querySelector("#links-list");
  
    let links = [
      {
        scheme: "http://",
        subdirectory: "index.html",
      },
    ]; // Populate from local storage
  
    let ipOrDomain = "192.168.0.1"; // Populate from local storage - last IP address used
    let key = "link-generator";
  
    function saveToLocalStorage() {
      if (typeof Storage !== "undefined") {
        window.localStorage.setItem(key + "-links", JSON.stringify(links));
        window.localStorage.setItem(key + "-ip", JSON.stringify(ipOrDomain));
      }
    }
  
    function loadFromLocalStorage() {
      if (typeof Storage !== "undefined") {
        const data = JSON.parse(window.localStorage.getItem(key + "-links"));
        const ip = JSON.parse(window.localStorage.getItem(key + "-ip"));
        if (data) {
          links = data;
        }
        if (ip) {
            ipOrDomain = ip;
            ipOrDomainInput.value = ip;
        }
      }
    }
  
    function updateGeneratedLink() {
      const url = buildLink();
      generatedLink.textContent = url;
      generatedLink.setAttribute("href", url);
      generatedLink.setAttribute("target", "_blank");
      generateLinkListItems();
      saveToLocalStorage();
    }
  
    function buildLink() {
      const scheme = schemeSelect.value;
      const ip = ipOrDomainInput.value;
      if (ip.length < 1) {
        return;
      }
  
      ipOrDomain = ip;
  
      const subdirectory = subdirectoryInput.value;
  
      // Add forward slash if missing from text input
      if (subdirectory[0] !== "/" && subdirectory[0] !== ":") {
        return `${scheme}${ip}/${subdirectory}`;
      }
      return `${scheme}${ip}${subdirectory}`;
    }
  
    function formHandler(e) {
      e.preventDefault();
      addLink();
      generateLinkListItems();
      subdirectoryInput.value = "";
      saveToLocalStorage();
      return;
    }
  
    function clickHandler(e) {
      if (e.target.classList.contains("fa-trash")) {
        deleteItem(e.srcElement.parentElement.parentElement.innerText);
      } else {
        addLink();
        subdirectoryInput.value = "";
      }
      generateLinkListItems();
      saveToLocalStorage();
      return;
    }
  
    function deleteItem(e) {
      const newLinks = links.filter(function (value) {
        return value.subdirectory !== e;
      });
      links = newLinks;
      return;
    }
  
    function addListItem(url, text) {
      //<li class=".links-list__li"><a href="#" target="_blank" class="links-list__li--a">Sample</a><button id="delete-button" class="button-delete"><i class="fas fa-trash"></i></button></li>
  
      const listItem = document.createElement("li");
      const linkTag = document.createElement("a");
      const deleteButton = document.createElement("button");
  
      deleteButton.classList.add("button-delete");
      listItem.classList.add(".links-list__li");
  
      const trashIcon = document.createElement("i");
      trashIcon.classList.add("fas");
      trashIcon.classList.add("fa-trash");
      deleteButton.appendChild(trashIcon);
  
      linkTag.setAttribute("href", url);
      linkTag.setAttribute("target", "_blank");
      linkTag.textContent = text;
      linkTag.classList.add("links-list__li--a");
  
      listItem.appendChild(linkTag);
      listItem.appendChild(deleteButton);
  
      return listItem;
    }
  
    function addLink() {
      const scheme = schemeSelect.value;
      let subdirectory = subdirectoryInput.value;
  
      if (subdirectory.length <= 0 || subdirectory === "/") {
        return;
      }
  
      const found = links.find(
        (e) => e["subdirectory"] === subdirectory && e["scheme"] === scheme
      );
      if (found) {
        return;
      }
  
      links.push({
        scheme: scheme,
        subdirectory: subdirectory,
      });
    }
  
    function generateLinkListItems() {
      // Clear existing list item elements
      while (linksList.firstChild) {
        linksList.removeChild(linksList.firstChild);
      }
      links.forEach((item) => {
        let subdirectory = item.subdirectory;
        
        if (subdirectory[0] !== ":") {
              subdirectory = "/" + subdirectory;
        }
        
        const url = item.scheme + ipOrDomainInput.value + subdirectory;
        const div = addListItem(url, item.subdirectory);
        linksList.appendChild(div);
      });
    }
  
    function changeHandler(e) {
      updateGeneratedLink();
    }
  
    /* EVENT LISTENERS */
    addButton.addEventListener("click", clickHandler);
    formElement.addEventListener("submit", formHandler);
    ipOrDomainInput.addEventListener("keyup", updateGeneratedLink);
    ipOrDomainInput.addEventListener("keydown", updateGeneratedLink);
    schemeSelect.addEventListener("change", updateGeneratedLink);
    subdirectoryInput.addEventListener("keydown", updateGeneratedLink);
    subdirectoryInput.addEventListener("keyup", updateGeneratedLink);
    linksList.addEventListener("click", clickHandler);
  
    /* RUNS ON LOAD */
    loadFromLocalStorage();
    updateGeneratedLink();
  })();
  