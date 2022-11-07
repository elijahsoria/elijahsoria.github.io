let mvlist = [];
let mvlist_recently_watched = [];

function updateMovieEl(mvs) {
	let listdiv = document.getElementById('movie-list');
	listdiv.innerHTML = "";
	for (let i = 0; i < mvs.length; i++) {
			let mv = mvs[i];
			let mvDiv = document.createElement("div");
			mvDiv.classList.add("r");
			let name = document.createElement("div");
			name.innerHTML = mv.title;
			name.classList.add("c");
			let rtg = document.createElement("div"); 
			rtg.innerHTML = mv.rating;
			rtg.classList.add("c");
			mvDiv.appendChild(name);
			mvDiv.appendChild(rtg);
			listdiv.appendChild(mvDiv);
    		}
};

function createMovieList() {
    fetch("./movies.txt")
   	.then( r => r.text() )
   	.then( text => {
    		let mvs = text.split("\n");
    		for (let i = mvs.length - 2; i >= 0; i--) {
			let mv = mvs[i].split(";");
			if (mv[0] && mv[1] && mv[2] && mv[3]) {
				mvlist.push({
					title: mv[0],
					rating: mv[1],
					year: mv[2],
					genres: mv[3].split(",") 
				});
			}
    		}
	        mvlist_recently_watched = [...mvlist];
	        updateMovieEl(mvlist);
    	});
};
createMovieList();
		
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

function sortMovies(event) {
  console.log("updating...");
  let menu = document.getElementById("sort_by");
  if (menu.value == 'title') {
    updateMovieEl(mvlist.sort((a,b) => stringSortFn(a.title, b.title)));
  } else if (menu.value == 'high_rated') {
    updateMovieEl(mvlist.sort((a,b) => {
	    if (a.rating == b.rating) {
		    return stringSortFn(a.title, b.title);
	    } else {
		    return parseFloat(b.rating) - parseFloat(a.rating);
	    }
    }));
  } else if (menu.value == 'low_rated') {
    updateMovieEl(mvlist.sort((a,b) => {
	    if (a.rating == b.rating) {
		    return stringSortFn(a.title, b.title);
	    } else {
		    return parseFloat(a.rating) - parseFloat(b.rating);
	    }
    }));
  } else if (menu.value == 'recently_watched') {
    updateMovieEl(mvlist_recently_watched);
  } 
};
