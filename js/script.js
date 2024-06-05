
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
const filters_more = document.querySelector("[data-filter=more_filters]");
const extra_filters = document.querySelector(".extra_categories");

const nav_area = document.querySelector("#nav");
const clicked_filters = document.querySelector(".clicked_filters");
const active_filters = document.querySelector(".active_filters");
const clear_filters = document.querySelector(".clear_filters");

const num_of_results = document.querySelector(".number_of_results");

// map that tracks which buttons are clicked
let filtersAndCategories = new Map();
let filters = [];

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
    populateAllButtonsOld(data);
    populateAllButtons(data);
})
  .catch(() => {
    console.log("error: JSON not found")
  });

function populateAllButtons(data) {
  const multi_filters = document.querySelectorAll(".multi_filter");

  multi_filters.forEach(button => {
    let category = button.dataset.category;
    createFilters(data, category, button);
  });
}

let data_map = new Map();
function createFilters(data, category, button) {
  let filtered = data.filter(data => {
    if (category in data) {
      let filter = data[category];
      return data;
    }
  });

  // turn each filter into a key
  const keys = new Set(
    filtered.map(data => data[category])
    .reduce((accumulator, currentValue) =>
    accumulator.concat(currentValue), [])
  );


  // create extra section which has all the new filters in it
  const show_filters = document.createElement("div");
  show_filters.classList.add("show_filters");
  show_filters.setAttribute("data-category", category);
  // accessibility
  show_filters.setAttribute("aria-expanded", false)
  // place it after each button
  button.after(show_filters);

  // counter
  let i = 0;
  // put buttons in an array
  const filter_buttons = [];

  keys.forEach((filter) =>
    {
      // checks if item exists and there are no empty strings
      if (filter) {
        // create button
        const button = document.createElement("button");
        button.classList.add("filter");
        // 
        button.setAttribute("data-category", category)
        button.setAttribute("data-filter", filter);
        // set them in order
        button.setAttribute("data-order", i);
        i++;
        // accessibility
        button.setAttribute("aria-pressed", false);
        // set filter to button text
        button.textContent = filter;
        // add button to array
        filter_buttons.push(button);
        // add functionality to each button
        clickFilter(button, data);
      }
    });

    // set functionality for multi-filter buttons
    showMultiFilterButtons(button, filter_buttons, show_filters);
}

