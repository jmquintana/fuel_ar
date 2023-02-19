console.log("script app.js");

const findBtn = document.getElementById("find");
const downBtn = document.getElementById("down");
const searchInput = document.querySelector(".search-container");

const handleFindBtn = (e) => {
	e.preventDefault();
	searchInput.classList.toggle("hide");
};

const handleDownBtn = (e) => {
	e.preventDefault();
	e.target.classList.toggle("rotated");
};

findBtn.addEventListener("click", handleFindBtn);
downBtn.addEventListener("click", handleDownBtn);
