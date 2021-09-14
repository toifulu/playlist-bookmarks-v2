class Playlist {

    constructor(name, img, url, pTile, pName, pUrl, pImg) {
        this.name = name;
        this.url = url;
        this.img = img;
        this.categories = [];

        this.id = pTile;
        this.nameId = pName;
        this.urlId = pUrl;
        this.imgId = pImg;
    }

    show() { show(this.tileId); }
    hide() { hide(this.tileId); }

    addCategory(newCategory) {
        this.categories.push(newCategory.toLowerCase());
    }
}

let lib = [];
let categoriesLib = [];

// ======================== Show and hide ========================

// DOM references
let searchId = document.getElementById("search");
let introId = document.getElementById("intro");
let playlistId = document.getElementById("playlists");
let categoryId = document.getElementById("categories");
let addId = document.getElementById("add-playlist");
let editId = document.getElementById("edit-playlist");
let helpId = document.getElementById("help");
let backgroundDim = document.getElementById("background-dim");

// So I can write slightly less
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
            showPlaylist = true;
            show(playlistId);
            editOn();
            searchId.value = "Edit playlists";
            break;
        case "edit playlists":
            showPlaylist = true;
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
    let backspace = (e.keyCode == 8);

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
searchId.addEventListener("keydown", function (e) { resetSearch(e) });

// ======================== Add playlist ========================

// DOM references
let addSumbitId = document.getElementById("add-submit");
let addNameId = document.getElementsByName("name")[0];
let addUrlId = document.getElementsByName("url")[0];
let addImgId = document.getElementsByName("img")[0];
let addCategoriesId = document.getElementsByName("categories")[0];

function add() {
    // Fetching values from input form
    let name = addNameId.value;
    let url = addUrlId.value;
    let img = addImgId.value;
    let categories = addCategoriesId.value.split(",");

    // Creating the DOM nodes
    let newTile = document.createElement("div");
    newTile.classList.add("playlist-tile");
    let newName = document.createElement("p");
    newName.appendChild(document.createTextNode(name));
    let newUrl = document.createElement("a");
    newUrl.setAttribute("href", url);
    let newImg = document.createElement("img");
    newImg.setAttribute("src", "../img/" + img);

    let editButton = document.createElement("button");
    editButton.appendChild(document.createTextNode("Edit"));
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", function(e) { showEditModule(e); });
    let deleteButton = document.createElement("button");
    deleteButton.appendChild(document.createTextNode("Delete"));
    deleteButton.classList.add("delete-button");
    let newDiv = document.createElement("div");
    
    // Putting it into the class
    playlist = new Playlist(name, url, img, newTile, newName, newUrl, newImg);
    categories.forEach(x => { playlist.addCategory(x) });
    lib.push(playlist);
    // todo add tagLib push

    // Appending the children
    newDiv.appendChild(editButton);
    newDiv.appendChild(deleteButton);

    newTile.appendChild(newUrl);
    newTile.appendChild(newImg);
    newTile.appendChild(newName);
    newTile.appendChild(newDiv);

    playlistId.appendChild(newTile);

    // Return to home page
    searchId.value = "";
    showSearch();

    // Reset everything
    addNameId.value = "";
    addUrlId.value = "";
    addImgId.value = "";
    addCategoriesId.value = "";
}

// Adding the event listeners
addSumbitId.addEventListener("click", add);

// ======================== Edit playlists ========================
let editSaveId = document.getElementById("edit-submit");
let editCancelId = document.getElementById("edit-cancel");
let editDisplayImgId = document.getElementById("edit-img");

let editNameId = document.getElementsByName("edited-name")[0];
let editUrlId = document.getElementsByName("edited-url")[0];
let editImgId = document.getElementsByName("edited-img")[0];
let editCategoriesId = document.getElementsByName("edited-categories")[0];

let editIds = [editNameId, editUrlId, editImgId, editCategoriesId];

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

    let playlistInfo = e.target.parentNode.parentNode;

    editNameId.value = playlistInfo.getElementsByTagName("p")[0].textContent;
    editUrlId.value = playlistInfo.getElementsByTagName("a")[0].getAttribute("href");
    editImgId.value = playlistInfo.getElementsByTagName("img")[0].getAttribute("src");
    editDisplayImgId.setAttribute("src", "../img/" + editImgId.value);
}

function hideEditModuleSubmit(e) {
    hide(editId);
    hide(backgroundDim);
}

function hideEditModuleCancel() {
    hide(editId);
    hide(backgroundDim);

    editIds.forEach(element => element.value = "");
}

editSaveId.addEventListener("click", function (e) { hideEditModuleSubmit(e); });
editCancelId.addEventListener("click", hideEditModuleCancel);
backgroundDim.addEventListener("click", hideEditModuleCancel);

// ======================== Final bits ========================

if (!playlistId.hasChildNodes) {
    show(introId);
} else {
    hide(introId);
}

let abc = document.querySelectorAll(".edit-button");
abc.forEach(element => {
    element.addEventListener("click", function(e) { showEditModule(e); });
});

let welcomeText = "Anything you wanna listen to?";
document.getElementById("search").setAttribute("placeholder", welcomeText);