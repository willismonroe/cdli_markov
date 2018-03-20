


let chain;

function generateTablet(markovObject, length, token = null, atf = true) {
    console.log("starting generateTablet");
    let new_text = [];
    if (token === null) {
        token = Object.keys(markovObject)
            .filter(token => token.substring(1, 3) == "&P").randomElement();
        new_text = [token];
    } else {
        new_text = ["1:"];
    }

    let next;

    let push = true;

    let obverse = false;
    let reverse = false;
    let tablet = false;

    let lineDetect = /\d+'?\.$/;
    let transPrefix = /#tr\.en:/;
    let lineCount = 1;

    for (let i = 0; i < length; i++) {
        push = true;
        if (token in markovObject) {
            next = markovObject[token].randomElement();
        } else {
            token = Object.keys(markovObject).randomElement();
            next = markovObject[token].randomElement();
        }

        // Only do this if the user requested an ATF file
        if (atf) {        
            // Count sequential lines
            if (lineDetect.test(next)) {
                next = next.replace(lineDetect, lineCount + ".");
                lineCount += 1;
            }

            // Check if we've already had an "@obverse"
            if (next.trim().substring(0, 3) === "@ob") {
                if (obverse == false) {
                    obverse = true;
                    lineCount = 1;
                } else {
                    push = false;
                }
            }

            // Check if we've already had an "@reverse"
            if (next.trim().substring(0, 3) === "@re") {
                if (reverse == false) {
                    reverse = true;
                    lineCount = 1;
                } else {
                    push = false;
                }
            }

            // Check if we've already had an "@tablet"
            if (next.trim().substring(0, 3) === "@ta") {
                if (tablet == false) {
                    tablet = true;
                    lineCount = 1;
                } else {
                    push = false;
                }
            }

            // Don't start a new text
            if (next.trim().substring(0, 2) == "&P") {
                push = false;
            }

            // No blanks
            if (next.trim() === "") {
                push = false;
            }

            // No '>>' lines
            if (next.trim().substring(0, 2) == ">>") {
                push = false;
            }
        }
        console.log("(" + next + ")");
        if (atf === false && transPrefix.test(next))
        {
            // If we're just doing english get ride of the "#tr.en"
            let lineStart = next.replace(transPrefix, lineCount + ":");
            lineCount += 1;
            new_text.push(lineStart);
            push = false;
            token = next;
        }

        if (push) {
            new_text.push(next);
            token = next;
        }
    }
    console.log("finished generateTablet");
    return new_text.join(" ");
}

function getFile() {
    let fileName = "cdliatf_unblocked.atf";
    if (document.getElementById("onlyEnglish").checked) {
        fileName = "cdlitranslations.txt";
    }
    console.log("starting getFile");
    fetch(fileName)
        .then(function (response) {
            return response.text();
        })
        .then(function (text) {
            chain = generateChain(text);
        })
        .then(function () {
            document.getElementById("genText").disabled = false;
        })
        .then(function () {
            console.log("finished getFile");
        });
}

function genText() {
    let length = 100;
    let atf = true;
    let token = null
    if (document.getElementById("onlyEnglish").checked) {
        atf = false;
        length = 150;
        token = "#tr.en:";
    }
    console.log("starting genText");
    let spinner = document.getElementById("spinner");
    spinner.style.visibility = "visible";
    let text;
    text = generateTablet(chain, length, token, atf);
    spinner.style.visibility = "hidden";
    document.getElementById("fakeText").innerHTML = text;
    console.log("finished genText");
}