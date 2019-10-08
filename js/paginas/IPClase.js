class IPClase {
    constructor(){
        var dirIP = '10.100.68.109';
        //var dirIP = '192.168.0.11';
        //var dirIP = '10.140.99.39';
        this.dir = 'https://'+dirIP+':3000/api/';
    } 

    getIP(){
        return this.dir;
    }
}
