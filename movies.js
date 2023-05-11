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
    return fetch("./movies.txt")
   	.then( r => r.text() )
   	.then( text => {
    		let mvs = text.split("\n");
    		for (let i = mvs.length - 2; i >= 0; i--) {
			let mv = mvs[i].split(";");
			if (mv[0] && mv[1] && mv[2] && mv[3]) {
				let gens = mv[3].split(",");
				mvlist_recently_watched.push({
					title: mv[0],
					rating: mv[1],
					year: mv[2],
					genres: gens
				});
				gens.forEach(gen => genres.add(gen));
			}
    		}
	    	updateMovieEl(mvlist_recently_watched);
	    	createFilterOptions();
    	});
};
		
function stringSortFn(a,b) {
	if (a < b) {
		return -1;
	}
	if (a > b) {
		return 1;
	}
	return 0;
};

function sortMovieFn(a, b) {
	if (a.rating == b.rating) {
		return stringSortFn(a.title, b.title);
	} else {
		return parseFloat(b.rating) - parseFloat(a.rating);
	}
}

function sortMovies(mvs) {
  let menu = document.getElementById("sort_by");
  if (menu.value == 'title') {
    return mvs.sort((a,b) => stringSortFn(a.title, b.title));
  } else if (menu.value == 'release_year') {
    return mvs.sort((a,b) => {
	    if (a.year == b.year) {
		    return stringSortFn(a.title, b.title);
	    } else {
		    return parseInt(b.year) - parseInt(a.year);
	    }
    });
  } else if (menu.value == 'high_rated') {
    return mvs.sort(sortMovieFn);
  } else if (menu.value == 'low_rated') {
    return mvs.sort((a, b) => {
	    if (a.rating == b.rating) {
		    return stringSortFn(a.title, b.title);
	    } else {
		    return parseFloat(a.rating) - parseFloat(b.rating);
	    }
    });
  } else {
    return mvs;
  }
};

function filterGenre(mvs, genre) {
	if (genre == "all") {
		return mvs;
	}
	return mvs.filter(mv => mv.genres.includes(genre));
}

function updateMovies(event) {
	let genre = document.getElementById("genre_filter").value;
	let mvs = [...mvlist_recently_watched];
	mvs = filterGenre(mvs, genre);
	mvs = sortMovies(mvs);
	updateMovieEl(mvs);
}

function loadPage() {
	readMovieTextFile().then(() => {
		let menu = document.getElementById("sort_by");
		menu.addEventListener("change", updateMovies);
		let genre_filter = document.getElementById("genre_filter");
		genre_filter.addEventListener("change", updateMovies);
		document.body.style.visibility = "visible";
	});
}
loadPage();
