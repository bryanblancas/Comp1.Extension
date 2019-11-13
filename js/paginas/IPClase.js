class IPClase {
    constructor(){
        var dirIP = '10.100.65.177';
        this.dir = 'https://'+dirIP+':3000/api/';
    } 

    getIP(){
        return this.dir;
    }
}