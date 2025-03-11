export const getCurrentSemester = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = month >= 1 && month <= 8 ? now.getFullYear() - 1 : now.getFullYear();
    const semester = month >= 9 || month === 1 ? "1" : month >= 7 ? "3" : "2";
    return `${year}.${semester}`;
};
