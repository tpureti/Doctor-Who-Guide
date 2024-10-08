
// get divs where the info will be placed
const container = document.querySelector("#stories_container");
const story = document.querySelector(".story");
const info = document.querySelector(".info_area");
// basic info
const number = document.querySelector(".number");
const title = document.querySelector(".story_title");
const poster_area = document.querySelector(".poster_area");
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
const clear_filters = document.querySelectorAll(".clear_filters");
const open_filters = document.querySelector(".open_filters");

const header = document.querySelector("#header");
const main_search = document.querySelector(".main_search");
const clear_input = document.querySelector(".clear_input");

const sidebar = document.querySelector(".sidebar");

const num_of_results = document.querySelector(".number_of_results");
const scroll_buttons = document.querySelector(".scroll_buttons");
const top = scroll_buttons.querySelector(".jump_to_top");


// map that tracks which buttons are clicked
let filtersAndCategories = new Map();
let filters = [];
// results from filters and searchbar
let filterResults = [];
let searchedStories = [];

// fetch json data
async function getJSON() {
  const response = await fetch("json/stories.json");
  let data = response.json();
  return data;
}

// resolve json data
getJSON()
  .then(data => {
    populateAllButtons(data);
    showFilteredStories(data);
    mainSearch(data);
    openSidebar();
    closeSidebar();
    shrinkHeader();
    scrollButtons();
    // 
    allowTransitions();
})
  .catch(() => {
    console.log("error: JSON not found")
  });

function openSidebar() {
  // get sidebar
  const sidebar = document.querySelector(".sidebar");

  // add event listener to open sidebar
  open_filters.addEventListener("click", () => {
    // add/remove "active" class on sidebar
    sidebar.classList.toggle("active");
    // add/remove "active" class on open filters button
    open_filters.classList.toggle("active");

    // if sidebar is active
    if (sidebar.classList.contains("active")) {
      // set width 
      // sidebar.style.width = "min(25rem, 100%)";
      // sidebar.style.maxWidth = "25rem";
    }
  });

  let clientWidth = window.innerWidth;
  // apply eventlistener if window is small enough
  if (clientWidth < 1356) {
    // add event listener to sidebar for transition
    sidebar.addEventListener("transitionend", (event) => {
      let sidebar = event.target;
  
      if (event.propertyName === "transform" && sidebar.classList.contains("sidebar")) {
        // if sidebar has been CLOSED
        if (!sidebar.classList.contains("active")) {
          // console.log(true);
          // set width to 0
          // sidebar.style.width = "0px";
        }
      }
    });
  }

  if (clientWidth >= 1356) {
    // console.log("meow");
  }

}

function closeSidebar() {
  const close_button = document.querySelector(".close_filters");

  close_button.addEventListener("click", () => {
    sidebar.classList.remove("active");
    open_filters.classList.remove("active");
  });
}

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

  clear_filters.forEach(button => {
    clearFilters(button, data);
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

function createElements(show_filters) {
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

  return [show_more, search, filters_list, filters_hidden]
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
  search_bar.classList.add("search_bar");
  search_bar.setAttribute("placeholder", "Search " + category.toLowerCase() + "s...");
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

  // create object of created html elements
  const htmlElements = {
    "show_filters": show_filters,
    "initial_filters": initial_filters,
    "filters_list": filters_list,
    "filters_hidden": filters_hidden,
    "show_more": show_more,
    "clear_button": clear_button
  }

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

        show_filters.style.maxHeight = show_filters.scrollHeight + "px";
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

    let zero_results = document.createElement("span");
    zero_results.textContent = "There are no results";
    // console.log(input);
    // make sure input exists and isn't 0
    if (input && input.trim().length > 0) {
      // split input by commas
      input = input.split(",");

      // clear filter list divs
      filters_list.innerHTML = '';
      filters_hidden.innerHTML = '';
      // remove show more button
      show_more.remove();

      // add clear search button
      clear_button.classList.add("active");

      // go through filters
      filter_buttons.some(button => {
        // get filter and sanitize it
        let filter = button.dataset.filter;
        filter = filter.toLowerCase();

        // go through input array
        input.forEach(input => {
          // sanitize input, remove whitespace
          input = input.trim().toLowerCase();
          // if input isn't just whitespace
          if (input) {
            // match input with filters 
            if (filter.includes(input)) {
            // push matching filters to array
            results.push(button);
          }
          }
        });
      });

      // if there are no results, display nothing
      if (results.length === 0) {
        filters_list.innerHTML = '';
        filters_list.appendChild(zero_results);
      }
    }
    // if input is EMPTY
    else {
      // clear filter list div
      filters_list.innerHTML = '';

      // reset is search is empty
      clearSearch(htmlElements);
    }

    // display results of input
    results.forEach(result => filters_list.appendChild(result));
    console.log(results);

    // add results to main search results
    search_results = results;
  });

  // add functionality to clear button
  clear_button.addEventListener("click", () => {
    // clear filter list div
    filters_list.innerHTML = '';
    search_bar.value = '';

    // reset if search is cleared
    clearSearch(htmlElements);
  });
}

