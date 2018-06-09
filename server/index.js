const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/index.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/:id', express.static(__dirname + '/../public/dist'));

app.get('/:id/shopproducts', (req, res) => {
  db.query(
    `SELECT name, city, state, shop_image_url
     FROM shops 
     WHERE id = 
        (SELECT id_shops FROM products WHERE id = ${req.params.id});
        
    SELECT products.id, products.name, products.price, products.liked, products.id_shops, images.image_url 
    FROM products 
    INNER JOIN images  
    WHERE products.id = images.id_product 
      AND products.id_shops = (SELECT id_shops from products where id = ${req.params.id}) 
    ORDER BY products.id;`,

    (error, results) => (error ? res.status(500).end() : res.status(200).json(results)),
  );
});

app.listen(5000, () => console.log('App listening to port 5000'));

