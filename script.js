
const fileName = "cdliatf_unblocked.atf";

let chain;

function generateTablet (markovObject, length) {
    console.log("starting generateTablet");
    
    let token = Object.keys(markovObject)
        .filter(token => token.substring(1,3) == "&P").randomElement();

   
    let next;
    let new_text = [token];
    let push = true;

    let obverse = false;
    let reverse = false;
    let tablet = false;

    let lineDetect = /\d+'?\.$/;
    let lineCount = 1;

    for (let i = 0; i < length; i++) {
        push = true;
        if (token in markovObject) {
            next = markovObject[token].randomElement();
        } else {
            token = Object.keys(markovObject).randomElement();
            next = markovObject[token].randomElement();
        }

        // Count sequential lines
        if (lineDetect.test(next)) {
            next = next.replace(lineDetect, lineCount + ".");
            lineCount += 1;
        }

        // Check if we've already had an "@obverse"
        if (next.trim().substring(0,3) === "@ob") {
            if (obverse == false) {
                obverse = true;
                lineCount = 1;
            } else {
                push = false;
            }
        }

        // Check if we've already had an "@reverse"
        if (next.trim().substring(0,3) === "@re") {
            if (reverse == false) {
                reverse = true;
                lineCount = 1;
            } else {
                push = false;
            }
        }

        // Check if we've already had an "@tablet"
        if (next.trim().substring(0,3) === "@ta") {
            if (tablet == false) {
                tablet = true;
                lineCount = 1;
            } else {
                push = false;
            }
        }

        // Don't start a new text
        if (next.trim().substring(0,2) == "&P") {
            push = false;
        }

        // No blanks
        if (next.trim() === "") {
            push = false;
        }

        // No '>>' lines
        if (next.trim().substring(0,2) == ">>") {
            push = false;
        }

        if (push) {
            new_text.push(next);
            token = next;
        }
    }
    console.log("finished generateTablet");
    return new_text.join(" ");
}

function getFile () {
    console.log("starting getFile");
    fetch(fileName)
        .then(function(response) {
            return response.text();
        })
        .then(function(text) {
            chain = generateChain(text);
        })
        .then(function() {
            document.getElementById("genText").disabled = false;
        })
        .then(function() {
            console.log("finished getFile");
        });
    
}

function genText () {
    console.log("starting genText");
    let spinner = document.getElementById("spinner");
    spinner.style.visibility = "visible";
    let text;
    text = generateTablet(chain, 100);
    spinner.style.visibility = "hidden";
    document.getElementById("fakeText").innerHTML = text;
    console.log("finished genText"); 
}