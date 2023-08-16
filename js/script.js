
// get divs where the info will be placed
const container = document.querySelector("#container");
const story = document.querySelector(".story");
const info = document.querySelector(".info_area");

const number = document.querySelector(".number");
const title = document.querySelector(".story_title");
const poster = document.querySelector(".poster");
const doctor = document.querySelector(".doctor");

const info_divs = document.querySelectorAll(".info_divs");
const companions = document.querySelector(".companions");
const production_info = document.querySelector(".production_info");
const season = document.querySelector(".season");
const episodes = document.querySelector(".episodes");

const status_area = document.querySelector(".status_area");
const missing_status = document.querySelector(".status");
const animated = document.querySelector(".animated");
const summary_area = document.querySelector(".summary_area");
const summary = document.querySelector(".summary");

const first_date = document.querySelector(".first_broadcast");
const last_date = document.querySelector(".last_broadcast");
const villain = document.querySelector(".villain");

const director_area = document.querySelector(".director_area");
const director = document.querySelector(".director");

const writer_area = document.querySelector(".writer_area");
const writer = document.querySelector(".writer");

const script_editor_area = document.querySelector(".script_editor_area");
const script_editor = document.querySelector(".script_editor");

const producer_area = document.querySelector(".producer_area");
const producer = document.querySelector(".producer");

const cast_area = document.querySelector(".cast_area");
const cast = document.querySelector(".cast");

const essential_button = document.querySelector(".button_essential");
const essential_area = document.querySelector(".essential_area");
const essential = document.querySelector(".essential_reason");

const filter_button = document.querySelectorAll(".filters");
const filters_essential = document.querySelector(".filters_essential");
const filters_main = document.querySelector(".filters_main");
const filter_doctors = document.querySelector("[data-filter=doctor]");
const filter_seasons = document.querySelector("[data-filter=season]");
const extra_filters = document.querySelector(".extra_filters");
const nav_area = document.querySelector("#nav");

allowTransitions();

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
    clickEssentialButton(data);
    populateButtons(data, "Doctor", filter_doctors);
    populateButtons(data, "Season", filter_seasons);
    addButtonClickEvents();
})
  .catch(() => {
    console.log("error: JSON not found")
  });

function showExtraFilters(filter, extra_area) {
  filter.addEventListener("click", () => {
    // if area is hidden show area on click
    if (extra_area.classList.contains("hide")) {
      extra_area.classList.remove("hide");
      extra_area.classList.add("show");
      // let height = extra_area.scrollHeight;
      // console.log(height);
      // extra_area.style.maxHeight = height + "px";
    }
    else {
      extra_area.classList.add("hide");
      extra_area.classList.remove("show");
      // extra_area.style.maxHeight = 0;
    }
    // add active class to pressed button
    if (!filter.classList.contains("filter_button")) {
      filter.classList.remove("filter_button");
    }
    else {
      filter.classList.add("filter_button");
    }
  });
}

function populateButtons(data, field, filter) {
  const key = new Set(
    data.map((item) => item[field])
    .reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
  );
  // console.log(key);
  
  const extra = document.createElement("section");
  extra.classList.add("extra_filters", "hide");
  nav_area.appendChild(extra);

  key.forEach((item) => {
    // create the button and add to extra filters area
    const button = document.createElement("button");
    button.classList.add("filters");
    button.innerHTML = item;
    extra.appendChild(button);
    // get each story which matches the filter button
    const stories = data.filter(data => { 
      if (data[field].includes(item)) {
        return data;
      }
   });

    clickFilter(button, data, stories, field, item);
  });

  showExtraFilters(filter, extra);
}

function clickFilter(filter_button, data, stories, category, item) {
  filter_button.addEventListener("click", ()=> {
    if (filter_button.classList.contains("filter_button")) {
      filter_button.classList.remove("filter_button");
      container.innerHTML = '';
      postData(data);
    }
     else {
      filter_button.classList.add("filter_button");
      container.innerHTML = '';

      console.log(stories);
      stories.forEach(story => {
        if (story[category] === item) {
          console.log(story);
        }
      });

      // show results from buttons
      showFilteredStories(data, stories, category, item);
     }
  });
}

let filteredStories = [];
let categories = [];
let filteredResults = [];
let filters = [];
let stories = [];

