// DOM references
let searchId = <HTMLInputElement>document.getElementById("search");
let introId = document.getElementById("intro");
let playlistId = document.getElementById("playlists");
let categoryId = document.getElementById("categories");
let addId = document.getElementById("add-playlist");
let editId = document.getElementById("edit-playlist");
let helpId = document.getElementById("help");
let backgroundDim = document.getElementById("background-dim");

interface Playlist {
    name: string,
    img: string,
    url: string,
    categories: Array<string>
}

interface Category {
    name: string,
    count: number
}

// ! something wrong with the storage of uniqueCategories

/** TODO:
 * make categories work (edit as well)
 * add custom right click
 * add delete confirmation (are you sure? delete cancel)
 * add settings toggle
 * add more input validation for add function (no blanks)
 * drag n drop to reoorganise
 */


let lib: Array<Playlist> = [];
let uniqueCategories: Array<string> = [];
let categoriesLib: Array<Category> = [];


// ======================== Upon loading ======================================================== //

// Init localStorage
if (localStorage.getItem("lib") === null) {
    localStorage.setItem("lib", "[]");
}
if (localStorage.getItem("categories") === null) { // kms everything's stored as strings i forgot
    localStorage.setItem("categories", "[]");
}
if (localStorage.getItem("unique categories") === null) {
    localStorage.setItem("unique categories", "[]");
}

// Take data from localStorage and load it into the page
function loadPage(): void {
    try {
        lib = JSON.parse(localStorage.getItem("lib"));
    } catch (err) {
        console.log(err);
    }

    lib.forEach((tile) => {
        let newTile = createTile(tile.name, tile.url, tile.img);
        playlistId.appendChild(newTile);
    });
    
    try {
        categoriesLib = JSON.parse(localStorage.getItem("categories"));
    } catch (err) {
        console.log(err);
    }

    try {
        uniqueCategories = JSON.parse(localStorage.getItem("unique categories"));
    } catch (err) {
        console.log(err);
    }

    // console.table(lib);
    // console.table(categoriesLib);
    console.log(uniqueCategories);
    console.log(localStorage.getItem("unique categories"));

    if (lib.length === 0) {
        show(introId);
    } else {
        hide(introId);
    }
}

document.addEventListener("DOMContentLoaded", loadPage);

// ======================== Show and hide ======================================================== //

// Functions to make life easier
function show(id: HTMLElement): void { id.removeAttribute("style"); }
function hide(id: HTMLElement): void { id.setAttribute("style", "display: none;"); }

// Shows and hides each <div> section based on search bar
function showSearch(): void {
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
            categoryAdd();
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
function search(searchTxt: string): void {
    let playlists: any = document.querySelectorAll("#playlists > div");
    lib.forEach((playlist, index) => {
        if (playlist.name.includes(searchTxt)) {
            show(playlists[index]);
        } else {
            hide(playlists[index]);
        }
    });
    if (searchTxt.length === 0) {
        playlists.forEach(element => { show(element); });
    }
}

// Deletes search query upon backspace
function resetSearch(e: KeyboardEvent): void {
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
searchId.addEventListener("keydown", function (e) { resetSearch(e) });

// ======================== Add playlist ======================================================== //

// Adds the playlist and append data into libs/categories
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

    // Checking name is unique
    let legal = true;

    lib.forEach((playlist) => {
        if (playlist.name === name) {
            let nameWarningId = document.getElementById("name-warning");
            nameWarningId.textContent = `A playlist name with name "${name}" already exists`;
            legal = false;
        }
    })

    if (!legal) { return; }

    // Creating the DOM nodes
    let newTile = createTile(name, url, img);
    playlistId.appendChild(newTile);

    // Create object and pop into library
    let newPlaylist: Playlist = {
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
            let newCategory: Category = {
                name: category,
                count: 1
            }
            categoriesLib.push(newCategory);
        } else {
            categoriesLib.forEach((cateLib) => {
                if (cateLib.name === category) {
                    cateLib.count++;
                }
            });
        }
    });

    // Return to home page
    (<HTMLInputElement>searchId).value = "";
    showSearch();

    // Reset everything
    addNameId.value = "";
    addUrlId.value = "";
    addImgId.value = "";
    addCategoriesId.value = "";

    let warnings: any = document.querySelectorAll("#add-warning > p");
    warnings.forEach((warning) => hide(warning));
}

