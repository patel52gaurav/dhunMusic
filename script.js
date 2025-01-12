

let currentSong = new Audio(); //  currentSong is a new, empty audio object.  currentSong.src → Empty string ("") because no source has been set yet.
// console.log("gana Current =",currentSong.src); //  Output: ""

let songs = []; // Holds the list of song names fetched from the server.
let currFolder = ""; // Tracks the current folder where songs are being fetched from.
let currentSongIndex = -1; // Keeps track of the currently playing song's index.





const nextButton = document.querySelector('#next'); // Replace with your next button's selector
const prevButton = document.querySelector('#previous'); // Replace with your previous button's selector



// The function takes a total number of seconds as input and
// converts it into a time format MM:SS

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  // Think of .padStart() as adding a zero before a number if it doesn’t already have two digits,
  // like writing "05 minutes" instead of "5 minutes" on a digital timer. It makes the output neat and professional.

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, "0"); // Converts remainingSeconds to a string. Pads with "0" if the length is less than 2.
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}







let timerInterval = null;


function showToast(message) {
  // Create toast element
  const toast = document.createElement("div");
  toast.classList.add("timer-toast");
  toast.textContent = message;

  // Style the toast
  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.backgroundColor = "rgba(0,0,0,0.8)";
  toast.style.color = "white";
  toast.style.padding = "15px";
  toast.style.borderRadius = "5px";
  toast.style.zIndex = "1000";
  toast.style.transition = "opacity 0.3s";

  // Add toast to body
  document.body.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

function createTimerModal() {
  // Create backdrop
  const backdrop = document.createElement("div");
  backdrop.style.position = "fixed";
  backdrop.style.top = "0";
  backdrop.style.left = "0";
  backdrop.style.width = "100%";
  backdrop.style.height = "100%";
  backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  backdrop.style.backdropFilter = "blur(5px)";
  backdrop.style.zIndex = "999";
  backdrop.style.display = "flex";
  backdrop.style.justifyContent = "center";
  backdrop.style.alignItems = "center";

  // Create modal container
  const modal = document.createElement("div");
  modal.id = "timer-modal";
  modal.style.backgroundColor = "#252525";
  modal.style.color = "white";
  modal.style.padding = "30px";
  modal.style.borderRadius = "10px";
  modal.style.zIndex = "1000";
  modal.style.width = "400px";
  modal.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
  modal.style.textAlign = "center";

  // Modal content
  modal.innerHTML = `
        <h2>Set Timer</h2>
        <div style="margin: 20px 0;">
            <label for="hours">Hours:</label>
            <input type="number" id="hours" min="0" max="23" value="0" 
                   style="width: 60px; margin: 0 10px; background-color: #333; color: white; border: none; padding: 5px;">
            
            <label for="minutes">Minutes:</label>
            <input type="number" id="minutes" min="0" max="59" value="0" 
                   style="width: 60px; margin: 0 10px; background-color: #333; color: white; border: none; padding: 5px;">
        </div>
        <div>
            <button id="start-timer" style="background-color: #1db954; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-right: 10px;">Start Timer</button>
            <button id="close-timer-modal" style="background-color: #333; color: white; border: none; padding: 10px 20px; border-radius: 5px;">Cancel</button>
        </div>
    `;

  // Add event listeners
  const startTimerBtn = modal.querySelector("#start-timer");
  const closeModalBtn = modal.querySelector("#close-timer-modal");
  const hoursInput = modal.querySelector("#hours");
  const minutesInput = modal.querySelector("#minutes");

  // Function to close modal
  const closeModal = () => {
    document.body.removeChild(backdrop);
  };

  startTimerBtn.addEventListener("click", () => {
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes > 0) {
      startTimer(totalMinutes);
      closeModal();
    } else {
      showToast("Please set a valid timer duration");
    }
  });

  closeModalBtn.addEventListener("click", closeModal);

  // Close modal when clicking outside
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  // Prevent modal from closing when clicking inside the modal
  modal.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Append modal to backdrop
  backdrop.appendChild(modal);

  return backdrop;
}

function startTimer(minutes) {
  // Clear any existing timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  // Calculate end time
  const endTime = Date.now() + minutes * 60 * 1000;

  // Show timer start toast
  showToast(`Timer set for ${minutes} minutes`);

  timerInterval = setInterval(() => {
    const remainingTime = endTime - Date.now();

    if (remainingTime <= 0) {
      // Timer finished
      clearInterval(timerInterval);
      currentSong.pause();
      play.src = "img/play.svg";
      showToast("Timer finished. Playback stopped.");
    }
  }, 1000);
}



