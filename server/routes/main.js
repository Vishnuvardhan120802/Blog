const express=require('express');
const router=express.Router();
const Post=require('../models/post');
const { check, validationResult } = require('express-validator');

const nodemailer = require('nodemailer');

//routes
router.get('',async(req,res)=> {
    const locals={
        title:"NodeJs Blog",
        description:"Blog Created with Nodejs,Mongodb & Express    "
    }
    try{
        const locals={
            title:"NodeJs Blog",
            description:"Blog Created with Nodejs,Mongodb & Express    "
        }

        let perPage=5;
        let page=req.query.page||1;

        const data=await Post.aggregate([{ $sort:{createdAt: -1}}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
        
        const count = await Post.countDocuments();
        //const count=await Post.count();
        const nextPage = parseInt(page)+1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage);

        //const data=await Post.find();
        res.render('index',{locals,
            data,
            current:page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute : '/'
});
    }
    catch(error){
        console.log(error);
    }
})




/*
Get Route
ID*/ 

router.get('/post/:id',async(req,res)=> {
    try{
        
        let slug= req.params.id;
        const data = await Post.findById(slug);
        //const data=await Post.findById({_id: slug});
        const locals={
            title:data.title,
            description:"Blog Created with Nodejs,Mongodb & Express    "
        }
        res.render('post',{locals,data,
             currentRoute: `/post/${slug}`
        }
        );
    }
    catch(error){
        console.log(error);
    }
});

/*
Post Search
*/
router.post('/search',async (req,res)=>{
    try{
    const locals= { 
        title:"NodeJs Blog",
        description:"Blog Created with NodeJS,MongoDb & ExpressJS " 
    
    }
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"");

    const data=await Post.find({
        $or:[
            { title: { $regex: new RegExp(searchNoSpecialChar,'i')}},
            { body: { $regex: new RegExp(searchNoSpecialChar,'i')}}
        ]
    });

    res.render("search",{
        data,
        locals
    });
}
    catch(error)
    {
        console.log(error);
    }
});



router.get('/contact', (req, res) => {
    res.render('contact', { 
        errors: '', 
        currentRoute: '/contact' 
    });
});




// router.get('/contact', (request, response) => {

// 	response.render('contact', { errors : '' });

// });


router.post('/send', 
	[
		check('name').notEmpty().withMessage('Name is required'),
		check('email').isEmail().withMessage('Invalid Email Address'),
		check('subject').notEmpty().withMessage('Subject is required'),
		check('message').notEmpty().withMessage('Message is required')
	], (request, response) => {

		const errors = validationResult(request);

		if(!errors.isEmpty())
		{
			response.render('contact', { errors : errors.mapped(), currentRoute:'/contact' });
		}
		else
		{
			const transporter = nodemailer.createTransport({
				service : 'Gmail',
				auth : {
					user : 'vishnuvenkatesan12@gmail.com',
					pass : 'pfwo avpb vrdq eoxw'
				}
			});

			const mail_option = {
				from : request.body.email,
				to : 'vishnuvenkatesan12@gmail.com',
				subject : request.body.subject,
				text : request.body.message
			};

			transporter.sendMail(mail_option, (error, info) => {
				if(error)
				{
					console.log(error);
				}
				else
				{
					response.redirect('/success');
				}
			});
		}
});

// router.get('/success', (request, response) => {
//    response.send(`
//     <script>
//     alert('<h1>Your Message was Successfully Send!</h1>');
//     </script>
//     `)
// 	//response.redirect('/contact');
//     response.redirect('/contact?message=success');

// });

router.get('/success', (req, res) => {
    res.send(`
        <script>
            alert('Your message was successfully sent!');
            window.location.href = '/contact';
        </script>
    `);
});





router.get('/about',(req,res)=> {
    res.render('about',{
        currentRoute: '/about'
    });
});

module.exports=router;


// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "Building APIs with Node.js",
//       body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications."
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
//     },
//     {
//       title: "Discover how to use Express.js",
//       body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
//     },
//     {
//       title: "Learn the basics of Node.js and its architecture",
//       body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
//     },
//     {
//       title: "NodeJs Limiting Network Traffic",
//       body: "Learn how to limit netowrk traffic."
//     },
//     {
//       title: "Learn Morgan - HTTP Request logger for NodeJs",
//       body: "Learn Morgan."
//     },
//   ])
// }

// insertPostData();