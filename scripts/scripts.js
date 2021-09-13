// DOM references
let playlistId = document.getElementById("playlists");
let searchId = document.getElementById("search");
let tagId = document.getElementById("tag-info");

/** Toggles display to block */
function show(...node) 
{ 
    node.forEach((node) => node.removeAttribute("style")); 
}

/** Toggles display to none */
function hide(...node) 
{ 
    node.forEach((node) => node.setAttribute("style", "display: none;")); 
}

//todo * = edit, + = add new, - = delete ? = help

class Playlist 
{
    constructor(name, img, url) 
    {
        this.name = name;
        this.img = img;
        this.url = url;
        this.tags = [];

        this.idName = null;
        this.idUrl = null;
        this.idImg = null;
        this.idBox = null;
    }

    /** Creates the playlist and returns the playlist node */
    init() 
    {
        let plBox = document.createElement("div");
        let plUrl = document.createElement("a");
        let plImg = document.createElement("div");
        let plName = document.createElement("p");
    
        let txt = this.name.toLowerCase();
        let desc = document.createTextNode(txt);
    
        plBox.classList.add("playlist-box");
        plUrl.classList.add("playlist-link");
        plImg.classList.add("playlist-img");
        plName.classList.add("playlist-name");
    
        plUrl.setAttribute("href", this.url);
        plImg.setAttribute("style", "background-image: url(../img/" + this.img + ".png)");

        this.idBox = plBox;
        this.idImg = plImg;
        this.idUrl = plUrl;
        this.idName = plName;
    
        plName.appendChild(desc);
        plImg.appendChild(plName);
        plUrl.appendChild(plImg);
        plBox.appendChild(plUrl);
    
        return plBox;
    }

    addTag(newTag) 
    { 
        this.tags.push(newTag.toLowerCase()); 
    }

    enableUrl()
    {
        this.idUrl.setAttribute("href", this.url);
    }

    disableUrl()
    {
        this.idUrl.removeAttribute("href");
    }

    remove()
    {
        this.idBox.parentNode.removeChild(this.idBox);
    }
}

/** Short for library. Stores all the playlist objects */
let lib = 
{
    // Store all the playlist objects in "playlists" array
    "playlists": playlistData.map(function(data) 
    {
        // Create and init all objects
        let newList = new Playlist(data[0], data[1], data[2]);
        playlistId.appendChild(newList.init());

        // Add the tags
        for (let i = 3; i < data.length; i++) 
        { 
            newList.addTag(data[i]); 
        }
        return newList;
    }),

    /** Inputs include: "name", "tag", "box" */
    "get": function(input) 
    {
        switch (input.toLowerCase()) 
        {
            case "name": input = "idName"; break;
            case "tag": input = "tags"; break;
            case "box": input = "idBox"; break;
            case "img": input = "idImg"; break;
        }
        return this.playlists.map((playlist) => playlist[input]);
    },

    /** Input event and returns lib object of event */
    "find": function (event) {
        let target = event.target;
        let index = -1;
        if (target.classList.contains("playlist-box")) 
        {
            lib.get("box").forEach((playlist, i) => { if (target === playlist) {index = i}; return; });
        }
        else if (target.classList.contains("playlist-img"))
        {
            lib.get("img").forEach((playlist, i) => { if (target === playlist) {index = i}; return; });
        }
        else if (target.classList.contains("playlist-name"))
        {
            lib.get("name").forEach((playlist, i) => { if (target === playlist) {index = i}; return; });
        }
        else
        {
            return false;
        }
        return this.playlists[index];
    }
};

let tagsLib = [];
// Add all unique tags to tagsLib
(function() 
{
    // Add instrumental to all non-vocal
    lib.playlists.forEach((list) => {
        if (list.tags.indexOf("vocal") === -1) list.addTag("instrumental");
    });

    // Push all unique tags to tagsLib
    lib.get("tag").forEach(function(tags)
    {
        tags.forEach(function(tag)
        {
            if (tagsLib.every((uniqueTag) => uniqueTag !== tag)) tagsLib.push(tag);
        });
    });

    tagsLib.sort();

    let tagUlId = tagId.querySelector("ul");

    // Remove "no tags yet" msg
    if (tagsLib.length > 0) 
    {
        tagUlId.removeChild(tagUlId.querySelector("li"));
    }

    tagsLib.forEach(function(tag){
        tag = tag.charAt(0).toUpperCase() + tag.slice(1);
        let li = document.createElement("li");
        let text = document.createTextNode(tag);
        li.appendChild(text);
        tagUlId.appendChild(li);
    });

})();

