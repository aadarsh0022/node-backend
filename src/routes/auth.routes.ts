import { Request, Response, Router } from "express";
import { AuthRequest } from "../types/express";
import { loginController, refreshTokenController, signupController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// register new user
router.post("/signup", signupController);

// login user
router.post("/login", loginController);

// refresh token
router.post("/refresh", refreshTokenController);

router.get("/profile", authMiddleware, (req: AuthRequest, res: Response) => {
    res.json({
        message: "Protected route accessed ✅",
        user: req.user,
    });
});

export default router;