function showMultiFilterButtons(button, filter_buttons, show_filters) {
  // create "show more" button
  let show_more = document.createElement("button");
  show_more.classList.add("show_more");

  // show filters when clicking button
  button.addEventListener("click", (event) => {
    // toggle main filter button to active or inactive
    button.classList.toggle("active");
    // toggle show_filters div to active or inactive
    show_filters.classList.toggle("active");

    // if "show filters" is ACTIVE 
    if (!show_filters.classList.contains("active")) {
      // accessibility
      show_filters.ariaExpanded = false;
      button.ariaPressed = false;
      // close div
      show_filters.style.maxHeight = 0;
    }
    // if "show filters" is INACTIVE
    else {
      // accessibility
      show_filters.ariaExpanded = true;
      button.ariaPressed = true;
      // 
      let default_height;
      let max_height;
      // clear filter area
      show_filters.replaceChildren();
      // decide on maximum amount of filters shown
      let max_initial_filters = 8;

      // get initial/default filters
      let initial_filters = filter_buttons.slice(0, max_initial_filters);
      // get hidden filters
      let hidden_filters = filter_buttons.slice(max_initial_filters);

      // display initial filters
      if (filter_buttons.length < max_initial_filters) {
        initial_filters.forEach(button => {
          show_filters.appendChild(button);
        });
      }
      // if "show more" button is ACTIVE
      else if (show_filters.classList.contains("show_all")) {
        // display all filters
        filter_buttons.forEach(button => {
          show_filters.appendChild(button);
        });
      }
      // if category has more than 7 entries, allow user to toggle a "show more" button
      if (filter_buttons.length > max_initial_filters && !show_filters.classList.contains("show_all")) {
        initial_filters.forEach(button => {
          show_filters.appendChild(button);
        });
        // set "show more" button text
        show_more.textContent = "Show More";
        // add show_more button to end of initial filters
        show_filters.appendChild(show_more);

        // add click event which shows the rest of the filters
        show_more.addEventListener("click", () => {
          // toggle active class on "show more"
          show_more.classList.toggle("active");

          // if all hidden filters are shown
          if (show_more.classList.contains("active")) {
            // go through all hidden buttons and add them
            hidden_filters.forEach(button => {
              // add buttons before "show more"
              show_more.before(button);
            });
            // add class to indicate "show all" is active
            show_filters.classList.add("show_all");
            // change "show more" to "show less"
            show_more.textContent = "Show Less";
            // transition to appropriate scrollheight
            max_height = show_filters.scrollHeight;
            show_filters.style.maxHeight = max_height + "px";
            // get last button of hidden filters
            let last_button = hidden_filters.slice(-1);
            last_button = last_button[0];
            // add "show less" button after transition ends
            show_filters.addEventListener("transitionend", (event) => {
              // make sure it only applies to max-height transition on show_filters
              if (event.propertyName === "max-height") {
                last_button.after(show_more);
              }
            });
          }
          // if hidden filters are hidden
          else {
            // remove class to indicate "show all" is inactive
            show_filters.classList.remove("show_all");
            // adjust height back to default height
            show_filters.style.maxHeight = default_height + "px";
            // change text back to "show more"
            show_more.textContent = "Show More";
            // get last button of initial filters
            let last_button = initial_filters.slice(-1);
            last_button = last_button[0];
            // add "show more" button after transition ends
            show_filters.addEventListener("transitionend", (event) => 
              {
              // make sure it only applies to max-height transition on show-filters
              if (event.propertyName === "max-height") {
                // console.log(event);
                last_button.after(show_more);
              }
              });
          }
        });
      }
      else if (filter_buttons.length < max_initial_filters) {
      }
      // show height smoothly
      let scroll_height = show_filters.scrollHeight;
      show_filters.style.maxHeight = scroll_height + "px";
      // get default height
      default_height = scroll_height;

      if (show_filters.classList.contains("show_all")) {
        let height = show_filters.scrollHeight;
        height = height + 25;
        show_filters.style.maxHeight = height + "px";
      } 
    }
  });
}

function populateAllButtonsOld(data) {
    // get all buttons with multiple filters
    const filters_main = document.querySelectorAll(".filters_main");
    // go through array of filter buttons
    filters_main.forEach(button => 
      {
        // get category of button
        let category = button.dataset.filter;
        // populate button with filters
        populateButtonsOld(data, category, button);
      });

      // get buttons that are booleans
      const filters_misc = document.querySelectorAll(".filters_misc");
      // go through array of filter buttons
      filters_misc.forEach(button => {
        // get category of button
        let category = button.dataset.filter;
        // add click event for each button
        button.addEventListener("click", () => {
          // toggle filter_button class
          button.classList.toggle("filter_button");
          // if button is INACTIVE
          if (!button.classList.contains("filter_button")) {
            // remove button from filter bar and add it back to the extra_area
             active_filters.removeChild(button);

            // if all buttons have been unclicked and area is empty
            if (!active_filters.hasChildNodes()) {
              // hide area of clicked buttons
              active_filters.innerHTML = '';
              clicked_buttons.style.display = "none";
            }
            // delete category from tracker
            filtersAndCategories.delete(category);
            // clear default
            container.innerHTML = '';
            // show filtered stories from clicking button
            showFilteredStories(data);
          }
          // if button is ACTIVE
          else {
            // add to filter bar
            clicked_buttons.style.display = "flex";
            clicked_buttons.style.maxHeight = "auto";
            active_filters.appendChild(button);
            // ADD category to tracker
            filtersAndCategories.set(category, true);
            // clear default
            container.innerHTML = '';
            // show filtered stories from clicking button
            showFilteredStories(data);
          }
          console.log(filtersAndCategories);
        });
      });
    
    // add functionality to sort buttons 
    showSortButtons(data);
      
    // clear filters 
    clearFilters(data);

    // show extra filters
    showExtraFilters(filters_more, extra_filters);
}

