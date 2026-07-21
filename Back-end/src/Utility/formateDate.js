const optionsEn = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
}

function formatDate(date) {
    const dateObj = new Date(date);

    return !isNaN(dateObj.getTime())
        ? dateObj.toLocaleString("en-US", optionsEn)
        : "";
}

module.exports = formatDate;