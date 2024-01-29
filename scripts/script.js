const BASE_URL = 'https://www.googleapis.com/youtube/v3';
const API_KEY = 'AIzaSyAKSaLauGXZc8-IK42y74ew07xM-7ZHbcM';


// ! Handle Sidebar Menu collapse functionality ==>>
const sidebarToggleBtn = document.getElementById("sideBar-toggleBtn");
sidebarToggleBtn.addEventListener("click", ()=>{
    // sidebarToggleBtn.classList.toggle("active");
    document.getElementById("sidebar").classList.toggle("sidebarOpened");
})

// ! Handle Sidebar Show More collapse functionality ==>>

// ! Fetching and Rendering videos on home page grid


async function fetchVideos(searchQuerry) {
    try{
        
    } catch(err){
        console.log("error occured :", err);
        alert("error occured :", err);
    }
}