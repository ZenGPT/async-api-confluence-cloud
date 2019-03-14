module.exports = function (app, addon) {

    // Root route. This route will serve the `atlassian-connect.json` unless the
    // documentation url inside `atlassian-connect.json` is set
    app.get('/', function (req, res) {
        res.format({
            // If the request content-type is text-html, it will decide which to serve up
            'text/html': function () {
                res.redirect('/atlassian-connect.json');
            },
            // This logic is here to make sure that the `atlassian-connect.json` is always
            // served up when requested by the host
            'application/json': function () {
                res.redirect('/atlassian-connect.json');
            }
        });
    });

    // This is an example route that's used by the default "generalPage" module.
    // Verify that the incoming request is authenticated with Atlassian Connect
    app.get('/hello-world', addon.authenticate(), function (req, res) {
            // Rendering a template is easy; the `render()` method takes two params: name of template
            // and a json object to pass the context in
            res.render('hello-world', {
                title: 'Atlassian Connect'
                //issueId: req.query['issueId']
            });
        }
    );

    app.get('/view-customer', addon.authenticate(), function (req, res) {
            var httpClient = addon.httpClient(req);
            var contentId  = req.query['contentId'];
            
            httpClient.get({
                url: '/rest/api/content/' + contentId + '/property',
                json: true
            }, function (err, response) {
                if (err) { 
                    res.send("Error: " + response.statusCode + ": " + err);
                }
                else {
                    var customerData = response.body.results.filter(function(result) {return result.key == "customer-data"})
                    res.render('view-customer', {
                        values: customerData[0].value,
                        contentId: contentId
                    });
                }
            })
        }
    );

    app.get('/list-customers', addon.authenticate(), function (req, res) {
            res.render('list-customers');
        }
    );

    app.get('/add-new-customer', addon.authenticate(), function (req, res) {
        var spaceKey =  req.query['spaceKey']
        res.render('new-customer', {
            spaceKey: spaceKey
        });
    });

    app.get('/add-new-note', addon.authenticate(), function (req, res) {
        var contentId  = req.query['contentId'];
        var spaceKey =  req.query['spaceKey']
        res.render('new-note',{
           contentId: contentId,
           spaceKey: spaceKey 
        });
    });

    // Add any additional route handlers you need for views or REST resources here...


    // load any additional files you have in routes and apply those to the app
    {
        var fs = require('fs');
        var path = require('path');
        var files = fs.readdirSync("routes");
        for(var index in files) {
            var file = files[index];
            if (file === "index.js") continue;
            // skip non-javascript files
            if (path.extname(file) != ".js") continue;

            var routes = require("./" + path.basename(file));

            if (typeof routes === "function") {
                routes(app, addon);
            }
        }
    }
};
