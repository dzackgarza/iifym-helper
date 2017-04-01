function makeGoogleRequest(lat, long) {
    var request = {
        location: new google.maps.LatLng(lat, long),
        radius: '1000',
        types: ['food']
    };

    var container = document.getElementById('results');

    var service = new google.maps.places.PlacesService(container);
    service.nearbySearch(request, (results, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
            	let n = results[i].name.replace(/'/g, '');

                container.innerHTML += `<a href='javascript:lookup(\"${n}\")'>${n}</a> <br />`;
            }
        }
    });
}

function getLocation() {
    let x = document.getElementById("demo");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            x.innerHTML = `Latitude: ${position.coords.latitude}<br> 
            	Longitude: ${position.coords.longitude}`;
            makeGoogleRequest(position.coords.latitude, position.coords.longitude)
        });
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function lookup(item) {
	let domElt = document.getElementById("dishes");
	var htmlString = "";
	if (foodLookup[item] == null) {
		 htmlString += "Not in database."
	} else {
		for (var o of foodLookup[item].sort((a,b) => a.calories - b.calories)){
			htmlString += `
				<details><summary>${o.name}</summary>
				<ul>
					<li>Calories: ${o.calories}</li>
					<li>Protein: ${o.protein}</li>
					<li>Carbohydrates: ${o.carbs}</li>
					<li>Fat: ${o.fat}</li>
				</ul>
				</details>`
		}
	}
	dishes.innerHTML = htmlString;
}

let parseDictionary = function() {
	let domElt = document.getElementById("fullDatabase"),
		htmlString = "";
	for(var k of Object.keys(foodLookup)){
		htmlString += `
		<details>
		<summary>${k}</summary>
		<ul>
		`;
		for (var o of foodLookup[k]){
			htmlString += `
			<li>
				<details><summary>${o.name}</summary>
				<ul>
					<li>Calories: ${o.calories}</li>
					<li>Protein: ${o.protein}</li>
					<li>Carbohydrates: ${o.carbs}</li>
					<li>Fat: ${o.fat}</li>
				</ul>
				</details>
			</li>`
		}
		htmlString += `</ul></details>`
	}
	domElt.innerHTML = htmlString;
}

function expandAll(containerElement) {
    $(containerElement).find("details").each(function () {
    	let attr = $(this).attr('open');
    	let isOpen = (typeof attr !== typeof undefined && attr !== false)
        if (!isOpen) $(this).find("summary").click();
    });
}
function collapseAll(containerElement) {
    $(containerElement).find("details").each(function () {
    	let attr = $(this).attr('open');
    	let isOpen = (typeof attr !== typeof undefined && attr !== false)
        if (isOpen) $(this).find("summary").click();
    });
}


getLocation();
parseDictionary();