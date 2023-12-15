import User from "../models/user.model";
import extend from "lodash/extend";
import errorHandler from "../../helpers/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";
import profilePhoto from "../../client/assets/images/profile.png"

const create = async(req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        return res.status(200).json({
            message: "Succesfully signed up"
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const list = async(req, res) => {
    try {
        let users = await User.find().select("name email created updated");
        res.json(users);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const userById = async(req, res, next, id) => {
    try {
        let user = await User.findById(id)
            .populate("following", "_id name")
            .populate("following", "_id name")
            .exec();
        if (!user) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        req.profile = user;
        next();
    } catch (err) {
        return res.status(400).json({
            error: "Could not retrieve the user"
        });
    }
}

const read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}

const update = async(req, res) => {
    const form = formidable({});
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            });
        }
        let user = req.profile;
        user = extend(user, {
            name: fields.name?.toString() || '',
            email: fields.email?.toString() || '',
            password: fields.password?.toString() || '',
            about: fields.about?.toString() || ''
        });
        user.updated = Date.now();
        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo[0].filepath);
            user.photo.contentType = files.photo[0].mimeType;
        }
        try {
            await user.save();
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
    })
}

const remove = async(req, res) => {
    try {
        let user = req.profile;
        let deletedUser = await user.remove();
        deletedUser.hashed_password = undefined;
        deletedUser.salt = undefined;
        res.json(deletedUser);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const photo = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set("Content-Type", req.profile.photo.contentType);
        return res.send(req.profile.photo.data);
    }
    next();
}

const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd() + profilePhoto);
}

const addFollowing = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.body.userId, {$push: {following: req.body.followId}});
        next();
    } catch (err) {
        return res.status(400).json(({
            error: errorHandler.getErrorMessage(err)
        }))
    }
}

const addFollower = async (req,res) => {
    try {
        let result = await User.findByIdAndUpdate(req.body.followId,
                                {$push: {followers: req.body.userId}},
                                {new: true})
                                .populate("following", "_id name")
                                .populate("followers", "_id name")
                                .exec();
        result.hashed_password = undefined;
        result.salt = undefined;
        res.json(result);
    } catch (err) {
        res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const removeFollowing = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}});
        next();
    } catch (err) {
        res.status(400).json({
            error: errorHandler.getErrorMessage(err``)
        });
    }
}

const removeFollower = async (req, res) => {
    try {
        let response = await User.findByIdAndUpdate(req.body.unfollowId,
                                    {$pull: {followers: req.body.userId}})
                                    .populate("following", "_id name")
                                    .populate("followers", "_id name")
                                    .exec();
        response.hashed_password = undefined;
        response.salt = undefined;
        res.json(response);
    } catch (err) {
        res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

export default { create, list, update, userById, read, remove, photo, defaultPhoto, addFollowing,
     addFollower, removeFollower, removeFollowing };