function showSortButtons(data) {
  // get buttons that are sorting
  const sort_select = document.querySelector(".sort_select");
  const select_button = document.querySelector(".select_button");
  // add click event
  select_button.addEventListener("click", () => {
    // toggle sort select to active/inactive
    sort_select.classList.toggle("active");
    // set button to active/inactive
    select_button.classList.toggle("filter_button");
    // set aria attribute to true or false
    let aria = select_button.getAttribute("aria-expanded");
    if (aria === "false") {
      select_button.setAttribute("aria-expanded", "true");
    }
    else {
      select_button.setAttribute("aria-expanded", "false");
    }
  });

  // get buttons that are sorting
   const selected_value = document.querySelector(".selected_value");
   const filters_sort = document.querySelectorAll(".filters_sort");
   
   //add click event to each button  
   filters_sort.forEach(button => {
    button.addEventListener("click", () => {
      // close select menu
      sort_select.classList.remove("active");
      select_button.classList.remove("filter_button");

      // get category from button 
      let category = button.dataset.filter;
      let up = "up_arrow";
      let down = "down_arrow"

      let arrow = document.createElement("span");
      arrow.textContent = "↑";

      // if button is ACTIVE
      if (button.classList.contains("filter_button")) {
        // remove ACTIVE status from OTHER BUTTONS
        filters_sort.forEach(btn => {
          let cat = btn.dataset.filter;
          // if buttons DO NOT MATCH clicked button
          if (button !== btn) {
            // console.log(btn);
            btn.classList.remove("filter_button");
            // remove key from tracked categories
            filtersAndCategories.delete(cat);
            btn.classList.remove(up);
            btn.classList.remove(down);
          }
          // if button DOES MATCH clicked button and IS ACTIVE
          else {
            // add active class
            button.classList.add("filter_button");

            // if filter is ASCENDING set it to descending
            if (filtersAndCategories.get(category) === "Ascending") {
              filtersAndCategories.set(category, "Descending");
              btn.classList.add(down);
            } 
            // if filter is DESCENDING set it to ascending
            else {
              filtersAndCategories.set(category, "Ascending");
              btn.classList.add(up);
              btn.classList.remove(down);
            }
          }
        });
      }
      // if button is INACTIVE
      else {
        filters_sort.forEach(btn => {
          if (button !== btn) {
            let cat = btn.dataset.filter;
            btn.classList.remove("filter_button");
            // remove key from tracked categories
            filtersAndCategories.delete(cat);
            btn.classList.remove(up);
            btn.classList.remove(down);
          }
           else {
            // add active class
            button.classList.add("filter_button");
            // add filter to ascending by default
            filtersAndCategories.set(category, "Ascending");
            button.classList.add(up);
           }
          
          });
        }
        // show title in main button
        selected_value.innerHTML = button.innerHTML;
        console.log(filtersAndCategories);

        container.innerHTML = '';
        showFilteredStories(data);
    });
   });
}

function showExtraFilters(filter, extra_area) {
  filter.addEventListener("click", () => {
    // toggle filter button on and off
    filter.classList.toggle("filter_button");
    // if area is hidden show area on click
    if (extra_area.classList.contains("hide")) {
      extra_area.classList.remove("hide");
      extra_area.classList.add("show");
    }
    else {
      extra_area.classList.add("hide");
      extra_area.classList.remove("show");
    }
  });
}

