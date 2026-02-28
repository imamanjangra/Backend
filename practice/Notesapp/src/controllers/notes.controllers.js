import { Notes } from "../Models/notes.model.js";

export const createNotes = async (req, res) => {
  try {
    const { title, content, isPinned, isArchived, tags, folderID , isDeleted } = req.body;

    if (!title || !content || title.trim() === "" || content.trim() === "") {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = await Notes.create({
      title: title.trim(),
      content: content.trim(),
      isPinned: isPinned || false,
      isArchived: isArchived || false,
      tags: tags || [],
      folderID : req.params.id,
      userID: req.user._id,  
      isDeleted : isDeleted || false
    });

    return res.status(201).json({
      message: "Note created successfully",
      note,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error while creating note",
      error: error.message,
    });
  }
};

export const getNotesByFolder = async (req, res) => {
  try {
    const notes = await Notes.find({
      folderID: req.params.folderId,
      userID: req.user._id,
      isDeleted : false
    });

    return res.status(200).json({
      count: notes.length,
      notes
    });

  } catch (error) {
    return res.status(400).json({
      message: "Error fetching notes",
      error: error.message
    });
  }
};

export const getTrushNotesByFolder = async (req, res) => {
  try {
    const notes = await Notes.find({
      folderID: req.params.folderId,
      userID: req.user._id,
      isDeleted : true
    });

    return res.status(200).json({
      count: notes.length,
      notes
    });

  } catch (error) {
    return res.status(400).json({
      message: "Error fetching notes",
      error: error.message
    });
  }
};

export const updateNotes = async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Authorization check (FIXED — using userID)
    if (note.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: Not your note" });
    }

    // Only allow specific fields
    const allowedFields = [
      "title",
      "content",
      "isPinned",
      "isArchived",
      "tags",
      
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        note[field] = req.body[field];
      }
    });

    await note.save();

    return res.status(200).json({
      message: "Note updated successfully",
      note,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error while updating note",
      error: error.message,
    });
  }
};

export const removeNote = async (req , res) => {
 try {
   const note = await Notes.findById(req.params.id);
 
   if(!note){
     return res.status(404).json({message : "Note is not found"});
   }
 
   if(note.userID.toString() !== req.user._id.toString()){
     return res.status(403).json({message : "This is not your note "});
   }
 
   let value = !note.isDeleted;;
   console.log(value);
 
   
 
   const remove = await Notes.findByIdAndUpdate( 
     req.params.id,
     { $set: { isDeleted : value } },
     { new: true }
   )
 
   return res.status(200).json({remove})
 } catch (error) {
    return res.status(400).json({message : "Somthing is wrong "} , error)
 }

}

export const deleteNotes = async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: Not your note" });
    }

    await note.deleteOne();

    return res.status(200).json({
      message: "Note deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error while deleting note",
      error: error.message,
    });
  }
};

export const totalNotes = async (req , res ) => {
 try {
   const userId = req.user._id;
 
   const result = await Notes.aggregate([
     {
       $match : {
         userID : userId
       }
     },
      {
         $group : {
           _id : userId,
           totalNotes : {$sum : 1},
           ArchivedNotes : {
             $sum : {
               $cond : [{$eq : ["$isArchived" , true]} , 1 , 0]
             }
           },
           unArchivedNotes : {
             $sum : {
               $cond : [{$eq : ["$isArchived" , true]} , 1 , 0]
             }
           },
           isPinned : {
            $sum : {
              $cond : [{$eq : ["$isPinned" , true]} , 1 , 0]
            }
           },
           unPinned : {
            $sum : {
              $cond : [{$eq : ["$isPinned" , false]} , 1 , 0]
            }
           }
         }
       }
   ])
 
    return res.status(200).json(result[0] || {
       totalNotes: 0,
       ArchivedNotes: 0,
       unArchivedNotes: 0,
       isPinned : 0,
       unPinned : 0

     });
 } catch (error) {
  return res.status(400).json({message : "somthing went wrong "})
 }
}

export const searchNotes = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required"
      });
    }

    const notes = await Notes.find(
      {
        userID: req.user._id,   // VERY IMPORTANT (security)
        $text: { $search: query }
      },
      {
        score: { $meta: "textScore" }  // relevance score
      }
    ).sort({
      score: { $meta: "textScore" }    // sort by relevance
    });

    return res.status(200).json({
      count: notes.length,
      notes
    });

  } catch (error) {
    return res.status(500).json({
      message: "Search failed",
      error: error.message
    });
  }
};

export const getMonthlyStats = async (req , res) => {
  try {
    const {year , month } = req.query;

    if(!year || !month){
      return res.status(400).json({message : "Year and month is required "});
    }

    const startDate = new Date(year , month -1 , 1);
    const endDate = new Date(year , month , 1);

    const stats = await Notes.aggregate([
      {
        $match : {
          userID : req.user._id,
          createdAt : {
             $gte: startDate,
             $lt : endDate
          }
        },  
      },
      {
        $group : {
          _id : {$dayOfMonth : "$createdAt"},
          count : {$sum : 1}
        }     
     },
     {
      $sort : {
        _id : 1
      }
     }
     
    ])
    return res.status(200).json({ stats });
  } catch (error) {
    return res.status(500).json({ message: "Error generating stats" });
  }
}