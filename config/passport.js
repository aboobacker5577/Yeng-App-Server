var mongoose=require('mongoose');
var passport=require('passport');
var admin=mongoose.model('admin');
var LocalStrategy=require('passport-local').Strategy;


passport.serializeUser(function (admin,done) {
    done(null,admin.id);
})
passport.deserializeUser(function (id,done) {
    admin.findById(id,function (err,admin) {
        done(err,admin);
    });
});

passport.use('local.signup',new LocalStrategy({
    usernameField:'Email',
    passwordField:'Eassword',
    passReqToCallback:true
},function (req,email,password,done) {
    req.checkBody('email','Invalid Email').notEmpty().isEmail();
    req.checkBody('password','Invalid password').notEmpty().isLength({min:4});
    var errors=req.getValidationResult();
    if(errors){
        var messages=[];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null,false,req.flash('error',messages));
    }

    admin.findOne({'email':email},function (err,user) {
        if (err){
            return done(err);
        }
        if (user){
            return done(null,false,{message:"Email is already in use."});
        }
        var newAdmin=new admin();
        newAdmin.email=email;
        newAdmin.password=newUser.encryptPassword(password);
        newAdmin.save(function (err,result) {
            if (err){
                return done(err);
            }

            return done(null,newAdmin);
        })
    });
}));

passport.use('local.signin',new LocalStrategy({
    usernameField:'Email',
    passwordField:'Password',
    passReqToCallback:true
},function (req,Email,Password,done) {
    req.checkBody('Email','Invalid Email').notEmpty().isEmail();
    req.checkBody('Eassword','Invalid password').notEmpty();
    /*var errors=req.getValidationResult();
    console.log(errors);
    if(errors){
        var messages=[];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null,false,req.flash('error',messages));
    }*/

    admin.findOne({'Email':Email,'Password':Password},function (err,admin) {
        if (err){
            console.log(err);
            return done(err);
        }
        if (!admin){
            console.log("no admin");
            return done(null,false,{message:"Email and password do not match."});
        }
        /*if(!admin.validPassword(Password)){
            return done(null,false,{message:'wrong password'});
        }*/
        console.log(admin);
        req.session.loggedIn=true;
        req.session.admin = {
            "email": admin.Email,
            "_id": admin._id,
            "Password":admin.Password
        };
        return done(null,admin);

    });
}));