let doc = 
{
    "lists": 1,
    "size": 187, // size of one playlist is 187x187
    "flexWidth": 975,
    "width": 0,
}

/** Resizes the flex width so playlists are always centered */
function resizeCheck()
{
    doc.width = document.documentElement.clientWidth;
    doc.flexWidth = doc.size*doc.lists;

    let searchTxt = searchId.value.toLowerCase().trim();
    if (searchTxt.length === 0) doc.flexWidth = 9000;

    if (doc.width > 1050 && doc.lists >= 5) 
    {
        doc.flexWidth = doc.size*5;
    }
    else if (doc.width > 780 && doc.lists >= 4)
    {
        doc.flexWidth = doc.size*4;
    }
    else if (doc.width > 580 && doc.lists >= 3)
    {
        doc.flexWidth = doc.size*3;
    }
    else if (doc.lists >= 2)
    {
        doc.flexWidth = doc.size*2; 
    }
    else
    {
        doc.flexWidth = doc.size;
    }
    playlistId.setAttribute("style", "width: " + doc.flexWidth + "px;");
}

/** Filters the playlists. */
function search() 
{
    let searchTxt = searchId.value.toLowerCase().trim();
    doc.lists = 0; // for centering the elements

    // If user wants to search categories
    if (searchTxt.charAt(0) == ">") 
    {
        // Updating 
        searchTxt = searchTxt.slice(1).trim();
        searchId.setAttribute("style", "color: rgb(222, 203, 183)");
        
        // Searches all playlists' tags for if it matches specified tag (exact val)
        lib.playlists.forEach(function(playlist) 
        {
            if (playlist.tags.some((tag) => tag === (searchTxt))) // ie. hasTag
            {
                doc.lists++;
                show(playlist.idBox);
            }
            else
            {
                hide(playlist.idBox);
            }
        });
        // Shows/hides the tag menu
        tagsLib.some((tag) => searchTxt === tag) ? hide(tagId) : show(tagId);        
    }
    else // Default search
    {
        lib.playlists.forEach(function(playlist) 
        {
            if (playlist.name.includes(searchTxt)) 
            {
                doc.lists++;
                show(playlist.idBox);
            }
            else
            {
                hide(playlist.idBox);
            }
        });

        // Updating
        searchId.removeAttribute("style");
        hide(tagId);
    }
    resizeCheck();
}

searchId.addEventListener("keyup", search);
window.onresize = resizeCheck;

/** Allows user to click on tag list and fills in search bar for them. */
function tagSearch(e)
{
    searchId.value = "> " + e.target.textContent;
    search();
}

let liId = document.querySelectorAll("#tag-info > ul > li")
liId.forEach((li) => li.addEventListener("click", tagSearch));

/** Store info for drag and drop */
let dnd = {
    "clicking": false,
    "freshClick": true,
    "x": 0,
    "initialx": 0, // Horizontal position on first click
    "y": 0,
    "initialy": 0,
    "relX": 0, // Horizontal position relative to firstTarget
    "relY": 0,
    "firstTarget": null, // Element to be moved
    "currentTarget": null,
    "listPosition": [],
    "listIndex": [],
    "placeholder": (new Playlist("", "0", "index.html")).init(),
    "pos": null,
    "relpos": null
}

dnd.placeholder.setAttribute("style", "visibility: hidden;");

function drag(e) 
{
    if (e.which === 1) // is clicking left button
    {
        // Updating
        dnd.clicking = true;
        dnd.firstTarget = lib.find(e);

        // Get cursor position relative to element. For illusion of dragging
        dnd.pos = dnd.firstTarget.idBox.getBoundingClientRect();
        dnd.relpos = dnd.firstTarget.idBox.getBoundingClientRect();
        dnd.relX = e.clientX - dnd.pos.left;
        dnd.relY = e.clientY - dnd.pos.top;

        // Getting position of each box
        let positions = lib.get("box").map((box) => box.getBoundingClientRect());

        // Filtering out elements that aren't on screen
        let height = document.documentElement.clientHeight;
        dnd.listPosition = positions.filter((box, index) => 
        {
            if (box.bottom > 0 && box.top < height) 
            {
                // Recording the index
                dnd.listIndex.push(index);
                return true;
            }
            else 
            {
                return false;
            }
        });
        console.log(dnd.listIndex);
    }
}