function populateButtonsOld(data, category, filter) { 
  // create a new set based off the filter keys
  const key = new Set(
    data.map((item) => item[category])
    .reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
  )
  
  // create extra section which has all the new filters in it
  const extra = document.createElement("section");
  extra.classList.add("extra_filters", "hide");
  extra.setAttribute("category", category);
  nav_area.appendChild(extra);
  // show area when clicked
  showExtraFilters(filter, extra);

  // counter
  let i = 0;

  key.forEach((item) => {
    // checks if item exists and there are no empty strings
    if (item) {
      // create the button and add to extra filters area
      const button = document.createElement("button");
      button.classList.add("filters");
      button.setAttribute("category", category);
      button.setAttribute("filter", item);

      button.setAttribute("data-order", i);
      i++;

      button.innerHTML = item;
      extra.appendChild(button);
      
      // get each story which matches the filter button
      clickFilter(button, data, category, item);
    }
  });
}

function clickFilter(filter_button, data) {
  // get category and filter
  let category = filter_button.dataset.category;
  let filter = filter_button.dataset.filter;
  let cloned_button;
  // add eventlistener when clicked
  filter_button.addEventListener("click", (event) => {
    // toggle active status on button
    filter_button.classList.toggle("filter_button");
    // if button is INACTIVE
    if (!filter_button.classList.contains("filter_button")) {
      // accessibility
      filter_button.ariaPressed = false;

      // keep track of filters and categories
      removeFilter(filter_button);
      // print map
      console.log(filtersAndCategories);
      // remove cloned button from active filters
      cloned_button.remove();

      // reset container and show stories
      container.innerHTML = '';
      showFilteredStories(data);
      // keeps track of active filters div
      showActiveFilters();
      showActiveMultiFilterButtons();
    }
    // if button is ACTIVE
     else {
      // accessibility
      filter_button.ariaPressed = true;

      // keep track of filters and categories pressed
      addFilter(filter_button);
      // print map
      console.log(filtersAndCategories);
      // clone button and place it in active filters
      cloned_button = filter_button.cloneNode(true);
      cloned_button.textContent = category + ": " + filter; 
      active_filters.appendChild(cloned_button);
      // add functionality to cloned buttons
      removeClonedButtons(data, cloned_button, filter_button);

      // show results from buttons
      container.innerHTML = '';
      showFilteredStories(data);
      // keeps track of active filters div
      showActiveFilters();
      showActiveMultiFilterButtons();
     }
  });
}

function addFilter(button) {
// get category and filter
let category = button.dataset.category;
let filter = button.dataset.filter;
// add filter to map 
if (filtersAndCategories.has(category)) {
        filtersAndCategories.forEach((value, key) => {
          if (key === category) {
            filtersAndCategories.get(key).push(filter);

          }
        });
      }
      else {
        // create new filter array
        filters = [];
        filters.push(filter);
        filtersAndCategories.set(category, filters);
      }
}

function removeFilter(button) {
// get category and filter
let category = button.dataset.category;
let filter = button.dataset.filter;  
// remove filter from map
filtersAndCategories.forEach((values, key) => {
  if (key === category) {
    // remove value if filter matches
    values = values.filter(value => value !== filter);
    filtersAndCategories.set(category, values);
    // if category's empty, delete key
    if (values.length === 0) {
      filtersAndCategories.delete(key);
    }
  }
});
}

function removeClonedButtons(data, cloned_button, original_button) {
  cloned_button.addEventListener("click", () => {
    // remove filter from map tracking it
    removeFilter(cloned_button);
    console.log(filtersAndCategories);
    // remove button
    cloned_button.remove();
    // remove active class on original button
    original_button.classList.toggle("filter_button");
    // accessibility
    original_button.ariaPressed = false;
    // show results from buttons
    container.innerHTML = '';
    showFilteredStories(data);
    // keeps track of active filters div
    showActiveFilters();
    showActiveMultiFilterButtons();
  });
}

