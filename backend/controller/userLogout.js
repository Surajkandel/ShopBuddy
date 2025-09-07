async function userLogout(req, res) {
    try {
        const isProduction = process.env.NODE_ENV === 'production';

        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "lax",
            path: "/",   // must match signin
        });

        res.json({
            message: "Logout successfully",
            error: false,
            success: true,
            data: []
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
            error: true,
            success: false
        });
    }
}

module.exports = userLogout;
