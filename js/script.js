
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

// getting sorting filters
const sorting_filters = document.querySelector(".sorting_filters");
const sort_button = document.querySelector("#sort_button");
const sort_dropdown = document.querySelector(".sort_dropdown");

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
  // show sort buttons when pressed
  sort_button.addEventListener("click", () => {
    // toggle active status
    sort_button.classList.toggle("active");
    sorting_filters.classList.toggle("active");
    sort_dropdown.classList.toggle("active");

    toggleSortDropdown();
  });

  // add functionality to sort buttons
  clickSort(data);

  // get boolean filters
  const bool_filters = document.querySelectorAll(".boolean_filter");
  // go through each and set functionality
  bool_filters.forEach(button => {
    // add button functionality
    clickFilter(button, data);
  });

  // get multi filters
  const multi_filters = document.querySelectorAll(".multi_filter");
  // go through each and set functionality
  multi_filters.forEach(button => {
    let category = button.dataset.category;
    createMultiFilters(data, category, button);
  });
}

function clickSort(data) {
  // get sort buttons
  const sort_buttons = document.querySelectorAll(".sort_filter");
  // get selected sort filter
  const selected_filter = document.querySelector(".selected_filter");
  
  // add event listener for each sort button
  sort_buttons.forEach(button => {
    let filter = button.dataset.filter;
    button.addEventListener("click", (event) => {
      // remove active class from button and dropdown
      sort_button.classList.toggle("active");
      sort_dropdown.classList.remove("active");
      // close sort dropdown
      toggleSortDropdown();

      let ascending = "fa-arrow-up-short-wide";
      let descending = "fa-arrow-down-wide-short";

      // get arrow
      let arrow = button.children[0];
      arrow.classList.add("fa-solid");

      // if button is CURRENTLY ACTIVE
      if (button.classList.contains("active")) {
        // go through all buttons and set the others to inactive
        sort_buttons.forEach(btn => {
          if (button !== btn) {
            let filter = btn.dataset.filter;
            let arrow = btn.children[0];
            
            btn.classList.remove("active");
            filtersAndCategories.delete(filter);

            arrow.classList.add("fa-solid");
            arrow.classList.remove(ascending);
            arrow.classList.remove(descending);
          }
          // set currently pressed button to active
          else {
            // add active class
            button.classList.add("active");
            
            // if button is ASCENDING
            if (button.ariaLabel === "Ascending") {
              // change arrow to descending
              arrow.classList.remove(ascending);
              arrow.classList.add(descending);
              button.ariaLabel = "Descending";
              // change filter to descending
              filtersAndCategories.set(filter, "Descending");
            }
            // if button is DESCENDING
            else if (button.ariaLabel === "Descending") {
              // change arrow back to ascending
              arrow.classList.remove(descending);
              arrow.classList.add(ascending);
              button.ariaLabel = "Ascending";
              // change filter back to ascending
              filtersAndCategories.set(filter, "Ascending");
            }
          }
        });
      }
      // if button is CURRENTLY INACTIVE
      else {
        // add active class
        sort_buttons.forEach(btn => {
          let filter = btn.dataset.filter;

          if (button === btn) {
            console.log(button);
            // add active class
            button.classList.add("active");
            // accessibility
            button.ariaPressed = true;
            button.setAttribute("aria-label", "Ascending");
            // set ascending arrow
            arrow.classList.add(ascending);
            // add to filters clicked and set to ascending by default
            filtersAndCategories.set(filter, "Ascending");
          }
           else {
            // accessibility
            btn.ariaPressed = false;

            let filter = btn.dataset.filter;
            let arrow = btn.children[0];
            
            btn.classList.remove("active");
            filtersAndCategories.delete(filter);

            arrow.classList.add("fa-solid");
            arrow.classList.remove(ascending);
            arrow.classList.remove(descending);
           }
        });
      }
      
      console.log(filtersAndCategories);
      // set selected filter to whatever was chosen
      let text = button.innerHTML;
      selected_filter.innerHTML = text;
      selected_filter.style.paddingTop = ".5rem";
      // reset container and show sort
      container.innerHTML = '';
      showFilteredStories(data);
    });
  });
}

