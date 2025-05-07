const express = require("express");
const userController = require("../controllers/user.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware.verifyToken);

router
  .route("/me")
  .get(userController.findLoggedInUserDetails)
  .delete(userController.deleteSoftUser);

router.patch("/me/change-password", userController.updatePassword);

router.use(authMiddleware.verifyRoles("ADMIN"));

router
  .route("/")
  .get(userController.findAllUsers)
  .post(userController.createOne);
router
  .route("/:id")
  .get(userController.findOneUserById)
  .patch(userController.updateOneById)
  .delete(userController.deleteOneById);

module.exports = router;
