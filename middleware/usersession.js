module.exports = {
  isLogged: (req, res, next) => {
    if (req.session.user) {
      console.log('user logged')
      next();
    }
    else {
      res.redirect('/login')
    }
  },
  notLogged: (req, res, next) => {
    if (!req.session.user) {
      console.log("user notlogged");
      next();
    } else {
      res.redirect('/home')
    }
  }
}