const Server = require('ws').Server;
const fs = require('fs');

const wss = new Server({ port:4505 });








let post = [];

try
{
    post = JSON.parse(fs.readFileSync(__dirname + '/post.json', 'utf8'));
}
catch(e)
{
    console.log("An Exception occured while parsing post JSON : " + e.message);
    post = [];
}



















wss.on('connection', socket=>{
    socket.on('message', msg=>{
        let dat = {};

        try{
            dat = JSON.parse(msg);
        }
        catch(e)
        {
            console.log("Exception while decoding JSON : " + e.message);
            return;
        }

        

        if(dat.r === "get")
        {
            socket.send(JSON.stringify(
            {
                r : dat.r,
                posts : post,
                status : true
            }));
        }


        if(dat.r === "new")
        {
            try
            {
                post.push({
                    name : dat.name,
                    title : dat.title,
                    thumb : dat.thumb,
                    nerd : dat.nerd,
                });

                fs.writeFileSync(__dirname + '/post.json', JSON.stringify(post, undefined, 4));

                socket.send(JSON.stringify(
                {
                    r : dat.r,
                    status : true
                }));

                console.log(`${dat.name} uploaded a post`);
            }
            catch{
                socket.send(JSON.stringify(
                {
                    r : dat.r,
                    status : false
                }));

                console.log(`${dat.name} uploaded a post but didn't worked`);
            }
        }


    });
});

console.log("Server might have started...?");
