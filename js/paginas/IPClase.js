class IPClase {
    constructor(){
        var dirIP = '192.168.43.179';
        this.dir = 'https://'+dirIP+':3000/api/';
    } 

    getIP(){
        return this.dir;
    }
}
