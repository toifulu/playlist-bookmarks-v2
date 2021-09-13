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
let helpId = document.getElementById("help");

// So I can write slightly less
function show(id) { id.removeAttribute("style"); }
function hide(id) { id.setAttribute("style", "display: none;"); }

// Shows and hides each <div> section based on search bar
function showSearch() {
    let searchTxt = searchId.value.toLowerCase().trim();

    // Hide everything beforehand
    hide(playlistId);
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
            searchId.value = "Edit playlists";
            break;
        case "edit playlists":
            showPlaylist = true;
            show(playlistId);
            searchId.value = "Edit playlists";
            break;
        
        case "?":
            show(helpId);
            searchId.value = "Help";
            break;
        case "help":
            show(helpId);
            searchId.value = "Help";
            break;
            
        default:
            show(playlistId);
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
        case "help":
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
    let newTxt = document.createTextNode(name);
    newName.classList.add("playlist-name");
    newName.appendChild(newTxt);

    let newUrl = document.createElement("a");
    newUrl.setAttribute("href", url);
    newUrl.classList.add("playlist-url");

    let newImg = document.createElement("img");
    newImg.setAttribute("src", "../img/" + img);
    newImg.classList.add("playlist-img");

    // Putting it into the class
    playlist = new Playlist(name, url, img, newTile, newName, newUrl, newImg);
    categories.forEach(x => { playlist.addCategory(x) });

    // Appending the children
    newTile.appendChild(newUrl);
    newTile.appendChild(newImg);
    newTile.appendChild(newName);
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

if (!playlistId.hasChildNodes) {
    show(introId);
} else {
    hide(introId);
}

let welcomeText = "Anything you wanna listen to?";
document.getElementById("search").setAttribute("placeholder", welcomeText);