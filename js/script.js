
// get divs where the info will be placed
const container = document.querySelector("#container");
const story = document.querySelector(".story");
const info = document.querySelector(".info_area");
// basic info
const number = document.querySelector(".number");
const title = document.querySelector(".story_title");
const poster = document.querySelector(".poster");
const doctor = document.querySelector(".doctor");
const rating = document.querySelector(".rating");
// pt. 2
const info_divs = document.querySelectorAll(".info_divs");
const companions = document.querySelector(".companions");
const production_info = document.querySelector(".production_info");
const season = document.querySelector(".season");
const episodes = document.querySelector(".episodes");
const ep_length = document.querySelector(".runtime_ep");
const runtime = document.querySelector(".runtime_total");
// pt. 3
const status_area = document.querySelector(".status_area");
const missing_status = document.querySelector(".status");
const animated = document.querySelector(".animated");
const summary_area = document.querySelector(".summary_info");
const summary = document.querySelector(".summary");
const first_date = document.querySelector(".first_broadcast");
const last_date = document.querySelector(".last_broadcast");
// const villain = document.querySelector(".villain");

// production information
// director
const director_area = document.querySelector(".director_area");
const director = document.querySelector(".director");
// writer(s)
const writer_area = document.querySelector(".writer_area");
const writer = document.querySelector(".writer");
// script editor
const script_editor_area = document.querySelector(".script_editor_area");
const script_editor = document.querySelector(".script_editor");
// producer
const producer_area = document.querySelector(".producer_area");
const producer = document.querySelector(".producer");
// composer
const composer_area = document.querySelector(".composer_area");
const composer = document.querySelector(".composer");
// cast
const cast_area = document.querySelector(".cast_area");
const cast = document.querySelector(".cast");
// essential
const essential_button = document.querySelector(".button_essential");
const essential_area = document.querySelector(".essential_area");
const essential = document.querySelector(".essential_reason");
// episode info
const ep_area = document.querySelector(".eps_area");
const ep_info = document.querySelector(".ep_info");
const ep_name = document.querySelector(".episode_name");
const ep_number = document.querySelector(".ep_number");
const ep_date = document.querySelector(".ep_date");
const ep_runtime = document.querySelector(".ep_runtime");
const ep_viewers = document.querySelector(".ep_viewers");
const ep_rating = document.querySelector(".ep_rating");

// buttons
const filter_button = document.querySelectorAll(".filters");
const filters_essential = document.querySelector(".filters_essential");
const filters_main = document.querySelector(".filters_main");
const filter_doctors = document.querySelector("[data-filter=doctor]");
const filter_seasons = document.querySelector("[data-filter=season]");
const filters_more = document.querySelector("[data-filter=more_filters]");
const extra_filters = document.querySelector(".extra_categories");
const filter_companions = document.querySelector("[data-filter=companion]");
const filter_producers = document.querySelector("[data-filter=producer]");
const filter_writers = document.querySelector("[data-filter=writer]");
const filter_scripteditors = document.querySelector("[data-filter=script]");

const nav_area = document.querySelector("#nav");
const clicked_buttons = document.querySelector(".clicked_buttons");
const active_buttons = document.querySelector(".active_buttons");
const clear_filters = document.querySelector(".clear_filters");

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
    clearFilters(data);
    showFilters(filters_more, extra_filters);
    populateButtons(data, "Companion", filter_companions);
    // populateButtons(data, "Producer", filter_producers);
    populateButtons(data, "Writer", filter_writers);
    // populateButtons(data, "ScriptEditor", filter_scripteditors);
    // addButtonClickEvents();
})
  .catch(() => {
    console.log("error: JSON not found")
  });

// getJSON()
//   .then(data => clickEssentialButton(data));

