
/* todo
- seems like you can't use node on browser
- either that or do something with local server
- filesystem not workingajskdfsadhfjkhjsk
 */
interface Playlist {
    name: string,
    img: string,
    url: string,
    categories: Array<string>
}

let lib: Array<Playlist>;
let categories: Array<string>;

// ======================== Upon loading ================================================================================================

function loadPage(): void {

}

document.addEventListener("DOMContentLoaded", loadPage);

// ======================== Show and hide ========================================================================================================================

// DOM references
let searchId = <HTMLInputElement>document.getElementById("search");
let introId = document.getElementById("intro");
let playlistId = document.getElementById("playlists");
let categoryId = document.getElementById("categories");
let addId = document.getElementById("add-playlist");
let editId = document.getElementById("edit-playlist");
let helpId = document.getElementById("help");
let backgroundDim = document.getElementById("background-dim");

function show(id: HTMLElement): void { id.removeAttribute("style"); }
function hide(id: HTMLElement): void { id.setAttribute("style", "display: none;"); }

// Shows and hides each <div> section based on search bar
function showSearch(): void {
    let searchValue = searchId.value;
    let searchTxt = searchValue.toLowerCase().trim();

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
            searchValue = "Add playlist";
            break;
        case "add playlist":
            show(addId);
            searchValue = "Add playlist";
            break;

        case ">":
            show(categoryId);
            searchValue = "Categories";
            break;
        case "categories":
            show(categoryId);
            searchValue = "Categories";
            break;
        case "-":
            show(playlistId);
            editOn();
            searchValue = "Edit playlists";
            break;
        case "edit playlists":
            show(playlistId);
            editOn();
            searchValue = "Edit playlists";
            break;
        case "?":
            show(helpId);
            searchValue = "Commands list";
            break;
        case "commands list":
            show(helpId);
            searchValue = "Commands list";
            break;
        default:
            show(playlistId);
            editOff();
            break;
    }
}

// Deletes search query upon backspace
function resetSearch(e: KeyboardEvent): void {
    let searchValue = searchId.value;
    let searchTxt = searchValue.toLowerCase().trim();
    let backspace = (e.key == "Backspace");

    switch (searchTxt) {
        case "add playlist":
            searchValue = backspace ? "" : "Add playlist";
            break;
        case "categories":
            searchValue = backspace ? "" : "Categories";
            break;
        case "edit playlists":
            searchValue = backspace ? "" : "Edit playlists";
            break;
        case "commands list":
            searchValue = backspace ? "" : "Help";
            break;
        default:
            break;
    }
}

// Adding the event listeners
searchId.addEventListener("keyup", showSearch);
searchId.addEventListener("keydown", function (e) { resetSearch(e) });

// ======================== Add playlist ================================================================================================

function add(): void {

    let addNameId = <HTMLInputElement>document.getElementsByName("name")[0];
    let addUrlId = <HTMLInputElement>document.getElementsByName("url")[0];
    let addImgId = <HTMLInputElement>document.getElementsByName("img")[0];
    let addCategoriesId = <HTMLInputElement>document.getElementsByName("categories")[0];

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

    playlistId.appendChild(newTile);

    // Return to home page
    (<HTMLInputElement>searchId).value = "";
    showSearch();

    // Reset everything
    addNameId.value = "";
    addUrlId.value = "";
    addImgId.value = "";
    addCategoriesId.value = "";
}

// Adding the event listeners
let addSumbitId = document.getElementById("add-submit");
addSumbitId.addEventListener("click", add);

// ======================== Edit playlists ================================================================================================

let editSave = document.getElementById("edit-submit");
let editCancel = document.getElementById("edit-cancel");
let editDisplayImg = document.getElementById("edit-img");

let editedName = <HTMLInputElement>document.getElementsByName("edited-name")[0];
let editedUrl = <HTMLInputElement>document.getElementsByName("edited-url")[0];
let editedImg = <HTMLInputElement>document.getElementsByName("edited-img")[0];
let editCategories = <HTMLInputElement>document.getElementsByName("edited-categories")[0];

let editedIds = [editedName, editedUrl, editedImg, editCategories];

// Adjusts the class (mostly CSS appearance) when editing mode is on
function editOn(): void {
    let tiles = document.querySelectorAll(".playlist-tile");
    tiles.forEach(tile => tile.classList.add("editing"));
}

// Return class to normal
function editOff(): void {
    let tiles = document.querySelectorAll(".playlist-tile");
    tiles.forEach(tile => tile.classList.remove("editing"));
}

// Shows edit module
function showEditModule(e: Event): void {
    show(editId);
    show(backgroundDim);

    let target = <HTMLElement>e.target;
    let playlistInfo: any = target.parentNode.parentNode;

    editedName.value = playlistInfo.getElementsByTagName("p")[0].textContent;
    editedUrl.value = playlistInfo.getElementsByTagName("a")[0].getAttribute("href");
    editedImg.value = playlistInfo.getElementsByTagName("img")[0].getAttribute("src");
    editDisplayImg.setAttribute("src", editedImg.value);
}

function hideEditModuleSubmit(e: Event): void {
    hide(editId);
    hide(backgroundDim);
}

function hideEditModuleCancel(): void {
    hide(editId);
    hide(backgroundDim);

    editedIds.forEach(element => element.value = "");
}

editSave.addEventListener("click", function (e) { hideEditModuleSubmit(e); });
editCancel.addEventListener("click", hideEditModuleCancel);
backgroundDim.addEventListener("click", hideEditModuleCancel);

// ======================== Final bits ================================================================================================

if (!playlistId.hasChildNodes) {
    show(introId);
} else {
    hide(introId);
}

let abc = document.querySelectorAll(".edit-button");
abc.forEach(element => {
    element.addEventListener("click", function (e) { showEditModule(e); });
});

let welcomeText = "Anything you wanna listen to?";
document.getElementById("search").setAttribute("placeholder", welcomeText);