import Joi from "joi";
import ExpressError from "../utils/ExpressError.js";

const validateRegister = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        role: Joi.string().valid("user", "vendor").required(),

        shopName: Joi.string().when("role", { is: "vendor", then: Joi.required() }),
        category: Joi.string().when("role", { is: "vendor", then: Joi.required() })
    });

    const { error } = schema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

const validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().valid("user", "vendor").required()
    });

    const { error } = schema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

export { validateLogin, validateRegister };