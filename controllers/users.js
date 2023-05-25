


import User from "../models/user.js";


export const signup = async (req, res) => {

    try {
        const { firstName, lastName, email, mobileNumber, birthdate, addresses } = req.body;
        
        const missingFields = [];
        if (!firstName) {
          missingFields.push('firstName');
        }
        if (!lastName) {
          missingFields.push('lastName');
        }
        if (!email) {
          missingFields.push('email');
        }
        if (!mobileNumber) {
          missingFields.push('mobileNumber');
        }
        if (!addresses) {
          missingFields.push('addresses');
        }
        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
          }

        const existingUser = await User.findOne({ $or: [{ email }, { mobileNumber }] });
        if (existingUser) {
            return res.status(409).json({ error: 'Email or mobile number already exists.' });
        }

        const formattedAddresses = addresses.map(address => {
            const { addressLine1, addressLine2, pincode, city, state, type } = address;
            return {
                addressLine1,
                addressLine2,
                pincode,
                city,
                state,
                type
            };
        });

        const user = new User({
            firstName,
            lastName,
            email,
            mobileNumber,
            birthdate,
            addresses: formattedAddresses
        });

        const savedUser = await user.save();
        res.status(201).json({message:"User Created Successfully",savedUser});

    } catch (error) {
        let errorMessage = 'An error occurred while creating the user.';
        if (error.name === 'ValidationError') {
            // Mongoose validation error
            const errors = Object.values(error.errors).map(err => err.message);
            errorMessage = `Validation error: ${errors.join(' ')}`;
            res.status(400).json({ error: errorMessage });
        } else {
            res.status(500).json({ error: errorMessage });
        }
    }

}


export const search = async (req, res) => {
     try {
    const { searchString, minAge, maxAge, city } = req.query;
console.log({searchString});
    const filters = {};
    if (searchString) {
        const searchRegex = new RegExp(searchString, 'i');
        filters.$or = [
          { firstName: { $regex: searchRegex } },
          { lastName: { $regex: searchRegex } },
          { email: { $regex: searchRegex } }
        ];
      }

    // Search on Age
    if (minAge || maxAge) {
      filters.birthdate = {};
      if (minAge) {
        filters.birthdate.$lte = new Date(new Date().setFullYear(new Date().getFullYear() - minAge));
      }
      if (maxAge) {
        filters.birthdate.$gte = new Date(new Date().setFullYear(new Date().getFullYear() - maxAge - 1));
      }
    }

    // Search by City
    if (city) {
      filters['addresses.city'] = { $regex: new RegExp(city, 'i') };
    }
console.log({filters});
    const users = await User.find(filters);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching for users.' });
  }
}


export const updateUser=async(req,res)=>{
    try {
        const {id} = req.params
        console.log({id});
        const { firstName, lastName, email, mobileNumber, birthdate, addresses } = req.body;
    
    
        // Check if email or mobile number already exists for other users
        const existingUser = await User.findOne({ $and: [{ _id: { $ne: id } }, { $or: [{ email }, { mobileNumber }] }] });
        if (existingUser) {
          return res.status(409).json({ error: 'Email or mobile number already exists for another user.' });
        }
    
        // Extract address data from each address object in addresses array
        const formattedAddresses = addresses.map(address => {
          const { addressLine1, addressLine2, pincode, city, state, type } = address;
          return {
            addressLine1,
            addressLine2,
            pincode,
            city,
            state,
            type
          };
        });
    
        // Find the user by ID and update the information
        const user = await User.findByIdAndUpdate(
          id,
          {
            $set: {
              firstName,
              lastName,
              email,
              mobileNumber,
              birthdate,
              addresses: formattedAddresses
            }
          },
          { new: true }
        );
    
        if (!user) {
          return res.status(404).json({ error: 'User not found.' });
        }
    
        res.status(200).json({message:`User ${firstName} ${lastName} Updated Successfully`,user});
      } catch (error) {
        let errorMessage = 'An error occurred while updating the user.';
        if (error.name === 'ValidationError') {
          // Mongoose validation error
          const errors = Object.values(error.errors).map(err => err.message);
          errorMessage = `Validation error: ${errors.join(' ')}`;
          res.status(400).json({ error: errorMessage });
        } else {
          res.status(500).json({ error: errorMessage });
        }
      }
}