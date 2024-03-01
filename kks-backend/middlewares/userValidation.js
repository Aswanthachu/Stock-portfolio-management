
export const userValidation = (req, res, next) => {
    const { type } = req.body;
    if (type === "manual") {

        const { username, email, password } = req.body.userData;
        // regex for email
        var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        // regex for password 
        var regexForSpecial = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/

        // user data valiadtion
        try {
            if(username.length < 3){
                res.status(400).json({message:"User Name should consist atleast 3 characters."})
            }
            else if (username === "") {
                res.status(400).json({ message: "User Name is required." });
            }
            else if (username.length < 3) {
                res.status(400).json({ message: "User Name is atleast 3 letters" });
            }
            else if (email === "") {
                res.status(400).json({ message: "Email is required." });
            }
            else if (!email.match(emailFormat)) {
                res.status(400).json({ message: "Provide a valid email" });
            }
            else if (password === "") {
                res.status(400).json({ message: "password is required" });
            }
            else if (password.length < 8) {
                res.status(400).json({ message: "Please enter a password atleast 8 character long." });
            }
            else if (!(/^(?=.*[a-z])/.test(password)) || !(/^(?=.*[A-Z])/.test(password)) || !(/^[a-zA-Z0-9!@#$%^&*_]{6,16}$/.test(password))) {
                res.status(400).json({ message: "Password should contain atleast one capital letter , small letter, number , special character" });
            }
            else {
                next();
            }
        } catch (error) {
            console.log(error);
        }
    }else{
        next();
    }

}