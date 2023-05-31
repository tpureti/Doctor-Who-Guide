
// get divs where the info will be placed
const container = document.querySelector("#container");
const story = document.querySelector(".story");

const essential = document.querySelector(".essential");
const number = document.querySelector(".number");
const title = document.querySelector(".title");
const poster = document.querySelector(".poster");

const doctor = document.querySelector(".doctor");
const companions = document.querySelector(".companions");

const season = document.querySelector(".season");
const episodes = document.querySelector(".episodes");
const missing = document.querySelector(".missing_eps");
const summary = document.querySelector(".summary");

const first_date = document.querySelector(".first_broadcast");
const last_date = document.querySelector(".last_broadcast");
const villain = document.querySelector(".villain");

// fetch json data
async function getJSON() {
  const response = await fetch("json/stories.json");
  let data = response.json();
  
  return data;
}

// resolve json data
getJSON()
  .then(data => {
    postData(data);
})
  .catch(() => {
    console.log("error: JSON not found")
  });

// function which loops through and displays json data
function postData(data) {

  // loop through each item
  for (let value in data) {
      // define results
      const results = data[value]
      console.log(results);
      // div.innerHTML = results[key];

      // key names
      let story_poster = results.Poster;
      let story_number = results.Number;
      let story_title = results.Title;
      let story_doctor = results.Doctor;
      let story_companion = results.Companion;
      let story_season = results.Season;
      let story_eps = results.Episodes;
      let eps_missing = results.Missing_Episodes;
      let story_summary = results.Summary;
      let story_essential = results.Essential;
      let story_firstbroadcast = results.First_Broadcast;
      let story_lastbroadcast = results.Last_Broadcast;
      
      /** 
       * add info to divs and display them 
       * */ 

      // set result to story number div
      number.innerHTML = story_number;
      // set result to title div
      title.innerHTML = story_title;
      // set result to essential div
      essential.innerHTML = story_essential;

      //loop through array for doctor
      const doctor_item = loopThroughArray(story_doctor);
      // set result to doctor div
      doctor.innerHTML = doctor_item;

      poster.src = story_poster
      // set result to season div
      season.innerHTML = story_season;
      // set result to episodes div
      episodes.innerHTML = story_eps;

      // loop through array for companions
      const companion_item = loopThroughArray(story_companion);
      // set result to companions div
      companions.innerHTML = companion_item;
      // set result to summary div
      summary.innerHTML = story_summary;
  
      // if there are missing episodes, set result to missing eps div
      if (results.hasOwnProperty("Missing_Episodes")) {
        missing.innerHTML = eps_missing;
      } 
      else {
        missing.innerHTML = "";
      }

      // format dates
      const first_dateaired = ISODateFormatter(story_firstbroadcast);
      // set result to first broadcast div
      first_date.innerHTML = first_dateaired;
      // check whether last broadcast exists
      if (results.hasOwnProperty("Last_Broadcast")) {
        const last_dateaired = ISODateFormatter(story_lastbroadcast);
        // set result to last broadcast div
        last_date.innerHTML = last_dateaired;
      } 
      else {
        // if not set div to empty
        last_date.innerHTML = "";
      }

      // duplicate elements
      let createStory = story.cloneNode(true)
      container.appendChild(createStory)
  }
}

/** 
 * function that loops through any arrays
 * places spans around item
 * @param {array} array - array from json file
 * @return {string} - returns string that concats all elements
 */
function loopThroughArray(array) {
  if (array.length > 0) {
    // initialize item
    let item = '' 
    for (let i in array) {
      // wraps item in <span> tags
        item += "<span>" + array[i] + "</span>";
    }
    return item;
  }
}

/**
 * formats dates
 * @param {*} isodate - date in ISO format
 * @return {Date} - returns date formatted properly
 */
function ISODateFormatter(isodate) {
  return new Date(isodate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}