// Function to add the " next and previous button clicked" effect
function handleClick(button) {
  button.classList.add('button-clicked'); // Add the "clicked" class

  // Remove the "clicked" class after the animation duration
  setTimeout(() => {
    button.classList.remove('button-clicked');
  }, 100); // Match the duration in CSS
}









async function getSongs(folder) {
  try {
    // console.log(`Fetching songs from folder: ${folder}`);
    currFolder = folder;

    let response = await fetch(`http://127.0.0.1:5500/${folder}/`); // let response = await fetch("http://127.0.0.1:5500/songs/cs/");
    if (!response.ok) { 
      // This block runs if the response is not successful (e.g., 404, 500 error)

      // response.ok is true if the status code is between 200 and 299, meaning the request was successful. 


      console.error(`Failed to fetch songs: ${response.statusText}`); // If the fetch() request fails, and for example, the server responds with a 404 error (Page Not Found), response.statusText would be "Not Found", and the log would be: Failed to fetch songs: Not Found
      return;
    }


    // Neeche ki chaar line is used to fetch HTML content from a response, parse it into a DOM structure, and extract all anchor (<a>) elements from it. 
    
   /*1 */ let htmlText = await response.text(); // The htmlText will hold the string:: "<html><body><a href='song1.mp3'>Song 1</a><a href='song2.mp3'>Song 2</a></body></html>"

   /*2 */  let parser = new DOMParser(); // DOMParser is used to parse a string of HTML, XML, or SVG into a DOM structure, making it easier to manipulate and query the content.
   /* 3 */  let doc = parser.parseFromString(htmlText, "text/html"); 
    //--> Parses the htmlText string into a Document object.
    //--> "text/html" specifies that the string being parsed is HTML content.
    //--> After this step, doc behaves like a DOM structure, allowing you to traverse and manipulate it.



   // Searches the parsed DOM (doc) for all <a> elements.
   /* 4 */  let anchors = doc.getElementsByTagName("a");


    songs = [];  // ye global variable h,yaha pe songs array ko khaali kr rhe kyuki hm chahte h ki agar naye card pe click kre to list mein jo puraane songs the wo naye waale k saath merge na ho
    for (let element of anchors) {
      if (element.href.endsWith(".mp3")) {
        // console.log(element.href.split(`/${folder}/`)[1]);  element.href.split(`/${folder}/`)[1] contains tum%20hi%20ho.mp3
        
        songs.push(decodeURIComponent(element.href.split(`/${folder}/`)[1])); // If element.href is http://127.0.0.1:5500/songs/cs/song1.mp3 and folder is "songs/cs", this results in: ["http://127.0.0.1:5500", "song1.mp3"]
        // decodeURIComponent: Decodes any URL-encoded characters (e.g., %20 for spaces) in the filename to make it human-readable.
      }
    }


    let songsUL = document.querySelector(".songList ul");
    songsUL.innerHTML = "";
    for (const song of songs) {
      songsUL.innerHTML += `<li>
          <img class="invert" src="img/music.svg" alt="">
          <div class="info">
              <div>${song}</div>
              
          </div>
          <div class="playnow">
              <span>Play Now</span>
              <img class="invert" src="img/play.svg" alt="">
          </div>
      </li>`;
    }

    Array.from(songsUL.querySelectorAll("li")).forEach((li, index) => {
      // console.log(li,index);
      
      li.addEventListener("click", () => {
        playMusic(songs[index]);
      });
    });

    // console.log("Songs loaded successfully:", songs);
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
}




function playMusic(track, pause = false) { // If the user clicked on "song1.mp3" , track will contain "song1.mp3".
  currentSongIndex = songs.indexOf(track); // 
  currentSong.src = `/${currFolder}/` + track; // pehle kisi gaane play krna then will look like this currentSong.src = "http://127.0.0.1:5500/songs/ncs/aa%20jaao.mp3"
  console.log(currentSong.src); 

  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track); // If track = "song%20one.mp3", decodeURI(track) will return "song one.mp3".
 
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"; // jb bhi naye gaane pe click kre Ensures the time display is reset when switching between songs, avoiding a situation where leftover times from the previous song might be shown.
}


async function main() {
  // Load songs from default folder
  await getSongs("songs/ncs");

  // Add a search input dynamically
  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "text");
  searchInput.setAttribute("placeholder", "Search songs...");
  searchInput.classList.add("search-input"); // <input type="text" placeholder="Search songs..." class="search-input">

  // Insert the search input after the "Your Library" heading


  const libraryHeading = document.querySelector(".find-Song");
  // Since <li class="find-Song"></li> is inside the <ul>, the new input will be added directly after the <ul> and not inside it.
  // If you want the search input to appear inside the <ul> and not outside, you could modify the JavaScript code like this:
  // libraryHeading.insertAdjacentElement("beforeend", searchInput);


  /*
<ul>
    <li><img class="invert" src="img/home.svg" alt="home">Home</li>
    <li><div class="timer-btn">
        <img class="invert" src="img/timer.svg" alt=""> Timer
    </div></li>
    <li class="find-Song"></li>
</ul>
<input type="text" placeholder="Search songs..." class="search-input">
  */  

  libraryHeading.insertAdjacentElement("afterend", searchInput);


 

  



