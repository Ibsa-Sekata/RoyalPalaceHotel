export function errorHandler(err, _req, res, _next) {
    const isDatabaseUnavailable = err?.name === "PrismaClientInitializationError" || err?.code === "P1001";
    const status = isDatabaseUnavailable ? 503 : (err.status || 500);
    const code = isDatabaseUnavailable ? "DATABASE_UNAVAILABLE" : (err.code || "INTERNAL_ERROR");
    const message = isDatabaseUnavailable
        ? "The database is temporarily unavailable. Please try again shortly."
        : status === 500 ? "Something went wrong" : err.message;

    if (status === 500 || isDatabaseUnavailable) console.error(err);

    res.status(status).json({
        success: false,
        error: { code, message, details: err.details || [] },
    });
}