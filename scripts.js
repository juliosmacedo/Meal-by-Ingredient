const app = document.getElementById('root')
let request = new XMLHttpRequest()
let request2 = new XMLHttpRequest()
const container = document.createElement('div')
container.setAttribute('class', 'container')
app.appendChild(container)
const select = document.getElementById('ingredients');
const mealList = document.getElementById('mealList');
const get_meal_btn = document.getElementById('gobtn');
const chooseRecipeText = document.getElementById('h3');


request.open('GET', 'https://www.themealdb.com/api/json/v1/1/list.php?i=list', true)


request.onload = function () {
  var data = JSON.parse(this.response);
  let options = [];
  if (request.status >= 200 && request.status < 400) {
    for (let i=0; i<data.meals.length; i++) {
		options.push(`<option value='${data.meals[i].strIngredient}'>${data.meals[i].strIngredient}</option>`)
	}
  } else {
    const errorMessage = document.createElement('marquee')
    errorMessage.textContent = `Gah, it's not working!`
    app.appendChild(errorMessage)
  }
  select.innerHTML = options;
}

request.send()


//// TESTS //////

// get_meal_btn.addEventListener('click', () => {
//   const mealRequest = document.querySelector('#ingredients').value.replace(/ /g,"_");
//   const mealOptions = [];


//   for (let i=0; i<15; i++) {
//   fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mealRequest}`)
// 	.then(response => response.json())
// 	.then(data => mealOptions.push(`<li>${data.meals[i].strMeal}</li>`)) 
// }
//   console.log(mealOptions)
//   setTimeout (mealList.innerHTML = mealOptions, 3000)
// });




// Meal fetch and meal list creation // fetchData(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mealRequest}`)


get_meal_btn.addEventListener('click', () => {
  const mealRequest = document.querySelector('#ingredients').value.replace(/ /g,"_");
  const mealOptions = [];

  request2.open('GET', `https://www.themealdb.com/api/json/v1/1/filter.php?i=${mealRequest}`, true)
  request2.send()
  request2.onload = function () {
    var data = JSON.parse(this.response);
    
    if (request2.status >= 200 && request2.status < 400) {
	  chooseRecipeText.style.display = 'flex';
      for (let i=0; i<data.meals.length; i++) {
        mealOptions.push(`<button class="button-54" onclick="createMeal(${data.meals[i].idMeal})">${data.meals[i].strMeal}</button>`)
    }
    } else {
      const errorMessage = document.createElement('marquee')
      errorMessage.textContent = `Gah, it's not working!`
      app.appendChild(errorMessage)
    }
    mealList.innerHTML = mealOptions.join( "" );
  }
  
});



async function createMeal(qmeal) {

	const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${qmeal}`);
	const data = await response.json();
	const meal = data.meals[0]
		
	const ingredients = [];
	for(let i=1; i<=20; i++) {
		if(meal[`strIngredient${i}`]) {
			ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
		} else {
			break;
		}
	}
	
	const newInnerHTML = `
		<div class="row">
			<div class="columns five">
        <h1>${meal.strMeal}</h1>
				<img src="${meal.strMealThumb}" alt="Meal Image">
				<div class='pwrapper'>
				${meal.strCategory ? `<p><strong>Category:</strong> ${meal.strCategory}</p>` : ''}
				${meal.strArea ? `<p><strong>Area:</strong> ${meal.strArea}</p>` : ''}
				${meal.strTags ? `<p><strong>Tags:</strong> ${meal.strTags.split(',').join(', ')}</p>` : ''}
				</div>
				<h5>Ingredients:</h5>
				<ul>
					${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
				</ul>
			</div>
			<div class="columns seven">
			<h5>Instructions:</h5>
				<p>${meal.strInstructions}</p>
			</div>
		</div>
		${meal.strYoutube ? `
		<div class="row2">
			<h5>Video Recipe</h5>
			<div class="videoWrapper">
				<iframe width="420" height="315"
				src="https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}">
				</iframe>
			</div>
		</div>` : ''}
	`;
	
	container.innerHTML = newInnerHTML;
}