function toggleSortDropdown() {
  // if sort button is ACTIVE
  if (sort_dropdown.classList.contains("active")) {      
    sort_dropdown.style.maxHeight = sort_dropdown.scrollHeight + "px";

    // accessibility
    sort_button.ariaPressed = true;
    sort_dropdown.ariaExpanded = true;
    sort_dropdown.ariaHidden = false;
  }
  // if sort button is INACTIVE
  else {
    sort_dropdown.style.maxHeight = 0;
    // accessibility
    sort_button.ariaPressed = false;
    sort_dropdown.ariaExpanded = false;
    sort_dropdown.ariaHidden = true;
  }
}

let data_map = new Map();
function createMultiFilters(data, category, button) {
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
  const show_filters = document.createElement("ol");
  show_filters.classList.add("show_filters");
  show_filters.id = category.toLowerCase() + "_filters";
  show_filters.setAttribute("data-category", category);
  // accessibility
  show_filters.setAttribute("aria-labelledby", category.toLowerCase() + "-filters_button");
  show_filters.setAttribute("aria-expanded", false);
  show_filters.setAttribute("aria-haspopup", "menu");

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
        button.classList.add("multi");
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
  // get button category
  let category = button.dataset.category; 

  // create "show more" button
  const show_more = document.createElement("button");
  show_more.classList.add("show_more");

  // create search bar container
  const search = document.createElement("div");
  search.classList.add("search_container");
  // create search bar
  const search_bar = document.createElement("input");
  search_bar.setAttribute("type", "text");
  search_bar.classList.add("search");
  search_bar.setAttribute("placeholder", "search " + category.toLowerCase() + "s");
  // create clear button
  const clear_button = document.createElement("button");
  clear_button.classList.add("clear_search");
  clear_button.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  // add search bar and clear button to search container
  search.appendChild(search_bar);
  search.appendChild(clear_button);

  // create filters div to show filter buttons
  const filters_list = document.createElement("div");
  filters_list.classList.add("filters_default");
  // create filters div for hidden filters
  const filters_hidden = document.createElement("div");
  filters_hidden.classList.add("filters_hidden");

  // add filters to show_filters div
  show_filters.appendChild(filters_list);
  show_filters.appendChild(filters_hidden);
  
  // decide on maximum amount of filters shown
  let max_initial_filters = 8;

  // get initial/default filters
  let initial_filters = filter_buttons.slice(0, max_initial_filters);
  // get hidden filters
  let hidden_filters = filter_buttons.slice(max_initial_filters);
  
  let scroll_height;
  let search_results = [];

  // show filters when clicking button
  button.addEventListener("click", () => {
    // toggle main filter button to active or inactive
    button.classList.toggle("active");
    // toggle show_filters div to active or inactive
    show_filters.classList.toggle("active");

    // let scroll_height;

    // if "show filters" is ACTIVE 
    if (!show_filters.classList.contains("active")) {
      // accessibility
      button.ariaExpanded = false;
      button.ariaPressed = false;
      // close div
      show_filters.style.maxHeight = 0;
    }
    // if "show filters" is INACTIVE
    else {
      // accessibility
      button.ariaExpanded = true;
      button.ariaPressed = true;

      // add search bar to beginning of filter list
      show_filters.prepend(search);

      // get search term
      let search_term = search_bar.value;

      // if search term exists, display results even if user opens and closes filters
      if (search_term.trim().length > 0) {
        console.log(search_results);
        // display results
        search_results.forEach(result => filters_list.appendChild(result));
        // remove "show more" button
        show_more.remove();

        // smooth scroll animation
        show_filters.style.maxHeight = show_filters.scrollHeight + "px";

        console.log(show_more);
      }
      
      // if category has less than max amount of shown filters
      else if (filter_buttons.length < max_initial_filters) {
        // display initial filters for every category
        filter_buttons.forEach(button => filters_list.appendChild(button));

        // show_filters.style.maxHeight = show_filters.scrollHeight + "px";
      }

      // if category has more than max amount of shown filters, allow user to toggle a "show more" button that shows the rest of them
      else if (filter_buttons.length > max_initial_filters) {
        // if "show all" is ACTIVE
        if (show_filters.classList.contains("show_all")) {
          // display all filters
          initial_filters.forEach(button => filters_list.appendChild(button));
          hidden_filters.forEach(button => filters_hidden.appendChild(button));
        }
        // if "show all" is INACTIVE
        else {
          // remove hidden filters
          filters_hidden.innerHTML = '';
          // display initial filters
          initial_filters.forEach(button => filters_list.appendChild(button));
            
          // set "show more" button to default
          show_more.textContent = "Show More";
          // add show_more button after filters list
          show_filters.append(show_more);
          // get default maxheight
          scroll_height = show_filters.scrollHeight;
        }
        
        // smoothly scroll
        show_filters.style.maxHeight = show_filters.scrollHeight + "px";
      }
    }
  });

  // add event listener to show more button
  show_more.addEventListener("click", () => {
    // get parent element
    let show_filters = show_more.parentNode;
    // toggle active class on "show more"
    show_more.classList.toggle("active");

    // if show_more is clicked
    if (show_more.classList.contains("active")) {
      // go through all hidden buttons and add them
      hidden_filters.forEach(button => {
        // add buttons after current ones in filter list
        filters_hidden.appendChild(button);
      });

      // set show_filters to "show all" 
      show_filters.classList.add("show_all");
      // change "show more" to "show less"
      show_more.textContent = "Show Less";

      // transition to appropriate scrollheight
      show_filters.style.maxHeight = show_filters.scrollHeight + "px";

      // remove show more button temporarily
      show_more.remove();
    }
    else {
      // remove class to indicate "show all" is inactive
      show_filters.classList.remove("show_all");
    
      // adjust height back to default height
      show_filters.style.maxHeight = scroll_height + "px";
      console.log(scroll_height);
      // change text back to "show more"
      show_more.textContent = "Show More";

      // remove show more button temporarily
      show_more.remove();
    }
  });

  // add "show more" button after transition ends
  show_filters.addEventListener("transitionend", (event) => {
    if (event.propertyName === "max-height") {
      let div = event.target;
      // if all filters are shown
      if (div.classList.contains("show_all")) {
        filters_hidden.after(show_more);
      }
      // if default filters are shown
      else 
        {
        filters_list.after(show_more);
      }
    }
  });

  // add functionality to search bar
  search_bar.addEventListener("input", (event) => {
    let results = [];
    let input = event.target.value;
    // console.log(input);
    // make sure input exists and isn't 0
    if (input && input.trim().length > 0) {
      // sanitize input, remove whitespace
      input = input.trim().toLowerCase();

      // go through filters
      filter_buttons.filter(button => {
        // get filter and sanitize it
        let filter = button.dataset.filter;
        filter = filter.toLowerCase();
        // console.log(filter);
        if (filter.includes(input)) {
          // clear filter list div
          filters_list.innerHTML = '';
          filters_hidden.innerHTML = '';
          show_more.remove();
          // push matching filters to array
          results.push(button);

          clear_button.classList.add("active");
        }
      });
    }
    // if input is EMPTY
    else {
      // clear filter list div
      filters_list.innerHTML = '';

      // if "show all" is INACTIVE
      if (!show_filters.classList.contains("show_all")) {
        // display default amount of filters
        initial_filters.forEach(button => {
          filters_list.appendChild(button);
          // add back "show more" button
          filters_list.after(show_more);
        });
      }
      // if "show all" is ACTIVE
      else {
        // display all filters
          initial_filters.forEach(button => filters_list.appendChild(button));
          hidden_filters.forEach(button => filters_hidden.appendChild(button));
          // add back "show more" button
          filters_hidden.after(show_more);
      }
        // smooth scroll transition
        show_filters.style.maxHeight = show_filters.scrollHeight + "px";
        // remove clear button
        clear_button.classList.remove("active");
    }

    // display results of input
    results.forEach(result => filters_list.appendChild(result));
    console.log(results);

    // if there are no results, display nothing
    if (results.length === 0) {
      filters_list.innerHTML = '';
      let zero_results = document.createElement("span");
      zero_results.textContent = "There are no results";
      filters_list.appendChild(zero_results);
    }

    // add results to main search results
    search_results = results;
  });

  // add functionality to clear button
  clear_button.addEventListener("click", () => {
    // clear filter list div
    filters_list.innerHTML = '';
    search_bar.value = '';

    // if "show all" is INACTIVE
    if (!show_filters.classList.contains("show_all")) {
      // display default amount of filters
      initial_filters.forEach(button => {
        filters_list.appendChild(button);
        // add back "show more" button
        filters_list.after(show_more);
      });
    }
    // if "show all" is ACTIVE
    else {
      // display all filters
        initial_filters.forEach(button => filters_list.appendChild(button));
        hidden_filters.forEach(button => filters_hidden.appendChild(button));
        // add back "show more" button
        filters_hidden.after(show_more);
    }
      // smooth scroll transition
      show_filters.style.maxHeight = show_filters.scrollHeight + "px";
      // remove clear button
      clear_button.classList.remove("active");
  });
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

function clickFilter(filter_button, data) {
  // get category and filter
  // let category = filter_button.dataset.category;
  // let filter = filter_button.dataset.filter;
  // let cloned_button;

  let cloned_button = filter_button.cloneNode(true);
  
  // add eventlistener when clicked
  filter_button.addEventListener("click", (event) => {
    // toggle active status on button
    filter_button.classList.toggle("active");
    // if button is INACTIVE
    if (!filter_button.classList.contains("active")) {
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
      // keep track of filters and categories pressed
      addFilter(filter_button);
      // print map
      console.log(filtersAndCategories);
      // clone button and place it in active filters
      cloned_button = filter_button.cloneNode(true);
      // cloned_button.textContent = category + ": " + filter; 
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
  // accessibility
  button.ariaPressed = true;

  // if filter is multi filter
  if (button.classList.contains("multi")) {
  console.log(button);
  // get category and filter names
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
// if filter is boolean filter
else if (button.classList.contains("boolean_filter")) {
  // get add to filters clicked
  let filter = button.dataset.filter;
  filtersAndCategories.set(filter, true);

  // show blurb
  const blurb = document.querySelector(".blurb[data-filter=" + filter + "]");
  if (blurb) {
    // add active class
    blurb.classList.add("active");
  
    // accessibility
    blurb.ariaHidden = false;
  }
  }
}

function removeFilter(button) {
  // accessibility
  button.ariaPressed = false;

  // if filter is multi filter
  if (button.classList.contains("multi")) {
    console.log(button);
    // get category and filter
    let category = button.dataset.category;
    let filter = button.dataset.filter;  

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
  // if filter is boolean filter
  else if (button.classList.contains("boolean_filter")) {
    console.log(button);
    // remove from filters clicked
    let filter = button.dataset.filter;
    filtersAndCategories.delete(filter);

    // hide blurb
    const blurb = document.querySelector(".blurb[data-filter=" + filter + "]");
    if (blurb) {
      blurb.classList.remove("active");
      // accessibility
      blurb.ariaHidden = true;
    }
  }
}

function removeClonedButtons(data, cloned_button, original_button) {
  cloned_button.addEventListener("click", () => {
    // remove filter from map tracking it
    removeFilter(cloned_button);
    console.log(filtersAndCategories);
    // remove button
    cloned_button.remove();
    // remove active class on original button
    original_button.classList.toggle("active");
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

    // get sort filters
    const sort_filters = document.querySelectorAll(".sort_filter");
    const selected_filter = document.querySelector(".selected_filter");

    // clear selected filter
    selected_filter.style.paddingTop = "0rem";
    selected_filter.innerHTML = "";

    sort_filters.forEach(btn => {
      // accessibility
      btn.ariaPressed = false;

      let filter = btn.dataset.filter;
      let arrow = btn.children[0];
      
      btn.classList.remove("active");
      filtersAndCategories.delete(filter);

      arrow.classList.add("fa-solid");
      arrow.classList.remove("fa-arrow-up-short-wide");
      arrow.classList.remove("fa-arrow-down-wide-short");
    });

    // get multi-filters from sidebar
    const show_filters = document.querySelectorAll(".show_filters");
    // clear active status on all buttons
    show_filters.forEach(div => {
      let filters = Array.from(div.children);
      filters.forEach(button => {
        if (button.classList.contains("active")) {
          // toggle all active buttons off
          button.classList.toggle("active");
          // accessibility
          button.ariaPressed = false;
        }
      });
    });
    // get boolean filters from sidebar
    const bool_filters = document.querySelectorAll(".boolean_filter");
    bool_filters.forEach(button => {
      if (button.classList.contains("active")) {
        // toggle all active buttons off
        button.classList.toggle("active");
        // remove filters
        removeFilter(button);
      }
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