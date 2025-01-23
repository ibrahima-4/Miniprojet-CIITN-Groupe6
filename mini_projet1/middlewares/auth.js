// Middleware pour vérifier si l'utilisateur est authentifié
    function isAuthenticated(req, res, next) {
        if (req.session.user) {
        return next();
        } else {
        res.redirect('/user/login');
        }
    }
    
    
    module.exports = { isAuthenticated };
