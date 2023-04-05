const
    WEBHOOK_URL = "https://discord.com/api/webhooks/1092807273404977152/p2gp5k9_gQ-GF-0xqqTl8BlLjqgyN_HSFJaboOqefJ9iIS_q_NrlylIngX_9GYqOw588",
    DEV_MODE = false,
    PAGE = window.location.pathname;

// 1. Global Functions
function getAverageColour(image_src) {

    const
        canvas = document.createElement("canvas"),
        context = canvas.getContext && canvas.getContext("2d");

    let
        data, width, height, i = -4,
        length, rgb = {r: 0, g: 0, b: 0},
        count = 0;

    if (!context) {
        return false;
    }

    const
        img = new Image();

    img.src = image_src;

    width = canvas.width = img.width;
    height = canvas.height = img.height;

    context.drawImage(img, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch (e) {
        /* security error, img on diff domain */
        console.error(e);
        return false;
    }

    length = data.data.length;

    while ((i += width * 4) < length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    console.log(rgb);
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

}


// 2. Webhook
if (!DEV_MODE) {
    fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: "Someone visited " + PAGE,
            username: "Webhook",
            avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png"
        })
    }).then(r =>
        console.log(`Status: ${r.status} ${r.statusText}`)
    ).then(console.log);
}


// 3. Searching Factions
const
    SEARCH_BAR = document.getElementById("search-bar"),
    SEARCH_BUTTON = document.getElementById("search-button"),
    SEARCH_RESULTS = document.getElementById("search-results");

let
    FACTION_LIST = [];

function addFaction(faction) {
    const
        FACTION = faction.item,
        SEARCH_RESULT = document.createElement("div"),
        SEARCH_RESULT_NAME = document.createElement("h3"),
        SEARCH_RESULT_DESCRIPTION = document.createElement("p"),
        SEARCH_RESULT_LEADER = document.createElement("p"),
        SEARCH_RESULT_BUTTON_ROW = document.createElement("div"),
        SEARCH_RESULT_DISCORD = document.createElement("a"),
        SEARCH_RESULT_PAGE = document.createElement("a"),
        SEARCH_RESULT_LOGO = document.createElement("img");

    const
        LOGO_NAME = `${FACTION.logo}`,
        LOGO_PATH = LOGO_NAME;
        
    SEARCH_RESULT.classList.add("search-result");

    SEARCH_RESULT_LOGO.src = LOGO_PATH;
    SEARCH_RESULT_LOGO.width = 100;
    SEARCH_RESULT_LOGO.height = 100;

    SEARCH_RESULT_NAME.innerText = FACTION.name;
    SEARCH_RESULT_LEADER.innerText = `Leader: ${FACTION.leader}`
    SEARCH_RESULT_DESCRIPTION.innerText = FACTION.description;

    SEARCH_RESULT_BUTTON_ROW.classList.add("button__row")
    
    SEARCH_RESULT_PAGE.classList.add("button");
    SEARCH_RESULT_PAGE.innerText = `View ${FACTION.name}'s Page`
    SEARCH_RESULT_PAGE.href = `factions/${FACTION.name.toLowerCase().replace(" ", "-")}.html`;
    SEARCH_RESULT_PAGE.target = "_blank";

    SEARCH_RESULT_DISCORD.classList.add("button");
    SEARCH_RESULT_DISCORD.innerText = `Join ${FACTION.name}'s Discord`
    SEARCH_RESULT_DISCORD.href = FACTION.discord;
    SEARCH_RESULT_DISCORD.target = "_blank";


    SEARCH_RESULT_BUTTON_ROW.appendChild(SEARCH_RESULT_DISCORD);
    SEARCH_RESULT_BUTTON_ROW.appendChild(SEARCH_RESULT_PAGE);

    SEARCH_RESULT.appendChild(SEARCH_RESULT_LOGO);
    SEARCH_RESULT.appendChild(SEARCH_RESULT_NAME);
    SEARCH_RESULT.appendChild(SEARCH_RESULT_LEADER);
    SEARCH_RESULT.appendChild(SEARCH_RESULT_DESCRIPTION);
    SEARCH_RESULT.appendChild(SEARCH_RESULT_BUTTON_ROW);
    
    SEARCH_RESULTS.appendChild(SEARCH_RESULT);
}

fetch("data/factions.json").then(r => r.json()).then(data => {
    FACTION_LIST = data;
});


async function searchFaction(query) {

    const
        options = {
            includeScore: true,
            keys: ["name", "description", "leader"]
        },
        fuse = new Fuse(FACTION_LIST, options) // "list" is the item array
    return fuse.search(query);
}


// Search button
SEARCH_BUTTON.addEventListener("click", async () => {
    const results = await searchFaction(SEARCH_BAR.value);
    SEARCH_RESULTS.innerHTML = "";
    results.forEach(result => {
        addFaction(result);
    });
});



