const axios = require("axios");

async function getSupportedLanguages() {
    try {
        const response = await axios.get("https://emkc.org/api/v2/piston/runtimes");
        console.log("Danh sách ngôn ngữ hỗ trợ:", response.data);
    } catch (error) {
        console.error("Lỗi:", error.response ? error.response.data : error.message);
    }
}

getSupportedLanguages();
