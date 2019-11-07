class IPClase {
    constructor(){
        // var dirIP = '25.7.11.142';
        var dirIP = '10.100.64.79';
        //var dirIP = '192.168.43.179';
        //var dirIP = '10.140.99.39';
        //var dirIP = '10.100.97.11';
        this.dir = 'https://'+dirIP+':3000/api/';
    } 

    getIP(){
        return this.dir;
    }
}
