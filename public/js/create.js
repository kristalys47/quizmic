//firestore.settings(settings);
var users = firestore.collection("users");
var groups = firestore.collection("groups");
var challenges = firestore.collection("challenges");
var username = firestore.collection("username");
var challengesArray = [];

//TODO: automatically fill answers

function createMain() {
    getUserChallengesQUERY()

}

function enableHint() {
    var show = !document.getElementById("hintEnable").checked;
    document.getElementById("hint").hidden = show;
    document.getElementById("hintname").hidden = show;
    document.getElementById("hint").value = "";

}

function enableOptions() {
    document.getElementById("options").hidden = !document.getElementById("optionsEnable").checked;
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
    document.getElementById("option3").value = "";
}

function trying() {
    createChallengeQUERY(
        document.getElementById('nameofchallenge').value,
        document.getElementById('url').value,
        document.getElementById('answer').value,
        document.getElementById('artist').value,
        document.getElementById('genre').value,
        document.getElementById('hint').value,
        document.getElementById('isPublic').checked,
        document.getElementById('option1').value,
        document.getElementById('option2').value,
        document.getElementById('option3').value,
        document.getElementById("optionsEnable").checked,
        document.getElementById("hintEnable").checked);
}

function clearCreateForm() {
    document.getElementById('nameofchallenge').value = "";
    document.getElementById('url').value = "";
    document.getElementById('answer').value = "";
    document.getElementById('artist').value = "";
    document.getElementById('genre').value = "";
    document.getElementById('isPublic').checked = false;
    document.getElementById("optionsEnable").checked = false;
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
    document.getElementById("option3").value = "";
    document.getElementById("options").hidden = true;
    document.getElementById("hintEnable").checked = false;
    document.getElementById("hint").value = "";
    document.getElementById("hint").hidden = true;
    document.getElementById("hintname").hidden = true;
}

function createButtonSections(challenge) {
    var div = document.createElement("div");
    div.className = "nodebuddyholder";

    var challengeName = document.createElement("p");
    challengeName.className = "challengeName";

    var assignButton = document.createElement("button");
    assignButton.className = "assignButton";

    var editButton = document.createElement("button");
    editButton.className = "editButton";
    editButton.onclick = function () {
        editChallenge(challenge, div, editButton, deleteButton, challengeName);
    };


    var deleteButton = document.createElement("button");
    deleteButton.className = "deleteButton";
    deleteButton.onclick = function () {
             deleteChallenge(challenge, div, editButton, deleteButton);

         };

    challengeName.innerHTML = challenge.challengeName;
    assignButton.innerHTML = "Assign";
    editButton.innerHTML = "Edit";
    deleteButton.innerHTML = "Delete";

    div.appendChild(challengeName);
    div.appendChild(assignButton);
    div.appendChild(editButton);
    div.appendChild(deleteButton);

    document.getElementById('indivualchallenges').appendChild(div);
}

