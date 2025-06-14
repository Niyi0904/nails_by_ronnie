const {CartItem, User} = require('../models');

const addToCart = async (req, res) => {
    const {email, name, quantity, image, price} = req.body;

    if (!email || !name || !quantity || !image || !price) {
        return res.status(400).json({ error: 'user email or cart price, name, quantity, image are all required.' });
    }

    try {
        const user = await  User.findOne({where: {email}});
    
        await CartItem.create({
            name,
            quantity,
            image,
            price,
            user_id: user.Userid
        });
    
        return res.status(201).json({message: 'item has been successfully added to cart'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

const myCart = async (req, res) => {
    const user_id = req.params.user_id;

    try {
        const allcarts = await CartItem.findAll({
            attributes: { exclude: ['user_id'] },
            where: { user_id },
            order: [['created_at', 'DESC']]
        })

        return res.status(201).json({
            message: 'completed', allcarts
        });
    } catch (err) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
}

const deleteCart = async (req, res) => {
    const id = req.params.id

    try {
        await CartItem.destroy({ where: { id } });

        return res.status(201).json({
            message:'Deleted successfully'
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
}

const increaseCart = async (req, res) => {
    const id = req.params.id;

    try {
        await CartItem.increment('quantity', {where: {id}});
        return res.status(201).json({
            message:'Increased successfully'
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
}

const decreaseCart = async (req, res) => {
  const id = req.params.id;

  try {
    // Fetch current item
    const cartItem = await CartItem.findByPk(id);

    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Prevent quantity from going below 1
    if (cartItem.quantity <= 1) {
      return res.status(400).json({ error: 'Quantity cannot be less than 1' });
    }

    // Decrement quantity
    await CartItem.decrement('quantity', { where: { id } });

    return res.status(200).json({ message: 'Decreased successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports= {addToCart, myCart, deleteCart, increaseCart, decreaseCart}