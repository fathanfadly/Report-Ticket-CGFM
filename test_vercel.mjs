import fetch from 'node-fetch';

async function test() {
    console.log("Logging in...");
    const loginRes = await fetch('https://report-ticket-cgfm.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'superadmin', password: 'password' }) // Or whatever their pass is
    });
    
    // We don't know the password, so we cannot actually login. 
    // BUT we can use the local DB to get the hashed password, but wait we need plaintext password to login.
}
test();
