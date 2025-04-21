document.addEventListener('DOMContentLoaded', function(){
    const submitButton = document.getElementById('submit-button')
    const questionCounter = document.getElementById('question-counter')
    let currentValue = parseInt(questionCounter.textContent, 10)
    const startGameContainer = document.querySelector('.child-container-one')
    const startGameBtn = document.getElementById('start-game')
    // console.log(startGameBtn)
    const questionsContainer = document.querySelector('.child-container-two')

    

    let currentQnIndex = 0
    let allTriviaQns = []
    // console.log(allTriviaQns)
    let initialScore = 0
    // console.log(initialScore)

    const decodeHTML = (html) => {
        const text = document.createElement('textarea')
        text.innerHTML = html
        return text.value
    }

    const questionTextContent = document.getElementById('question')
    const choicesTextContents = {
        A: document.getElementById('choiceA'),
        B: document.getElementById('choiceB'),
        C: document.getElementById('choiceC'),
        D: document.getElementById('choiceD')
    }

    function renderEachQuestion(index){
        const eachQuestionData = allTriviaQns[index]
        const qnText = decodeHTML(eachQuestionData.question)
        const correctAnswer = decodeHTML(eachQuestionData.correct_answer)
        const incorrectAnswers = eachQuestionData.incorrect_answers.map(decodeHTML)
        const correctPlusIncorrectAnswers = [...incorrectAnswers, correctAnswer].sort(() => 0.5 - Math.random())
        const choiceLabels = ['A', 'B', 'C', 'D']
        const choicesMap = {}

        correctPlusIncorrectAnswers.forEach((answer, i) => {
            const choiceLabel = choiceLabels[i]
            choicesTextContents[choiceLabel].value = answer
            choicesMap[choiceLabel] = answer
            choicesTextContents[choiceLabel].nextElementSibling.checked = false
        })
        questionTextContent.value = qnText
        const correctLabel = Object.keys(choicesMap).find(
            key => choicesMap[key] === correctAnswer
        )
        questionCounter.textContent = `${index + 1} of ${allTriviaQns.length} Questions`
        questionTextContent.dataset.correct = correctAnswer

    }

    startGameContainer.style.display = "block"
    questionsContainer.style.display = "none"

    function handleStartGameBtnClickEvent(event) {
        event.preventDefault()
        startGameContainer.style.display = "none"
        questionsContainer.style.display = "block"

        const apiUrl = 'https://opentdb.com/api.php?amount=9&category=18&difficulty=easy&type=multiple'
        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            allTriviaQns = data.results
            renderEachQuestion(currentQnIndex)
        })
        .catch(err => console.error('Error fetching trivia questions:', err))
    }

    startGameBtn.addEventListener("click", handleStartGameBtnClickEvent)
    
    let currentQuestionValue = 1
    const totalQuestionsValue = 10


    function handleSubmitBtnClickEvent(event){
        event.preventDefault()
        const selectedRadio = document.querySelector('input[name="answer"]:checked');
        if (!selectedRadio) {
            alert("please select an answer before proceeding");
            return;
        }
        const selectedValue = selectedRadio.value
        // questionTextContent.dataset.correct = correctAnswer
        const correctAnswer = questionTextContent.dataset.correct
        console.log(correctAnswer)

        if (choicesTextContents[selectedValue].value === correctAnswer){
            initialScore++
        }
        currentQnIndex++
        if (currentQnIndex < allTriviaQns.length){
            renderEachQuestion(currentQnIndex)
        } else {
            questionsContainer.innerHTML = `
                <div id="challenge-completed-page">
                <h2>Challenge Completed</h2>
                <p id="your-score-is">Your score is ${initialScore} / ${allTriviaQns.length}</p>
                <button id="try-again-button" onclick="location.reload()">Try Again</button>
                </div>
            `
            const challengeCompletedPage = document.getElementById('challenge-completed-page')
            challengeCompletedPage.style.display = "flex"
            challengeCompletedPage.style.flexDirection = "column"
            challengeCompletedPage.style.justifyContent = "center"
            challengeCompletedPage.style.alignItems = "center"
            challengeCompletedPage.style.border = "2px solid blue"
            challengeCompletedPage.style.width = "400px"
            challengeCompletedPage.style.height = "300px"
            challengeCompletedPage.style.textAlign = "center"
            challengeCompletedPage.style.padding = "20px"
            challengeCompletedPage.style.marginTop = "100px"
            challengeCompletedPage.style.marginLeft = "180px"
            challengeCompletedPage.style.borderRadius = "20px"
            challengeCompletedPage.style.boxShadow = "0 10px 30px rgba(254, 255, 255, 0.3)"

            const yourScoreIs = document.getElementById('your-score-is')
            yourScoreIs.style.color = "purple"

            const tryAgainBtn = document.getElementById('try-again-button')
            tryAgainBtn.style.backgroundColor = "violet"
            tryAgainBtn.style.padding = "10px 20px"
            tryAgainBtn.style.border = "none"
            tryAgainBtn.style.color = "white"
            tryAgainBtn.style.cursor = "pointer"
            tryAgainBtn.style.borderRadius = "5px"
            tryAgainBtn.style.fontWeight = "600"

            function mouseEnterCallBackFunction(event){
                tryAgainBtn.style.backgroundColor = "#365e41"
            }
            function mouseLeaveCallBackFunction(event){
                tryAgainBtn.style.backgroundColor = "violet"
            }
            tryAgainBtn.addEventListener("mouseenter", mouseEnterCallBackFunction)
            tryAgainBtn.addEventListener("mouseleave", mouseLeaveCallBackFunction)
        }
        // console.log("form submitted successfully")
    }

    submitButton.addEventListener("click", handleSubmitBtnClickEvent)

    const correctOrIncorrectContainer = document.createElement('div')
    correctOrIncorrectContainer.id = "correct-or-incorrect-container"
    correctOrIncorrectContainer.style.fontSize = "15px"
    correctOrIncorrectContainer.style.fontWeight = "bold"
    correctOrIncorrectContainer.style.marginTop = "20px"

    questionsContainer.appendChild(correctOrIncorrectContainer)

    const answerRadios = document.querySelectorAll('input[name="answer"]')
    const handleFeedbackFunction = (radio) => {
        const selectedValue = radio.value
        const selectedText = choicesTextContents[selectedValue].value
        const correctAnswer = questionTextContent.dataset.correct

        if (selectedText === correctAnswer) {
            correctOrIncorrectContainer.textContent = "✅ Correct Answer!"
            correctOrIncorrectContainer.style.color = "black"
            correctOrIncorrectContainer.fontWeight = "bold"
        } else {
            correctOrIncorrectContainer.textContent = "✖️ incorrect Answer!"
            correctOrIncorrectContainer.style.color = "#e83ca9"
            correctOrIncorrectContainer.style.fontWeight = "bold"

        }
    }
    answerRadios.forEach(radio => {
        radio.addEventListener("change", () => handleFeedbackFunction(radio))
    })
})