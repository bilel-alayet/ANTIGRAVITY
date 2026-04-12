const axios = require('axios');
const fs = require('fs');

async function test() {
    try {
        const response = await axios.get('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyD5Pzw-FmzcnkFteWCwiLcLSexlX9sVRlo');
        const names = response.data.models.map(m => m.name);
        fs.writeFileSync('models.txt', names.join('\n'), 'utf8');
    } catch (e) {
        if(e.response) {
            fs.writeFileSync('error.json', JSON.stringify(e.response.data, null, 2), 'utf8');
        } else {
            console.error(e.message);
        }
    }
}
test();