function clearSearch(htmlElements) {
  // destructure object with html elements
  let show_filters = htmlElements.show_filters;
  let initial_filters = htmlElements.initial_filters;
  let filters_list = htmlElements.filters_list;
  let filters_hidden = htmlElements.filters_hidden;
  let show_more = htmlElements.show_more;
  let clear_button = htmlElements.clear_button;

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
  let category = filter_button.dataset.category;
  let filter = filter_button.dataset.filter;
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

      // if scrollheight is past header
      if (document.documentElement.scrollTop > header.offsetHeight) {
        // adjust size of buttons
        cloned_button.classList.add("scroll");
      } 

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
  // const filter_container = document.querySelector(".container");

  // if there's more than one active filter
  if (active_filters.childElementCount > 0) {
    // apply to both clear buttons
    clear_filters.forEach(button => {
      // active class to clear filter button
      button.classList.add("active");
      // remove disabled attribute from button
      button.removeAttribute("disabled");
      // accessibility
      button.ariaDisabled = false; 
    });
  }
  // if there are no active filters
  else {
    console.log(true);
    // disable reset button
    clicked_filters.style.borderBottom = 0;

    // apply to both clear buttons
    clear_filters.forEach(button => {
      // remove active class on clear all button
      button.classList.remove("active");
      // add back in disabled attribute
      button.setAttribute("Disabled", "");
      // accessibility
      button.ariaDisabled = true;
    });
  }
}

