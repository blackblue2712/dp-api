const router = require("express").Router();

const {
    requireSignin
} = require("../controllers/auth");

const {
    getQuestions,
    postAsk,
    requestRelatedQuestionId,
    getSigleQuestion,
    postAnswer,
    updateQuestionAfterPostAnswer,
    getYourQuestions,
    putUpdateQuestion,
    getSingleQuestionToEdit,
    getSearchQuestions,
    deleteQuestion
} = require("../controllers/asks");

router.get("/questions", getQuestions);
router.get("/search", getSearchQuestions);
router.get("/questions/:quesId", getSigleQuestion);
router.get("/questions/edit/:quesId", getSingleQuestionToEdit);
router.put("/questions/edit/:quesId", requireSignin, putUpdateQuestion);
router.get("/your-questions/", getYourQuestions);
router.post("/new", requireSignin, postAsk);
router.post("/answer/new", requireSignin, postAnswer, updateQuestionAfterPostAnswer);

router.delete("/questions/delete/:qid", requireSignin, deleteQuestion);

router.param("quesId", requestRelatedQuestionId);

module.exports = router;