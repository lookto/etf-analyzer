const isDecimal = (n) => {
    const regex = /[-+]?([0-9]*[.])?[0-9]+([eE][-+]?\d+)?/;
    return regex.test(n);
};

const calculateTotalWeight = (data, key) => {
    if (!data || !key) return;

    const totalWeight = data
        .filter((element) => {
            return element[key] > 0;
        })
        .reduce((total, element) => {
            return total + element[key];
        }, 0);

    return totalWeight;
};

module.exports = { isDecimal, calculateTotalWeight };
