class IPClase {
    constructor(){
        var dirIP = '25.7.11.142';
        //var dirIP = '10.100.67.134';
        this.dir = 'https://'+dirIP+':3000/api/';
    } 

    getIP(){
        return this.dir;
    }
}