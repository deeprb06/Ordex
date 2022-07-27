import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    full_name: {
        type: String,
    },
    email: {
        type: String,
    },
    birth_date: {
        type: Number,
    },
    preferences: [{
        type: String,
    }],
    password: {
        type: String,
    },
    reset_hash: {
        type: String,
        default: ''
    },
    activation_hash: {
        type: String,
        default: ''
    },
    is_active: {
        //1-active,0-inactive
        type: Number,
        default: 0
    }
},
    {
        collection: 'Users',
        timestamps: true,
    });

UsersSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10, (error, hash) => {
        if (error) {
            return next(error);
        } else {
            this.password = hash;
            next();
        }
    });
});

UsersSchema.methods.comparePassword = async function (passw) {
    return await bcrypt.compare(passw, this.password);
};


const UsersModel = mongoose.model('Users', UsersSchema);

export default UsersModel;