function showActiveFilters() {
  // get container for active filters + clear all button
  const filter_container = document.querySelector(".container");

  // if there's more than one active filter
  if (active_filters.childElementCount > 0) {
    // remove default text
    const empty_filters = document.querySelector(".no_filters");
    if (empty_filters !== null) {
      empty_filters.remove();
    }
    // change spacing to space-between on container
    filter_container.style.justifyContent = "space-between";
    // active class to clear filter button
    clear_filters.classList.add("active");
    // remove disabled attribute from button
    clear_filters.removeAttribute("disabled");
    // accessibility
    clear_filters.ariaDisabled = false; 
  }
  // if there are no active filters
  else {
    console.log(true);
    // create and add text to say there's no filters applied
    let empty_filters = document.createElement("span");
    empty_filters.classList.add("no_filters");
    empty_filters.textContent = "No filters currently applied";
    active_filters.appendChild(empty_filters);
    // change spacing back to center on container
    filter_container.style.justifyContent = "center";
    // remove active class on clear all button
    clear_filters.classList.remove("active");
    // add back in disabled attribute
    clear_filters.setAttribute("Disabled", "");
    // accessibility
    clear_filters.ariaDisabled = true;
  }
}

function clearFilters(data) {
  clear_filters.addEventListener("click", () => {
    // accesibility
    clear_filters.ariaHidden = false;
    // reset active filters div
    active_filters.innerHTML = '';

    // hide clicked filters div
    clicked_filters.classList.toggle("active");
    clicked_filters.style.maxHeight = null;
    // get filters from sidebar
    let show_filters = document.querySelectorAll(".show_filters");
    // clear active status on all buttons
    show_filters.forEach(div => {
      let filters = Array.from(div.children);
      filters.forEach(button => {
        if (button.classList.contains("filter_button")) {
          // toggle all active buttons off
          button.classList.toggle("filter_button");
          // accessibility
          button.ariaPressed = false;
        }
      });
    });
    // add back in text that indicates no filters are active
    showActiveFilters();
    showActiveMultiFilterButtons();
    // clear filters clicked
    filtersAndCategories.clear();
    // post default page
    container.innerHTML = '';
    postData(data);
  })
}

function showActiveMultiFilterButtons() {
  // get all multi filters lists
  const show_filters = document.querySelectorAll(".show_filters");
  // go through each one
  show_filters.forEach(div => {
    // get category
    let category = div.dataset.category;
    console.log(category);
    // get matching multi-filter button
    const button = document.querySelector(".multi_filter[data-category=" + category + "]");
    const current_filters_number = button.children[0].children[0];
    // array to keep track of active buttons for each category
    let active_buttons = [];
    // create array from filters of each category
    let filters = Array.from(div.children);
    // go through each filter button
    filters.forEach(button => {
      // check pressed status
      let pressed = button.getAttribute("aria-pressed");
      if (pressed === "true") {
        active_buttons.push(button);
        }
      });
      // if active buttons number is more than 0, display
      if (active_buttons.length > 0) {
        current_filters_number.textContent = active_buttons.length;
      }
      else {
        current_filters_number.textContent = '';
      }
    });

}

