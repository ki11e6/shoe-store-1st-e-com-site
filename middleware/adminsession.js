module.exports = {
  isLogged: (req, res, next) => {
    if (req.session.admin) {
      console.log('admin logged')
      next();
    }
    else {
      res.redirect('/admin')
    }
  },
  notLogged: (req, res, next) => {
    if (!req.session.admin) {
      console.log('admin not logged')
      next()
    } else {
      res.redirect('/admin/adminlogin')
    }
  }
}