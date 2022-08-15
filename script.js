// Create namespace object:
const app = {};


// Create variables:

// adding namespace variables for network request
app.apiKey = '456f5962dee9f809c3786f2e86a7aa2b';
app.ts = '1'
app.hash = '80a29a2a84504afd414346b9b445084a';
app.baseUrl = 'http://gateway.marvel.com/v1/public/characters';

// adding html variables
$dropdown = $('#characterList');
$textBox = $('#characterInput');
$submit = $('#submit');
$display = $('#resultsBox');
$name = $('#characName')

// adding other namespace variables
app.comicsTotal;
app.comicsResults;



// Create namespace methods:

// this method will get the typed character names from MARVEL API
app.getCharacterNames = () => {
    const characterResponse = $.ajax({
        url: `${app.baseUrl}`,
        method: 'GET',
        dataType: 'json',
        data: {
            "nameStartsWith": `${app.search}`,
            "ts": app.ts,
            "apikey": app.apiKey,
            "hash": app.hash,
        },
    });
    return characterResponse;
}

// this method will get the comics for a characterID from MARVEL API
app.getComics = () => {
    const comicResponse = $.ajax({
        url: `${app.baseUrl}/${app.searchID}/comics`,
        method: 'GET',
        dataType: 'json',
        data: {
            "ts": app.ts,
            "apikey": app.apiKey,
            "hash": app.hash,
        },
    });
    return comicResponse;
}

// this method will add typed character names to the dropdown
app.populateDropdown = () => {
    // create event listener on keypress 
    $textBox.on('input', () => {
        // empty the $dropdown first
        $dropdown.empty();
        app.search = $textBox.val();
        // if the $textBox is empty, don't perform network request
        if (app.search.length === 0) {
            console.log("empty");
        // otherwise, perform network request
        } else {
            const characterNames = app.getCharacterNames();
            characterNames.then((response) => {
                // for each result, store the character name as a variable & character ID as another variable
                response.data.results.forEach((res) => {
                    const characterName = res.name;
                    const characterID = res.id;
                    // append the html 
                    const htmlToAppend = `
                    <option data-value="${characterID}" value="${characterName}"></option>
                    `;
                    $dropdown.append(htmlToAppend);
                });
            });
        } 
    });
}

// this method will display comics for a selected character name
app.displayComics = () => {
    // create event listener on click (of submit button)
    $submit.click(() => {
        // empty the $diplay and $name first
        $display.empty();
        $name.empty();
        // store selected character name & ID, and append character name to the html
        const value = $textBox.val();
        app.searchID = ($('#characterList [value="' + value + '"]').data('value'));
        const htmlAppendName = `
            <h3 class="characName">${value}</h3>
        `;
        $name.append(htmlAppendName);
        // perform network request to get comics (for selected characterID)
        const comics = app.getComics();
        comics.then((response) => {
            app.comicsTotal = response.data.total;
            // if there are no comics available, append "No Comic Available" to the html
            if (app.comicsTotal === 0) {
                const htmlAppend = `
                    <div>
                        <h4 class="comicTitle">No Comics Available</4>
                    </div>
                `;
                $display.append(htmlAppend);
                // clear out $textBox
                $textBox.val(""); 
            // otherwise, for each comic, store the title, description and image as a variable
            } else {
                app.comicsResults = response.data.results;
                app.comicsResults.forEach((res) => {
                    const comicTitle = res.title;
                    const comicSummary = res.description;
                    // if there is no image and description, append the title, "No Image Available" & "No Description Available" to the html
                    if (res.images[0] === undefined && comicSummary === null) {
                        const htmlToAppend = `
                            <div class="flexColumn">
                                <h4 class="comicTitle">${comicTitle}</h4>
                                <div>
                                    <p>No Image Available</p>
                                </div>
                                <p>No Description Available</p>
                            </div>
                        `;
                        $display.append(htmlToAppend); 
                    // if there is no image, append the title, description & "No Image Available" to the html
                    } else if (res.images[0] === undefined) {
                        const htmlToAppend = `
                            <div class="flexColumn">
                                <h4 class="comicTitle">${comicTitle}</h4>
                                <div>
                                    <p>No Image Available</p>
                                </div>
                                <p>${comicSummary}</p>
                            </div>
                        `;
                        $display.append(htmlToAppend); 
                    // if there is no description, append the title, & image to the html
                    } else if (comicSummary === null || comicSummary === "") {
                        const comicImg = res.images[0].path;
                        const htmlToAppend = `
                            <div class="flexColumn">
                                <h4 class="comicTitle">${comicTitle}</h4>
                                <div>
                                    <img src="${comicImg}/standard_medium.jpg" alt="front page of comic book">
                                </div>
                                <p>No Description Available</p>
                            </div>
                        `;
                        $display.append(htmlToAppend); 
                    // otherwise, append the description, title, & image to the html
                    } else {
                        const comicImg = res.images[0].path;
                        const htmlToAppend = `
                            <div class="flexColumn">
                                <h4 class="comicTitle">${comicTitle}</h4>
                                <div>
                                    <img src="${comicImg}/standard_medium.jpg" alt="front page of comic book">
                                </div>
                                <p>${comicSummary}</p>
                            </div>
                        `;
                        $display.append(htmlToAppend); 
                    }
                    // clear out $textBox
                    $textBox.val("");
                });
            }
        });
    });
}




// Create initialization code:
app.init = () => {
    app.populateDropdown();
    app.displayComics();
}


// Create document.ready function:
$(() => {
    app.init();
})



