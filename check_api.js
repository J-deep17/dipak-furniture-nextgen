const axios = require('axios');

async function checkProducts() {
    try {
        const res = await axios.get('http://localhost:5000/api/products');
        console.log(JSON.stringify(res.data.slice(0, 3), null, 2));
    } catch (e) {
        console.error(e.message);
    }
}

checkProducts();
