const {Gallery} = require('../models');

const addNewGallery = async (req, res) => {
    const {name, description} = req.body;
    const imageFile = req.files?.image;

    if(!name || !description || !imageFile) {
        res.status(400).json({error: 'All fields are required'});
    }

    if (!imageFile.mimetype.startsWith('image/')){
        return res.status(400).json({error: 'Invalid file type'});
    }

    try {
        await Gallery.create({
            name,
            description,
            image: imageFile.data
        });

        res.status(201).json({message: 'Gallery added successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports= {addNewGallery};