function showFilteredStories(data, stories, currentCategory, item) {
  // keep track of categories pressed
  if (categories.at(-1) !== currentCategory) {
    categories.push(currentCategory);
  }
  // keep track of filters pressed
  filters.push(item);
  console.log(categories);
  console.log(filters);
  
  let categoriesOrder = [...new Set(categories.concat(currentCategory))];

  // let lastCategory = categoriesOrder.at(-1);
  let penultimateCategory = categories.at(-2);

  filteredStories = [... new Set(filteredStories.concat(stories))];
  // console.log(filteredStories);

  filters.some(filter => {
    // console.log(filter);
      filteredStories.filter(data => {
        if (data[currentCategory].includes(filter)) {
          let lastFilter = data[penultimateCategory][0];
          // console.log(data[penultimateCategory]);
          // console.log(data);
          
          if (!filters.includes(lastFilter)) {
            // console.log(lastFilter); 
          }
          else {
            // console.log(lastFilter);
            console.log(data);
          }
        }
      });
  });

  /**  */
//   let pressedFilters = {};

//   pressedFilters[currentCategory] = item;
//   filteredStories.push(pressedFilters);
   
//  filteredStories.forEach(object => {
//     // console.log(object);
//     let keys = Object.keys(object);
//     let values = Object.values(object);
//     // console.log(keys);
//     // console.log(values);

//     filteredResults = data.filter(storyItem => {
//       return keys.every(category => {
//       let storyValue = storyItem[category][0];
//         if (storyItem[category].includes(object[category])) {
//         let item = new Map(Object.entries(storyItem));

//         console.log(storyItem);
//      }
//     })
//   });
//   });
  


  // let newData = [];
  // // console.log(filteredStories);
  // filteredStories.filter(data => {
  //   //  console.log(data);
  //     pressedFilters.forEach(filter => {
  //       if (data[currentCategory].includes(filter)) {
  //         console.log(data);
  //       }
  //   });
  // });

  // filteredResults = [...new Set(filteredResults)];
  // console.log(filteredResults);


  // // add together results only if first and last categories match
  // if (categories.length < 2 || firstCategory === currentCategory && penultimateCategory === currentCategory) {
  //   filteredStories = [... new Set(filteredStories.concat(stories))];
  //   // post results
  //   postData(filteredStories);
  //   console.log(filteredStories);
  // }
  // else if (penultimateCategory !== currentCategory && firstCategory === currentCategory) {
  //   // add new results to old filtered results
  //   // filteredResults = [... new Set(filteredResults.concat(stories))];
  //   // console.log(filteredResults);
  //   console.log(pressedFilters);

  //   pressedFilters.some(value => {
  //     // console.log(value);
  //     stories.filter(data => {
  //       if (data[penultimateCategory].includes(value)) {
  //         filteredResults.push(data);
  //       }
  //     });
  //   });
  //   postData(filteredResults);
  //   console.log(filteredResults);
  // }
  // // if not, filter from combined results
  //  else {
  //   console.log(true);
  //   console.log(stories);

  //   pressedFilters.some(value => {
  //     filteredStories.filter(data => {
  //       // get values of each object
  //       let storyValues = Object.values(data);
  //       // if value includes selected filters
  //       if (storyValues.includes(value) && data[currentCategory].includes(item)) {
  //         filteredResults.push(data);
  //       }

  //     });
  //     // console.log(value);
  //   });
  //   console.log(filteredResults);
  //   // post filtered results
  //   postData(filteredResults);
  //  }
}

function clickEssentialButton(data) {
  // get filter
  let filter = data.filter(data => data.Essential == true);

  filter_button.forEach((button, index) => {
    button.addEventListener("click", () => {
        if (button.classList.contains("filter_button")) {
          // remove active button
          button.classList.remove("filter_button");
          // clear default
          container.innerHTML = '';
          // show results
          postData(data);
        }
        else {
          button.classList.add("filter_button");
          // clear default
          container.innerHTML = '';
          // show results
          postData(filter);
        }
      });
  });
}

