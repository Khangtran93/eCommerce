import asyncHandler from "../middleware/asyncHandler.js";
import User from '../model/userModel.js'
import generateToken from "../utils/generateToken.js";


// @desc   Auth user & get token
// @route  POST /api/users/login
// @access PUBLIC
const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))) {
        //create a token with given user
        generateToken(res, user._id)
      
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
            res.status(404);
            throw new Error("invalid Email or password")
        
    }
});

// @desc   Register user
// @route  POST /api/users
// @access PUBLIC
const registerUser = asyncHandler(async(req, res) => {
    const { name, email, password} = req.body;
    const userExist = await User.findOne({email});

    if(userExist) {
        res.status(400);
        throw new Error("User exists.")
    }
    
    const user = await User.create({
        name, 
        email,
        password
    })

    if (user) {
        generateToken(res, user._id)
        res.status(201);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
  
    }
    else {
        res.status(400);
        throw new Error("Invalid user");
    }
    

   
});


// @desc   Logout user / clear cookies
// @route  POST /api/users/logout
// @access PRIVATE
const logoutUser = asyncHandler(async(req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    
    res.status(200).json({message: "Logged out successfully"});
    
});


// @desc   Get user profile
// @route  GET /api/users/profile
// @access PRIVATE
const getUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);

    if(user) {
        res.status(200);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    }
    else {
        res.status(404);
        throw new Error("user not found");
    }
})


// @desc   Update user profile
// @route  PUT /api/users/profile
// @access PRIVATE
const updateUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);

    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
    
        if(req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save()
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    }
    else {
        res.status(401);
        throw new Error("user not found");
    }
})


// @desc   Get users
// @route  GET /api/users
// @access Private/admin
const getUsers = asyncHandler(async(req, res) => {
    const users = await User.find({});
    res.status(200).json(users)
});


// @desc   Get user by id
// @route  GET /api/user/:id
// @access Private/admin
const getUserById = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(404);
        throw new Error("No User Found")
    }
})


// @desc   Delete user
// @route  DELETE /api/user/:id
// @access Private/admin
const deleteUser = asyncHandler(async(req, res) => {
    console.log("ID for delete ", req.params.id)
    const user = await User.findById(req.params.id);
    if(user) {
        if(user.isAdmin){
            res.status(400);
            throw new Error("Cannot delete admin user")
        }
        else{
            await User.deleteOne({_id: user._id})
            res.status(200).json("User deleted")
        }
    }
    else {
        res.status(404);
        throw new Error("User not found")
    }
})


// @desc   Update user
// @route  PUT /api/user/:id
// @access Private/admin
const updateUser = asyncHandler(async(req, res) => {
    console.log('ID: ', req.params.id)
    const user = await User.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);
    

    const updatedUser = await user.save();
    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
    })
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});

export {authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getUsers, getUserById, deleteUser, updateUser};