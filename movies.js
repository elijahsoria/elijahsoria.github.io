let mvlist = [];
let mvlist_recently_watched = [];
let genres = new Set();

function createMovieRow(mv) {
	let name = document.createElement("div");
	name.innerHTML = mv.title;
	name.classList.add("c");
	let rtg = document.createElement("div"); 
	rtg.innerHTML = mv.rating;
	rtg.classList.add("c");
	let mvDiv = document.createElement("div");
	mvDiv.classList.add("r");
	mvDiv.appendChild(name);
	mvDiv.appendChild(rtg);
	let sub = document.createElement("div");
	sub.innerHTML = "(" + mv.year + ") - " + mv.genres.join(", ");
	sub.classList.add("sub");
	let wrapDiv = document.createElement("div");
	wrapDiv.appendChild(mvDiv);
	wrapDiv.appendChild(sub);
	return wrapDiv;
}

function updateMovieEl(mvs) {
	let listdiv = document.getElementById('movie-list');
	listdiv.innerHTML = "";
	for (let i = 0; i < mvs.length; i++) {
		listdiv.appendChild(createMovieRow(mvs[i]));
	}
};

function createFilterOptions() {
	let genreFilter = document.getElementById('genre_filter');
	for (const gen of genres) {
		let genDiv = document.createElement("option");
		genDiv.innerHTML = gen;
		genDiv.value = gen;
		genreFilter.appendChild(genDiv);
	}
};

function readMovieTextFile() {
    fetch("./movies.txt")
   	.then( r => r.text() )
   	.then( text => {
    		let mvs = text.split("\n");
    		for (let i = mvs.length - 2; i >= 0; i--) {
			let mv = mvs[i].split(";");
			if (mv[0] && mv[1] && mv[2] && mv[3]) {
				let gens = mv[3].split(",");
				mvlist.push({
					title: mv[0],
					rating: mv[1],
					year: mv[2],
					genres: gens
				});
				gens.forEach(gen => genres.add(gen));
			}
    		}
	        mvlist_recently_watched = [...mvlist];
	    	updateMovieEl(mvlist);
	    	createFilterOptions();
    	});
};
readMovieTextFile();
		
function stringSortFn(a,b) {
	if (a < b) {
			    return -1;
		    }
		    if (a > b) {
			    return 1;
		    } else {
			    return 0;
		    }
};

function sortMovieFn(a, b) {
	if (a.rating == b.rating) {
		return stringSortFn(a.title, b.title);
	} else {
		return parseFloat(b.rating) - parseFloat(a.rating);
	}
}

function sortMovies(event) {
  console.log("updating...");
  let menu = document.getElementById("sort_by");
  if (menu.value == 'title') {
    mvlist.sort((a,b) => stringSortFn(a.title, b.title));
  } else if (menu.value == 'high_rated') {
    mvlist.sort(sortMovieFn);
  } else if (menu.value == 'low_rated') {
    mvlist.sort((a, b) => {
	    if (a.rating == b.rating) {
		    return stringSortFn(a.title, b.title);
	    } else {
		    return parseFloat(a.rating) - parseFloat(b.rating);
	    }
    });
  }
  return filterGenre(null);
};

function filterGenre(event) {
	console.log("filtering genre...");
	let genre = document.getElementById("genre_filter").value;
	let mvs_filtered = [];
	if (document.getElementById("sort_by").value == "recently_watched") {
		if (genre == "all" ) {
			return updateMovieEl(mvlist_recently_watched);
		}
		mvs_filtered = mvlist_recently_watched.filter(mv => mv.genres.includes(genre));
	} else {
		if (genre == "all") {
			return updateMovieEl(mvlist);
		}
		mvs_filtered = mvlist.filter(mv => mv.genres.includes(genre));
	}
	return updateMovieEl(mvs_filtered);
};
