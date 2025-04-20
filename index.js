document.addEventListener('DOMContentLoaded', function(){
    const submitButton = document.getElementById('submit-button')
    const questionCounter = document.getElementById('question-counter')
    let currentValue = parseInt(questionCounter.textContent, 10)
    const startGameContainer = document.querySelector('.child-container-one')
    const startGameBtn = document.getElementById('start-game')
    const questionsContainer = document.querySelector('.child-container-two')

    

    let currentQnIndex = 0
    let allTriviaQns = []
    let initialScore = 0

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
    const correctAnswer = questionTextContent.dataset.correct

    function handleSubmitBtnClickEvent(event){
        event.preventDefault()
        const selectedRadio = document.querySelector('input[name="answer"]:checked');
        if (!selectedRadio) {
            alert("please select an answer before proceeding");
            return;
        }
        const selectedValue = selectedRadio.value
        // questionTextContent.dataset.correct = correctAnswer

        if (choicesTextContents[selectedValue].value === correctAnswer){
            initialScore++
        }
        currentQnIndex++
        if (currentQnIndex < allTriviaQns.length){
            renderEachQuestion(currentQnIndex)
        } else {
            questionsContainer.innerHTML = `
                <h2>Challenge Completed</h2>
                <p>Your score is ${initialScore} / ${allTriviaQns.length}</p>
                <button onclick="location.reload()">Try Again</button>
            `
        }
        // console.log("form submitted successfully")
    }

    submitButton.addEventListener("click", handleSubmitBtnClickEvent)
})