function drop(e)
{
    if (dnd.clicking)
    {
        dnd.currentTarget = lib.find(e);
        dnd.firstTarget.idBox.removeAttribute("style");
    }

    // Updating
    dnd.listPosition = [];
    dnd.listIndex = [];
    dnd.clicking = false;
    //playlistId.insertBefore(dnd.firstTarget.idBox, playlistId.childNodes.indexOf(dnd.ph)); //! i don't know what's happening anymore
    dnd.placeholder.remove();
}

function dragMove(e)
{
    if (dnd.firstTarget === null) return;

    dnd.x = e.clientX;
    dnd.y = e.clientY;

    if (dnd.clicking)
    {
        // Illusion of dragging
        let target = dnd.firstTarget;
        let x = dnd.x  - dnd.relX;
        let y = dnd.y - dnd.relY;
        target.idBox.setAttribute("style", "z-index: 1; cursor: move; position: fixed; left: " + x + "px ; top: " + y + "px ;");
        dnd.firstTarget.disableUrl();

        dnd.listPosition.forEach((box, i) =>  
        {
            if (box.left < dnd.x && dnd.x < box.right && box.top < dnd.y && dnd.y < box.bottom) 
            {
                console.log(lib.playlists[dnd.listIndex[i]].name);
            }
        });

        // Set dnd.currentTarget as the object it's currently hovering over
        /*dnd.elements.forEach((box, i) => 
        {
            // Checking which box is hovered over // ! very gross... need to fix and optimise...
            // todo maybe instead of relative position, try to match up with array. 
            // todo you've got which box's in there. just need to access the array and then append the child
            // todo i'm so tired. i've been sleepy for way too long
            // TODO: go to bed
            if (box.left < dnd.x && dnd.x < box.right && box.top < dnd.y && dnd.y < box.bottom) 
            {
                let index = i;
                let mod = 1;

                if (dnd.y < dnd.relpos.top) // above playlist
                {
                    // just to make sure nothign happens
                    mod = 0;
                    console.log("top");
                }
                else if (dnd.y > dnd.relpos.bottom) // below playlist
                {
                    console.log("bot");
                    index++;
                }
                else // on the same row
                {
                    if (dnd.x > dnd.relpos.right) // to the right
                    {
                        console.log("right");
                        index++;
                    }
                    else if (dnd.x < dnd.relpos.left) // to the left
                    {
                        console.log("left");
                        mod = 0;
                        // nothing happens
                    }
                    else // on same place
                    {
                        console.log("same place");
                    }
                }

                dnd.currentTarget = lib.playlists[dnd.elementsIndex[index]];
                let append = playlistId.childNodes[lib.playlists.indexOf(dnd.currentTarget) + mod];

                // Last element
                if (playlistId.childNodes[dnd.elementsIndex[index]] === undefined) 
                {
                    playlistId.appendChild(dnd.placeholder);
                    return;
                }

                if (dnd.elements[index] === undefined) // ! meant to help with bottom right corner. it doesn't work
                {
                    append = playlistId.childNodes[lib.playlists.indexOf(dnd.currentTarget) + mod - 1];
                }

                // Insert the placeholder
                playlistId.insertBefore(dnd.placeholder, append);
                dnd.relpos = dnd.placeholder.getBoundingClientRect();
                console.log(dnd.currentTarget.name + " | index: " + index + " | mod: " + mod);
            }
        });*/
    }
    if (!dnd.clicking && dnd.firstTarget !== null) dnd.firstTarget.enableUrl();
}

lib.get("box").forEach(function(box)
{
    box.addEventListener("mousedown", drag);
    box.addEventListener("mouseup", drop);
});

document.addEventListener("mousemove", dragMove);



// Seeing if the scripts broke
search();
let welcomeText = "Anything you wanna listen to?";
document.getElementById("search").setAttribute("placeholder", welcomeText);