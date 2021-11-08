//string
export const isString = (str) => (typeof str === 'string' && str ? str : '名字不符合標準');
export const isTrim = (str) => str.trim();
export const isStringEmpty = (str) => (str ? str : '請填寫名稱');
export const preventUrl = (url, currentId) => {
    const currentUrlNumber = url.indexOf(`/${currentId}`);
    return url.slice(0, currentUrlNumber);
};
export const convertNumToStr = (num) => num.toString();
