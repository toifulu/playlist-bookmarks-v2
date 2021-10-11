// DOM references
let searchId = document.getElementById("search");
let introId = document.getElementById("intro");
let playlistId = document.getElementById("playlists");
let categoryId = document.getElementById("categories");
let addId = document.getElementById("add-playlist");
let editId = document.getElementById("edit-playlist");
let helpId = document.getElementById("help");
let backgroundDim = document.getElementById("background-dim");
/** TODO:
 * make categories work (edit as well)
 * add custom right click
 * add delete confirmation (are you sure? delete cancel)
 * add settings toggle
 * add more input validation for add function (no blanks)
 * drag n drop to reoorganise
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
    if (lib.length === 0) {
        show(introId);
    }
    else {
        hide(introId);
    }
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
            search(searchTxt);
            show(playlistId);
            editOff();
            break;
    }
}
// Shows and hides playlist based on text in search bar
function search(searchTxt) {
    let playlists = document.querySelectorAll("#playlists > div");
    lib.forEach((playlist, index) => {
        if (playlist.name.includes(searchTxt)) {
            show(playlists[index]);
        }
        else {
            hide(playlists[index]);
        }
    });
    if (searchTxt.length === 0) {
        playlists.forEach(element => { show(element); });
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
    // Checking name is unique
    let legal = true;
    lib.forEach((playlist) => {
        if (playlist.name === name) {
            let nameWarningId = document.getElementById("name-warning");
            nameWarningId.textContent = `A playlist name with name "${name}" already exists`;
            legal = false;
        }
    });
    if (!legal) {
        return;
    }
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
    let warnings = document.querySelectorAll("#add-warning > p");
    warnings.forEach((warning) => hide(warning));
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
    deleteButton.addEventListener("click", function (e) { showDeleteModule(e); });
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
let editedCategories = document.getElementsByName("edited-categories")[0];
let editedIds = [editedName, editedUrl, editedImg, editedCategories];
let editedPlaylist;
let editedIndex;
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
    let playlistName = target.parentNode.previousSibling.textContent;
    // Grab playlist data from libs
    lib.forEach((playlist, index) => {
        if (playlist.name === playlistName) {
            editedIndex = index;
            editedPlaylist = playlist;
        }
    });
    editedName.value = editedPlaylist.name;
    editedUrl.value = editedPlaylist.url;
    editedImg.value = editedPlaylist.img;
    editedCategories.value = JSON.stringify(editedPlaylist.categories);
    editDisplayImg.setAttribute("src", `content/img/${editedImg.value}`);
}
// Hides the edit module when user presses "submit"
function hideEditModuleSubmit() {
    let targetTile = playlistId.childNodes[editedIndex];
    let tileElements = targetTile.childNodes;
    // Update libs data
    lib[editedIndex].name = editedName.value;
    lib[editedIndex].url = editedUrl.value;
    lib[editedIndex].img = editedImg.value;
    lib[editedIndex].categories = JSON.parse(editedCategories.value);
    // Edit new values into html
    tileElements[0].setAttribute("href", editedUrl.value);
    tileElements[1].setAttribute("src", `content/img/${editedImg.value}`);
    tileElements[2].textContent = editedName.value;
    hide(editId);
    hide(backgroundDim);
}
// Hides the edit module when user presses "cancel"
function hideEditModuleCancel() {
    hide(editId);
    hide(backgroundDim);
    editedIds.forEach(element => element.value = "");
}
// todo add check if image exists before loading
// Changes display img based on what is entered
function showDisplayImg() {
    let newSrc = `content/img/${editedImg.value}`;
    editDisplayImg.setAttribute("src", newSrc);
}
editedImg.addEventListener("keyup", showDisplayImg);
editSave.addEventListener("click", hideEditModuleSubmit);
editCancel.addEventListener("click", hideEditModuleCancel);
backgroundDim.addEventListener("click", hideEditModuleCancel);
// ======================== Delete playlists ======================================================== //
// todo make delete confirmation 
let deleteTarget;
let deletetile;
let deleteTileName;
function showDeleteModule(e) {
    deleteTarget = e.target;
    deletetile = deleteTarget.parentNode.parentElement;
    deleteTileName = deletetile.getElementsByTagName("p")[0].textContent;
    deleteTile(); // todo replace this with the delete confirmation trigger
    console.table(lib);
    console.table(categoriesLib);
}
function deleteTile() {
    deletetile.remove();
    // Update libs & categoriesLib
    lib.forEach((playlist, index) => {
        if (playlist.name === deleteTileName) {
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
}
// todo add event listener to deletetile confirm
// ======================== Categories ======================================================== //
let categorySelectIds = document.querySelectorAll(".category-select");
/**
 * categories always organised in alphabetical order
 * click to create category
 */
function categorySelectHandler() {
}
// ======================== Upon leaving ======================================================== //
function storeStuff() {
    // parse libs and categories into json
    window.localStorage.setItem("lib", JSON.stringify(lib));
    window.localStorage.setItem("categories", JSON.stringify(categoriesLib));
}
window.onbeforeunload = storeStuff;
// ======================== Testing out time functions ======================================================== //
let date = new Date();
let hours = date.getHours();
let greetingMsg;
if (3 <= hours && hours <= 12) {
    greetingMsg = "morning";
}
else if (12 < hours && hours <= 18) {
    greetingMsg = "afternoon";
}
else if (18 < hours && hours <= 23) {
    greetingMsg = "evening";
}
else {
    greetingMsg = "..morning?";
}
console.log(`Page successfully loaded`);
console.log(`Good ${greetingMsg}`);
// ======================== Final bits ======================================================== //
function reset() {
    lib = [];
    categoriesLib = [];
    localStorage.clear();
}
let welcomeText = "Anything you wanna listen to?";
document.getElementById("search").setAttribute("placeholder", welcomeText);
