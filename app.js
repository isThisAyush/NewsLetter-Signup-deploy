const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");
const response = require("express");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
client.setConfig({apiKey: "745f4d55a8594deada5f0a5054844eb4",  server: "us8",});


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signUp.html");
})

app.post("/", function (req, res) {
    
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    }
    
    //This creates a function for us to run later that sends the info to MailChimp.  Part of this comes straight from the MailChimp guide, the rest is for handling the response.
    const run = async function () {
        
        //try/catch is used in an async function to catch any errors that come back.  Like if/else, it can run a different set of instructions based on what comes back.
        try {
            const response = await client.lists.addListMember("84168611cb", {
                email_address: email,
                status: "subscribed",
          
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            })
            res.sendFile(__dirname + "/success.html");
        } catch (error) {
            console.log(error);
            res.sendFile(__dirname + "/failure.html");
        }
    };
   
    //running the function created above.
    run();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

    app.listen(3000, function () {
        console.log("Server is running on port 3000.");
    
    });

