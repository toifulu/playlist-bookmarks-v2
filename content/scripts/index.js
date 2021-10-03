let lib = [];
let categories = [];
// ======================== Upon loading ================================================================================================
// init localstorage
if (window.localStorage.length == 0) {
    localStorage.setItem("lib", "");
    localStorage.setItem("categories", "");
}
function loadPage() {
    // load up everything
    if (localStorage.getItem("lib") !== "") {
        try {
            lib = JSON.parse(localStorage.getItem("lib"));
        }
        catch (err) {
            console.log(err);
        }
        lib.forEach((tile) => {
            let newTile = createTile(tile.name, tile.url, tile.img);
            playlistId.appendChild(newTile);
        });
    }
    if (localStorage.getItem("categories") !== "") {
        try {
            categories = JSON.parse(localStorage.getItem("categories"));
        }
        catch (err) {
            console.log(err);
        }
    }
}
document.addEventListener("DOMContentLoaded", loadPage);
// ======================== Show and hide ========================================================================================================================
// DOM references
let searchId = document.getElementById("search");
let introId = document.getElementById("intro");
let playlistId = document.getElementById("playlists");
let categoryId = document.getElementById("categories");
let addId = document.getElementById("add-playlist");
let editId = document.getElementById("edit-playlist");
let helpId = document.getElementById("help");
let backgroundDim = document.getElementById("background-dim");
function show(id) { id.removeAttribute("style"); }
function hide(id) { id.setAttribute("style", "display: none;"); }
// Shows and hides each <div> section based on search bar
function showSearch() {
    let searchTxt = searchId.value.toLowerCase().trim();
    // Hide everything beforehand
    hide(playlistId);
    hide(editId);
    hide(introId);
    hide(categoryId);
    hide(addId);
    hide(helpId);
    // Show things based on user input
    switch (searchTxt) {
        case "+":
            show(addId);
            searchId.value = "Add playlist";
            console.log("UH");
            break;
        case "add playlist":
            show(addId);
            searchId.value = "Add playlist";
            break;
        case ">":
            show(categoryId);
            searchId.value = "Categories";
            break;
        case "categories":
            show(categoryId);
            searchId.value = "Categories";
            break;
        case "-":
            show(playlistId);
            editOn();
            searchId.value = "Edit playlists";
            break;
        case "edit playlists":
            show(playlistId);
            editOn();
            searchId.value = "Edit playlists";
            break;
        case "?":
            show(helpId);
            searchId.value = "Commands list";
            break;
        case "commands list":
            show(helpId);
            searchId.value = "Commands list";
            break;
        default:
            show(playlistId);
            editOff();
            break;
    }
}
// Deletes search query upon backspace
function resetSearch(e) {
    let searchTxt = searchId.value.toLowerCase().trim();
    let backspace = (e.key == "Backspace");
    switch (searchTxt) {
        case "add playlist":
            searchId.value = backspace ? "" : "Add playlist";
            break;
        case "categories":
            searchId.value = backspace ? "" : "Categories";
            break;
        case "edit playlists":
            searchId.value = backspace ? "" : "Edit playlists";
            break;
        case "commands list":
            searchId.value = backspace ? "" : "Help";
            break;
        default:
            break;
    }
}
// Adding the event listeners
searchId.addEventListener("keyup", showSearch);
searchId.addEventListener("keydown", function (e) { resetSearch(e); });
// ======================== Add playlist ================================================================================================
function add() {
    let addNameId = document.getElementsByName("name")[0];
    let addUrlId = document.getElementsByName("url")[0];
    let addImgId = document.getElementsByName("img")[0];
    let addCategoriesId = document.getElementsByName("categories")[0];
    // Fetching values from input form
    let name = addNameId.value;
    let url = addUrlId.value;
    let img = addImgId.value;
    let categories = addCategoriesId.value.split(",");
    // Creating the DOM nodes
    let newTile = createTile(name, url, img);
    playlistId.appendChild(newTile);
    // Create object and pop into library
    let newPlaylist = {
        name: name,
        img: img,
        url: url,
        categories: categories,
    };
    lib.push(newPlaylist);
    // Return to home page
    searchId.value = "";
    showSearch();
    // Reset everything
    addNameId.value = "";
    addUrlId.value = "";
    addImgId.value = "";
    addCategoriesId.value = "";
}
function createTile(name, url, img) {
    let newTile = document.createElement("div");
    newTile.classList.add("playlist-tile");
    let newName = document.createElement("p");
    newName.appendChild(document.createTextNode(name));
    let newUrl = document.createElement("a");
    newUrl.setAttribute("href", url);
    let newImg = document.createElement("img");
    newImg.setAttribute("src", "content/img/" + img);
    let editButton = document.createElement("button");
    editButton.appendChild(document.createTextNode("Edit"));
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", function (e) { showEditModule(e); });
    let deleteButton = document.createElement("button");
    deleteButton.appendChild(document.createTextNode("Delete"));
    deleteButton.classList.add("delete-button");
    let newDiv = document.createElement("div");
    // Appending the children
    newDiv.appendChild(editButton);
    newDiv.appendChild(deleteButton);
    newTile.appendChild(newUrl);
    newTile.appendChild(newImg);
    newTile.appendChild(newName);
    newTile.appendChild(newDiv);
    return newTile;
}
// Adding the event listeners
let addSumbitId = document.getElementById("add-submit");
addSumbitId.addEventListener("click", add);
// ======================== Edit playlists ================================================================================================
let editSave = document.getElementById("edit-submit");
let editCancel = document.getElementById("edit-cancel");
let editDisplayImg = document.getElementById("edit-img");
let editedName = document.getElementsByName("edited-name")[0];
let editedUrl = document.getElementsByName("edited-url")[0];
let editedImg = document.getElementsByName("edited-img")[0];
let editCategories = document.getElementsByName("edited-categories")[0];
let editedIds = [editedName, editedUrl, editedImg, editCategories];
// Adjusts the class (mostly CSS appearance) when editing mode is on
function editOn() {
    let tiles = document.querySelectorAll(".playlist-tile");
    tiles.forEach(tile => tile.classList.add("editing"));
}
// Return class to normal
function editOff() {
    let tiles = document.querySelectorAll(".playlist-tile");
    tiles.forEach(tile => tile.classList.remove("editing"));
}
// Shows edit module
function showEditModule(e) {
    show(editId);
    show(backgroundDim);
    let target = e.target;
    let playlistInfo = target.parentNode.parentNode;
    editedName.value = playlistInfo.getElementsByTagName("p")[0].textContent;
    editedUrl.value = playlistInfo.getElementsByTagName("a")[0].getAttribute("href");
    editedImg.value = playlistInfo.getElementsByTagName("img")[0].getAttribute("src");
    editDisplayImg.setAttribute("src", editedImg.value);
}
function hideEditModuleSubmit(e) {
    hide(editId);
    hide(backgroundDim);
}
function hideEditModuleCancel() {
    hide(editId);
    hide(backgroundDim);
    editedIds.forEach(element => element.value = "");
}
editSave.addEventListener("click", function (e) { hideEditModuleSubmit(e); });
editCancel.addEventListener("click", hideEditModuleCancel);
backgroundDim.addEventListener("click", hideEditModuleCancel);
// ======================== Upon leaving ========================================================================================================================
function storeStuff() {
    // parse libs and categories into json
    if (lib.length != 0) {
        window.localStorage.setItem("lib", JSON.stringify(lib));
    }
    if (categories.length != 0) {
        window.localStorage.setItem("categories", JSON.stringify(categories));
    }
}
window.onbeforeunload = storeStuff;
// ======================== Final bits ================================================================================================
if (!playlistId.hasChildNodes) {
    show(introId);
}
else {
    hide(introId);
}
let abc = document.querySelectorAll(".edit-button");
abc.forEach(element => {
    element.addEventListener("click", function (e) { showEditModule(e); });
});
let welcomeText = "Anything you wanna listen to?";
document.getElementById("search").setAttribute("placeholder", welcomeText);
