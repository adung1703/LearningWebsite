const language = "javascript";

const args = ["10", "20"];
const input = "2 3";

const data = {
    language: language,
    version: null,
    files: [
        {
            name: "main",
            content: ""
        }
    ],
    stdin: (language === "c++" || language === "python") ? input : null,
    args: (language === "javascript") ? args : null,
    compile_timeout: 10000,
    run_timeout: 5000,
    compile_memory_limit: -1,
    run_memory_limit: -1
};

console.log("Data:", data);