// function which loops through and displays json data
function postData(data) {
  const result = new Array();

  // loop through each item
  for (let value in data) {
      // define result
      let results = data[value];
      result.push(results);
      // key names
      let story_poster = results.Poster;
      let story_number = results.Number;
      let story_title = results.Title;
      let story_doctor = results.Doctor;
      // 
      let story_companion = results.Companion;
      let story_season = results.Season;
      let story_eps = results.Episodes;
      let eps_missing = results.Missing_Episodes;
      let story_summary = results.Summary;
      let story_essential = results.Essential;
      let story_firstbroadcast = results.First_Broadcast;
      let story_lastbroadcast = results.Last_Broadcast;
      // 
      let story_director = results.Director;
      let story_writer = results.Writer;
      let story_script_editor = results.Script_Editor;
      let story_producer = results.Producer;
      let story_cast = results.Actors;
      // 
      let essential_reason = results.Why_Essential;
      
      /** 
       * add info to divs and display them 
       * */ 

      // set result to story number div
      number.innerHTML = story_number;
      // set result to title div
      title.innerHTML = story_title;

      // add essential class if essential story
      if (story_essential === true) {
        info.classList.add("essential");
        essential_button.style.display = "block";

      } else {
        info.classList.remove("essential");
        essential_button.style.display = "none";
      }

      // check if anything is written for essential reason
      if (essential_reason.length !== 0) {
        // set result to essential div
        const essential_paras = loopThroughArray(essential_reason);
        essential.innerHTML = essential_paras;
      } else {
        // if nothing, remove the whole div
        essential_area.remove();
      }

      //loop through array for doctor
      const doctor_item = loopThroughArray(story_doctor);
      // set result to doctor div
      doctor.innerHTML = doctor_item;

      poster.src = story_poster;
      // set result to season div
      season.innerHTML = story_season;
      // set result to episodes div
      episodes.innerHTML = story_eps;

      // loop through array for companions
      const companion_item = loopThroughArray(story_companion);
      // set result to companions div
      companions.innerHTML = companion_item;

      // set result to summary div
      const summary_paras = loopThroughArray(story_summary);
      // set summary to visible
      summary.innerHTML = summary_paras;
  
      // if there are missing episodes, set result to missing eps div
      if (results.hasOwnProperty("Missing_Episodes")) {
        status_area.style.display = "block"; // display status div
        // displays number of episodes if there are any missing
        let missing_eps = parseInt(story_eps, 10) - parseInt(eps_missing, 10); // subtract missing eps from total eps
        // set episodes to missing eps/total eps
        episodes.innerHTML = missing_eps + "/" + story_eps;

        // set status of story
        if (eps_missing == story_eps) {
          missing_status.innerHTML = "Completely Missing"; // if all eps are missing
        } 
        else {
          missing_status.innerHTML = "Partially Missing"; // if only some eps are missing
        }
      }
      // otherwise hide 
      else {
        status_area.style.display = "none";
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

      // set director to div
      displayCastCrew(results, "Director", story_director, director, director_area);

      // set writer to div
      displayCastCrew(results, "Writer", story_writer, writer, writer_area);

      // set script editor to div
      displayCastCrew(results, "Script_Editor", story_script_editor, script_editor, script_editor_area);

      // set producer to div
      displayCastCrew(results, "Producer", story_producer, producer, producer_area);

      // set cast to div
      displayCastCrew(results, "Actors", story_cast, cast, cast_area);
      
      // duplicate elements
      cloneStoryContainer();
    }
    return result;
}

function displayCastCrew(results, category, story, div, currentArea) {
  // display the result in correct div
  if (results.hasOwnProperty(category)) {
    const name = loopThroughArray(story);
    div.innerHTML = name;
    currentArea.style.display = "block";
  }
  else {
    currentArea.style.display = "none"; // hide div
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

/**
* 
*/
function cloneStoryContainer() {
  // duplicate elements
  let createStory = story.cloneNode(true);
  container.append(createStory);
  // replace first story
  story.replaceWith(createStory);
}

function getButtons(button_class) {
  const button = document.querySelectorAll(button_class);
  return button
}

function getInfoSummaryEssentialDivs() {
  const castcrew_info = document.querySelectorAll(".castcrew_info");
  const summary_area = document.querySelectorAll(".summary_area");
  const essential_area = document.querySelectorAll(".essential_area");

  return [castcrew_info, summary_area, essential_area]
}

function addButtonClickEvents() {
  // get all buttons
  const essential_button = getButtons(".button_essential");
  const castcrew_button = getButtons(".button_castcrew");
  const summary_button = getButtons(".button_summary");
  // get all areas that need to be switched out
  const [castcrew_info, summary_area, essential_area] = getInfoSummaryEssentialDivs();

  // show summary
  showAdditionalInfo(summary_button, castcrew_info, summary_area, castcrew_button);
  // show cast & crew
  showAdditionalInfo(castcrew_button, summary_area, castcrew_info, summary_button);
  // show essential
  showEssential(essential_button, essential_area);
}

function showAdditionalInfo(story_button, otherArea, currentArea, other_button) {
    // get basic info
    const basic_info = document.querySelectorAll(".basic_info");
    
    // go through and replace basic info with summary/castcrew or show why the story is essential
      story_button.forEach((button, index) => {
        button.addEventListener("click", () => {     
        // checks whether button has the "active" classlist
        if (button.classList.contains("active_button")) {
          // show basic info
          basic_info[index].classList.remove("hide");
          // hide current area
          currentArea[index].classList.remove("show");
          // remove active button on both buttons
          button.classList.remove("active_button");
          other_button[index].classList.remove("active_button");
        }
        // if it's not currently active
        else {
          // add active button
          button.classList.add("active_button");
          // hide basic info
          basic_info[index].classList.add("hide");
          // show current area
          currentArea[index].classList.add("show");
          // hide other area
          otherArea[index].classList.remove("show");
          // remove active from other button
          other_button[index].classList.remove("active_button");
        }
    });
  });
}

function showEssential(essential_button, essential_area) {
  essential_button.forEach((button, index) => {
    button.addEventListener("click", function() {
      // check whether button has "active" classlist
      if (button.classList.contains("active_button")) {
        button.classList.remove("active_button");
        // remove essential element
        essential_area[index].classList.remove("show");
        essential_area[index].style.maxHeight = 0;
      } 
      else {
        button.classList.add("active_button");
        // show essential element
        let height = essential_area[index].scrollHeight;
        essential_area[index].style.maxHeight = height + "px";
        essential_area[index].classList.add("show");
      }
    });
  });
}

/**
 * function which allows transitions AFTER page loads
 */
function allowTransitions() {
  document.onreadystatechange = () => {
    if (document.readyState === "complete") {
      console.log("page ready");
      document.querySelector(".preload").classList.remove("preload");
    }
  }
}