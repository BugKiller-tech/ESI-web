// models/user.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    // username: {
    //   type: String,
    //   unique: true,
    // },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        allowNull: false,
        // select: false,
    },
    emailConfirmed: {
        type: Number,
        default: 1,

    },
    emailConfirmationToken: {
        type: String,
        default: '',
    },
    isAdmin: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true
});

schema.pre('save', async function (next) {
    // Hash password before saving user
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    await this.createEmailConfirmationToken();
});

schema.methods.comparePassword = async function (password) {
    return bcrypt.compareSync(password, this.password);
};
schema.methods.updatePassword = async function (newPassword) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(newPassword, salt);
}
schema.methods.createEmailConfirmationToken = async function () {
    const token = jwt.sign(
        {
            email: this.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )
    this.emailConfirmationToken = token;
}

schema.methods.toAuthJson = function () {
    const excludeFields = ['password'];
    return {
        email: this.email,
        emailConfirmed: this.emailConfirmed,
    };
}

module.exports = mongoose.model('User', schema);
