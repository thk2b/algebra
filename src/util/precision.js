export default function precision(n){
    const places = n.toString().split('.')[1];
    return places ? places.length : 0;
};