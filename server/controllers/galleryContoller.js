const {Gallery} = require('../models');

const addNewGallery = async (req, res) => {
    const {name, description, image} = req.body;

    if(!name || !description || !image) {
        res.status(400).json({error: 'All fields are required'});
    }

    try {
        await Gallery.create({
            name,
            description,
            image
        });

        res.status(201).json({message: 'Gallery added successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports= {addNewGallery};
