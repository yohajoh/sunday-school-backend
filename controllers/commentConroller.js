import Comment from '../models/commentModel.js';

export const getComment = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('authorId', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error('❌ Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
    });
  }
};

export const createNewComment = async (req, res) => {
  try {
    const { postId, author, authorId, text, parentId } = req.body;

    const comment = new Comment({
      postId,
      author,
      authorId,
      text,
      parentId: parentId || null,
    });

    await comment.save();

    // If this is a reply, add it to the parent comment's replies
    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, {
        $push: { replies: comment._id },
      });
    }

    // Populate the comment with user details
    const populatedComment = await Comment.findById(comment._id).populate(
      'authorId',
      'firstName lastName',
    );

    res.status(201).json({
      success: true,
      data: populatedComment,
    });
  } catch (error) {
    console.error('❌ Create comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating comment: ' + error.message,
    });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { userId } = req.body;

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      comment.likes = comment.likes.filter(
        (like) => like.toString() !== userId,
      );
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    const updatedComment = await Comment.findById(comment._id).populate(
      'authorId',
      'firstName lastName',
    );

    res.json({
      success: true,
      data: updatedComment,
      message: alreadyLiked ? 'Comment unliked' : 'Comment liked',
    });
  } catch (error) {
    console.error('❌ Like comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking comment: ' + error.message,
    });
  }
};
