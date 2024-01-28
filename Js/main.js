let mealData = document.getElementById("mealData");
let searchContainer = document.getElementById("search");
let submitBtn;


// open nav
function openNav() {
    $(".side-nav").animate({
        left: 0
    }, 500);

    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");

    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}


//close nav
function closeNav() {
    let navMenuWidth = $(".side-nav .nav-menu").outerWidth();
    $(".side-nav").animate({
        left: - navMenuWidth
    }, 500);

    $(".open-close-icon").removeClass("fa-x");
    $(".open-close-icon").addClass("fa-align-justify");


    $(".links li").animate({
        top: 300
    }, 500);
}

closeNav();

//toggle between open and close 
$(".side-nav .nav-head i.open-close-icon").click(function() {
    if($(".side-nav").css("left") == "0px") {
        closeNav();
    }else {
        openNav();
    }
});

// search
function showSearchInputs() {
    searchContainer.innerHTML = `
    <div class="row py-4 ms-4">
        <div class="col-md-6 mb-4">
            <input onkeyup="searchByName(this.value)" type="text" class="form-control bg-transparent text-white" placeholder="Search By Meal Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" type="text" class="form-control bg-transparent text-white" maxlength="1" placeholder="Search By Meal First Letter">
            <!-- maxlength attribute specifies the maximum number of characters allowed in the <input> element. -->
        </div>
    </div>`
    mealData.innerHTML = ""
}


async function searchByName(inputValue) {
    closeNav();
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`);
    response = await response.json();
    let meals = response.meals;
    // console.log(meals);
    $(".inner-loading").fadeOut(300);
    meals ? displayMeals(meals) : displayMeals([]);
}


async function searchByFLetter(inputLetter) {
    closeNav();
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    inputLetter == "" ? inputLetter = "a" : ""; // default
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${inputLetter}`)
    response = await response.json();
    let meals = response.meals;
    // console.log(meals);
    $(".inner-loading").fadeOut(300);
    meals ? displayMeals(meals) : displayMeals([]);
}

// 
async function searchEmpty() {
    searchByName("");
}

$(".logo").click(function() {
    searchEmpty();
})

$(document).ready(function() {
    searchEmpty();
    $(".loading").fadeOut(500);
    $("body").css("overflow", "visible");
});


// Categories
async function getCategories() {
    $("#search").html("");
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    response = await response.json();
    // console.log(response);
    let categories = response.categories;
    // console.log(categories);
    $(".inner-loading").fadeOut(300);
    displayCategories(categories);
}

function displayCategories(category) {
    let categories = "";
    for (i = 0; i < category.length ; i++) {
        categories += `
        <div class="col-md-4 col-lg-3">
        <div onclick="getCategoryMeals('${category[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img class="w-100 img-fluid" src="${category[i].strCategoryThumb}" alt="meal image">
            <div class="meal-layer position-absolute text-center text-black p-2">
                <h3>${category[i].strCategory}</h3>
                <p>${category[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>
    </div>`
    }
    $("#mealData").html(categories);
}

/* - split(Separator المكان الي هيبدا من عندة التقسيم [Opt], Limit the number of splits. Items after the limit are excludedمستبعد  [Opt])
The split() method splits a string into an array of substrings.
The split() method returns the new array.
split(" ") => ['word', 'word', 'word']

slice() method returns selected elements in an array, as a new array.
slice(Start [Mand], End [Opt] (Not Include End يعني رقم النهايه الي بتكتبة بياخد الرقم الي قبله)) يقطع 

join() method returns an array as a string. array.join(separator)
separator (Opt)).The separator to be used. Default is a comma. (A string)
*/

