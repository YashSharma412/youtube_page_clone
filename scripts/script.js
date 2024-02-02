const API_KEY = 'AIzaSyAqd7NEpSmfCeJXdBwNVr51JZUHOVhd_Xo';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';
const MAX_RESULTS = 18;
// ! Handle Sidebar Menu collapse functionality ==>>
const sidebarToggleBtn = document.getElementById("sideBar-toggleBtn");
sidebarToggleBtn.addEventListener("click", ()=>{
    // sidebarToggleBtn.classList.toggle("active");
    document.getElementById("sidebar").classList.toggle("sidebarOpened");
})

// ! Handle Sidebar Show More collapse functionality ==>>

function PrettifyViewCount(viewCount) {
    // console.log("viewCount: ", viewCount)
    let count = parseFloat(viewCount);
    if (count > 1e9) {
        return (count/1e9).toFixed(2) + "B";
    } else if(count >= 1e6){
        return (count/1e6).toFixed(2) + "M";
    } else if(count >= 1e3){
        return (count/1e3).toFixed(2) + "K";
    } else{
        return count.toString();
    }
}

function PrettifyPublishedDate(publishedAt) {
    const publishedDate = new Date(publishedAt);
    const now = new Date();
    const timePassedInSeconds = Math.floor((now - publishedDate)/1000);

    if (timePassedInSeconds < 60) {
        return `${timePassedInSeconds} seconds ago`;
      } else if (timePassedInSeconds < 3600) {
        const minutes = Math.floor(timePassedInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      } else if (timePassedInSeconds < 86400) {
        const hours = Math.floor(timePassedInSeconds / 3600);
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      } else if (timePassedInSeconds < 604800) {
        const days = Math.floor(timePassedInSeconds / 86400);
        return `${days} day${days > 1 ? "s" : ""} ago`;
      } else if (timePassedInSeconds < 2419200) {
        const weeks = Math.floor(timePassedInSeconds / 604800);
        return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
      } else if (timePassedInSeconds < 29030400) {
        const months = Math.floor(timePassedInSeconds / 2419200);
        return `${months} month${months > 1 ? "s" : ""} ago`;
      } else {
        const years = Math.floor(timePassedInSeconds / 29030400);
        return `${years} year${years > 1 ? "s" : ""} ago`;
      }
}

