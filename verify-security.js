#!/usr/bin/env node

/**
 * Security Verification Script
 * Checks that all secrets are properly configured and secured
 */

const fs = require('fs');
const path = require('path');

console.log('🔐 Security Verification Script\n');
console.log('='.repeat(50));

let passed = 0;
let failed = 0;
let warnings = 0;

// Test 1: Check .gitignore exists and contains .env
console.log('\n📋 Test 1: Checking .gitignore...');
try {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    if (gitignore.includes('.env')) {
        console.log('✅ PASS: .gitignore contains .env exclusions');
        passed++;
    } else {
        console.log('❌ FAIL: .gitignore missing .env exclusions');
        failed++;
    }
} catch (e) {
    console.log('❌ FAIL: .gitignore not found');
    failed++;
}

// Test 2: Check .env.example exists
console.log('\n📋 Test 2: Checking .env.example...');
if (fs.existsSync('.env.example')) {
    console.log('✅ PASS: .env.example exists');
    passed++;
} else {
    console.log('❌ FAIL: .env.example not found');
    failed++;
}

// Test 3: Check server/.env.example exists
console.log('\n📋 Test 3: Checking server/.env.example...');
if (fs.existsSync('server/.env.example')) {
    console.log('✅ PASS: server/.env.example exists');
    passed++;
} else {
    console.log('❌ FAIL: server/.env.example not found');
    failed++;
}

// Test 4: Check server/.env exists
console.log('\n📋 Test 4: Checking server/.env...');
if (fs.existsSync('server/.env')) {
    console.log('✅ PASS: server/.env exists');
    passed++;
} else {
    console.log('⚠️  WARNING: server/.env not found (create from .env.example)');
    warnings++;
}

// Test 5: Check JWT_SECRET strength
console.log('\n📋 Test 5: Checking JWT_SECRET strength...');
require('dotenv').config({ path: 'server/.env' });
const jwtSecret = process.env.JWT_SECRET;
if (jwtSecret && jwtSecret.length >= 32) {
    console.log(`✅ PASS: JWT_SECRET is strong (${jwtSecret.length} characters)`);
    passed++;
} else if (jwtSecret) {
    console.log(`⚠️  WARNING: JWT_SECRET is weak (${jwtSecret.length} characters, should be 32+)`);
    warnings++;
} else {
    console.log('❌ FAIL: JWT_SECRET not set');
    failed++;
}

// Test 6: Check for weak secrets
console.log('\n📋 Test 6: Checking for weak secrets...');
if (jwtSecret && (jwtSecret === 'supersecret123' || jwtSecret.includes('secret') || jwtSecret.includes('password'))) {
    console.log('❌ FAIL: JWT_SECRET appears to be weak or predictable');
    failed++;
} else if (jwtSecret) {
    console.log('✅ PASS: JWT_SECRET appears strong');
    passed++;
} else {
    console.log('⚠️  WARNING: Cannot verify JWT_SECRET (not set)');
    warnings++;
}

// Test 7: Check MONGO_URI
console.log('\n📋 Test 7: Checking MONGO_URI...');
const mongoUri = process.env.MONGO_URI;
if (mongoUri) {
    console.log('✅ PASS: MONGO_URI is configured');
    passed++;
} else {
    console.log('⚠️  WARNING: MONGO_URI not set');
    warnings++;
}

// Test 8: Check GOOGLE_API_KEY
console.log('\n📋 Test 8: Checking GOOGLE_API_KEY...');
const googleKey = process.env.GOOGLE_API_KEY;
if (googleKey) {
    console.log('✅ PASS: GOOGLE_API_KEY is configured');
    console.log('⚠️  REMINDER: Rotate this key if it was exposed in git history');
    passed++;
    warnings++;
} else {
    console.log('⚠️  WARNING: GOOGLE_API_KEY not set (AI features will not work)');
    warnings++;
}

// Test 9: Check Razorpay configuration
console.log('\n📋 Test 9: Checking Razorpay configuration...');
const razorpayId = process.env.RAZORPAY_KEY_ID;
const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
if (razorpayId && razorpaySecret) {
    console.log('✅ PASS: Razorpay credentials configured');
    passed++;
} else {
    console.log('⚠️  WARNING: Razorpay credentials not set (payments will not work)');
    warnings++;
}

// Test 10: Check for hardcoded secrets in code
console.log('\n📋 Test 10: Scanning for hardcoded secrets...');
const filesToCheck = [
    'server/server.js',
    'server/config/db.js',
    'server/controllers/aiController.js',
    'server/controllers/paymentController.js'
];

let foundHardcoded = false;
for (const file of filesToCheck) {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        // Check for common patterns of hardcoded secrets
        if (content.match(/['"]AIza[A-Za-z0-9_-]{35}['"]/)) {
            console.log(`❌ FAIL: Hardcoded Google API key found in ${file}`);
            foundHardcoded = true;
            failed++;
        }
        if (content.match(/['"]rzp_(test|live)_[A-Za-z0-9]{14}['"]/)) {
            console.log(`❌ FAIL: Hardcoded Razorpay key found in ${file}`);
            foundHardcoded = true;
            failed++;
        }
    }
}

if (!foundHardcoded) {
    console.log('✅ PASS: No hardcoded secrets detected');
    passed++;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 SUMMARY:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`⚠️  Warnings: ${warnings}`);

const total = passed + failed;
const score = total > 0 ? Math.round((passed / total) * 100) : 0;

console.log(`\n🎯 Security Score: ${score}%`);

if (failed === 0 && warnings <= 2) {
    console.log('\n✅ EXCELLENT: Your application is secure!');
    process.exit(0);
} else if (failed === 0) {
    console.log('\n⚠️  GOOD: Your application is mostly secure, but address warnings.');
    process.exit(0);
} else {
    console.log('\n❌ ATTENTION REQUIRED: Please fix the failed tests before deployment.');
    process.exit(1);
}
