/*
_______________________________

Project HAMSTER v1.1
Made by Wilzzu
_______________________________

Script originally made for 
finding P2000 hamster patterns
on the Steam marketplace, but
can be used for finding any
patterns now!

Start by setting the
refresh value on the bottom
and pasting this script to your
browser's developer console

- 3-5 seconds is recommended
when there's less than 10 pages

- 15 seconds is recommended
when there's more than 10 pages

_______________________________
*/

clear();
const hamster = () => {
	// Global values
	let item = undefined;
	let listings = document.getElementById("searchResultsRows").children.length - 1;
	let style =
		"font-weight: bold; font-size: 50px;color: white; text-shadow: 3px 3px 0 rgb(217,31,38), 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)";
	let tries = 0;

	const search = () => {
		// Search for listings
		if (item && item.length >= listings) {
			// When all listings are loaded search for certain paint seed
			console.log("%cLoaded all " + item.length + " listings!", "color: LightGreen");
			let found = false;
			for (i = 0; i < item.length; i++) {
				// Show notification when correct paint seed is found
				if (pattern.includes(parseInt(item[i].innerText.split(" ")[3]))) {
					found = true;
					console.log("%c PATTERN FOUND!!", style);
				}

				// Delete all the wrong paint seeds
				else {
					item[i].getRootNode().host.parentElement.parentElement.style.display = "none";
				}
			}

			// If no correct paint seed is found from the page try going to the next one
			if (!found) {
				let curPage = document.querySelector(".active").innerText;
				let newPage = curPage;
				console.log(
					"%cNo patterns found :(\n" + "%cChanging page in " + refreshTime + " seconds",
					"color: LightCoral",
					"color: DodgerBlue"
				);

				setTimeout(() => {
					document.getElementsByClassName("pagebtn")[1].click();
					let tries = 0;
					let retries = 0;
					let failed = false;
					let manual = false;

					// Listen for page change
					let interval = setInterval(() => {
						if (curPage == newPage && !manual) {
							tries++;
							console.log("%cTrying to load next page...", "color: Orange");
							newPage = document.querySelector(".active").innerText;

							// If page hasn't changed after 20 tries try changing it again
							// If that doesn't work skip the page and try the next one
							// If that also fails send an error message
							if (tries >= 20) {
								tries = 0;
								retries++;
								if (retries >= 2 && !failed) {
									retries = 0;
									failed = true;
									console.log(
										"%cFailed to load page " +
											document.querySelector(".active").nextElementSibling.innerText +
											"%c\nTrying to load page " +
											document.querySelector(".active").nextElementSibling.nextElementSibling
												.innerText +
											"next",
										"color: LightCoral",
										"color: DodgerBlue"
									);
									document.querySelector(".active").nextElementSibling.nextElementSibling.click();
								} else if (retries >= 2) {
									console.log(
										"%cFailed to load the next two pages, try loading them manually",
										"color: LightCoral"
									);
									manual = true;
								} else {
									console.log("%cRestarting page load", "color: DodgerBlue");
									document.getElementsByClassName("pagebtn")[1].click();
								}
							}
						} else if (curPage == newPage) {
							newPage = document.querySelector(".active").innerText;
						} else {
							clearInterval(interval);
							hamster();
						}
					}, 500);
				}, 1000 * refreshTime);
			}
		} else {
			let fail = false;
			let paint = [];
			for (i = 1; i <= listings; i++) {
				let info = document
					.getElementById("searchResultsRows")
					.children[i].getElementsByClassName("market_listing_item_name_block")[0]
					.querySelector("csfloat-item-row-wrapper");
				if (info) paint.push(info.shadowRoot.querySelector("div"));
			}

			for (j = 0; j < paint.length; j++) {
				if (
					paint[j].innerText.split(" ").length >= 4 &&
					paint[j].innerText.split(" ")[3].length <= 0
				) {
					fail = true;
					break;
				}
			}
			if (!fail) {
				item = paint;
				search();
			} else {
				if (tries >= 1000) {
					console.log("%cFailed to load listings, try refreshing the page", "color: LightCoral");
				} else
					setTimeout(() => {
						console.log("%cLoading listings...", "color: DodgerBlue");
						tries++;
						let scrollingElement = document.scrollingElement || document.body;
						scrollingElement.scrollTop = scrollingElement.scrollHeight;
						search();
					}, 100);
			}
		}
	};
	search();
};

// Set custom refresh time and pattern(s) by changing the values below
//--------------------------------------------------------------------

let refreshTime = 15;
let pattern = [125, 555, 583];

//--------------------------------------------------------------------

// Start script
hamster();
