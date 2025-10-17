const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PasswordValidator = require('password-validator');

const schema = new PasswordValidator();
schema
    .is().min(8)
    .is().max(100)                              
    .has().uppercase()                                                                                    
    .has().not().spaces()                           

exports.signup = async (req, res, next) => {
    try {

        // verification de la conformité du mdp selon le schema
        if (!schema.validate(req.body.password)) {
            return res.status(400).json({ 
                success: false,
                message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule et ne doit pas contenir d'espaces." 
            });
        }

        // on verifie que le mail n'est pas deja utilisé 
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Cet email est déjà utilisé." });
        }
        
        // 10 passages de hash 
        const hash = await bcrypt.hash(req.body.password, 10);
        
        // stockage des infos 
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        await user.save();
        
        return res.status(201).json({ message: 'Utilisateur créé avec succès !' });
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.login = async (req, res, next) => {
    try {
        // on verifie que le mail utilisé est deja assigné a un compte existant
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: 'Paire Identifiant/Mot de passe incorrecte' });
        }
        
        // on verifie avec compare que le hash et le mdp fourni correspondent
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Paire Identifiant/Mot de passe incorrecte' });
        }
        // creation d'un token assigné au user
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        return res.status(200).json({ userId: user._id, token });
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur", error });
    }
};