function showFilteredStories(data) {
  // create array of categories
  let categories = Array.from(filtersAndCategories.keys());

  // array of stories to be pushed
  let filteredStories = [];

  // filter stories
  const stories = data.filter(data => {
    // get the latest category
    let currentCategory = categories.at(-1);
    // get the filter from data
    let filters = data[currentCategory];
    // console.log(currentCategory);

    // make sure filter exists and isn't empty
    if (currentCategory in data && typeof filters !== 'undefined') { 

      //turn data into array of entries 
      let entries = Array.from(Object.entries(data));
      // turn filters and categories clicked into array
      let clickedFilters = Array.from(filtersAndCategories.entries());

      // check whether all clicked filters are present in data
      let checkFilters = function (entries, clickedFilters) {
        return clickedFilters.every((filter) => {
          // flatten each entry into one array
          filter = filter.flat();
          // get category from first entry
          let category = filter[0];
          // console.log(category);
          // remove first entry, leaving only filters
          filter.shift();

          // return entries where at least one or more category is present in entry
          return entries.some(entry => {
            // flatten entry
            entry = entry.flat();
            // get key from entry
            let key = entry[0];
            // remove key, leaving only values
            entry.shift();

              // if key and category match and exist
              if (key === category) {
                // make sure at least one filter is present in key's values
                return filter.some(f => {
                  // console.log(f);
                  // if entry includes filter
                  if (entry.includes(f) || category === "Number" || category === "Title" || category === "IMDBRating" || category === "TotalViewers") {
                    return true;
                  }
                  // if there are missing episodes
                  else if (category === "MissingEpisodes") {
                    return true;
                  }
                  else if (category === "Animated" && !entry.includes("None")) {
                    return true;
                  }
                });
              }
            });
          });
      }

      // if filters map is in entries, push to filteredStories
      if (checkFilters(entries, clickedFilters)) {
        filteredStories.push(data);
      }

      
    }
  });

  // if sorted by story number
  if (filtersAndCategories.has("Number")) {
    let value = filtersAndCategories.get("Number");
    if (value === "Ascending") {
      filteredStories.sort();
    } 
    else {
      filteredStories.reverse();
    }
  }

  // if sorted by title
  if (filtersAndCategories.has("Title")) {
    let value = filtersAndCategories.get("Title");
    // sort in ascending order
    if (value === "Ascending") {
      filteredStories.sort((a, b) => {
        let titleA = a.Title.toLowerCase();
        let titleB = b.Title.toLowerCase();

        // disregard articles when sorting
        if (titleA.search("^a |^an |^the ") === 0 || titleB.search("^a |^an |^the ") === 0) {
          titleA = titleA.replace("the ", "").replace("a ", "").replace("an ", "");
          titleB = titleB.replace("the ", "").replace("a ", "").replace("an ", "");
        }

        if (titleA < titleB) {
          return -1;
        }

        return 0;
      });
    }
    // sort in descending order
    else {
      filteredStories.sort((a, b) => {
        let titleA = a.Title.toLowerCase();
        let titleB = b.Title.toLowerCase();

        // disregard articles when sorting
        if (titleA.search("^a |^an |^the ") === 0 || titleB.search("^a |^an |^the ") === 0) {
          titleA = titleA.replace("the ", "").replace("a ", "").replace("an ", "");
          titleB = titleB.replace("the ", "").replace("a ", "").replace("an ", "");
        }
        
        if (titleA > titleB) {
          return -1;
        }

        return 0;
      });
    }
  }

  // if sorted by rating
  if (filtersAndCategories.has("IMDBRating")) {
    let value = filtersAndCategories.get("IMDBRating");
    // sort in ascending order
    if (value === "Ascending") {
      filteredStories.sort((a, b) => b.IMDBRating - a.IMDBRating);
    }
    // sort in descending order
    else {
      filteredStories.sort((a, b) => a.IMDBRating - b.IMDBRating);
    }
  }

  // if sorted by viewership
  if (filtersAndCategories.has("TotalViewers")) {
    // sort in ascending order
    filteredStories.sort((a, b) => b.TotalViewers - a.TotalViewers);
  }

  filteredStories = [... new Set(filteredStories.concat(stories))];
  console.log(filteredStories);
  postData(filteredStories);

  // show number of results
  num_of_results.textContent = filteredStories.length;

  // reset page if all filters are unclicked or cleared
  if (categories.length === 0) {
    postData(data);
  }
}

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
      // else if (parseInt(story_number) < 51) {
      //     missing_status.innerHTML = "Complete";
      //     missing_status.style.color = "#fff";
      // }
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

      // show number of results by default
      // const num_of_results = document.querySelector(".number_of_results");
      num_of_results.textContent = data.length;
      
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