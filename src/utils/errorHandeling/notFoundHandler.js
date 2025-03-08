const notFoundHandler = (req, res, next) => {
    return next(new Error("API not found", { cause: 404 }))
}

export default notFoundHandler