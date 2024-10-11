function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Silahkan masuk untuk memulai session.");
  res.redirect("/authentation");
}

const checkStandard = (req, res, next) => {
  if (req.user && req.user.standard || req.user.premium) {
    next();
  } else {
    req.flash('error', 'Forbidden. Standard users only.');
    res.redirect('/dash');
  }
};

module.exports = {
  isAuthenticated,
  checkStandard
}; 