const minutesToSeconds = (inputText) => {
    const minutes = parseInt(inputText.split(':')[0]);
    const seconds = parseInt(inputText.split(':')[1]);
    return minutes * 60 + seconds;
};

module.exports = { minutesToSeconds }