// Returns a HTML playlist tile
function createTile(name: string, url: string, img: string): HTMLElement {
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

let editedName = <HTMLInputElement>document.getElementsByName("edited-name")[0];
let editedUrl = <HTMLInputElement>document.getElementsByName("edited-url")[0];
let editedImg = <HTMLInputElement>document.getElementsByName("edited-img")[0];
let editedCategories = <HTMLInputElement>document.getElementsByName("edited-categories")[0];

let editedIds = [editedName, editedUrl, editedImg, editedCategories];
let editedPlaylist: Playlist;
let editedIndex: number;

// Adjusts the class (mostly CSS appearance) when editing mode is on
function editOn(): void {
    let tiles = document.querySelectorAll(".playlist-tile");
    tiles.forEach(tile => tile.classList.add("editing"));
}

function editOff(): void {
    let tiles = document.querySelectorAll(".playlist-tile");
    tiles.forEach(tile => tile.classList.remove("editing"));
}

// Shows edit module
function showEditModule(e: Event): void {
    show(editId);
    show(backgroundDim);

    let target = <HTMLElement>e.target;
    let playlistName: any = target.parentNode.previousSibling.textContent;

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
function hideEditModuleSubmit(): void {

    let targetTile = playlistId.childNodes[editedIndex];
    let tileElements: any = targetTile.childNodes;

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
function hideEditModuleCancel(): void {
    hide(editId);
    hide(backgroundDim);
    editedIds.forEach(element => element.value = "");
}

// todo add check if image exists before loading

// Changes display img based on what is entered
function showDisplayImg(): void {
    let newSrc = `content/img/${editedImg.value}`;
    editDisplayImg.setAttribute("src", newSrc);
}

editedImg.addEventListener("keyup", showDisplayImg);
editSave.addEventListener("click", hideEditModuleSubmit);
editCancel.addEventListener("click", hideEditModuleCancel);
backgroundDim.addEventListener("click", hideEditModuleCancel);

// ======================== Delete playlists ======================================================== //

// todo make delete confirmation 

let deleteTarget: HTMLElement;
let deletetile: any;
let deleteTileName: any;

function showDeleteModule(e: Event): void {
    deleteTarget = <HTMLElement>e.target;
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
let categoryTabId = document.getElementById("category-tab");
let categoriesId = document.querySelectorAll("#category-selector > div");
let categoryCreatorText = document.querySelectorAll("#category-creator > p")[1];

function categoryFocus(e: Event): void {
    let target: any = e.target;
    let pos = target.getBoundingClientRect();
    let top = pos.bottom + 5;

    categoryTabId.setAttribute("style", `visibility: visible; top: ${top}px; left: ${pos.left}px`);
}

function categoryReset() {
    categoriesId.forEach((item) => {
        item.remove();
    });
    categoryCreatorText.textContent = "";
}

let categorySelectorId = document.getElementById("category-selector");

// Toggle what the category looks like when user wants to add new playlist
function categoryAdd() {

    categoryReset();

    if (uniqueCategories.length === 0) {
        return;
    }

    uniqueCategories.forEach((item) => {
        let newP = document.createElement("p");
        let newtext = document.createTextNode(item);
        newP.appendChild(newtext);

        let newButton = document.createElement("button");
        let newtext2 = document.createTextNode("X");
        newButton.appendChild(newtext2);

        let newDiv = document.createElement("div");

        newDiv.appendChild(newP);
        newDiv.appendChild(newButton);

        categorySelectorId.appendChild(newDiv);
        console.log(newDiv);
    });
}

function categoryFocusout(e: Event): void {
    let target: any = e.target;
    categoryTabId.setAttribute("style", `visibility: hidden;`);
}

categorySelectIds.forEach(id => {
    id.addEventListener("focus", (e) => { categoryFocus(e) });
    id.addEventListener("focusout", (e) => { categoryFocusout(e) });
});


// ======================== Upon leaving ======================================================== //

function storeStuff() {
    // parse libs and categories into json
    window.localStorage.setItem("lib", JSON.stringify(lib));
    window.localStorage.setItem("categories", JSON.stringify(categoriesLib));
    window.localStorage.setItm("unique categories", JSON.stringify(uniqueCategories));
}

window.onbeforeunload = storeStuff;

// ======================== Testing out time functions ======================================================== //

let date = new Date();
let hours = date.getHours();
type Times = "morning" | "afternoon" | "evening" | "..morning?";
let greetingMsg: Times;

if (3 <= hours && hours <= 12) {
    greetingMsg = "morning";
} else if (12 < hours && hours <= 18) {
    greetingMsg = "afternoon";
} else if (18 < hours && hours <= 23) {
    greetingMsg = "evening";
} else {
    greetingMsg = "..morning?";
}

console.log(`Page successfully loaded`);
console.log(`Good ${greetingMsg}`);

// ======================== Final bits ======================================================== //

function reset(): void {
    lib = [];
    categoriesLib = [];
    localStorage.clear();
}

let welcomeText = "Anything you wanna listen to?";
document.getElementById("search").setAttribute("placeholder", welcomeText);