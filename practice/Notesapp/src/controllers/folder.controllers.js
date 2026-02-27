import {Folder} from "../Models/folder.moduel.js";

export const createFolder = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(402).josn({ message: "Enter the name of the Folder" });
    }

    const folder = await Folder.create({
      name,
       userID: req.user._id
    });

    return res.status(200).json({ folder });
  } catch (error) {
    return res.status(400).json({ message: "Somthing went wrong " });
  }
};

export const getFolder = async (req, res) => {
  try {
    const folder = await Folder.find({ userID: req.user._id });

    return res.status(200).json({
      count: folder.length,
      folder,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching folder",
      error: error.message,
    });
  }
};

export const updateFolder = async (req, res) => {
 try {
    const folder = await Folder.findById(req.params.id);
   
     if(!folder){
               return res.status(404).json({ message: 'folder not found !!!' });
           }
   
           const update = await Folder.findByIdAndUpdate(req.params.id , req.body , {new : true});
   
           return res.status(200).josn({update})
 } catch (error) {
                 return res.status(400).json({ message: 'Failed to update FOlder !!!' });
 }      
        
};

export const deleteFolder = async (req , res) => {
    try {
        const folder = await Folder.findById(req.params.id);
       
         if(!folder){
                   return res.status(404).json({ message: 'folder not found !!!' });
               }
        await Folder.deleteOne({_id : req.params.id}) ;
    
        return res.status(200).json({message : "Folder is deleted"})
    } catch (error) {
     return   res.status(400).json({ message: 'Failed to delete Folder !!!' });
    }
}
