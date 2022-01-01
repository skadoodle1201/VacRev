const User = require('../models/users');

module.exports.RenderSignUp =  (req,res) =>{
        res.render('users/register');
}

module.exports.SignUp = async(req,res,next)=>{
        try{
                const {email,username,password} = req.body;
                const user = new User({ email,username});
                const registeredUser =  await User.register(user ,password);
                req.login(registeredUser, err=> {
                        if(err) return next(err);
                        req.flash('success','Welcome');
                        res.redirect('/');
                })
        }
        catch(e){
                req.flash('error',e.message);
                res.redirect('register');
        }
}


module.exports.RenderLogin = (req,res)=>{
        res.render('users/login');
}


module.exports.authenticate = async(req,res)=>{
        req.flash('success','Welcome Back!!' );
        const redirectUrl = req.session.returnTo || '/';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
}

module.exports.logout =(req,res)=>{
        req.logout();
        req.flash('success', 'Successfully Logged Out');
        res.redirect('/');
}