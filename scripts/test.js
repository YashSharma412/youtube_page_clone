// Relevent links
// Figma Link- https://www.figma.com/file/53msLWP0JcqWdt4n0fjAZu/YouTube-UI-Clone-Design-(Community)?type=design&node-id=3-185&mode=design&t=9E1wUw956BSodnIp-0

// Google API- https://www.googleapis.com/youtube/v3

// API Documentation- https://developers.google.com/youtube/v3/docs

// API Key Reference- https://www.googleapis.com/youtube/v3/endpoint?key={apiKey

// Search API Documentation- https://developers.google.com/youtube/v3/docs/search/list

// Video List API Documentation- https://developers.google.com/youtube/v3/docs/videos/list


const searchQuery = "one+piece";
const API_key = "AIzaSyAKSaLauGXZc8-IK42y74ew07xM-7ZHbcM"; 
const BASE_URL = "https://www.googleapis.com/youtube/v3";

async function fetchSearchData(searchQuery) {
    try {
        const response = await fetch(`${BASE_URL}/search?key=${API_key}&part=snippet`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: searchQuery }) 
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}
document.getElementById("search_button").addEventListener("click", () => {
    fetchSearchData(searchQuery);
});
