
Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)];
};

function generateChain (text) {
    let listOfTokens = text.split(" ");
    let markovObject = {};
    let prev = null;
    for (let token of listOfTokens) {
        if (prev !== null) {
            if (prev in markovObject) {
                markovObject[prev].push(token);
            } else {
                markovObject[prev] = [token];
            }
        }
        prev = token;
    }
    return markovObject;
}

function generateText (markovObject, length, startToken=null) {
    let token;
    if (startToken === null) {
        token = Object.keys(markovObject).randomElement();
    } else {
        token = startToken;
    }
    let next;
    let new_text = [token];
    for (let i = 0; i < length; i++) {
        if (token in markovObject) {
            next = markovObject[token].randomElement();
        } else {
            token = Object.keys(markovObject).randomElement();
            next = markovObject[token].randomElement();
        }
        new_text.push(next);
        token = next;
    }
    return new_text.join(" ");
}