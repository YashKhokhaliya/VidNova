import { ApiError } from "../utils/ApiError.js"

const errorHandler = (err, req, res, next) => {
    let error = err

    // If the thrown error isn't already an ApiError (e.g. a raw Mongoose
    // error or unexpected bug), normalize it into the same shape so the
    // frontend always receives a consistent response format.
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500
        const message = error.message || "Something went wrong"
        error = new ApiError(statusCode, message, error?.errors || [], err.stack)
    }

    const response = {
        success: false,
        message: error.message,
        errors: error.errors,
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    }

    return res.status(error.statusCode).json(response)
}

export { errorHandler }