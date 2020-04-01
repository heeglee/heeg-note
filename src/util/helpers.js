export default function debounce(callback, time) {
    let debounced;

    return function() {
        clearTimeout(debounced);
        debounced = setTimeout(() => {
            debounced = null;
            callback.apply(this, arguments);
        }, time);
        
        // !debounced && callback.apply(this, arguments);
    }
}

export function removeHTMLTags(str) {
    return str.replace(/<[^>]*>?/gm, '');
}