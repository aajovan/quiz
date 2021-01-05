"use strict";

var globalUI = {
    quiz: "#quiz",
    btnNext: "#next",
    btnPrev: "#prev",
    btnCheckAns: "#checkAnswers",
    navigation: "#navigation",
    question: "#question",
    ansChecked: 'input[name="answer"]:checked',
    popup: '#popup'
};
var questions = generateRandomQuestions(4);
var questionCounter = 0;
var selections = [];
var quiz = $(globalUI.quiz);

// Display initial question

setupNavigation();
displayNext();

// Click handler for the 'next' button

$(globalUI.btnNext).on("click", function (e) {
    e.preventDefault();

    // Suspend click listener during fade animation

    if (quiz.is(":animated")) {
        return false;
    }
    choose();
    if (!alertUser()) {
        questionCounter++;
        displayNext();
    }

});

// Click handler for the 'prev' button

$(globalUI.btnPrev).on("click", function (e) {
    e.preventDefault();

    if (quiz.is(":animated")) {
        return false;
    }

    choose();
    if (!alertUser()) {
        questionCounter--;
        displayNext();
    }
});

// Click handler for the 'Check answers' button

$(globalUI.btnCheckAns).on("click", function (e) {
    e.preventDefault();

    if (quiz.is(":animated")) {
        return false;
    }

    $(globalUI.question).remove();
    var scoreElem = displayScore();
    quiz.append(scoreElem).fadeIn();
    $(globalUI.btnNext).hide();
    $(globalUI.btnPrev).hide();
    $(globalUI.btnCheckAns).hide();
    $(globalUI.navigation).hide();

});

//Click for question navigation button

$(globalUI.navigation)
    .find(".button")
    .on("click", function (e) {
        e.preventDefault();

        if (quiz.is(":animated")) {
            return false;
        }

        choose();
        if (!alertUser()) {
            questionCounter = parseInt($(this).find('.navItem').attr('href'));
            displayNext();
        }
    });

// Creates and returns the div that contains the questions and
// the answer selections

function createQuestionElement(index) {
    var qElement = $("<div>", {
        id: "question"
    });
    var header = $("<h2>Pitanje " + (index + 1) + ":</h2>");
    qElement.append(header);
    var radioButtons = createRadios(index);
    qElement.append(radioButtons);
    return qElement;
}

// Creates a list of the answer choices as radio inputs

function createRadios(index) {
    var radioList = $('<div class="inputGroup__container">');
    var item = null;
    var input = "";

    for (var i = 0; i < questions[index].choices.length; i++) {
        item = $('<div class="inputGroup">');

        if (selections[index] && selections[index].indexOf(i.toString()) !== -1) {
            input =
                '<input type="checkbox" name="answer" class="switch" checked value=' +
                i +
                " />";
        } else {
            input =
                '<input type="checkbox" name="answer" class="switch" value=' +
                i +
                " />";
        }

        input += '<label for="answer">' + questions[index].choices[i];
        +"</label>";
        item.append(input);
        radioList.append(item);
    }

    return radioList;
}

// Reads the user selection and pushes the value to an array

function choose() {
    var selectedAnswers = [];
    selections[questionCounter] = $(globalUI.ansChecked).val();
    $(globalUI.ansChecked).each(function () {
        var sThisVal = this.checked ? $(this).val() : "";
        selectedAnswers.push(sThisVal);
    });
    selections[questionCounter] = selectedAnswers;
}

// Displays next requested element

function displayNext() {
    quiz.fadeOut(function () {
        $(globalUI.question).remove();
        $(globalUI.btnCheckAns).hide();
        var nextQuestion = createQuestionElement(questionCounter);
        quiz.append(nextQuestion).fadeIn();
        setGivenAnswer()

        switch (questionCounter) {
            case 1:
                $(globalUI.btnPrev).show();
                break;

            case 0:
                $(globalUI.btnPrev).hide();
                $(globalUI.btnNext).show();
                break;

            case questions.length - 1:
                $(globalUI.btnNext).hide();
                $(globalUI.btnPrev).show();
                $(globalUI.btnCheckAns).show();
                checkAnswersvalid();
                $('input[name="answer"]').on("click", function (e) {
                    choose();
                    checkAnswersvalid();
                });
                break;

            default:
                $(globalUI.btnNext).show();
        }
    });
}

// Check if answer valid, at least 1

function checkAnswersvalid() {
    var notValid = false;

    if (alertUser() || selections.length < questions.length) {
        notValid = true;
    } else {
        for (var i = 0; i < questions.length; i++) {
            if (!selections || selections[i].length === 0) {
                notValid = true;
                break;
            }
        }
    }

    if (notValid) {
        $(globalUI.btnCheckAns).addClass("button-disabled");
    } else {
        $(globalUI.btnCheckAns).removeClass("button-disabled");
    }
}

// Alert if not correct num of answers

function alertUser() {

    if (
        selections[questionCounter] &&
        selections[questionCounter].length >
        (questionCounter + 3)
    ) {

        var displayMsg = "Moguće je odabrati " +
            (questionCounter + 3) +
            " odgovora na pitanju " +
            (questionCounter + 1)

        $(globalUI.popup).find('h3').html(displayMsg)
        $(globalUI.popup).fadeIn(300);
        setTimeout(function () {
            $(globalUI.popup).fadeOut(300);
        }, 2400);
        return true;
    }
    return false;
}

// TO DO - implement score

function displayScore() {
    var score = $("<p>Nije implementirano</p>");
    return score;
}

//Setup navigation buttons - questions

function setupNavigation() {
    var item = $(globalUI.navigation);

    for (var i = 0; i < questions.length; i++) {
        var navButton =
            '<div class="button"><a class="navItem" href="' + i + '">' + questions[i].question;
        +"</a></div>";
        item.append(navButton);
    }
}

function setGivenAnswer() {
    $(globalUI.navigation).find('.navItem').each(function (index) {
        if (selections[index] && selections[index].length > 0) {
            $(this).parent('div').addClass('button-active');
        } else {
            $(this).parent('div').removeClass('button-active');
        }
    })
}

// generate random question with 2-8 answers
// minimum 1 correct answer, maximum n+2

function generateRandomQuestion(questionNum) {
    var randomNum = Math.floor(Math.random() * (8 - (questionNum + 2)) + 1) + (questionNum + 2);
    var choices = [];
    for (var i = 1; i < randomNum + 1; i++) {
        choices.push(i)
    }
    return {
        question: "Pitanje " + questionNum,
        choices: choices,
    }
}

// generate array with random questions

function generateRandomQuestions(questions) {
    var result = [];
    for (var j = 0; j < questions; j++) {
        result.push(generateRandomQuestion(j + 1));
    }
    return result;
}
