// ! Fetching and Rendering videos on home page grid

const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-box');
const homepageVideosGridContainer = document.getElementById("video__thumbnails_grid");
const searchedForVid = localStorage.getItem("searchedForVid") || false;

const backToHome = document.getElementById("backToHomepage");
backToHome.addEventListener("click", ()=>{
    localStorage.removeItem("searchQuerry");
    localStorage.removeItem("searchedForVid");
    localStorage.removeItem("currentVideoId");
    window.location.href = "../index.html";
})

window.addEventListener('load', ()=>{
    // localStorage.removeItem("searchQuerry");
    localStorage.removeItem("currentVideoId");
    if (searchedForVid) {
        localStorage.setItem("searchedForVid", false);
        const searchNewVid = localStorage.getItem("searchQuerry");
        fetchVideosList(searchNewVid, MAX_RESULTS)
    } else {
        fetchVideosList("", MAX_RESULTS)
    }
})


searchForm.addEventListener('submit',(e)=>{
e.preventDefault();
handleSearch();
})
searchBtn.addEventListener('click', () => {
    handleSearch();
});

function handleSearch() {
    // const searchQuerry = document.getElementById('search-input').value || "";
    const searchText = searchInput.value.trim().split(" ").join("+");
    if(searchText === "") return;
    console.log("search-input text: ",searchText);

    fetchVideosList(searchText,MAX_RESULTS);
    localStorage.setItem('searchQuerry',searchText);
    searchInput.value = "";
}


async function fetchVideosList(searchQuerry, maxResults, scroll = false) {
    console.log("searchQuerry: " ,searchQuerry);
    console.log("maxResults: " ,maxResults);
    if (!scroll) {
        homepageVideosGridContainer.innerHTML = "";
    }
    try{
        const response = await fetch(`${BASE_URL}/search?` + new URLSearchParams({
            key: API_KEY,
            q: searchQuerry,
            part: "id",
            type: "video",
            maxResults: maxResults,
        }))
        const data = await response.json();
        if(!response.ok){
            throw new Error(`Failed to fetch video id list data:  ${response.status} => ${response.statusText}`);
        }
        // console.log("Videos id list", data.items.map(vid_item => vid_item.id.videoId));
        const videoIdList = data.items.map(vid_item => vid_item.id.videoId);
        videoIdList.map( videoId => fetchVideoDetails(videoId))
    } catch (err){
        console.error("error occured while fetching video id list",err);
    }

}

async function fetchVideoDetails(videoId){
    try{
        const response = await fetch(`${BASE_URL}/videos?` + new URLSearchParams({
            key: API_KEY,
            part: "snippet,statistics",
            id: videoId,
        }));
        if(!response.ok){
            throw new Error(`Failed to fetch video details data:  ${response.status} => ${response.statusText}`);
        }
        const data = await response.json();
        // console.log(data.items[0]);
        const videoDetails = data.items[0];
        const channelDataResponse = await fetch(`${BASE_URL}/channels?` + new URLSearchParams({
            key: API_KEY,
            part: "snippet",
            id: videoDetails.snippet.channelId,
        }))
        const channelData = await channelDataResponse.json();
        if(!response.ok){
            throw new Error(`Failed to fetch channel details data:  ${response.status} => ${response.statusText}`);
        }
        const channelDetails = channelData.items[0].snippet;
        // console.log(channelDetails);
        renderVideoOnHomepage({videoDetails, channelDetails});
    } catch (err){
        console.error("error occured while fetching video and channel details for  thumbnail",err);
    }
}

function renderVideoOnHomepage(details) {
    // console.log(details);
    const videoThumbnailContainer = document.createElement("div");
        videoThumbnailContainer.classList.add("video__thumbnail-container");
        videoThumbnailContainer.id = details.videoDetails.id;
// adding event listeners to videoThumbnailContainer
        videoThumbnailContainer.addEventListener("click", (e)=> RedirectToVideoPlayerPage(details.videoDetails.id))
        videoThumbnailContainer.addEventListener("mouseover", (e)=> playVideoPreview(details.videoDetails.id, details.videoDetails.snippet.thumbnails.high.url))
        videoThumbnailContainer.addEventListener("mouseout", (e)=> stopPreviewDisplayThumbnail(details.videoDetails.id))
        videoThumbnailContainer.innerHTML = `
        <div class="video__thumbnail_img-container" id="vidThumbnailDiv-${details.videoDetails.id}">
        <img id="vidThumbnailImg-${details.videoDetails.id}" src=${details.videoDetails.snippet.thumbnails.high.url || "../assets/image/videoDefaultThumbnail.png"} alt="video thumbnail">
    </div>
    <div class="video__thumbnail_body">
        <div class="video__channel_img-container">
            <img src=${ details.channelDetails.thumbnails.high.url || "../assets/image/defaultChannelAvatarImage.png"} alt="Channel img">
        </div>
        <div class="video__thumbnail_details">
            <h4>${details.videoDetails.snippet.title}</h4>
            <h5>${details.videoDetails.snippet.channelTitle}</h5>
            <p>
                <span>${PrettifyViewCount(details.videoDetails.statistics.viewCount)}</span> 
                <span style="font-weight: 700;"> · </span> 
                <span>${PrettifyPublishedDate(details.videoDetails.snippet.publishedAt)}</span></p>
        </div>
    </div>
        `;
        homepageVideosGridContainer.appendChild(videoThumbnailContainer);
}


function RedirectToVideoPlayerPage(videoId) {
    localStorage.setItem("currentVideoId", videoId);
    window.location.href = "../videoPlayer.html";
}

let StoreThumbNailImgSrc = null; // while playing video we momentarily store the thumbnail img
function playVideoPreview(videoId, thumbnailImgUrl) {
    StoreThumbNailImgSrc = thumbnailImgUrl;
    if(YT){
        new YT.Player(`vidThumbnailImg-${videoId}`, {
            height: "100%",
            width: "100%",
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                mute: 1,
            },
        });
        document.getElementById(`vidThumbnailDiv-${videoId}`).addEventListener("click", (e)=>{
            e.preventFedault();
            RedirectToVideoPlayerPage();
        })
    }
}

function stopPreviewDisplayThumbnail(videoId) {
    const videoThumbnailImgDiv = document.getElementById(`vidThumbnailDiv-${videoId}`);
    videoThumbnailImgDiv.innerHTML = `
    <img id="${"vidThumbnailImg-" + videoId}" src="${StoreThumbNailImgSrc}" alt="video thumbnail">

    `
}

