console.log("script app.js");

const findBtn = document.getElementById("find");
const searchInput = document.querySelector(".search-container");

const handleFindBtn = (e) => {
	e.preventDefault();
	searchInput.classList.toggle("hide");
};

findBtn.addEventListener("click", handleFindBtn);
