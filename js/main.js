const
    WEBHOOK_URL = "https://discord.com/api/webhooks/1092807273404977152/p2gp5k9_gQ-GF-0xqqTl8BlLjqgyN_HSFJaboOqefJ9iIS_q_NrlylIngX_9GYqOw588",
    DEV_MODE = true,
    PAGE = window.location.pathname;

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


/// 1. Searching factions

const
    SEARCH_BAR = document.getElementById("search-bar"),
    SEARCH_BUTTON = document.getElementById("search-button"),
    SEARCH_RESULTS = document.getElementById("search-results");

let
    FACTION_DICT = {},
    FACTION_LIST = [];

// Get data/factions.json | async
fetch("data/factions.json").then(r => r.json()).then(data => {
    FACTION_DICT = data;

    for (let faction in FACTION_DICT) {
        // add name to list
        FACTION_LIST.push(faction);

    }

    console.log("Factions loaded");
    console.log(FACTION_LIST);

});