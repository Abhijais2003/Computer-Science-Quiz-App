const apiKey = "YOUR_API_KEY";
const limit = 10;
const url = `https://quizapi.io/api/v1/questions?apiKey=${apiKey}&limit=${limit}`;
const questionElement = document.getElementById("question");
const buttons = document.querySelectorAll(".btn");
const nextBtn = document.querySelector("#next-btn");
const resetBtn = document.createElement("button");

resetBtn.id = "reset-btn";
resetBtn.textContent = "Reset Quiz";
resetBtn.setAttribute("id", "reset-btn");
resetBtn.style.display = "none";
document.body.appendChild(resetBtn);

let currentQuestionIndex = 0;
let quizData = [];
let correctOrNot = [];
let score = 0;

const loadQuestion = (index) => {
  if (index >= quizData.length) {
    questionElement.innerHTML = `Quiz completed! </br> </br> Your score is: ${score} out of 10`;
    buttons.forEach((button) => {
      button.style.display = "none";
    });
    nextBtn.style.display = "none";
    resetBtn.style.display = "block";
    return;
  }

  const currentQuestion = quizData[index];
  questionElement.textContent = currentQuestion.question;
  const answerObj = currentQuestion.answers;
  const correctAnswers = currentQuestion.correct_answers;

  correctOrNot = Object.values(correctAnswers).map((opt) => opt === "true");

  buttons.forEach((button, i) => {
    const answer = answerObj[`answer_${String.fromCharCode(97 + i)}`];
    if (answer != null) {
      button.style.display = "block";
      button.textContent = answer;
      button.disabled = false;
      button.style.backgroundColor = "";
    } else {
      button.style.display = "none";
    }
  });

  nextBtn.style.display = "none";
  resetBtn.style.display = "none";
};

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    quizData = data;
    // console.log(quizData.length);
    loadQuestion(currentQuestionIndex);
  })
  .catch((error) => {
    console.error("There has been a problem with your fetch operation:", error);
  });

buttons.forEach((button, i) => {
  button.addEventListener("click", (event) => {
    if (correctOrNot[i]) {
      event.target.style.backgroundColor = "rgb(121, 204, 121)";
      score++;
    } else {
      event.target.style.backgroundColor = "#e14958";
      // Highlight correct answers
      buttons.forEach((btn, index) => {
        if (correctOrNot[index]) {
          btn.style.backgroundColor = "rgb(121, 204, 121)";
        }
      });
    }
    buttons.forEach((btn) => (btn.disabled = true));
    nextBtn.style.display = "block";
  });
});

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  loadQuestion(currentQuestionIndex);
});

resetBtn.addEventListener("click", () => {
  currentQuestionIndex = 0;
  score = 0;
  loadQuestion(currentQuestionIndex);
  buttons.forEach((button) => {
    button.style.display = "block";
    button.disabled = false;
    button.style.backgroundColor = "";
  });
  nextBtn.style.display = "block";
  resetBtn.style.display = "none";
});
