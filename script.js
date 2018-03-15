const fileName = "cdliatf_unblocked.atf";

let chain;

let generateTablet = function (markovObject, length) {
    console.log("starting generateTablet");
    
    let token = Object.keys(markovObject)
        .filter(token => token.substring(1,3) == "&P").randomElement();

    let push = true;
    let next;
    let new_text = [token];
    let obverse = false;
    let reverse = false;
    let tablet = false;

    for (let i = 0; i < length; i++) {
        push = true;
        if (token in markovObject) {
            next = markovObject[token].randomElement();
        } else {
            token = Object.keys(markovObject).randomElement();
            next = markovObject[token].randomElement();
        }

        // Check if we've already had an "@obverse"
        if (next.trim().substring(0,3) === "@ob") {
            if (obverse == false) {
                obverse = true;
            } else {
                push = false;
            }
        }

        // Check if we've already had an "@reverse"
        if (next.trim().substring(0,3) === "@re") {
            if (reverse == false) {
                reverse = true;
            } else {
                push = false;
            }
        }

        // Check if we've already had an "@tablet"
        if (next.trim().substring(0,3) === "@ta") {
            if (tablet == false) {
                tablet = true;
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

        if (push) {
            new_text.push(next);
            token = next;
        }
    }
    console.log("finished generateTablet");
    return new_text.join(" ");
};

let getFile = function () {
    console.log("starting getFile");
    fetch(fileName)
        .then(r => r.text())
        .then(t => chain = generateChain(t))
        .then()
        .then(console.log("finished getFile"));
    setTimeout( () => {
        document.getElementById("genText").disabled = false;
    }, 150);
};

let genText = function () {
    console.log("starting genText");
    let spinner = document.getElementById("spinner")
    spinner.style.visibility = "visible";
    let text;
    text = generateTablet(chain, 100);
    spinner.style.visibility = "hidden";
    document.getElementById("fakeText").innerHTML = text;
    console.log("finished genText"); 
};