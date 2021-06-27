var formidable = require('formidable');
var fs = require('fs');
const Menu = require('../../../models/menu');

function menuController() {
    return {
        index(req, res) {
            res.render('admin/menu');
        },
        store(req, res) {
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                const { name, price, size } = fields;
                if (!name || !price || !size) {
                    req.flash('error', 'All fields are required')
                    return res.redirect('/admin/menu')
                }
                // console.log(fields);
                var oldpath = files.filetoupload.path;
                var newpath = './public/img/' + files.filetoupload.name;
                const item = new Menu({
                    name: name,
                    price: price,
                    size: size,
                    image: files.filetoupload.name
                })
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                });
                item.save().then((item) => {
                    console.log('Item Added Successfully');
                    return res.redirect('/')
                }).catch(err => {
                    req.flash('error', 'Something went Wrong!');
                    return res.redirect('/admin/menu')
                })
            });
        }
    }
}

module.exports = menuController;