// get meals by category
async function getCategoryMeals(mealcategory) {
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${mealcategory}`);
    response = await response.json();
    // console.log(response);
    // display 20 meal
    let meals = response.meals.slice(0, 20);
    // console.log(meals);
    $(".inner-loading").fadeOut(300);
    displayMeals(meals);
}


function displayMeals(meals) {
    let meal = "";
    for (let i = 0; i < meals.length; i++) {
        meal += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${meals[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${meals[i].strMealThumb}" alt="meal image">
                    <div class="meal-layer catogry-meal position-absolute d-flex justify-content-center align-items-center text-black p-2">
                        <h3 class="text-center">${meals[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    $("#mealData").html(meal);
}


// get meal details by idMeal
async function getMealDetails(mealID) {
    closeNav();
    $("#search").html("");
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();
    // console.log(respone);
    let mealsdetails = respone.meals[0];
    // console.log(mealsdetails);
    $(".inner-loading").fadeOut(300);
    displayMealDetails(mealsdetails);
}


function displayMealDetails(mealsdetails) {
    $("#search").html("");

    let ingredients = ``;
    for (let i = 1; i <= 20; i++) {
        if (mealsdetails[`strIngredient${i}`]) {
            ingredients += `
            <li class="alert alert-info m-2 p-1">${mealsdetails[`strMeasure${i}`]} ${mealsdetails[`strIngredient${i}`]}</li>
            `
        }
    }

    let tags = mealsdetails.strTags?.split(","); // لو كانت موجودة نقسمها
    if (!tags) tags = []; //array لو كانت التجات مش فاضيه نضعها في 

    let tagsStr = '';
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-2">${tags[i]}</li>`
    }

    let details = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${mealsdetails.strMealThumb}" alt="">
                    <h2 class="mt-4 text-center detail">${mealsdetails.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h3>Instructions</h3>
                <p class="detail">${mealsdetails.strInstructions}</p>
                <h3 class="area-detail"><span class="fw-bolder">Area : </span>${mealsdetails.strArea}</h3>
                <h3 class="area-detail"><span class="fw-bolder">Category : </span>${mealsdetails.strCategory}</h3>
                <h3 class="area-detail">Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>
                <h3 class="area-detail">Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>
                <a target="_blank" href="${mealsdetails.strSource}" class="btn btn-success me-3">Source</a>
                <a target="_blank" href="${mealsdetails.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    $("#mealData").html(details);
}



// get Area
async function getArea() {
    $("#search").html("");
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    respone = await respone.json();
    let area = respone.meals;
    // console.log(area);
    $(".inner-loading").fadeOut(300);
    displayArea(area);
}


function displayArea(area) {
    let areaBox = "";
    for (let i = 0; i < area.length; i++) {
        areaBox += `
        <div class="col-md-3">
        <div onclick="getAreaMeals('${area[i].strArea}')" class="rounded-2 text-center text-white cursor-pointer">
                <i class="fa-solid fa-house-laptop fa-3x mb-3"></i>
                <h3 class="area">${area[i].strArea}</h3>
        </div>
    </div>`
    }

    $("#mealData").html(areaBox);
}


// get meals by area
async function getAreaMeals(mealsArea) {
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${mealsArea}`);
    response = await response.json();
        // display 20 meal
        let meals = response.meals.slice(0, 20);
        // console.log(meals);
    $(".inner-loading").fadeOut(300);
    displayMeals(meals);
}


//Ingredient
async function getIngredients() {
    $("#search").html("");
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    response = await response.json();
        // display 20 meal
        let meals = response.meals.slice(0, 20);
        // console.log(meals);
    $(".inner-loading").fadeOut(300);
    displayIngredients(meals);
}

function displayIngredients(mealsIngredient) {
    let ingredientbox = "";
    for (let i = 0; i < mealsIngredient.length; i++) {
        ingredientbox += `
        <div class="col-md-4 col-lg-3">
            <div onclick="getIngredientsMeals('${mealsIngredient[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                    <i class="fa-solid fa-drumstick-bite fa-4x mb-3"></i>
                    <h3>${mealsIngredient[i].strIngredient}</h3>
                    <p class="desc">${mealsIngredient[i].strDescription.split(" ").slice(0,20).join(" ")} .....</p>
            </div>
        </div>`
    }
    $("#mealData").html(ingredientbox);
}


async function getIngredientsMeals(ingredients) {
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
    response = await response.json();
        // display 20 meal
        let meals = response.meals.slice(0, 20);
        // console.log(meals);
    $(".inner-loading").fadeOut(300);
    displayMeals(meals);
}




// Contact Us
function showContact() {
    mealData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `

    submitBtn = document.getElementById("submitBtn");
    
    document.getElementById("nameInput").addEventListener("focus", () => {
        nameTouched = true;
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailTouched = true;
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneTouched = true;
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageTouched = true;
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordTouched = true;
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordTouched = true;
    })
}

