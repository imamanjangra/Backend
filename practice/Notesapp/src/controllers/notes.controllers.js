import { Notes } from "../Models/notes.model.js";


// ================= CREATE NOTE =================
export const createNotes = async (req, res) => {
  try {
    const { title, content, isPinned, isArchived, tags, folderID } = req.body;

    if (!title || !content || title.trim() === "" || content.trim() === "") {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = await Notes.create({
      title: title.trim(),
      content: content.trim(),
      isPinned: isPinned || false,
      isArchived: isArchived || false,
      tags: tags || [],
      folderID,
      userID: req.user._id,  
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



// ================= GET NOTES =================
export const getNotes = async (req, res) => {
  try {
    const notes = await Notes.find({ userID: req.user._id });

    return res.status(200).json({
      count: notes.length,
      notes,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error while fetching notes",
      error: error.message,
    });
  }
};



// ================= UPDATE NOTE =================
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
      "folderID"
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



// ================= DELETE NOTE =================
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