// Function to delay the execution of another function
function debounce(func, delay) {
  // A variable to store the timer
  let timer;

  return function (...args) {
    // Clear any previous timer
    clearTimeout(timer);

    // Set a new timer to call the function after the delay
    timer = setTimeout(() => {
      func(...args); // Call the function with the provided arguments
    }, delay);
  };
}

// Search function to filter the list of songs
function searchSongs(searchTerm) {
  const songsList = document.querySelector(".songList ul"); // Get the <ul> containing song items
  const songItems = songsList.querySelectorAll("li"); // Get all the <li> items in the list

  songItems.forEach((item) => {
    const songName = item.querySelector(".info div:first-child").textContent.toLowerCase(); // Get the song name text
    const matchesSearch = songName.includes(searchTerm.toLowerCase()); // Check if it matches the search term

    // Show or hide the item based on the search match
    item.style.display = matchesSearch ? "flex" : "none";
  });
}

// Create a debounced version of the search function
const performSearch = debounce(searchSongs, 300); // Delay execution by 300ms


// Add an event listener to the search input box
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value; // Get the text entered by the user
  performSearch(searchTerm); // Call the debounced search function
});


// Timer functionality
const timerBtn = document.querySelector(".timer-btn");
timerBtn.addEventListener("click", () => {
  const timerModal = createTimerModal();
  document.body.appendChild(timerModal);
});


 




  

  // Existing playback controls and event listeners
  play.addEventListener("click", () => { // play is an id which referes to line 134 in html --> <img width="35" id="play" src="img/play.svg" alt="">
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
   
  });


  // normally kisi song ko jb play krnge tb usmein gaane kaa naam,uska duration MM:SS mein, uska circle move krega towards right side.
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = 
    `${secondsToMinutesSeconds(currentSong.currentTime )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%"; //At 25 Seconds: (25 / 100) * 100 = 25%  .circle will move to the 25% position of the seek bar.
  });
  

  // iska mtlb ye hai ki agar gaane ko randomly kahi se bhagaana hai to uske liye logic likha gya h
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    // console.log(e.target);
    
    // e.offsetX gives the horizontal distance (in pixels) from the left edge of the seek bar to the point where the user clicked.
    // e.target.getBoundingClientRect().width = Retrieves the total width (in pixels) of the seek bar element.
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;  
    document.querySelector(".circle").style.left = percent + "%";

    // If the song is 240 seconds long and the user clicks at 25%: currentSong.currentTime = 240 * (25 / 100) = 60 seconds. The song jumps to 1:00.
      currentSong.currentTime = currentSong.duration * (percent / 100);
  });



  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"; // isse hoga kya ki hidden sidebar(jo ki hidden tha) wo screen pe visible ho jata hai
  });



  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });


  previous.addEventListener("click", () => {
    handleClick(prevButton)
    if (currentSongIndex > 0) { //If currentSongIndex is 0, it means the first song is already playing, so no previous song exists.
      playMusic(songs[currentSongIndex - 1]);
    } else {
      // console.log("No previous song available.");
    }
  });

  next.addEventListener("click", () => {
    handleClick(nextButton)
    if (currentSongIndex + 1 < songs.length) {
      playMusic(songs[currentSongIndex + 1]);
    } else {
      // console.log("No next song available.");
    }
  });

// class .range k andar  <input> element hoga uspe lgao eventListener
  document.querySelector(".range input").addEventListener("change", (e) => {
    // console.log(e.target.value);
    
    // parseInt(): Converts the string value of the input to an integer.
    currentSong.volume = parseInt(e.target.value) / 100;
  }); 


  // We divide by 100 because the Audio.volume property in JavaScript accepts a value in the range of 0.0 to 1.0.
  //If the user moves the slider to 50, e.target.value is 50.
// parseInt(50) / 100 equals 0.5.
// currentSong.volume is set to 0.5, meaning 50% volume.






  // This block of code is responsible for handling clicks on cards .jb hm naye card pe click kr rhe tb is ke wajah se library k songs change ho rhe 
  // The data-folder="cs" is used to identify which folder's songs should be loaded when this card is clicked. 

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    // console.log(e); // gives line no. 85-98 and line no. 101-114 
    
    e.addEventListener("click", async (item) => {

      // console.log(item.target);
      
      console.log(item.currentTarget.dataset.folder);
      
      await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
}


main();