function editChallenge(challenge, div, editButtons, deleteButtons, challengeName) {

    var confirmation = confirm("Are you sure you want to edit the challenge?");
    if (confirmation) {

        document.getElementById('nameofchallenge').value = challenge.challengeName;
        document.getElementById('url').value = challenge.youtubeID;
        document.getElementById('answer').value = challenge.song;
        document.getElementById('artist').value = challenge.artist;
        document.getElementById('genre').value = challenge.genre;


        document.getElementById('isPublic').checked = challenge.isPublic;

        document.getElementById("optionsEnable").checked = true;
        document.getElementById("options").hidden = false;
        document.getElementById("option1").value = challenge.options[0];
        document.getElementById("option2").value = challenge.options[1];
        document.getElementById("option3").value = challenge.options[2];

        var exist = (challenge.hint === "");
        document.getElementById("hintEnable").checked = !exist;
        document.getElementById("hint").hidden = exist;
        document.getElementById("hintname").hidden = exist;
        if(exist)
            document.getElementById("hint").value = "";
        else
            document.getElementById("hint").value = challenge.hint;

        document.getElementById("createchallengebutton").hidden =true;
        document.getElementById("cancelEdit").hidden = false;
        document.getElementById("summitEdit").hidden = false;

        document.getElementById("cancelEdit").onclick = function () {
            clearCreateForm();
            document.getElementById("createchallengebutton").hidden =false;
            document.getElementById("cancelEdit").hidden = true;
            document.getElementById("summitEdit").hidden = true;
        };

        document.getElementById("summitEdit").onclick = function () {
            var cname = document.getElementById('nameofchallenge').value;
            var url = document.getElementById('url').value;
            var song = document.getElementById('answer').value;
            var artist = document.getElementById('artist').value;
            var genre = document.getElementById('genre').value;
            var hint = document.getElementById('hint').value;
            var ispublic = document.getElementById('isPublic').checked;
            var opt1 = document.getElementById('option1').value;
            var opt2 = document.getElementById('option2').value;
            var opt3 = document.getElementById('option3').value;
            var optenable = document.getElementById("optionsEnable").checked;
            var hintenable = document.getElementById("hintEnable").checked;
            if(!checkTheInputForChallenges(cname, url, song, artist, genre, hint, ispublic, opt1, opt2, opt3, optenable, hintenable)){
                return;
            }
            document.getElementById("createchallengebutton").hidden =false;
            document.getElementById("cancelEdit").hidden = true;
            document.getElementById("summitEdit").hidden = true;
            var transaction = firestore.runTransaction(t => {
                return t.get(challenges.doc(challenge.id)).then(doc => {

                    var data = doc.data();
                    challenge.challengeName = cname;
                    challenge.youtubeID = url;
                    challenge.song = song;
                    challenge.artist = artist;
                    challenge.genre = genre;
                    challenge.hint = hint;
                    challenge.isPublic = ispublic;
                    challenge.options = [opt1, opt2, opt3];
                    challengeName.innerText = cname;

                    t.update(challenges.doc(challenge.id), {
                        challengeName: cname,
                        youtubeAPIid: url,
                        song: song,
                        artist: artist,
                        genre: genre,
                        hint: hint,
                        attempted: data.attempted,
                        rightlyAnswered: data.rightlyAnswered,
                        isPublic: ispublic,
                        options: [opt1, opt2, opt3],
                        creator: users.doc(sessionStorage.getItem("userID")),
                        date: data.date
                    })
                }).catch(err => {
                    console.log('Transaction failure:', err);
                });

            }).then(function () {
                console.log('Transaction success!');
            }).catch(err => {
                console.log('Transaction failure:', err);
            });
            clearCreateForm();
        };
    }
}

function deleteChallenge(challenge, div, editButtons, deleteButtons, challengeName) {

    var confirmation = confirm("Are you sure you want to delete the challenge?");
    if (confirmation) {
        var user = sessionStorage.getItem("userID");
        var transaction = firestore.runTransaction(t => {
            return t.get(users.doc(user))
                .then(doc => {
                    const ownChallenges = doc.data().ownChallenges;
                    var j = -1;
                    for (var i = 0; i < ownChallenges.length; i++) {
                        if (challenge.id === ownChallenges[i].id) {
                            j = i;
                            break;
                        }
                    }
                    if (j !== -1) {

                        ownChallenges.splice(j, 1);

                        t.update(users.doc(user), {ownChallenges: ownChallenges});

                        challenges.doc(challenge.id).delete().then(function () {
                            console.log("Challenge successfully deleted!");
                            editButtons.remove();
                            deleteButtons.remove();
                            div.remove();

                        }).catch(function (error) {
                            console.error("Error removing challenge: ", error);
                        });
                    }

                });

        }).then(function () {
            console.log('Transaction success!');
        }).catch(err => {
            console.log('Transaction failure:', err);
        });

    }
}

/**
 * Get challenges that were created by user that is signed in.
 */