function showFilters(filter, extra_area) {
  filter.addEventListener("click", () => {
    // if area is hidden show area on click
    if (extra_area.classList.contains("hide")) {
      extra_area.classList.remove("hide");
      extra_area.classList.add("show");
    }
    else {
      extra_area.classList.add("hide");
      extra_area.classList.remove("show");
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
  // create a new set based off the filter keys
  const key = new Set(
    data.map((item) => item[field])
    .reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
  )

  // console.log(key);
  
  // create extra section which has all the new filters in it
  const extra = document.createElement("section");
  extra.classList.add("extra_filters", "hide");
  extra.setAttribute("category", field);
  nav_area.appendChild(extra);
  // extra.style.display = none;

  // counter
  let i = 0;

  key.forEach((item) => {
    // checks if item exists and there are no empty strings
    if (item) {
      // create the button and add to extra filters area
      const button = document.createElement("button");
      button.classList.add("filters");
      button.setAttribute("category", field);
      button.setAttribute("filter", item);

      button.setAttribute("data-order", i);
      i++;

      button.innerHTML = item;
      extra.appendChild(button);
      
      // get each story which matches the filter button
      clickFilter(button, data, field, item, extra);
    }
  });
  showFilters(filter, extra);
}

let categories = [];
let categoriesActive = new Map();
let filtersClicked = [];

let i = 0;
function clickFilter(filter_button, data, category, item) {
  // add eventlistener when clicked
  filter_button.addEventListener("click", ()=> {
    // if button has already been clicked
    if (filter_button.classList.contains("filter_button")) {
      filter_button.classList.remove("filter_button");
      // remove button from filter bar and add it back to the extra_area
      active_buttons.removeChild(filter_button);
      // extra.appendChild(filter_button);

      // if all buttons have been unclicked and area is empty
      if (!active_buttons.hasChildNodes()) {
        // hide area of clicked buttons
        active_buttons.innerHTML = '';
        clicked_buttons.style.display = "none";
      }

      // reset container
      container.innerHTML = '';
      // reset order of buttons
      resetButtonOrder(filter_button);

      // keep track of category unpressed
      categories = categories.filter(e => e !== item);

      categoriesActive.forEach((value, key) =>
      {
        if (key === category) {
          categoriesActive.set(category, value - 1);
          if (value <= 0) {
            categoriesActive.delete(key);
          }
        }
      });
      // console.log(categoriesActive);

      // keep track of filters pressed
      filtersClicked = filtersClicked.filter(e => e !== item);

      showFilteredStories(data, category, item);
    }
    // if button hasn't been clicked
     else {
      filter_button.classList.add("filter_button");
      container.innerHTML = '';
      clicked_buttons.style.display = "flex";
      clicked_buttons.style.maxHeight = "auto";
      active_buttons.appendChild(filter_button);

      // keep track of categories pressed
      categories.push(category);
      if (categoriesActive.has(category)) {
        categoriesActive.set(category, i++);
      }
      else if (!categoriesActive.has(category)) {
        i = 0;
        categoriesActive.set(category, i++);
      }
      console.log(categoriesActive);
      // keep track of filters pressed
      filtersClicked.push(item);

      // show results from buttons
      showFilteredStories(data, category, item);
     }
  });
}

function clearFilters(data) {
  clear_filters.addEventListener("click", ()=> {
    let active_buttons = document.querySelector(".active_buttons");
    active_buttons = Array.from(active_buttons.children);

    for (let button of active_buttons) {
      resetButtonOrder(button);
    }

    // hide area of clicked buttons
    active_buttons.innerHTML = '';
    clicked_buttons.style.display = "none";
    // remove "active" class from active buttons
    const filter_button = document.querySelectorAll(".filter_button");
    for (let button of filter_button) {
      if (button.classList.contains("filter_button")) {
        button.classList.remove("filter_button");
      }
    }
    // remove extra sections of buttons
    const extra_filters = document.querySelectorAll(".extra_filters");
    for (let area of extra_filters) {
      if (area.classList.contains("show")) {
        area.classList.remove("show");
        area.classList.add("hide");
      }
    }
    // clear filters and categories clicked
    categories = [];
    categoriesActive.clear();
    filtersClicked = [];
    // post default page
    container.innerHTML = '';
    postData(data);
  })
}

function resetButtonOrder(button) {
    // get category of button clicked
    let cat = button.getAttribute("category");
    // grab buttons in extra_filters
    const extra_buttons = document.querySelector(".extra_filters[category=" + cat + "]")
    // add button back into area
    extra_buttons.appendChild(button);    
    let buttons = Array.from(extra_buttons.children);
    // do a comparative sort
    let sorted = buttons.sort(function(a, b) {
      return +a.dataset.order - +b.dataset.order
    });
    // clear area and re-add buttons in order
    extra_buttons.innerHTML = '';
    sorted.forEach(button => extra_buttons.append(button));
}

function showFilteredStories(data, currentCategory, item) {
  // console.log(categories);
  console.log(filtersClicked);
  // find previous category
  let penultimateCategory = categories.at(-1);

  
  if (categories.length === 0 || filtersClicked.length === 0) {
    postData(data);
  }

  let category = Array.from(categoriesActive.keys());
  // console.log(cat);

  console.log(category);
  // cat.shift();


  let filteredStories = [];
  // filter stories
  const stories = data.filter(data => {
    // grab the latest category from activeCategories
    let currentCategory = category.at(-1);
    let filters = data[currentCategory];

    //reverse the categories array 
    let reverseCategories = category.reverse();
    // let previous_filter;
    // // go through categories in reverse
    // for (let category of reverseCategories) {
    //   previous_filter = data[category];
    // }
    let previousCategory = reverseCategories.at(-1);
    let previous_filter = data[previousCategory];

    // make sure filter exists and isn't empty
    if (currentCategory in data && typeof filters !== 'undefined') { 
      // create array if object is single item
      if (!Array.isArray(filters)) {
        filters = new Array(filters);
      }

      // goes through the matching categories and matches with the clicked filters
      filters.forEach(filter => {
        // console.log(filter);
        filtersClicked.some(clickedFilter => {     
        if (filter === clickedFilter) {
          // checks if there's more than one category and matches it to previous categories
          if (reverseCategories.length > 1) {
            // create array if object is single item
            if (!Array.isArray(previous_filter)) {
              previous_filter = new Array(previous_filter);
            }
            // check if filter based on previous category is applied
            previous_filter.forEach(prev_filter => {
              console.log(prev_filter);
              filtersClicked.some(filter => {
                console.log(filter);
              if (prev_filter === filter) {
                console.log(true);
                filteredStories.push(data);
                // console.log(data);
                }
              });
            });
          }
          // checks if category is the same as the first one
          else {
            // push data
            filteredStories.push(data);
          }
        }
      });
    });
    }
  });
  
  console.log(stories);

  filteredStories = [... new Set(filteredStories.concat(stories))];
  console.log(filteredStories);
  postData(filteredStories);
}

function clickEssentialButton(data) {
  // get filter
  let filter = data.filter(data => data.Essential == true);
  // console.log(filter);

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

let eps_name;

// function which loops through and displays json data
function postData(data) {
  const result = new Array();
  // loop through ach item
  for (let value in data) {
      // addButtonClickEvents();
      // define result
      let results = data[value];
      // result.push(results);

      // key names
      let story_poster = results.Poster;
      let story_number = results.Number;
      let story_title = results.Title;
      let story_doctor = results.Doctor;
      let story_rating = results.IMDBRating;
      // 
      let story_companion = results.Companion;
      let story_season = results.Season;
      let story_eps = results.Episodes;
      let eps_missing = results.MissingEpisodes;
      let story_animated = results.Animated;
      let story_summary = results.Summary;
      let story_essential = results.Essential;
      let story_firstbroadcast = results.FirstBroadcast;
      let story_lastbroadcast = results.LastBroadcast;
      let story_runtime = results.TotalRuntime;
      // 
      let story_director = results.Director;
      let story_writer = results.Writer;
      let story_script_editor = results.ScriptEditor;
      let story_producer = results.Producer;
      let story_composer = results.Music;
      let story_cast = results.Actors;
      let story_episodes = results.EpisodeInfo;
      // 
      let essential_reason = results.WhyEssential;
      
      /** 
       * add info to divs and display them 
       * */ 

      // set result to story number div
      number.textContent = story_number;
      // set result to title div
      title.textContent = story_title;

      // add essential class if essential story
      if (story_essential === true) {
        info.classList.add("essential");
        essential_button.style.display = "block";

        // check if anything is written for essential reason
        if (essential_reason.length) {
          // set result to essential div
          const essential_paras = loopThroughArray(essential_reason);
          essential.innerHTML = essential_paras;
        } 
        else {
          // if nothing, remove the whole div
          essential.innerHTML = '';
          // essential_area.remove();
        }

      } else {
        info.classList.remove("essential");
        essential_button.style.display = "none";
      }

      // display Doctor
      if ('Doctor' in results) {
        //loop through array for doctor
        const doctor_item = loopThroughArray(story_doctor);
        // set result to doctor div
        doctor.innerHTML = doctor_item;
      }

      poster.src = story_poster;
      // set result to season div
      season.textContent = story_season;
      // set result to episodes div
      episodes.textContent = story_eps;
      // set result to runtime div
      ep_length.textContent = "25m/ep";
      runtime.textContent = story_runtime;
      // display rating
      rating.innerHTML = story_rating;

      // display companions
      if ('Companion' in results) {
        // loop through array for companions
        const companion_item = loopThroughArray(story_companion);
        // set result to companions div
        companions.innerHTML = companion_item;
      }
      else {
        companions.innerHTML = '';
      }

      // set result to summary div
      const summary_paras = loopThroughArray(story_summary);
      // set summary to visible
      summary.innerHTML = summary_paras;
  
      // if there are missing episodes, set result to missing eps div
      if ('MissingEpisodes' in results) {
        // display status div
        status_area.style.display = "block"; 
        // displays number of episodes if there are any missing
        let missing_eps = parseInt(story_eps, 10) - parseInt(eps_missing, 10); // subtract missing eps from total eps

        // set status of story
        // if ALL EPISODES are missing
        if (eps_missing == story_eps) {
          missing_status.innerHTML = "Completely Missing";
          missing_status.style.color = "#FF7171";
          // set episodes to missing eps/total eps
          episodes.innerHTML = missing_eps + "/" + story_eps;
        }
        // if NO EPISODES are missing
        else if (eps_missing == 0) {
          missing_status.innerHTML = "Complete";
          missing_status.style.color = "#fff";
        } 
        // if SOME EPISODES are missing
        else {
          missing_status.innerHTML = "Partially Missing";
          missing_status.style.color = "#FFE76A";
          // set episodes to missing eps/total eps
          episodes.innerHTML = missing_eps + "/" + story_eps;
        }
      }
      // otherwise hide 
      else {
        status_area.style.display = "none";
      }

      // if episodes are ANIMATED
      if ('Animated' in results) {
        // display animated status
        animated.style.display = "block";
        animated.textContent = story_animated;
      }
      else {
        // hide animated status
        animated.style.display = "none";
      }

      // format dates
      const first_dateaired = ISODateFormatter(story_firstbroadcast);
      // set result to first broadcast div
      first_date.innerHTML = first_dateaired;
      // check whether last broadcast exists
      if ('LastBroadcast' in results) {
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
      displayCastCrew(results, "ScriptEditor", story_script_editor, script_editor, script_editor_area);

      // set producer to div
      displayCastCrew(results, "Producer", story_producer, producer, producer_area);

      // set cast to div
      displayCastCrew(results, "Actors", story_cast, cast, cast_area);

      //set music to dix
      displayCastCrew(results, "Music", story_composer, composer, composer_area);

      // get episode information
      let ep_names = loopThroughEpisodes(story_episodes);
      ep_area.innerHTML = ep_names;
      
      // duplicate elements
      cloneStoryContainer();
    }
    // return result;
}

function loopThroughEpisodes(story_episodes) {
  let div = '';
  story_episodes.forEach((info) => {
    ep_name.textContent = info.EpisodeName;
    ep_number.textContent = info.EpisodeSeason;
    const date = new Date(info.EpisodeDate).toLocaleDateString({ year: 'numeric', month: '2-digit', day: '2-digit' });
    ep_date.textContent = date;
    ep_runtime.textContent = info.EpisodeRuntime;
    ep_viewers.textContent = info.EpisodeViewers;
    ep_rating.textContent = info.EpisodeRating;
    let epn = ep_info.cloneNode(true);
    div += epn.outerHTML;
  });
  return div;
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
  if (array.length) {
    // initialize item
    let item = '' 
    for (let i of array) {
      // wraps item in <span> tags
        item += "<span>" + i + "</span>";
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

  // find buttons in story Node
  let btns = createStory.children.item(1).children.item(1).children.item(4).children;
  // HTML collection of info areas
  let info = createStory.children.item(1).children.item(1).children;
  let essential_info = createStory.children.item(2);

  // loop through all buttons and make sure they work
  for (const button of btns) {
    let button_name = button.classList[1].replace("button_", "");
    // if button is essential
    if (button_name.search("essential") !== -1) {
      addEssentialClick(button, essential_info);
    }
    // if button is anything else
    else {
      // console.log(button);
      addClick(button, info, btns);
    }
  }
}

function addClick(button, info, btns) {
  let button_name = button.classList[1].replace("button_", "");

  button.addEventListener("click", () => {
    // if button is ACTIVE and CLICKED
    if (button.classList.contains("active_button")) {

      // go through areas
      for (let area of info) {
        let area_name = area.classList[0].replace("_info", "");
        // if button and area are MATCHING
        if (area_name.search(button_name) !== -1) {
          // HIDE matching info to button
          area.classList.remove("show");
          }
          // if button and area are DIFFERENT
          else {
            // SHOW default info
            if (area_name.match("basic")) {
              area.classList.remove("hide");
            }
            // HIDE other button's info
            area.classList.remove("show");
          }
      }

      // go through buttons
      for (let btn of btns) {
        let buttons = btn.classList[1].replace("button_", "");
        // if button name MATCHES
        if (buttons.search(button_name) !== -1) {
          // remove "active button" css from all buttons
          button.classList.remove("active_button");
        }
        else {
          // remove "active button" css from all buttons
          btn.classList.remove("active_button");
        }
      }
    }

    // if button is INACTIVE and THEN CLICKED
    else {
      // go through areas
      for (let area of info) {
        let area_name = area.classList[0].replace("_info", "");
        // if button and area are MATCHING
        if (area_name.search(button_name) !== -1) {
          // SHOW matching info
          area.classList.add("show");
          }
          // if button and area are DIFFERENT
          else {
            // HIDE default information
            if (area_name.match("basic")) {
              area.classList.add("hide");
            }
            // HIDE other button's info
            area.classList.remove("show");
            // console.log(info[i]);
          }
      }

      // go through buttons
      for (let btn of btns) {
        let buttons = btn.classList[1].replace("button_", "");
        // if button name MATCHES
        if (buttons.search(button_name) !== -1) {
          // add "active button" css to MATCHING button
          button.classList.add("active_button");
        }
        else {
          // remove "active button" css from other buttons
          btn.classList.remove("active_button");
        }
      }
    }
  });
}

function addEssentialClick(button, info) {
  button.addEventListener("click", () => {
    // if button is ACTIVE
    if (button.classList.contains("active_button")) {
      // remove "active button" class
      button.classList.remove("active_button");
      // HIDE essential area
      info.classList.remove("show");
      info.style.maxHeight = 0;
    }
    // if button in INACTIVE
    else {
      // add "active button" class
      button.classList.add("active_button");
      // SHOW essential area
      // get height of area
      let height = info.scrollHeight;
      // set height of area
      info.style.maxHeight = height + "px";
      info.classList.add("show");
    }
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