// default focus in inputs is false
let nameTouched = false;
let emailTouched = false;
let phoneTouched = false;
let ageTouched = false;
let passwordTouched = false;
let repasswordTouched = false;


// validation (regex)
function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value));
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value));
}
/* 
    < matches the character <
    > matches the character >
    ( matches the character (
    ) matches the character )
    [ matches the character [
    \] matches the character ]
    \\ matches the character \
    . matches the character .
    , matches the character ,
    ; matches the character ;
    : matches the character :
    \s matches any whitespace character
    @ matches the character @
    " matches the character "
    \- matches the character - 
    \. matches the character . 

    ([^<>()[\]\\.,;:\s@"]+ ===== + matches the previous token between one and unlimited times {1,}
    * matches the previous token between zero and unlimited times {0,}
    (".+") " matches the character " 
    . matches any character

(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))
    matches a sequence of one or more characters that are not <, >, (, ), [, ], , ., , ;, :, \s, @, or ", followed by zero
    or more sequences of a dot and one or more characters that are not <, >, (, ), [, ], , ., , ;, :, \s, @, or ".
    This allows for dots to appear in the local part, but not consecutively or at the beginning or end.

the expression ((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\]) matches any string that is a valid IP address enclosed in square brackets,
    such as [192.168.0.1] or [127.0.0.1].

    the expression ([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}) matches any string that is a valid domain name,
    such as example.com or bing.co.uk.

*/

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value));
}

/* 
? matches the previous token between zero and one times
\+ matches the character + 
matches any string that is a valid phone number, such as:
+1(800)123-4567
800-123-4567
800.123.4567
800 123 4567
8001234567
*/


function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value));
}
/* the expression ^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$ matches any string that is a valid number from
 1 to 200, */

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value));
}

/*
    . matches any character
    \d matches a digit (equivalent to [0-9])
    positive lookahead regex is a type of assertion that checks if a certain pattern exists after the current position in the input string,
    but does not consume any characters. It has the syntax (?=pattern), where pattern is any valid regex expression
    
    the expression ^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$ matches any string that has at least one digit,
    at least one lower-case letter, and a length of at least eight characters, and consists of only digits and letters
    
    */

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value;
}

function inputsValidation() {

    if (nameTouched) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block");
        }
    }

    if (emailTouched) {
        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block");
        }
    }

    if (phoneTouched) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block");
        }
    }

    if (ageTouched) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block");
        }
    }

    if (passwordTouched) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block");
        }
    }
    if (repasswordTouched) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block");
        }
    }

    if (nameValidation() && emailValidation() && phoneValidation() && ageValidation() &&
    passwordValidation() && repasswordValidation()) {
    submitBtn.removeAttribute("disabled");
    } else {
    submitBtn.setAttribute("disabled", true);
}

}


// Events
$(".show-search").click(function() {
    showSearchInputs();
    closeNav();
});

$(".categories").click(function() {
    getCategories();
    closeNav();
});

$(".meals-area").click(function() {
    getArea();
    closeNav();
});

$(".meals-Ingredients").click(function() {
    getIngredients();
    closeNav();
});

$(".show-contact").click(function() {
    showContact();
    closeNav();
});