function getUserChallengesQUERY() {

    var user = sessionStorage.getItem("userID");
    var query = users.doc(user);
    var ownChallengesIDs = [];
    query.get().then(function (results) {
        if (results.exists) {
            var ownChallenges = results.data().ownChallenges;

            ownChallenges.forEach(function (doc) {
                ownChallengesIDs.push(doc.id)
            });
        }
        else
            console.log("No documents found!");


        ownChallengesIDs.forEach(function (e) {
            var query = challenges.doc(e);
            query.get().then(function (results) {
                if (results.exists) {
                    var info = results.data();
                    var challen = Challenge(info.challengeName, info.youtubeAPIid, info.song, info.artist, info.genre,
                        info.hint, info.attempted, info.rightlyAnswered, info.isPublic, info.options, info.date, info.creator, e);
                    this.challengesArray.push(challen);
                    createButtonSections(challen);
                }
                else
                    console.log("No challenge was found with that ID!");

            }).catch(function (error) {
                console.log("Error getting challenge ID:", error);
            });
        });
    }).catch(function (error) {
        console.log("Error getting user owned challenges:", error);
    });

}

function checkTheInputForChallenges(challengeName, URL, songname, artist, genre, hint, isPublic, option1, option2, option3, optionsEnabled, hintEnabled){
    if (URL === "" || songname === "" || artist === "" || genre === "" || challengeName === "") {
        window.alert("The challenge cannot be created becuase of missing data");
        return false;
    }

    if (hintEnabled && hint === "") {
        window.alert("You should specify a hint otherwise you can uncheck it");
        return false;
    }

    if (optionsEnabled) {
        if (option1 === "" || option2 === "" || option3 === "") {
            window.alert("You are missing options! You can always uncheck the options and let us do it for you");
            return false;
        }

        var op1 = option1.toLowerCase();
        var op2 = option2.toLowerCase();
        var op3 = option3.toLowerCase();
        var answer = songname.toLowerCase();
        if (op1 === op2 || op1 === op3 || op2 === op3 || answer === op1 || answer === op2 || answer === op3) {
            window.alert("There are similar options, please use different options or use free from if you are out of ideas.");
            return false;
        }
    }

    if (!(URL.includes("https://www.youtube.com/watch?v="))) {
        window.alert("The URL tou are trying to insert is not valid.");
        return false;
    }
    return true;
}
/**
 * Create a challenge
 * @param URL the challenge URL
 * @param songname the name of the song
 * @param artist the artist of the song
 * @param genre the genre of the song
 * @param hint optional hint for the challenge
 * @param isPublic boolean value if the challenge would be shared publicly
 * @param option1 wrong option for challenge
 * @param option2 wrong option for challenge
 * @param option3 wrong option for challenge
 * @param challengeName name of the challenge
 * @param optionsEnabled the user gave the options
 * @param hintEnabled the user gave the hint
 */
function createChallengeQUERY(challengeName, URL, songname, artist, genre, hint, isPublic, option1, option2, option3, optionsEnabled, hintEnabled) {

    if(!checkTheInputForChallenges(challengeName, URL, songname, artist, genre, hint, isPublic, option1, option2, option3, optionsEnabled, hintEnabled)){
        return;
    }

//TODO: THe validation pf the youtube and make sure that you just have the id when it comes to saving the URL
    var creator = firebase.auth().currentUser.uid;
    var query = challenges.add({
        challengeName: challengeName,
        youtubeAPIid: URL,
        song: songname,
        artist: artist,
        genre: genre,
        hint: hint,
        attempted: 0,
        rightlyAnswered: 0,
        isPublic: isPublic,
        options: [option1, option2, option3],
        creator: users.doc(creator),
        date: new Date()
    }).then(function (e) {
        console.log(e);
        var transaction = firestore.runTransaction(t => {
            return t.get(users.doc(creator))
                .then(doc => {
                    const ownChallenges = doc.data().ownChallenges;
                    ownChallenges.push(challenges.doc(e.id));
                    t.update(users.doc(creator), {ownChallenges: ownChallenges});
                });
        }).then(result => {
            console.log('Transaction success!');
        }).catch(err => {
            console.log('Transaction failure:', err);
        });

        var challen = {
            challengeName: challengeName,
            youtubeID: URL,
            song: songname,
            artist: artist,
            genre: genre,
            hint: hint,
            attempted: 0,
            rightlyAnswered: 0,
            isPublic: isPublic,
            options: [option1, option2, option3],
            creator: users.doc(creator),
            date: new Date(),
            id: e.id
        };
        this.challengesArray.push(challen);
        createButtonSections(challen);
        clearCreateForm();

    })
}