function clearFilters(clear_filters, data) {
  clear_filters.addEventListener("click", () => {
    // accesibility
    clear_filters.ariaHidden = false;
    // reset active filters div
    active_filters.innerHTML = '';

    // remove border from filters
    clicked_filters.style.borderBottom = null;

    // get sort filters
    const sort_filters = document.querySelectorAll(".sort_filter");
    const selected_filter = document.querySelector(".selected_filter");

    // clear selected filter
    selected_filter.style.paddingTop = "0rem";
    selected_filter.innerHTML = "";

    // clear sort filters
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

    // clear multi-filters from sidebar
    const multi_filters = document.querySelectorAll(".multi");
    // clear active status on all buttons
    multi_filters.forEach(button => {
        if (button.classList.contains("active")) {
          // toggle all active buttons off
          button.classList.toggle("active");
          // accessibility
          button.ariaPressed = false;
        }
    });

    // clear boolean filters from sidebar
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
    // set filteredResults to default data
    filterResults = data;
    // post default page
    container.innerHTML = '';
    createPagination(1);
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

  // if there is something in the search bar
  if (searchedStories.length) {
    // remove active class on search clear input
    clear_input.classList.remove("active");
    // reset to empty search bar
    main_search.value = '';
    // clear searchedStories
    searchedStories = [];
  }

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

      // turn data into array of entries 
      let entries = Array.from(Object.entries(data));
      // turn filters and categories clicked into array
      let clickedFilters = Array.from(filtersAndCategories.entries());

      // check whether all clicked filters are present in data
      let checkFilters = (entries, clickedFilters) => {
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
                  else if (category === "Animated" && !entry.includes("Not Animated")) {
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
     let value = filtersAndCategories.get("TotalViewers");
    // sort in ascending order
    if (value === "Ascending") {
      filteredStories.sort((a, b) => b.TotalViewers - a.TotalViewers);
    }
    // sort in descending order
    else {
      filteredStories.sort((a, b) => a.TotalViewers - b.TotalViewers);
    }
  }

  // reset page if all filters are unclicked or cleared
  if (categories.length === 0) {
    filteredStories = data;
    postData(data);
  }
  
  filteredStories = [... new Set(filteredStories.concat(stories))];
  postData(filteredStories);
  
  // show number of results
  num_of_results.textContent = filteredStories.length;

  console.log(filteredStories);
  // add filtered stories to global results container
  filterResults = [];
  filterResults = filterResults.concat(filteredStories);
  // 
  createPagination(1);
}

function mainSearch(data) {
  const search_tips = document.querySelector(".search_tips");

  let debounceTimer;
  const debounce = (callback, time) => {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(callback, time);
  };

  // add event listener to show tips
  main_search.addEventListener("focusin", () => {
    search_tips.classList.add("active");
  });

  // add event listener to close tips
  main_search.addEventListener("focusout", () => {
    search_tips.classList.remove("active");
  });

  // add event listener that gets user input
  main_search.addEventListener("input", (event) => {
    // get user input
    let input = event.target.value;
    // add clear button and hide tips
    if (input) {
      clear_input.classList.add("active");
      search_tips.classList.remove("active");
    }
    // remove clear button and show tips
    else {
      clear_input.classList.remove("active");
      search_tips.classList.add("active");
    }
    // handle search queries
    debounce(() => handleSearches(input, filterResults), 500);
  });

  // function that filters search inputs
  const handleSearches = (input, filteredStories) => {
    // remove whitespace
    input = input.trim();
    let full_input = input;
    // create arrays for various types of searches
    let gen_search;
    let exact_searches = [];
    let and_searches = [];
    let or_searches = [];
    let not_searches = [];

    // if there's QUOTES
    const QUOTE = full_input.match(/\"[\d\w\s\.\:]+\"/g);
    // add individual terms to array
    parseSearchTerms(QUOTE, exact_searches, "QUOTE");

    // if there's an AND
    const AND = full_input.match(/(([\d\w\s]+(AND|&)[\d\w\s]+))/g);
    // add individual terms to array
    parseSearchTerms(AND, and_searches, "AND");
    
    // if there's an OR
    const OR = full_input.match(/(([\d\w\s]+(OR|\|)[\d\w\s]+))/g);
    // add individual terms to array
    parseSearchTerms(OR, or_searches, "OR");

    // if there's a NOT
    const NOT = full_input.match(/((NOT|-)[\"\d\w\s\"]+)/g);
    // add individual terms to array
    parseSearchTerms(NOT, not_searches, "NOT");

    let or = [];
    // if there's a comma and it's NOT FOLLOWED by a key search term
    const COMMA_AHEAD = full_input.match(/,(?![\d\w\s]+(AND|&|OR|\|))/g);
    // if there's a comma and it's NOT PRECEDED by a key search term
    const COMMA_BEHIND = full_input.match(/(?<!(AND|&|OR|\|)[\d\w\s]+),/g);
    if (COMMA_AHEAD !== null && COMMA_BEHIND !== null) {
      or.push(input);
      parseSearchTerms(or, or_searches, "OR");
    }

    if (QUOTE === null && AND === null && OR === null && NOT == null && COMMA_AHEAD == null && COMMA_BEHIND === null) {
      input = input.toLowerCase();
      gen_search = input;
    }
   
  //  console.log(gen_search);
  //  console.log(exact_searches);
  //  console.log(and_searches);
  //  console.log(or_searches);
  //  console.log(not_searches);

   let searchResults = [];
   console.log(filteredStories);
   // go through currently displayed data  
   filteredStories.filter(data => {
    // console.log(data);
    // turn data into array of values 
    let entry = Object.values(data).flat().flat().flat();
    
    // make data lowercase
    let lowercase_entry = entry.map(entry => {
      if (!Array.isArray(entry) && typeof entry !== 'object' && typeof entry === 'string') {
          return entry.toLowerCase();
        }
      });

      // get rid of undefined entries
      lowercase_entry = lowercase_entry.filter(entry => entry !== undefined);

      if (gen_search !== undefined) {
        // get results from regular search
        let gen_results = findGenSearches(gen_search, lowercase_entry, data);
        // add to search results
        addToSearchResults(gen_results, searchResults);
      }

      if (exact_searches.length > 0) {
        // get results for quoted searches
        let exact_results = findExactSearches(exact_searches, lowercase_entry, data);
        // add to search results
        addToSearchResults(exact_results, searchResults);
      }

      // get results from AND searches
      if (and_searches.length > 0) {
        let and_results = findANDSearches(and_searches, lowercase_entry, data);
        // add to search results
        addToSearchResults(and_results, searchResults);
      }

      // get results from OR searches
      if (or_searches.length > 0) {
        let or_results = findORSearches(or_searches, lowercase_entry, data);
        // add to search results
        addToSearchResults(or_results, searchResults);
      }

    });

    // combine results
    searchResults = [...new Set(searchResults)];    

    // find NOT searches
    if (not_searches.length > 0) {
      let not_results = findNOTSearches(not_searches, searchResults);
      searchResults = not_results;
    }

    // display results
    container.innerHTML = '';
    postData(searchResults);
    // show number of results
    num_of_results.textContent = searchResults.length;
    // add search results to global array
    searchedStories = [];
    searchedStories = searchedStories.concat(searchResults);

    // create Pagination
    createPagination(1);
  }

  // add event listener to "clear" button
  clear_input.addEventListener("click", () => {
    // remove active class
    clear_input.classList.remove("active");
    // reset to previous results
    main_search.value = '';
    // clear searchedStories
    searchedStories = [];
    // clear results
    container.innerHTML = '';
    // if there are filters selected
    if (filterResults.length) {
      // use filtered stories
      createPagination(1)
    }
    else {
      createPagination(1);
    }
  });
}

function parseSearchTerms(INPUT, keyword_searches, keyword) {
  // if term exists
  if (INPUT !== null) {
    INPUT.forEach(term => {
      let array = [];
      // if it's a quote
      if (keyword === "QUOTE") {
        // remove quotes
        term = term.slice(1, -1);
        // add to set
        keyword_searches.push(term.toLowerCase());
      }
      // if it's an AND or OR search
      else if (keyword === "AND") {
        let regex = /(AND|&)/;
        term = term.split(regex);
        term.forEach(term => {
          // remove whitespace
          term = term.trim();
          // add to set
          if (!term.match(regex) && !term.match(/NOT|-/)) {
            // add to subarray
            array.push(term.toLowerCase());
          }
        });
        // add to main array
        keyword_searches.push(array);
      }
      else if (keyword === "OR") {
        let regex = /(OR|\||,)/;
        term = term.split(regex);
        term.forEach(term => {
          // remove whitespace
          term = term.trim();
          // add to set
          if (!term.match(regex) && term && !term.match(/NOT|-/)) {
            // add to subarray
            array.push(term.toLowerCase());
          }
        });
        // add to main array
        keyword_searches.push(array);
      }
      // if it's a NOT
      else if (keyword === "NOT") {
        // remove keyword and whitespace
        term = term.replace(/[NOT|-]+/,"");
        term = term.trim();
        // add to set
        keyword_searches.push(term.toLowerCase());
      }
    });
    // make a set from the array
    keyword_searches = [...new Set(keyword_searches)];

  }

}

function addToSearchResults(individual_results, searchResults) {
  if (individual_results !== undefined) {
    searchResults.push(individual_results);
  }
}

function findGenSearches(plain_search, lowercase_entry, data) {
  const result = lowercase_entry.some(entry => {
    if (entry.includes(plain_search)) {
      return true;
    }
  });

  if (result === true) {
    return data;
  }
}

function findExactSearches(exact_search, lowercase_entry, data) {
  let results = lowercase_entry.some(entry => {
    return exact_search.some(search => {
      if (entry === search) {
        return true;
      }
    });
  });

  if (results === true) {
    return data;
  }
}

function findORSearches(or_searches, lowercase_entry, data) {
  // get the result from searches
  const result = or_searches.some(search => {
    return search.some(search => {
      return lowercase_entry.some(entry => {
        if (entry.includes(search)) {
          // console.log(data);
          return true;
        }
      });
    });
    });
  
  // if result is true, add to array
  if (result === true) {
    return data;
  }
}

function findANDSearches(and_searches, lowercase_entry, data) {
  // get the result from searches
  const result = and_searches.some(search => {
    return search.every(search => {
      return lowercase_entry.some(entry => {
        if (entry.includes(search)) {
          return true;
          }
        });
      });
    });
  
  // if result is true, add to array
  if (result === true) {
    return data;
  }
}

function findNOTSearches(not_searches, searchResults) {
  let not_results = [];
  searchResults.filter(data => {
    // turn data into array of values 
    let entry = Object.values(data).flat().flat().flat();
    
    // make data lowercase
    let lowercase_entry = entry.map(entry => {
      if (!Array.isArray(entry) && typeof entry !== 'object' && typeof entry === 'string') {
          return entry.toLowerCase();
        }
      });

      // get rid of undefined entries
      lowercase_entry = lowercase_entry.filter(entry => entry !== undefined);

      const result = not_searches.every(search => {
        return lowercase_entry.every(entry => {
          // if entry DOES NOT INCLUDE search
          if (!entry.includes(search)) {
            return true;
          }
        });
      });
      // add to array
      if (result === true) {
        not_results.push(data);
      }
  });

  return not_results;
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
        poster_area.classList.add("essential_poster");
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
        poster_area.classList.remove("essential_poster");
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
      if ('MissingEpisodes' in results || parseInt(story_number) < 51) {
        // display status div
        status_area.style.display = "block"; 
        // displays number of episodes if there are any missing
        let missing_eps = parseInt(story_eps, 10) - parseInt(eps_missing, 10); // subtract missing eps from total eps

        // set status of story
        // if ALL EPISODES are missing
        if (eps_missing === story_eps) {
          missing_status.innerHTML = "Completely Missing";
          missing_status.style.color = "var(--clr-pale-red)";
          // set episodes to missing eps/total eps
          episodes.innerHTML = missing_eps + "/" + story_eps;
        }
        // if NO EPISODES are missing
        else if ('MissingEpisodes' in results === false) {
          missing_status.innerHTML = "Complete";
          missing_status.style.color = "var(--clr-light-green)";
        } 
        // if SOME EPISODES are missing
        else {
          missing_status.innerHTML = "Partially Missing";
          missing_status.style.color = "var(--clr-pale-yellow)";
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

      // show number of results by default
      // num_of_results.textContent = data.length;
      
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
  // let btns_og = createStory.children.item(1).children.item(1).children.item(4).children;
  let btns = createStory.children.item(1).children.item(2).children;
  // console.log(btns2);
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
  // add close buttons for each info area
  closeInfoTab(info, btns);
}

function closeInfoTab(info, btns) {
  // get basic info tab
  let basic = info[0];
  // slice array so basic isn't included
  info = Array.from(info);
  info = info.slice(1);

  btns = Array.from(btns);
  
  info.forEach((area, index) => {
    // get area name
    // let area_name = area.classList[0].replace("_info", "");
    let area_name = area.dataset.tab;

    // create close tab button
    const close_button = document.createElement("button");
    close_button.classList.add("close_tab");
    close_button.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    // close_button.innerHTML = 'close';
    close_button.style.color = "var(--" + area_name + "-button";

    // add close button to each tab
    area.prepend(close_button);

    // event listener to close info tabs
    close_button.addEventListener("click", () => {
      area.classList.toggle("show");
      basic.classList.toggle("hide");

      // go through all buttons
      btns.forEach(button => {
        let button_name = button.dataset.tab;
        // toggle off active button
        if (area_name.match(button_name)) {
          button.classList.toggle("active_button");
        }
      });
    });
  });
}

function addClick(button, info, btns) {
  // let button_name = button.classList[1].replace("button_", "");
  let button_name = button.dataset.tab;

  button.addEventListener("click", () => {
    // if button is ACTIVE and CLICKED
    if (button.classList.contains("active_button")) {

      // go through areas
      for (let area of info) {
        let area_name = area.dataset.tab;
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
        let buttons = btn.dataset.tab;
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
        let area_name = area.dataset.tab;
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
        let buttons = btn.dataset.tab;
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

function shrinkHeader() {
  let container = clicked_filters.children[1];
  // 
  let prevScroll = window.scrollY;

  let scrollCountTimer;
  let scrollCount = 0;

  window.onscroll = () => {

    // if (scrollCountTimer) {
    //   clearTimeout(scrollCountTimer)
    // }
    // scrollCountTimer = setTimeout(() => {
    //   scrollCount++
    // }, 500);

    const buttons = clicked_filters.querySelectorAll("button");
    
    if (document.documentElement.scrollTop > header.offsetHeight) {
      // get current scroll height
      let currentScroll = window.scrollY;

      // make header smaller
      header.classList.add("scroll");

      // header disappears if we scroll past header
      if (prevScroll > currentScroll) {
        header.style.top = "0";
      }
      // shows up if we scroll up
      else {
        header.style.top = "-" + header.offsetHeight + "px";
      }

      if (prevScroll > currentScroll) {
        // fix clicked filters below header
        clicked_filters.style.top = header.offsetHeight + "px";
      }
      else {
        // fix clicked filters to top of screen
        clicked_filters.style.top = "0";
        open_filters.classList.add("scroll");
      }

      // make buttons smaller on scroll
      buttons.forEach(button => {
        button.classList.add("scroll");
      });

      // if there are no filters selected
      if (active_filters.childElementCount === 0) {
        // clicked_filters.style.visibility = "hidden";
        clicked_filters.style.borderBottom = null;
      }
      // if there are filters
      else {
        container.style.border = "none";
        // clicked_filters.style.backgroundColor = "rgb(22, 22, 22, 0.5)";
        clicked_filters.style.borderBottom = "1px solid var(--clr-med-grey)";
      }

      // get height of header + filters if they're active
      let fullheader_height = header.offsetHeight + clicked_filters.offsetHeight;

      // set sidebar to just below it
      sidebar.style.top = fullheader_height + 16 + "px";

      // 
      prevScroll = currentScroll;
    }
    else {
      // make header smaller
      header.classList.remove("scroll");
      // attach clicked filters below header
      clicked_filters.style.top = header.offsetHeight + "px";
      clicked_filters.style.visibility = "visible";

      buttons.forEach(button => {
        button.classList.remove("scroll");
      });
    }

    // get full page height minus footer
    let pageHeight = document.documentElement.offsetHeight - window.innerHeight;
    pageHeight = pageHeight - footer.offsetHeight;

    // if scrolled down more than one page's worth, show scroll to bottom button
    if (document.documentElement.scrollTop >= window.innerHeight && !top.classList.contains("active")) {
      top.style.opacity = 1;
      top.classList.add("active");
    }
    // if scroll less than one page, remove button
    if (document.documentElement.scrollTop < window.innerHeight && top.classList.contains("active")) {
      top.style.opacity = 0;
    }
    // remove top button after it transitions away
    top.addEventListener("transitionend", (e) => {
      // console.log(e);
      if (top.classList.contains("active") && document.documentElement.scrollTop < window.innerHeight) {
        top.classList.remove("active");
      }
    });

    // if we're at the bottom of the page
    if (document.documentElement.scrollTop > pageHeight) {
      // set scroll buttons and sidebar above footer
      let height = footer.offsetHeight - 16;
      scroll_buttons.style.bottom = height + "px";
      sidebar.style.top = 0;
      // sidebar.style.bottom = "2rem";
    }
    else {
      scroll_buttons.style.bottom = "revert-layer";
      sidebar.style.top = "revert-layer";
    }
  }
}

function scrollButtons() {
  // console.log(scroll_buttons.querySelector(".jump_to_bottom"));
  const top = scroll_buttons.querySelector(".jump_to_top");
  const bottom = scroll_buttons.querySelector(".jump_to_bottom");

  // go to top if clicked
  top.addEventListener("click", () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  });

  // go to bottom if clicked
  bottom.addEventListener("click", () => {
    let height = document.documentElement.offsetHeight;
    window.scrollTo({
      top: height,
      left: 0,
      behavior: "smooth",
    });
  });
}

const entries_per_page = 10;
const prev_button = document.querySelector("#prev");
const next_button = document.querySelector("#next");
const page_links = document.querySelectorAll(".page_link");
const first_page = document.querySelector("#first_page");
const last_page = document.querySelector("#last_page");
const dots = document.querySelectorAll(".dots");
let page = 1;
let total_pages = null;
let combinedResults;

function createPagination(page) {
  console.log(filterResults.length);
  console.log(searchedStories.length);

  // if there are search results, use that total
  if (searchedStories.length) {
    total_pages = Math.ceil(searchedStories.length / entries_per_page);
    combinedResults = searchedStories;
  }
  // else use default or filtered results
  else {
    total_pages = Math.ceil(filterResults.length / entries_per_page);
    combinedResults = filterResults;
  }

  goToFirstPage();
}

window.addEventListener("hashchange", () => {
    // get url and change display if back or forward spacing
    let url = window.location.hash;
    url = url.slice(1);
  
    page = parseInt(url);
    displayPage(page);
    updatePagination();
});

function displayPage(page) {
    // scroll to top
    window.scroll(0, 0);
    top.classList.remove("active");
    // add pages visited to history
    history.replaceState({}, "", "#" + page);

    let startIndex = (page - 1) * entries_per_page;
    let endIndex = startIndex + entries_per_page;
    // display number of stories
    num_of_results.textContent = combinedResults.length;

    // get slice of stories
    let currStories = combinedResults.slice(startIndex, endIndex);

    // reset container
    container.innerHTML = '';
    // display stories of specific page
    postData(currStories);
}

function updatePagination() {
  // console.log(total_pages);
  let first_page_number = document.querySelector(".page_number").querySelector(".first");
  let last_page_number = document.querySelector(".page_number").querySelector(".last");
  
  first_page_number.textContent = page;
  last_page_number.textContent = total_pages;

  // same in both views
  if (page === 1) {
    // hide previous button
    prev_button.style.display = "none";
    // show next button
    next_button.style.display = "block";
  }
  else if (page === total_pages) {
    // hide next button
    next_button.style.display = "none";
    // show prev button
    prev_button.style.display = "block";
  }

  // if in mobile view
  if (window.innerWidth < 565) {
    // change appearance of first and last pages
    first_page.innerHTML = '<i class="fa-solid fa-angles-left"></i>';
    last_page.innerHTML = '<i class="fa-solid fa-angles-right"></i>';
    // first_page.style.color = "var(--clr-light-grey)";
    // last_page.style.color = "var(--clr-light-grey)";

    // move them before and after next and prev buttons
    prev_button.before(first_page);
    next_button.after(last_page);

    // change prev and next buttons to arrows
    next_button.innerHTML = '<i class="fa-solid fa-angle-right"></i>';
    prev_button.innerHTML = '<i class="fa-solid fa-angle-left"></i>';

    // hide every link except first
    page_links.forEach((link, index) => {
      if (index > 0) {
        link.style.display = "none";
      }
      else {
        link.textContent = page;
        link.dataset.page = page;
        link.href = "#" + page;
      }
    });

    if (page !== 1 && page !== total_pages) {
      // show prev button
      prev_button.style.display = "flex";
      // show next button
      next_button.style.display = "flex";

      // show first page
      first_page.style.display = "flex";
      // show last page
      last_page.style.display = "flex";
    }
    else if (page === 1) {
      // show last page
      last_page.style.display = "flex";
      // hide first page
      first_page.style.display = "none";
    }
    else if (page === total_pages) {
      // show first page
      first_page.style.display = "flex";
      // hide last page
      last_page.style.display = "none";
    }
  }

  // if not in mobile view
  else {
    // if there are more than 3 pages and not on the last page, shift page numbers
    if (total_pages > 3) {
      // show all 3 page links
      page_links.forEach(link => {
        link.style.display = "block";
      });
      // if on first page
      if (page === 1) {
        let i = 1;
        // reset to first 3 pages
        page_links.forEach(link => {
          link.textContent = i;
          link.dataset.page = i;
          link.href = "#" + i;
          i++;
        });
      }
      if (page !== 1 && page !== total_pages) {
        // show prev and next buttons
        prev_button.style.display = "block";
        next_button.style.display = "block";
        // adjust page numbers, increasing by one
        let prev_num = page - 1;
        let next_num = page + 1;
        // previous page
        page_links[0].textContent = prev_num;
        page_links[0].dataset.page = prev_num;
        page_links[0].href = "#" + prev_num;
        // current page
        page_links[1].textContent = page;
        page_links[1].dataset.page = page;
        page_links[1].href = "#" + page;
        // next page
        page_links[2].textContent = next_num;
        page_links[2].dataset.page = next_num;
        page_links[2].href = "#" + next_num;
      }
  
      // if on first two page
      if (page < 3) {
        // show last page
        last_page.textContent = total_pages;
        last_page.dataset.page = total_pages;
        last_page.style.display = "block";
        // show dots leading to last page
        dots[1].style.display = "block";
  
        // hide first page
        first_page.style.display = "none";
        // hide dots leading to first page
        dots[0].style.display = "none";
      }
      // if in middle pages
      if (page > 2 && page < total_pages - 1) {
        // show first and final pages
        first_page.style.display = "block";
        last_page.textContent = total_pages;
        last_page.dataset.page = total_pages;
        last_page.style.display = "block";
  
        // show dots in middle pages
        dots.forEach(span => {
          span.style.display = "block";
        });
      }
      // if on second to last page
      if (page >= total_pages - 1) {
        // hide last page
        last_page.style.display = "none";
        // do not show dots leading to last page
        dots[1].style.display = "none";
      }
      if (page === total_pages) {
        // show first page
        first_page.style.display = "block";
        dots[0].style.display = "block";
  
        // show last 3 pages
        // previous page
        page_links[0].textContent = total_pages - 2;
        page_links[0].dataset.page = total_pages - 2;
        page_links[0].href = "#" + (total_pages - 2);
        // current page
        page_links[1].textContent = total_pages - 1;
        page_links[1].dataset.page = total_pages - 1;
        page_links[1].href = "#" + (total_pages - 1);
        // next page
        page_links[2].textContent = total_pages;
        page_links[2].dataset.page = total_pages;
        page_links[2].href = "#" + total_pages;
      }
    }
    // if there are 3 pages or less
    else {
      // hide previous button
      prev_button.style.display = "none";
      // show next button
      next_button.style.display = "none";
      // remove first and last pages
      first_page.style.display = "none";
      last_page.style.display = "none";
      // hide dots
      dots.forEach(span => {
        span.style.display = "none";
      });
      // remove extra page links
      page_links.forEach((link, index) => {
        let page_num = index + 1;
        if (index > total_pages - 1) {
          link.style.display = "none";
        }
        else {
          link.textContent = page_num;
          link.dataset.page = page_num;
          link.href = "#" + page_num;
        }
      });
    }
  }


  // get each page
  page_links.forEach(link => {
    // show clicked page as active
    let page_num = link.dataset.page;
    page_num = parseInt(page_num);
    // if page number is page selected, set to active
    if (page_num === page) {
      link.classList.add("active");
      link.href = "#" + page;
    }
    else {
      link.classList.remove("active");
    }
  });
}

prev_button.addEventListener("click", (e) => {
  if (page > 1) {
    page--;
    e.preventDefault();
    window.location.href = "#" + page;

    displayPage(page);
    updatePagination();
  }
});

next_button.addEventListener("click", (e) => {
  if (page < total_pages) {
    page++;
    e.preventDefault();
    window.location.href = "#" + page;

    displayPage(page);
    updatePagination();
  }
});

page_links.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    // 
    let page_num = link.dataset.page;
    page_num = parseInt(page_num);
    if (page_num !== page) {
      page = page_num;
      e.preventDefault();
      window.location.href = "#" + page;

      displayPage(page);
      updatePagination();

    }
  });
});

first_page.addEventListener("click", (e) => {
  page = 1;
  e.preventDefault();
  window.location.href = "#" + page;

  displayPage(page);
  updatePagination();

});

function goToFirstPage() {
  page = 1;
  window.location.href = "#" + page;

  displayPage(page);
  updatePagination();

}

last_page.addEventListener("click", (e) => {
  page = total_pages;
  e.preventDefault();
  window.location.href = "#" + page;

  displayPage(total_pages);
  updatePagination();
});



/**
 *function which allows transitions AFTER page loads
 */
function allowTransitions() {
  document.onreadystatechange = () => {
    if (document.readyState === "complete") {
      console.log("page ready");
      document.querySelector(".preload").classList.remove("preload");
    }
  }
}