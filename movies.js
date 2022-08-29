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
			name.innerHTML = mv[0];
			name.classList.add("c");
			let rtg = document.createElement("div"); 
			rtg.innerHTML = mv[1];
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
			if (mv[0] && mv[1]) {
				mvlist.push([mv[0], mv[1]]);
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
    updateMovieEl(mvlist.sort((a,b) => stringSortFn(a[0], b[0])));
  } else if (menu.value == 'high_rated') {
    updateMovieEl(mvlist.sort((a,b) => {
	    if (a[1] == b[1]) {
		    return stringSortFn(a[0], b[0]);
	    } else {
		    return parseFloat(b[1]) - parseFloat(a[1]);
	    }
    }));
  } else if (menu.value == 'low_rated') {
    updateMovieEl(mvlist.sort((a,b) => {
	    if (a[1] == b[1]) {
		    return stringSortFn(a[0], b[0]);
	    } else {
		    return parseFloat(a[1]) - parseFloat(b[1]);
	    }
    }));
  } else if (menu.value == 'recently_watched') {
    updateMovieEl(mvlist_recently_watched);
  } 
};
