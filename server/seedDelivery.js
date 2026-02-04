const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ServiceableArea = require('./models/ServiceableArea');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = [
    // Ahmedabad
    { pincode: '380001', city: 'Ahmedabad', state: 'Gujarat' },
    { pincode: '380006', city: 'Ahmedabad', state: 'Gujarat' },
    { pincode: '380009', city: 'Ahmedabad', state: 'Gujarat' },
    { pincode: '380013', city: 'Ahmedabad', state: 'Gujarat' },
    { pincode: '380015', city: 'Ahmedabad', state: 'Gujarat' },
    { pincode: '380054', city: 'Ahmedabad', state: 'Gujarat' },
    { pincode: '382415', city: 'Ahmedabad', state: 'Gujarat' },
    { pincode: '382481', city: 'Ahmedabad', state: 'Gujarat' },

    // Surat
    { pincode: '395001', city: 'Surat', state: 'Gujarat' },
    { pincode: '395003', city: 'Surat', state: 'Gujarat' },
    { pincode: '395007', city: 'Surat', state: 'Gujarat' },

    // Vadodara
    { pincode: '390001', city: 'Vadodara', state: 'Gujarat' },
    { pincode: '390007', city: 'Vadodara', state: 'Gujarat' },

    // Rajkot
    { pincode: '360001', city: 'Rajkot', state: 'Gujarat' },
    { pincode: '360005', city: 'Rajkot', state: 'Gujarat' },

    // Gandhinagar
    { pincode: '382010', city: 'Gandhinagar', state: 'Gujarat' },

    // Mumbai
    { pincode: '400001', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400050', city: 'Mumbai', state: 'Maharashtra' },

    // Pune
    { pincode: '411001', city: 'Pune', state: 'Maharashtra' },

    // Delhi
    { pincode: '110001', city: 'Delhi', state: 'Delhi' },

    // Bengaluru
    { pincode: '560001', city: 'Bengaluru', state: 'Karnataka' },

    // Chennai
    { pincode: '600001', city: 'Chennai', state: 'Tamil Nadu' },

    // Hyderabad
    { pincode: '500001', city: 'Hyderabad', state: 'Telangana' },

    // Jaipur
    { pincode: '302001', city: 'Jaipur', state: 'Rajasthan' },

    // Indore
    { pincode: '452001', city: 'Indore', state: 'Madhya Pradesh' },

    // Bhopal
    { pincode: '462001', city: 'Bhopal', state: 'Madhya Pradesh' },

    // Kolkata
    { pincode: '700001', city: 'Kolkata', state: 'West Bengal' }
];

const importData = async () => {
    try {
        await ServiceableArea.deleteMany();
        await ServiceableArea.insertMany(seedData);
        console.log('Delivery Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
