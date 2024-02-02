// 
const videoId = localStorage.getItem('currentVideoId');
console.log("video Id", videoId);
const videoTitle = document.getElementById("videoTitle")
const videoLikes = document.getElementById("video__likes");
const videoDislikes = document.getElementById("video__dislikes");
const videoDescription = document.getElementById("video__description");
const totalVideoComments = document.getElementById("total_comments");
// 
const channelImg = document.getElementById("channel__img");
const channelName = document.getElementById("channel__name");
const channelSubCount = document.getElementById("subscriberCount");
// 
const videoCommentsContainer = document.getElementById("video__comments-container")
const suggestedVideosContainer  = document.getElementById("suggested__videos_section");
const pageTitle = document.getElementsByTagName("title")[0];
const showMoreDescription = document.querySelector(".video__description>.description__showbtn");
const total_comments = document.getElementById("total_comments");
videoDescription.addEventListener("click", handleDescription);

let descriptionCollapsed = true;
function handleDescription() {
    document.querySelector(".video__description>p").classList.toggle("collapsed");
    descriptionCollapsed =!descriptionCollapsed;
    document.querySelector(".video__description>.description__showbtn").innerText = (descriptionCollapsed) ? "show more ...": "show less ...";
}


window.addEventListener("load",()=>{
    if(!videoId){
        alert("please redirect to homepage");
        window.location.href = "../index.html";
    }
    if(YT){
        new YT.Player("videoPlayer", {
            height: "100%",
            width: "100%",
            videoId: videoId,
            playerVars: {
                autoplay: 1
            },
        });
    }
});

async function fetchNowPlayingVideoDetails(){
    const response = await fetch(BASE_URL + "/videos?" + new URLSearchParams({
        key: API_KEY,
        part: "snippet,statistics",
        id: videoId
    }))
    const data = await response.json();
    if(!response.ok){
        throw new Error(`Failed to fetch video id list data:  ${response.status} => ${response.statusText}`);
    }
    const videoDetails = data.items[0];

    const channelResponse = await fetch(BASE_URL + "/channels?" + new URLSearchParams({
        key: API_KEY,
        part: "snippet,statistics",
        id: videoDetails.snippet.channelId
    }))
    const channelData = await channelResponse.json();

    videoTitle.innerText = videoDetails.snippet.title;
    channelName.innerText = videoDetails.snippet.channelTitle;
    if (videoDetails.snippet.description.trim() === "") {
        videoDescription.parentNode.removeChild(videoDescription);
    } else {
        videoDescription.innerText = videoDetails.snippet.description;
        if(videoDetails.snippet.description.length < 50 ){
            showMoreDescription.style.display = "none";
        }
    }
    channelSubCount.innerText = PrettifyViewCount(channelData.items[0].statistics.subscriberCount);
    channelImg.src = channelData.items[0].snippet.thumbnails.default.url;
    videoLikes.innerText = PrettifyViewCount(videoDetails.statistics.likeCount);
    pageTitle.innerText = videoDetails.snippet.title.slice(0, 30);
    total_comments.innerText = PrettifyViewCount(videoDetails.statistics.commentCount)
}

fetchNowPlayingVideoDetails();

async function handleVideoComments(){
    const response = await fetch(BASE_URL + '/commentThreads?' + new URLSearchParams({
        key: API_KEY,
        videoId: videoId,
        part: "snippet,replies",
        maxResults: 10,
        order: "relevance"
    }))
    const data = await response.json();
    const commentsData = data.items;

    commentsData.map((comment)=>{
        const commentDiv = document.createElement("div");
        commentDiv.className = "comment__card";
        commentDiv.innerHTML = `
            <div class="comment__userImg">
                <img src=${comment.snippet.topLevelComment.snippet.authorProfileImageUrl} 
                        alt="commenter img">
            </div>
            <div class="comment__body">
                <div style="display: flex; flex-wrap: nowrap; gap: 0.4rem;">
                    <h4 class="commenter__name">${comment.snippet.topLevelComment.snippet.authorDisplayName}</h4>
                    <h5 class="comment__publishAt">${PrettifyPublishedDate(comment.snippet.topLevelComment.snippet.publishedAt)}</h5>
                </div>
                <p class="comment__text">${comment.snippet.topLevelComment.snippet.textDisplay}</p>
                <div class="comment__options">
                    <div class="comment__likes">
                        <img src="./assets/icons/likeIcon.svg" alt="likes">
                        <span id="comment__likes">${PrettifyViewCount(comment.snippet.topLevelComment.snippet.likeCount)}</span>
                    </div>
                    <div class="comment__likes">
                        <img src="./assets/icons/dislikeIcon.svg" alt="dislikes">
                        <span id="comment__dislikes"></span>
                    </div>
                    <div class="comment__reply-btn">
                        Reply
                    </div>
                </div>
                ${
                    comment.snippet.totalReplyCount > 0 ? `
                    <div class="comment__replies" id=${comment.snippet.topLevelComment.id} onclick="handleCommentReplies(this)" >
                        <h1><i class="fa-solid fa-sort-down" style="color: #74C0FC;"></i> <span class="comment__replies-count"> ${comment.snippet.totalReplyCount} </span> Replies</h1>
                    </div>
                    ` : ""
                }
            </div>
        `
        videoCommentsContainer.appendChild(commentDiv);
    })
}

