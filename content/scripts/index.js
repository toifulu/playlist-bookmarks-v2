// DOM references
let searchId = document.getElementById("search");
let introId = document.getElementById("intro");
let playlistId = document.getElementById("playlists");
let categoryId = document.getElementById("categories");
let addId = document.getElementById("add-playlist");
let editId = document.getElementById("edit-playlist");
let helpId = document.getElementById("help");
let backgroundDim = document.getElementById("background-dim");
/**
 * need to do:
 * add delete function
 * input validation for add function (no same name)
 * categories
 * make the search function work
 * edit playlists
 * drag n drop reoorganise
 */
let lib = [];
let uniqueCategories = [];
let categoriesLib = [];
// ======================== Upon loading ======================================================== //
// Init localStorage
if (localStorage.getItem("lib") === "null") {
    localStorage.setItem("lib", "[]");
}
if (localStorage.getItem("categories") === "null") { // kms everything's stored as strings i forgot
    localStorage.setItem("categories", "[]");
}
// Take data from localStorage and load it into the page
function loadPage() {
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
    try {
        categoriesLib = JSON.parse(localStorage.getItem("categories"));
    }
    catch (err) {
        console.log(err);
    }
    console.table(lib);
    console.table(categoriesLib);
}
document.addEventListener("DOMContentLoaded", loadPage);
// ======================== Show and hide ======================================================== //
// Functions to make life easier
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
// ======================== Add playlist ======================================================== //
// Adds the playlist and append data into libs/categories
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
    // Add unique categories into categories
    categories.forEach((category) => {
        if (uniqueCategories.indexOf(category) === -1) {
            uniqueCategories.push(category);
            let newCategory = {
                name: category,
                count: 1
            };
            categoriesLib.push(newCategory);
        }
        else {
            categoriesLib.forEach((cateLib) => {
                if (cateLib.name === category) {
                    cateLib.count++;
                }
            });
        }
    });
    // Return to home page
    searchId.value = "";
    showSearch();
    // Reset everything
    addNameId.value = "";
    addUrlId.value = "";
    addImgId.value = "";
    addCategoriesId.value = "";
}
// Returns a HTML playlist tile
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
    deleteButton.addEventListener("click", function (e) { deleteTile(e); });
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
// ======================== Edit playlists ======================================================== //
// DOM references
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
// Hides the edit module when user presses "submit"
// todo add edited data
function hideEditModuleSubmit(e) {
    hide(editId);
    hide(backgroundDim);
}
// Hides the edit module when user presses "cancel"
function hideEditModuleCancel() {
    hide(editId);
    hide(backgroundDim);
    editedIds.forEach(element => element.value = "");
}
editSave.addEventListener("click", function (e) { hideEditModuleSubmit(e); });
editCancel.addEventListener("click", hideEditModuleCancel);
backgroundDim.addEventListener("click", hideEditModuleCancel);
// ======================== Delete playlists ======================================================== //
function deleteTile(e) {
    let target = e.target;
    let tile = target.parentNode.parentElement;
    let tileName = tile.getElementsByTagName("p")[0].textContent;
    tile.remove();
    // Update libs & categoriesLib
    lib.forEach((playlist, index) => {
        if (playlist.name === tileName) {
            // Update categories
            playlist.categories.forEach((category) => {
                categoriesLib.forEach((cateLib, index) => {
                    if (cateLib.name === category) {
                        cateLib.count--;
                    }
                    if (cateLib.count <= 0) {
                        let uIndex = uniqueCategories.indexOf(cateLib.name);
                        uniqueCategories.splice(uIndex, 1);
                        categoriesLib.splice(index, 1);
                    }
                });
            });
            // Remove from libs
            lib.splice(index, 1);
        }
    });
    console.table(lib);
    console.table(categoriesLib);
}
// ======================== Upon leaving ======================================================== //
function storeStuff() {
    // parse libs and categories into json
    window.localStorage.setItem("lib", JSON.stringify(lib));
    window.localStorage.setItem("categories", JSON.stringify(categoriesLib));
}
window.onbeforeunload = storeStuff;
// ======================== Final bits ======================================================== //
if (lib.length === 0) {
    show(introId);
}
else {
    hide(introId);
}
function reset() {
    lib = [];
    categoriesLib = [];
    localStorage.clear();
}
let welcomeText = "Anything you wanna listen to?";
document.getElementById("search").setAttribute("placeholder", welcomeText);
