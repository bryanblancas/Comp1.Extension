class IPClase {
    constructor(){
        //var dirIP = '25.7.11.142';
        //var dirIP = '192.168.0.11';
        var dirIP = '10.140.99.39';
        this.dir = 'https://'+dirIP+':3000/api/';
    } 

    getIP(){
        return this.dir;
    }
}