handleVideoComments();

async function handleCommentReplies(target){
    // console.log(target.id);
    target.onclick = null;
    const commentId = target.id;
    const commentRepliesDiv = target;
    const response = await fetch(BASE_URL + '/comments?' + new URLSearchParams({
        key: API_KEY,
        parentId: commentId,
        part: "snippet",
        maxResults: 10,
        order: "relevance"
    }));
    const data = await response.json();
    // console.log(data);
    const repliesData = data.items;
    repliesData.map((reply)=>{
        const commentReplyDiv = document.createElement("div");
        commentReplyDiv.className = "comment__card";
        commentReplyDiv.innerHTML = `
            <div class="comment__userImg">
                <img src=${reply.snippet.authorProfileImageUrl} alt="replier img">
            </div>
            <div class="comment__body">
                <div style="display: flex; flex-wrap: nowrap; gap: 0.4rem;">
                    <h4 class="commenter__name">${reply.snippet.authorDisplayName}</h4>
                    <h5 class="comment__publishAt">${PrettifyPublishedDate(reply.snippet.publishedAt)}</h5>
                </div>
                <p class="comment__text">${reply.snippet.textDisplay}</p>
                <div class="comment__options">
                    <div class="comment__likes">
                        <img src="./assets/icons/likeIcon.svg" alt="likes">
                        <span id="comment__likes">${PrettifyViewCount(reply.snippet.likeCount)}</span>
                    </div>
                    <div class="comment__likes">
                        <img src="./assets/icons/dislikeIcon.svg" alt="dislikes">
                        <span id="comment__dislikes"></span>
                    </div>
                </div>
            </div>
        `
        commentRepliesDiv.appendChild(commentReplyDiv);
    })
}

async function fetchSuggestedVideos(){
    const searchQuerry = localStorage.getItem('searchQuerry') || "";
    const response = await fetch(BASE_URL + "/search?" + new URLSearchParams({
        key: API_KEY,
        part: "id",
        q: searchQuerry,
        type: "video",
        maxResults: MAX_RESULTS,
        order: "relevance"
    }))
    const data = await response.json();
    if(!response.ok){
        throw new Error(`Failed to fetch video id list data:  ${response.status} => ${response.statusText}`);
    }
    const suggestedVideoIds = data.items.map(el => el.id.videoId);
    suggestedVideoIds.map((vidId) =>{
        fetchSuggestedVideoDetails(vidId)
    })
}

async function fetchSuggestedVideoDetails(videoId) {
    const response = await fetch(`${BASE_URL}/videos?` + new URLSearchParams({
        key: API_KEY,
        part: "snippet,statistics",
        id: videoId,
    }));
    const data = await response.json();
    if(!response.ok){
        throw new Error(`Failed to fetch video data:  ${response.status} => ${response.statusText}`);
    }
    const videoDetails = data.items[0];

    // const channelResponse = await fetch(`${BASE_URL}/channels?` + new URLSearchParams({
    //     key: API_KEY,
    //     part: "snippet",
    //     id: videoDetails.snippet.channelId
    // }));
    // if(!channelResponse.ok){
    //     throw new Error(`Failed to fetch video data:  ${response.status} => ${response.statusText}`);
    // }
    // const channelData = await channelResponse.json();
    // const channelDetails = channelData.items[0].snippet;
    const suggestedVideoDiv = document.createElement("div");
    suggestedVideoDiv.className = "suggested__video_card";
    suggestedVideoDiv.addEventListener("click", ()=>{
        RedirectToVideoPlayerPage(videoDetails.id)
    })
    suggestedVideoDiv.innerHTML = `
    <div class="suggested__video_img">
        <img src=${videoDetails.snippet.thumbnails.high.url} alt="suggested video img">
    </div>
    <div class="suggested__video_body">
        <h1 class="suggested__video_heading">${videoDetails.snippet.title}</h1>
        <h5 class="suggested__video_channel">${videoDetails.snippet.channelTitle}</h5>
        <div class="suggested__video_details">
            <span class="suggested__video_viewCount">${PrettifyViewCount(videoDetails.statistics.viewCount)}</span> &middot;
            <span class="suggested__video_pblishedAt">${PrettifyPublishedDate(videoDetails.snippet.publishedAt)}</span>
        </div>
    </div>
    `

    suggestedVideosContainer.appendChild(suggestedVideoDiv);
}

function RedirectToVideoPlayerPage(videoId) {
    localStorage.setItem("currentVideoId", videoId);
    location.reload();
}


fetchSuggestedVideos()