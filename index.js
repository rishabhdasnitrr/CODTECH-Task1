import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import favicon from "serve-favicon";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname=dirname(fileURLToPath(import.meta.url));
const port = 3000;
const app = express();

app.use(express.static("public"));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

var headings = [];
var bodies = [];
var time = [];
var done = [];
var userSignedIn = 0;
var reenterPassword = 0;
var username = "Name";
var useremail = "Email address";
var userpassword = "";
var confirmpassword = "";
const plans = ["TimeTower Basic", "TimeTower Pro", "TimeTower Premium"];
const monthsList = ["01 (January)", "02 (February)", "03 (March)", "04 (April)", "05 (May)", "06 (June)", "07 (July)", "08 (August)", "09 (September)", "10 (October)", "11 (November)", "12 (December)"];
const planPrices = [0, 9.99, 19.99];
var plan = 0;

var country_list = ["India","Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

app.get("/", (req, res) => {
    console.log("New session started");
    headings = [];
    bodies = [];
    time = [];
    done = [];
    userSignedIn = 0;
    reenterPassword = 0;
    username = "Name";
    useremail = "Email address";
    userpassword = "";
    confirmpassword = "";
    plan = 0;
    var page = "home";
    res.render("index.ejs", {
        noteHeadings: headings,
        noteBodies: bodies,
        noteTime: time,
        noteDone: done,
        notePage: page,
        userSignedUp: userSignedIn,
        planList: plans,
        planIndex: plan
    });
});

app.get("/submit", (req, res) => {
    // console.log("OK");
    var page = "home";
    res.render("index.ejs", {
        noteHeadings: headings,
        noteBodies: bodies,
        noteTime: time,
        noteDone: done,
        notePage: page,
        userSignedUp: userSignedIn,
        userName: username,
        planList: plans,
        planIndex: plan
    });
});

app.post("/submit", (req, res) => {
    if(req.body.title === "" && req.body.body === ""){
        console.log("Updated tasks");
    }
    else{
        headings.push(req.body.title);
        bodies.push(req.body.body);
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var meridian = "AM";

        // Adjust UTC to ITC
        hours = (hours + 5) % 24 + (minutes >= 30 ? 1 : 0);
        minutes = (minutes + 30) % 60;

        // Adjust 12 AM / PM
        if(hours >= 12){
            hours -= 12;
            meridian = "PM";
        }
        if(hours === 0){
            hours = 12;
        }

        time.push(hours + ":" + (minutes<10?'0':'') + minutes + " " + meridian);
        done.push(0);
    }
    if(typeof(req.body.marker) === "object"){
        for(let i = 0; i<req.body.marker.length; i++){
            done[req.body.marker[i]] = 1;
        }
    }
    else if(typeof(req.body.marker) === "string"){
        done[(Number)(req.body.marker)] = 1;
    }
    res.redirect("/submit");
});

app.get("/features", (req, res) => {
    var page = "features";
    res.render("features.ejs", {
        notePage: page,
        userSignedUp: userSignedIn,
        userName: username,
        planList: plans,
        planIndex: plan
    });
});

app.get("/pricing", (req, res) => {
    var page = "pricing";
    res.render("pricing.ejs", {
        notePage: page,
        userSignedUp: userSignedIn,
        userName: username,
        planList: plans,
        planIndex: plan
    });
});

app.get("/signup", (req, res) => {
    var page = "pricing";
    res.render("signup.ejs", {
        notePage: page,
        userSignedUp: userSignedIn,
        userName: username,
        mismatchPassword: reenterPassword,
        enteredName: username,
        enteredEmail: useremail,
        planList: plans,
        planIndex: plan
    });
});

app.post("/signup", (req, res)=> {
    var page = "pricing";
    userpassword = req.body.password1;
    confirmpassword = req.body.password2;
    if(userpassword.localeCompare(confirmpassword) === 0){
        username = req.body.name;
        useremail = req.body.email;
        userSignedIn = 1;
        reenterPassword = 0;
        res.redirect("/submit");
    }
    else{
        reenterPassword = 1;
        res.render("signup.ejs" ,{
            notePage: page,
            enteredName: username,
            userName: username,
            enteredEmail: useremail,
            mismatchPassword: reenterPassword,
            userSignedUp: userSignedIn,
            planList: plans,
            planIndex: plan
        });
    }
});

app.post("/checkout", (req, res) => {
    var page = "pricing";
    var selectedPlanInd = req.body.plan;
    var currYear = new Date().getFullYear();
    if(userSignedIn === 0){
        res.redirect("/signup");
    }
    else{
        res.render("checkout.ejs", {
            notePage: page,
            userSignedUp: userSignedIn,
            userName: username,
            userEmail: useremail,
            planIndex: plan,
            countryList: country_list,
            selectedPlanIndex: selectedPlanInd,
            planList: plans,
            planPriceList: planPrices,
            monthList: monthsList,
            currentYear: currYear
        });
    }
});

app.post("/confirm", (req,res) => {
    var page = "pricing";
    plan = req.body.plan - '0';
    res.render("confirm.ejs", {
        notePage: page,
        userSignedUp: userSignedIn,
        userName: username,
        planIndex: plan,
        planList: plans,
        planPriceList: planPrices
    });
});

app.get("/faq", (req, res) => {
    var page = "faq";
    res.render("faq.ejs", {
        notePage: page,
        userSignedUp: userSignedIn,
        userName: username,
        planList: plans,
        planIndex: plan
    });
});

app.get("/about", (req, res) => {
    var page = "about";
    res.render("about.ejs", {
        notePage: page,
        userSignedUp: userSignedIn,
        userName: username,
        planList: plans,
        planIndex: plan
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})