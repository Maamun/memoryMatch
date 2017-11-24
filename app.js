// VARIABLES
let btn = document.querySelector('#btn');
let container = document.querySelector('.container');
let postContainer = document.querySelector('.post');
let result = document.querySelector('#result');
let para = document.querySelector('#para');
let close = document.querySelector('#close');

// variable to clearInterval
let interval;

// variable to allow interval to be called just once
let started = false;

let time = 0;

// array to track number of cells clicked
let clickedArray = [];

// The application will eventually be temporarily unable to handle click events when an incorrect match attempt is made
let ready = true;

// tracks the number of cells that have been completed
let numCompleted = 0;

// Generate random Numbers // shuffle array
function randomNumbers() {
	let numbers = [1, 1, 2, 2, 3, 3, 4, 4, 5];
	numbers.sort(num => 0.5 - Math.random());
	return numbers;
}
// Set BG colors
function hoverInBg(cell) {
	cell.addEventListener('mouseenter', function(e) {
		if (this.clicked === false && this.completed === false) {
			cell.style.backgroundColor = '#EBEBD3';
		}
	});
}
function hoverOutBg(cell) {
	cell.addEventListener('mouseleave', function(e) {
		if (this.clicked === false && this.completed === false) {
			cell.style.backgroundColor = '#F7EBE8';
		}
	});
}
// Set timeCounter
function timeCounter() {
	if (started === false) {
		interval = setInterval(() => {
			time++;
			para.innerHTML = `Time Elapsed: ${
				time < 10 ? '0' + time : time
			} <span>s</span>`;
		}, 1000);
		started = true;
	}
}
// reveal cell when clicked
function revealCell(cell) {
	cell.innerHTML = cell.value;
	cell.style.backgroundColor = '#083D77';
	cell.clicked = true;
}
// hide cell if not completed
function hideCell(cell) {
	cell.innerHTML = '';
	cell.style.backgroundColor = '#F7EBE8';
	cell.clicked = false;
}
// handle cell when completed
function completeCell(cell) {
	numCompleted++;
	cell.style.backgroundColor = '#E54B4B';
	cell.completed = true;
}
// handle click event for cells
function clickHandler(cell) {
	cell.addEventListener('click', function(e) {
		if (ready === false) return;
		timeCounter();
		if (this.clicked === false && this.completed === false) {
			clickedArray.push(this);
			revealCell(this);
		}
		if (clickedArray.length === 2) {
			if (clickedArray[0].value === clickedArray[1].value) {
				//if a matching pair is found
				completeCell(clickedArray[0]);
				completeCell(clickedArray[1]);

				// if all pairs are found
				if (numCompleted === 8) {
					clickedArray[1].style.backgroundColor = '#E54B4B';
					postContainer.style.width = '100%';
					// change last cell BGC before the alert
					setTimeout(() => {
						clearInterval(interval);
						result.innerHTML = `You won in ${time} seconds!`;
						result.style.border = '6px solid white';
					}, 400);
				}
				clickedArray = [];
			} else {
				//if a matching pair is not found
				ready = false;
				container.style.animationName = 'gridShake';
				setTimeout(function() {
					hideCell(clickedArray[0]);
					hideCell(clickedArray[1]);
					clickedArray = [];
					container.style.animationName = '';
					ready = true;
				}, 500);
			}
		}
	});
}
// set up the grid
function setUp(cell) {
	let answers = randomNumbers();
	let grid = Array.from(document.querySelectorAll('li'));
	console.log(answers, grid);
	let gridCells = grid.map((cell, index) => {
		cell.clicked = false;
		cell.completed = false;
		cell.value = answers[index];
		hoverInBg(cell);
		hoverOutBg(cell);
		clickHandler(cell);
	});
	// select a specific cell with keyboard and trigger a click
	document.addEventListener('keydown', function(e) {
		if (e.key > 0 && e.key < 10) {
			grid[e.key - 1].click();
		}
	});
	// reload page after finishing the game
	btn.addEventListener('click', function(e) {
		location.reload();
	});
}
// event to close
close.addEventListener('click', ev => {
	postContainer.style.width = '0';
	ready = false;
});
setUp();
