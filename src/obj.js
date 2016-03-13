export default (() => {

    const isObj = obj => obj !== undefined && obj !== null && Object.getPrototypeOf(obj) === Object.prototype;
    const clone = obj => {
        let cloned = Array.isArray(obj) ? [] : {};
        Object.keys(obj).forEach(key => {
            let value = obj[key];
            cloned[key] = isObj(value) || Array.isArray(value) ? clone(value) : value
        });
        return cloned;
    };

    return {isObj, clone};

})();
