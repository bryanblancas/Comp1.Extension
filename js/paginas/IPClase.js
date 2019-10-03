class IPClase {
    constructor(){
        var dirIP = '192.168.0.11';
        //var dirIP = '10.100.67.134';
        this.dir = 'https://'+dirIP+':3000/api/';
    } 

    getIP(){
        return this.dir;
    }
}