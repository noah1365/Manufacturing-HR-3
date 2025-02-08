import { Benefit } from "../model/benefit/benefitModel.js";

import mongoose from "mongoose";

/* benefit overview crud */
export const createBenefit = async (req,res) => {
    try {
        const {benefitsName,benefitsDescription,benefitsType,requiresRequest} = req.body;
        if(!benefitsName ||!benefitsDescription ||!benefitsType){
            return res.status(400).json({status:false,message:"All fields required!"});
        }
        const benefitsExist = await Benefit.findOne({benefitsName});
        if(benefitsExist){
            return res.status(400).json({status:false,message:"Benefits already exist!"});
        }
        const benefit = new Benefit({
            benefitsName,
            benefitsDescription,
            benefitsType,
            requiresRequest
        });
        await benefit.save();
        res.status(201).json({status:true,message:"Benefit created successfully!"});
    } catch (error) {
        console.log(`Error in login ${error}`);
        return res.status(500).json({success:false,message:"Server error"});
    }
};

export const getBenefit = async (req,res) => {
    try {
        const benefits = await Benefit.find({});
        res.status(200).json({status:true,benefits})
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateBenefit = async (req, res) => {
    try {
        const { id } = req.params;
        const {benefitsName,benefitsDescription,benefitsType,requiresRequest} = req.body;

        if(!benefitsName || !benefitsDescription || !benefitsType){
            return res.status(400).json({status:false,message:"All fields required!"});
        }
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({status:false,message:"Invalid benefit ID format."});
        }
        
        const benefit = await Benefit.findById(id);
        if(!benefit){
            return res.status(404).json({status:false,message:"Benefit not found!"});
        }

        const isUpdated = benefit.benefitsName !== benefitsName || 
                          benefit.benefitsDescription !== benefitsDescription || 
                          benefit.benefitsType !== benefitsType || 
                          benefit.requiresRequest !== requiresRequest;

        if(isUpdated){
            benefit.benefitsName = benefitsName;
            benefit.benefitsDescription = benefitsDescription;
            benefit.benefitsType = benefitsType;
            benefit.requiresRequest = requiresRequest;
            await benefit.save();
            return res.status(200).json({status:true,message:"Benefits updated successfully!",updatedBenefit:benefit});
        } else {
            return res.status(200).json({status:true,message:"No changes detected, benefit remains unchanged.",updatedBenefit:benefit});
        }
    } catch (error) {
        console.error("Error updating benefit:", error);
        return res.status(500).json({status:false,message:"Server error"});
    }
};


export const deleteBenefit = async (req, res) => {
    try {
        const {id} = req.params;

        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({status:false,message:"Invalid benefit ID format."});
        }
        const benefit = await Benefit.findByIdAndDelete(id);
        if(!benefit){
            return res.status(404).json({status:false,message:"Benefit not found!"});
        }

        res.status(200).json({status:true,message:"Benefit deleted successfully!"});
        
    } catch (error) {
        console.error("Error deleting benefit:",error);
        res.status(500).json({success:false,message:"Server error"});
    }
};


import cloudinary from "../config/cloudinaryConfig.js";
import upload from "../config/multerConfig.js"; 
import { RequestBenefit } from "../model/benefit/requestBenefitModel.js";

export const requestBenefit = async (req, res) => {
    try {
        console.log("Authenticated User ID:", req.user._id);
        console.log("Request Body:", req.body);  
        console.log("Uploaded Files:", req.files);

        const { benefitsName } = req.body;

        if (!benefitsName) {
            return res.status(400).json({ message: "Benefit name is required." });
        }

        if (!mongoose.Types.ObjectId.isValid(benefitsName)) {
            return res.status(400).json({ message: "Invalid Benefit ID format." });
        }

        // Hanapin ang benefit sa database
        const benefit = await Benefit.findById(benefitsName);
        if (!benefit) {
            console.log("Benefit not found in database:", benefitsName); // Debugging
            return res.status(404).json({ message: "Benefit not found." });
        }

        console.log("Benefit found:", benefit);

        if (!req.files || !req.files.frontId || !req.files.backId) {
            return res.status(400).json({ message: "Both front and back ID images are required." });
        }

        
        const newRequest = new RequestBenefit({
            employeeId: req.user._id,
            benefitsName,
            uploadDocs: {
                frontId: req.files.frontId[0].path,
                backId: req.files.backId[0].path,
            },
        });

        await newRequest.save();
        res.status(201).json({ message: "Benefit request created successfully", newRequest });

    } catch (error) {
        console.error("Error in requestBenefit:", error);
        res.status(500).json({ message: error.message });
    }
};



export { upload };
