var lib;
var categories;
// ======================== Upon loading ================================================================================================
function loadPage() {
}
document.addEventListener("DOMContentLoaded", loadPage);
// ======================== Show and hide ========================================================================================================================
// DOM references
var searchId = document.getElementById("search");
var introId = document.getElementById("intro");
var playlistId = document.getElementById("playlists");
var categoryId = document.getElementById("categories");
var addId = document.getElementById("add-playlist");
var editId = document.getElementById("edit-playlist");
var helpId = document.getElementById("help");
var backgroundDim = document.getElementById("background-dim");
function show(id) { id.removeAttribute("style"); }
function hide(id) { id.setAttribute("style", "display: none;"); }
// Shows and hides each <div> section based on search bar
function showSearch() {
    var searchValue = searchId.value;
    var searchTxt = searchValue.toLowerCase().trim();
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
function resetSearch(e) {
    var searchValue = searchId.value;
    var searchTxt = searchValue.toLowerCase().trim();
    var backspace = (e.key == "Backspace");
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
searchId.addEventListener("keydown", function (e) { resetSearch(e); });
// ======================== Add playlist ================================================================================================
function add() {
    var addNameId = document.getElementsByName("name")[0];
    var addUrlId = document.getElementsByName("url")[0];
    var addImgId = document.getElementsByName("img")[0];
    var addCategoriesId = document.getElementsByName("categories")[0];
    // Fetching values from input form
    var name = addNameId.value;
    var url = addUrlId.value;
    var img = addImgId.value;
    var categories = addCategoriesId.value.split(",");
    // Creating the DOM nodes
    var newTile = document.createElement("div");
    newTile.classList.add("playlist-tile");
    var newName = document.createElement("p");
    newName.appendChild(document.createTextNode(name));
    var newUrl = document.createElement("a");
    newUrl.setAttribute("href", url);
    var newImg = document.createElement("img");
    newImg.setAttribute("src", "content/img/" + img);
    var editButton = document.createElement("button");
    editButton.appendChild(document.createTextNode("Edit"));
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", function (e) { showEditModule(e); });
    var deleteButton = document.createElement("button");
    deleteButton.appendChild(document.createTextNode("Delete"));
    deleteButton.classList.add("delete-button");
    var newDiv = document.createElement("div");
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
var addSumbitId = document.getElementById("add-submit");
addSumbitId.addEventListener("click", add);
// ======================== Edit playlists ================================================================================================
var editSave = document.getElementById("edit-submit");
var editCancel = document.getElementById("edit-cancel");
var editDisplayImg = document.getElementById("edit-img");
var editedName = document.getElementsByName("edited-name")[0];
var editedUrl = document.getElementsByName("edited-url")[0];
var editedImg = document.getElementsByName("edited-img")[0];
var editCategories = document.getElementsByName("edited-categories")[0];
var editedIds = [editedName, editedUrl, editedImg, editCategories];
// Adjusts the class (mostly CSS appearance) when editing mode is on
function editOn() {
    var tiles = document.querySelectorAll(".playlist-tile");
    tiles.forEach(function (tile) { return tile.classList.add("editing"); });
}
// Return class to normal
function editOff() {
    var tiles = document.querySelectorAll(".playlist-tile");
    tiles.forEach(function (tile) { return tile.classList.remove("editing"); });
}
// Shows edit module
function showEditModule(e) {
    show(editId);
    show(backgroundDim);
    var target = e.target;
    var playlistInfo = target.parentNode.parentNode;
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
    editedIds.forEach(function (element) { return element.value = ""; });
}
editSave.addEventListener("click", function (e) { hideEditModuleSubmit(e); });
editCancel.addEventListener("click", hideEditModuleCancel);
backgroundDim.addEventListener("click", hideEditModuleCancel);
// ======================== Final bits ================================================================================================
if (!playlistId.hasChildNodes) {
    show(introId);
}
else {
    hide(introId);
}
var abc = document.querySelectorAll(".edit-button");
abc.forEach(function (element) {
    element.addEventListener("click", function (e) { showEditModule(e); });
});
var welcomeText = "Anything you wanna listen to?";
document.getElementById("search").setAttribute("placeholder", welcomeText);
