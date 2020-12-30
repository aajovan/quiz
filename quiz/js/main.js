(function () {
    var questions = [{
        question: "question 1",
        choices: [1, 2, 3, 4, 5, 6, 7],
        correctAnswer: [2, 5, 10]
    }, {
        question: "question 2",
        choices: [1, 2, 3, 4, 5, 6, 7],
        correctAnswer: [2, 5, 10, 7]
    }, {
        question: "question 3",
        choices: [1, 2, 3, 4, 5, 6, 7],
        correctAnswer: [2, 5, 10, 6, 1]
    }, {
        question: "question 4",
        choices: [1, 2, 3, 4, 5, 6, 7],
        correctAnswer: [2, 5, 10, 3, 10, 8]
    }];

    var questionCounter = 0; //Tracks question number
    var selections = []; //Array containing user choices
    var quiz = $('#quiz'); //Quiz div object

    // Display initial question
    setupNavigation();
    displayNext();

    // Click handler for the 'next' button
    $('#next').on('click', function (e) {
        e.preventDefault();

        // Suspend click listener during fade animation
        if (quiz.is(':animated')) {
            return false;
        }
        choose();
        questionCounter++;
        displayNext();

    });

    // Click handler for the 'prev' button
    $('#prev').on('click', function (e) {
        e.preventDefault();

        if (quiz.is(':animated')) {
            return false;
        }
        choose();
        questionCounter--;
        displayNext();
    });

    // Click handler for the 'Check answers' button
    $('#checkAnswers').on('click', function (e) {
        e.preventDefault();

        if (quiz.is(':animated')) {
            return false;
        }
        $('#question').remove();
        var scoreElem = displayScore();
        quiz.append(scoreElem).fadeIn();
        $('#next').hide();
        $('#prev').hide();
        $('#checkAnswers').hide();
    });
    //Click for question navigation button
    $('#navigation').find('.button').on('click', function (e) {
        e.preventDefault();

        if (quiz.is(':animated')) {
            return false;
        }
        choose();
        questionCounter = Number.parseInt($(this).find('a').attr('href'));
        displayNext();
    });

    // Creates and returns the div that contains the questions and 
    // the answer selections
    function createQuestionElement(index) {
        var qElement = $('<div>', {
            id: 'question'
        });

        var header = $('<h2>Question ' + (index + 1) + ':</h2>');
        qElement.append(header);

        var question = $('<p>').append(questions[index].question);
        qElement.append(question);

        var radioButtons = createRadios(index);
        qElement.append(radioButtons);

        return qElement;
    }

    // Creates a list of the answer choices as radio inputs
    function createRadios(index) {
        var radioList = $('<div class="inputGroup__container">');
        var item;
        var input = '';
        for (var i = 0; i < questions[index].choices.length; i++) {
            item = $('<div class="inputGroup">');
            if (selections[index] && selections[index].includes(i.toString())) {
                input = '<input type="checkbox" name="answer" class="switch" checked value=' + i + ' />';
            } else {
                input = '<input type="checkbox" name="answer" class="switch" value=' + i + ' />';
            }
            input += '<label for="answer">' + questions[index].choices[i]; +'</label>';
            item.append(input);
            radioList.append(item);
        }
        return radioList;
    }

    // Reads the user selection and pushes the value to an array
    function choose(hideWarning) {
        var selectedAnswers = [];
        selections[questionCounter] = $('input[name="answer"]:checked').val();
        $('input[name="answer"]:checked').each(function () {
            var sThisVal = (this.checked ? $(this).val() : "");
            selectedAnswers.push(sThisVal);
        });
        selections[questionCounter] = selectedAnswers;
        // Alert if not correct num of answers
        if (!hideWarning && (selections[questionCounter]) && (selections[questionCounter].length < questions[questionCounter].correctAnswer.length)) {
            alert('Potrebno je odabrati ' + questions[questionCounter].correctAnswer.length + ' odgovora na pitanju ' + (questionCounter + 1));
        }
    }

    // Displays next requested element
    function displayNext() {
        quiz.fadeOut(function () {
            $('#question').remove();
            $('#checkAnswers').hide();
            if (questionCounter < questions.length) {

                var nextQuestion = createQuestionElement(questionCounter);
                quiz.append(nextQuestion).fadeIn();
                if (questionCounter === 1) {
                    $('#prev').show();
                } else if (questionCounter === 0) {
                    $('#prev').hide();
                    $('#next').show();
                } else if (questionCounter === questions.length - 1) {

                    $('#next').hide();
                    $('#prev').show();
                    $('#checkAnswers').show();
                    checkAnswersvalid();
                    $('input[name="answer"]').on('click', function (e) {
                        choose(true);
                        checkAnswersvalid();
                    });
                } else {
                    $('#next').show();
                }
            }
        });
    }

    // Check if answer valid, at least 1
    function checkAnswersvalid() {
        var notValid = false;
        if (selections.length < questions.length) {
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
            $('#checkAnswers').addClass("btn-disabled")
        } else {
            $('#checkAnswers').removeClass("btn-disabled")
        }
    }
    // TO DO - implement score
    function displayScore() {
        var score = $('<p>Not implemented</p>');
        return score;
    }
    //Setup navigation buttons - questions
    function setupNavigation() {
        item = $('#navigation');
        for (var i = 0; i < questions.length; i++) {
            var navButton = '<div class="button"><a href="' + i + '">' + questions[i].question; +'</a></div>';
            item.append(navButton);
        }
    }
})();