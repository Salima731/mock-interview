const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    const baseUrl = process.env.REACT_APP_SERVER_URL?.replace(/\/$/, ''); // remove trailing slash
    return `${baseUrl}/${imagePath}`;
};

export default getImageUrl;
